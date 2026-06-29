import { randomUUID } from "node:crypto";
import { unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { extractPptx } from "pptx-content-extractor";
import { heuristicInventoryBatchAnalyzer } from "./analyzer";
import { normalizeMultilineText, normalizeWhitespace } from "./heuristics";
import { runOcrOnBuffers } from "./ocr";
import type {
  BatchInventoryDraftPreview,
  BatchInventoryImageSource,
  StoredBatchInventoryDraft,
  StoredBatchInventoryImage,
} from "./types";

type ExtractedUnit = {
  id: string;
  sourceType: "pdf" | "pptx";
  sourceLabel: string;
  rawText: string;
  images: StoredBatchInventoryImage[];
  ocrBuffers: Buffer[];
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
    const parsed = (await extractPptx(tempPath)) as PptxExtractResult;

    const mediaByName = new Map(
      parsed.media.map((item) => [getBaseName(item.name), item]),
    );

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
        const images = slide.mediaNames
          .map((mediaName) => ({
            mediaName,
            media: mediaByName.get(getBaseName(mediaName)),
          }))
          .filter(
            (
              entry,
            ): entry is {
              mediaName: string;
              media: PptxExtractResult["media"][number];
            } => Boolean(entry.media),
          )
          .map(({ media, mediaName }, mediaIndex) => {
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
            .filter((buffer): buffer is Buffer => Boolean(buffer))
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
          imageThreshold: 120,
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

      try {
        const screenshotResult = await parser.getScreenshot({
          partial: [pageNumber],
          desiredWidth: 1600,
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

          if (images.length === 0) {
            images = [screenshotImage];
          }
        }
      } catch (err) {
        console.error(`Page ${pageNumber} getScreenshot failed:`, err);
        screenshotImage = null;
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
          screenshotImage,
          ...images.filter((image) => image.source === "embedded"),
        ]
          .filter(Boolean)
          .map((image) =>
            getOcrBufferFromImage(image as StoredBatchInventoryImage),
          )
          .filter((buffer): buffer is Buffer => Boolean(buffer))
          .slice(0, 3),
      });
    }

    return units;
  } finally {
    await parser.destroy();
  }
}

async function enhanceUnitsWithOcr(units: ExtractedUnit[]) {
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
          unit.rawText.length < 80 ||
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

      const results = await runOcrOnBuffers(flatBuffers);
      const groupedTexts = new Map<number, string[]>();

      results.forEach((result, resultIndex) => {
        const ownerIndex = bufferOwners[resultIndex];
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

  const finalDrafts = await Promise.all(
    units.map(async (unit, index) => {
      const ocrText = ocrTexts.get(index) || "";
      const analysis = await heuristicInventoryBatchAnalyzer.analyze({
        label: unit.sourceLabel,
        sourceType: unit.sourceType,
        text: unit.rawText,
        ocrText,
        imageCount: unit.images.length,
      });

      return {
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
      } satisfies StoredBatchInventoryDraft;
    }),
  );

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
