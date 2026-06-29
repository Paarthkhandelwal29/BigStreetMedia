import { PDFParse } from "pdf-parse";
import { runOcrOnBuffers } from "./lib/cms/inventory-batch/ocr.ts";
import { randomUUID } from "node:crypto";

function parseDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL returned by extractor.");
  }
  return {
    mimeType: match[1],
    base64: match[2],
  };
}

function buildStoredImage(input) {
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
  };
}

async function main() {
  try {
    const url = "https://github.com/mozilla/pdf.js/raw/master/web/compressed.tracemonkey-pldi-09.pdf";
    console.log("Fetching PDF from:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    console.log("Fetched PDF size:", pdfBuffer.length);

    const parser = new PDFParse({ data: pdfBuffer });
    const textResult = await parser.getText();
    console.log("PDF total pages:", textResult.total);

    // Only test page 1 to save time
    for (let pageNumber = 1; pageNumber <= 1; pageNumber += 1) {
      let images = [];
      let screenshotImage = null;

      try {
        console.log(`Getting images for page ${pageNumber}...`);
        const imageResult = await parser.getImage({
          partial: [pageNumber],
          imageThreshold: 120,
        });

        const pageImages = imageResult.pages[0]?.images || [];
        console.log(`Page ${pageNumber} pageImages count:`, pageImages.length);

        images = pageImages.map((image, index) => {
          const extension = image.dataUrl.includes("image/jpeg") ? "jpg" : "png";
          return buildStoredImage({
            fileName: `page-${pageNumber}-image-${index + 1}.${extension}`,
            dataUrl: image.dataUrl,
            source: "embedded",
            width: image.width,
            height: image.height,
          });
        });
        console.log(`Page ${pageNumber} successfully built ${images.length} images`);
      } catch (err) {
        console.error(`Page ${pageNumber} getImage failed:`, err);
      }

      try {
        console.log(`Getting screenshot for page ${pageNumber}...`);
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
          console.log(`Page ${pageNumber} screenshot built successfully`);
          if (images.length === 0) {
            images = [screenshotImage];
          }
        }
      } catch (err) {
        console.error(`Page ${pageNumber} getScreenshot failed:`, err);
      }

      const ocrBuffers = [
        screenshotImage,
        ...images.filter((image) => image.source === "embedded"),
      ]
        .filter(Boolean)
        .map((img) => {
          if (img.mimeType === "image/tiff" || img.mimeType === "application/octet-stream") {
            return null;
          }
          return Buffer.from(img.base64, "base64");
        })
        .filter(Boolean)
        .slice(0, 3);

      console.log(`Page ${pageNumber} ocrBuffers count:`, ocrBuffers.length);
      if (ocrBuffers.length > 0) {
        console.log(`Running OCR for page ${pageNumber}...`);
        try {
          const ocrResults = await runOcrOnBuffers(ocrBuffers);
          console.log(`Page ${pageNumber} OCR Results:`, ocrResults);
        } catch (err) {
          console.error(`Page ${pageNumber} runOcrOnBuffers failed:`, err);
        }
      }
    }

    await parser.destroy();
  } catch (error) {
    console.error("Main failed:", error);
  }
}

main();
