import { randomUUID } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
const pdfWorkerFile = path.join(
  process.cwd(),
  "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
);
const pdfWorkerUrl = pathToFileURL(pdfWorkerFile).href;
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

import { PDFParse } from "pdf-parse";
import { extractPptx } from "pptx-content-extractor";
import { heuristicInventoryBatchAnalyzer } from "./analyzer";
import { normalizeMultilineText, normalizeWhitespace } from "./heuristics";
import { runOcrOnBuffers } from "./ocr";
import type {
  BatchInventoryDraftPreview,
  BatchInventoryImageSource,
  InventoryAnalysisResult,
  StoredBatchInventoryDraft,
  StoredBatchInventoryImage,
} from "./types";

type ExtractedUnit = {
  id: string;
  sourceType: "pdf" | "pptx";
  sourceLabel: string;
  rawText: string;
  images: StoredBatchInventoryImage[];
  ocrBuffers: Array<Buffer>;
};

type PptxExtractResult = Awaited<ReturnType<typeof extractPptx>>;

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

function getBaseName(fileName: string) {
  return fileName.split(/[\\/]/).pop() || fileName;
}

function mimeTypeFromFileName(fileName: string) {
  const extension = getFileExtension(fileName);

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "bmp":
      return "image/bmp";
    case "tif":
    case "tiff":
      return "image/tiff";
    default:
      return "application/octet-stream";
  }
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL returned by extractor.");
  }

  return {
    mimeType: match[1],
    base64: match[2],
  };
}

function buildStoredImage(input: {
  fileName: string;
  dataUrl: string;
  source: BatchInventoryImageSource;
  width?: number;
  height?: number;
}) {
  const parsed = parseDataUrl(input.dataUrl);

  return {
    id: randomUUID(),
    fileName: input.fileName,
    previewUrl: input.dataUrl,
    mimeType: parsed.mimeType,
    base64: parsed.base64,
    source: input.source,
    width: input.width,
    height: input.height,
  } satisfies StoredBatchInventoryImage;
}

function shouldIncludeDraft(rawText: string, imageCount: number) {
  if (imageCount > 0) return true;

  const normalized = rawText.toLowerCase();
  if (!normalized) return false;

  return (
    /\b(city|location|address|media|size|dimension|hoarding|unipole|metro|airport|railway|mall|boat|shelter)\b/i.test(
      normalized,
    ) || /\b\d{1,3}\s*(?:x|×|by)\s*\d{1,3}\b/i.test(normalized)
  );
}

function getOcrBufferFromImage(image: StoredBatchInventoryImage) {
  if (
    image.mimeType === "image/tiff" ||
    image.mimeType === "application/octet-stream"
  ) {
    return null;
  }

  try {
    return Buffer.from(image.base64, "base64");
  } catch {
    return null;
  }
}

async function extractFromPptx(
  buffer: Buffer,
  fileName: string,
): Promise<ExtractedUnit[]> {
  const tempPath = path.join(
    os.tmpdir(),
    `${randomUUID()}-${getBaseName(fileName).replace(/[^a-zA-Z0-9.-]/g, "-")}`,
  );

  await writeFile(tempPath, buffer);

  try {
    let parsed: PptxExtractResult;
    try {
      parsed = (await extractPptx(tempPath)) as PptxExtractResult;
    } catch {
      throw new Error(
        `Failed to parse the PPTX file. One or more slides could not be read. If this file was converted from another format, try re-saving it as .pptx or export as .pdf and upload that instead.`,
      );
    }

    const mediaByName = new Map<string, PptxExtractResult["media"][number]>();
    const mediaByLowerName = new Map<string, PptxExtractResult["media"][number]>();
    for (const item of parsed.media) {
      mediaByName.set(getBaseName(item.name), item);
      mediaByLowerName.set(getBaseName(item.name).toLowerCase(), item);
      const normalizedPath = item.name.replace(/[\\/]/g, "/");
      mediaByLowerName.set(normalizedPath.toLowerCase(), item);
    }

    return parsed.slides
      .map((slide, index) => {
        const slideText = slide.content
          .flatMap((item) => item.text)
          .map((text) => normalizeWhitespace(text))
          .filter(Boolean)
          .join("\n");
        const noteText = normalizeMultilineText(
          parsed.notes[index]?.content || "",
        );
        const rawText = [slideText, noteText].filter(Boolean).join("\n");

        const resolvedMedia: Array<{
          media: PptxExtractResult["media"][number];
          mediaName: string;
        }> = [];

        for (const mediaName of slide.mediaNames) {
          const baseName = getBaseName(mediaName);
          let found = mediaByName.get(baseName);
          if (!found) found = mediaByLowerName.get(baseName.toLowerCase());
          if (!found) {
            const normalizedPath = mediaName.replace(/[\\/]/g, "/");
            found = mediaByLowerName.get(normalizedPath.toLowerCase());
          }
          if (found) {
            resolvedMedia.push({ media: found, mediaName });
          }
        }

        const images = resolvedMedia.map(({ media, mediaName }, mediaIndex) => {
          const resolvedFileName = getBaseName(media.name);
          return buildStoredImage({
            fileName:
              resolvedFileName ||
              `slide-${index + 1}-${mediaIndex + 1}.${getFileExtension(mediaName) || "png"}`,
            dataUrl: media.content,
            source: "embedded",
          });
        });

        return {
          id: randomUUID(),
          sourceType: "pptx" as const,
          sourceLabel: `Slide ${index + 1}`,
          rawText,
          images,
          ocrBuffers: images
            .map(getOcrBufferFromImage)
            .filter((b): b is NonNullable<typeof b> => b !== null)
            .slice(0, 3),
        } satisfies ExtractedUnit;
      })
      .filter((unit) => shouldIncludeDraft(unit.rawText, unit.images.length));
  } finally {
    await unlink(tempPath).catch(() => undefined);
  }
}

async function extractFromPdf(buffer: Buffer): Promise<ExtractedUnit[]> {
  const parser = new PDFParse({ data: buffer });

  try {
    const textResult = await parser.getText();
    const units: ExtractedUnit[] = [];

    for (let pageNumber = 1; pageNumber <= textResult.total; pageNumber += 1) {
      const rawText = normalizeMultilineText(
        textResult.getPageText(pageNumber) || "",
      );
      let images: StoredBatchInventoryImage[] = [];
      let screenshotImage: StoredBatchInventoryImage | null = null;

      try {
        const imageResult = await parser.getImage({
          partial: [pageNumber],
          imageThreshold: 80,
        });

        const pageImages = imageResult.pages[0]?.images || [];
        images = pageImages.map((image, index) => {
          const extension = image.dataUrl.includes("image/jpeg")
            ? "jpg"
            : "png";
          return buildStoredImage({
            fileName: `page-${pageNumber}-image-${index + 1}.${extension}`,
            dataUrl: image.dataUrl,
            source: "embedded",
            width: image.width,
            height: image.height,
          });
        });
      } catch (err) {
        console.error(`Page ${pageNumber} getImage failed:`, err);
        images = [];
      }

      const hasEmbeddedImages = images.length > 0;

      if (!hasEmbeddedImages) {
        try {
          const screenshotResult = await parser.getScreenshot({
            partial: [pageNumber],
            desiredWidth: 800,
          });
          const screenshot = screenshotResult.pages[0];
          if (screenshot) {
            screenshotImage = buildStoredImage({
              fileName: `page-${pageNumber}-preview.png`,
              dataUrl: screenshot.dataUrl,
              source: "screenshot",
              width: screenshot.width,
              height: screenshot.height,
            });

            images = [screenshotImage, ...images];
          }
        } catch (err) {
          if (
            err instanceof Error &&
            (err.message.includes("worker") ||
              err.message.includes("worker.mjs") ||
              err.message.includes("fake worker"))
          ) {
            console.warn(
              `Page ${pageNumber} screenshot unavailable (worker issue). Using embedded images only.`,
            );
          } else {
            console.error(`Page ${pageNumber} getScreenshot failed:`, err);
          }
          screenshotImage = null;
        }
      }

      if (!shouldIncludeDraft(rawText, images.length)) {
        continue;
      }

      units.push({
        id: randomUUID(),
        sourceType: "pdf",
        sourceLabel: `Page ${pageNumber}`,
        rawText,
        images,
        ocrBuffers: [
          ...(hasEmbeddedImages ? [] : [screenshotImage].filter(Boolean)),
          ...images.filter((image) => image.source === "embedded"),
        ]
          .filter(Boolean)
          .map((image) =>
            getOcrBufferFromImage(image as StoredBatchInventoryImage),
          )
          .filter((b): b is NonNullable<typeof b> => b !== null)
          .slice(0, 3),
      });
    }

    return mergePdfUnits(units);
  } finally {
    await parser.destroy();
  }
}

function mergePdfUnits(units: ExtractedUnit[]): ExtractedUnit[] {
  const merged = new Map<number, ExtractedUnit>();
  const imagePages: { unit: ExtractedUnit; pageNum: number }[] = [];

  for (const unit of units) {
    const pageNum = parseInt(unit.sourceLabel.replace(/\D/g, ""), 10);
    merged.set(pageNum, { ...unit });
    if (unit.images.length > 0) {
      imagePages.push({ unit, pageNum });
    }
  }

  for (const { pageNum: imgPageNum } of imagePages) {
    const existing = merged.get(imgPageNum);
    if (!existing) continue;
    if (existing.rawText.trim().length >= 15) continue;

    let bestPartner: number | null = null;
    let bestDiff = Infinity;

    for (const [key] of merged) {
      if (key === imgPageNum) continue;
      const candidate = merged.get(key);
      if (!candidate || candidate.rawText.trim().length < 15) continue;
      const diff = Math.abs(imgPageNum - key);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestPartner = key;
      }
    }

    if (bestPartner !== null && bestDiff <= 3) {
      const partner = merged.get(bestPartner);
      if (partner) {
        merged.set(bestPartner, {
          ...partner,
          images: [...partner.images, ...existing.images],
          ocrBuffers: [...partner.ocrBuffers, ...existing.ocrBuffers].slice(0, 10),
          sourceLabel:
            bestPartner < imgPageNum
              ? `${partner.sourceLabel} & ${existing.sourceLabel}`
              : `${existing.sourceLabel} & ${partner.sourceLabel}`,
        });
        merged.delete(imgPageNum);
      }
    }
  }

  return Array.from(merged.values()).sort((a, b) => {
    const aNum = parseInt(a.sourceLabel.replace(/\D/g, ""), 10);
    const bNum = parseInt(b.sourceLabel.replace(/\D/g, ""), 10);
    return aNum - bNum;
  });
}

function deduplicateUnits(units: ExtractedUnit[]): ExtractedUnit[] {
  const seen = new Map<string, ExtractedUnit>();

  for (const unit of units) {
    const textKey = normalizeMultilineText(unit.rawText).toLowerCase();
    const imageKey = unit.images.map((i) => i.mimeType).join(",");
    const key = `${textKey}|${imageKey}|${unit.images.length}`;

    const existing = seen.get(key);
    if (existing) {
      const existingLabelNum = parseInt(existing.sourceLabel.replace(/\D/g, ""), 10);
      const currentLabelNum = parseInt(unit.sourceLabel.replace(/\D/g, ""), 10);
      if (currentLabelNum < existingLabelNum) {
        seen.set(key, unit);
      }
    } else {
      seen.set(key, unit);
    }
  }

  return Array.from(seen.values()).sort((a, b) => {
    const aNum = parseInt(a.sourceLabel.replace(/\D/g, ""), 10);
    const bNum = parseInt(b.sourceLabel.replace(/\D/g, ""), 10);
    return aNum - bNum;
  });
}

function hasUsableContent(rawText: string, ocrText: string, analysis: InventoryAnalysisResult): boolean {
  if (rawText.trim().length >= 20) return true;
  if (ocrText.trim().length >= 20) return true;

  const filledFields = Object.values({ city: analysis.city, mediaType: analysis.mediaType, size: analysis.size, location: analysis.location })
    .filter((v) => v !== "Unknown").length;
  if (filledFields >= 2) return true;

  return false;
}

async function enhanceUnitsWithOcr(units: ExtractedUnit[]) {
  const deduplicated = deduplicateUnits(units);
  if (deduplicated.length !== units.length) {
    console.log(`Deduplication: ${units.length} -> ${deduplicated.length} units`);
  }
  units = deduplicated;

  const initialAnalyses = await Promise.all(
    units.map((unit) =>
      heuristicInventoryBatchAnalyzer.analyze({
        label: unit.sourceLabel,
        sourceType: unit.sourceType,
        text: unit.rawText,
        imageCount: unit.images.length,
      }),
    ),
  );

  const ocrCandidates = units
    .map((unit, index) => ({
      unit,
      index,
      needsOcr:
        unit.ocrBuffers.length > 0 &&
        (unit.sourceType === "pdf" ||
          unit.rawText.length < 120 ||
          initialAnalyses[index].unknownFields.length >= 1),
    }))
    .filter((entry) => entry.needsOcr && entry.unit.ocrBuffers.length > 0);

  const ocrTexts = new Map<number, string>();
  const warnings: string[] = [];

  if (ocrCandidates.length > 0) {
    try {
      const bufferOwners: number[] = [];
      const flatBuffers = ocrCandidates.flatMap((entry) => {
        entry.unit.ocrBuffers.forEach(() => bufferOwners.push(entry.index));
        return entry.unit.ocrBuffers;
      });

      const totalLimit = 30;
      const limitedBuffers = flatBuffers.slice(0, totalLimit);
      const limitedOwners = bufferOwners.slice(0, totalLimit);
      if (flatBuffers.length > totalLimit) {
        warnings.push(
          `OCR was limited to ${totalLimit} images (${flatBuffers.length} total available) to keep processing fast. Some fields may remain Unknown.`,
        );
      }

      const results = await runOcrOnBuffers(limitedBuffers);
      const groupedTexts = new Map<number, string[]>();

      results.forEach((result, resultIndex) => {
        const ownerIndex = limitedOwners[resultIndex];
        if (ownerIndex === undefined) return;
        const current = groupedTexts.get(ownerIndex) || [];
        if (result.trim()) current.push(result);
        groupedTexts.set(ownerIndex, current);
      });

      groupedTexts.forEach((texts, ownerIndex) => {
        ocrTexts.set(ownerIndex, normalizeMultilineText(texts.join("\n")));
      });
    } catch (err) {
      console.error("OCR fallback failed with error:", err);
      warnings.push(
        "OCR fallback was unavailable for this upload, so some fields may remain Unknown.",
      );
    }
  }

  const finalDrafts: StoredBatchInventoryDraft[] = [];

  for (let index = 0; index < units.length; index++) {
    const unit = units[index];
    const ocrText = ocrTexts.get(index) || "";
    const analysis = await heuristicInventoryBatchAnalyzer.analyze({
      label: unit.sourceLabel,
      sourceType: unit.sourceType,
      text: unit.rawText,
      ocrText,
      imageCount: unit.images.length,
    });

    if (!hasUsableContent(unit.rawText, ocrText, analysis)) continue;

    finalDrafts.push({
      id: unit.id,
      sourceType: unit.sourceType,
      sourceLabel: unit.sourceLabel,
      city: analysis.city,
      mediaType: analysis.mediaType,
      size: analysis.size,
      location: analysis.location,
      featured: false,
      confidence: analysis.confidence,
      unknownFields: analysis.unknownFields,
      imagePreviews: unit.images,
      rawText: unit.rawText,
      ocrText,
    } satisfies StoredBatchInventoryDraft);
  }

  const firstCity = finalDrafts.find(
    (d) => d.city !== "Unknown",
  )?.city;
  if (firstCity) {
    for (const draft of finalDrafts) {
      if (draft.city === "Unknown") {
        draft.city = firstCity;
        draft.unknownFields = draft.unknownFields.filter(
          (f) => f !== "city",
        );
        draft.confidence = Math.round(
          draft.confidence * 0.85 + 15,
        );
      }
    }
  }

  return { drafts: finalDrafts, warnings };
}

export async function extractInventoryBatchFile(file: File) {
  const extension = getFileExtension(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  if (extension === "ppt") {
    throw new Error(
      "Legacy .ppt files require conversion support that is not available on this server yet. Please export the file as .pptx or .pdf and try again.",
    );
  }

  let units: ExtractedUnit[] = [];

  if (extension === "pptx") {
    units = await extractFromPptx(buffer, file.name);
  } else if (extension === "pdf") {
    units = await extractFromPdf(buffer);
  } else {
    throw new Error("Please upload a .ppt, .pptx, or .pdf file.");
  }

  if (units.length === 0) {
    throw new Error(
      "No inventory-like pages were detected in this file. Try a PPTX/PDF with site slides or pages that include billboard content.",
    );
  }

  return enhanceUnitsWithOcr(units);
}

export function toBatchDraftPreview(draft: StoredBatchInventoryDraft) {
  return {
    ...draft,
    imagePreviews: draft.imagePreviews.map((image) => ({
      id: image.id,
      fileName: image.fileName,
      previewUrl: image.previewUrl,
      mimeType: image.mimeType,
      source: image.source,
      width: image.width,
      height: image.height,
    })),
  } satisfies BatchInventoryDraftPreview;
}

export function resolveUploadFileName(
  image: StoredBatchInventoryImage,
  draft: {
    sourceLabel: string;
    id: string;
  },
) {
  const extension = getFileExtension(image.fileName);
  const sanitizedSource = draft.sourceLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  const inferredExtension =
    extension || mimeTypeFromFileName(image.fileName).split("/")[1] || "png";

  return `${sanitizedSource || draft.id}-${image.id}.${inferredExtension}`;
}
