import path from "node:path";

function getTesseractPaths() {
  const projectRoot = process.cwd();

  return {
    workerPath: path.join(
      projectRoot,
      "node_modules",
      "tesseract.js",
      "src",
      "worker-script",
      "node",
      "index.js",
    ),
    corePath: path.join(projectRoot, "node_modules", "tesseract.js-core"),
    cachePath: path.join(projectRoot, ".next", "cache", "tesseract"),
  };
}

export async function runOcrOnBuffers(buffers: Buffer[]) {
  if (buffers.length === 0) return [];

  const { createWorker } = await import("tesseract.js");
  const { workerPath, corePath, cachePath } = getTesseractPaths();

  const worker = await createWorker("eng", 1, {
    workerPath,
    corePath,
    cachePath,
    errorHandler: () => undefined,
  });

  try {
    const results: string[] = [];

    for (const buffer of buffers) {
      try {
        const result = await worker.recognize(buffer);
        results.push(result.data.text || "");
      } catch {
        results.push("");
      }
    }

    return results;
  } finally {
    await worker.terminate();
  }
}
