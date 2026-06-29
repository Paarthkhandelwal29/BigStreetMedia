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

  const { createWorker, PSM } = await import("tesseract.js");
  const { workerPath, corePath, cachePath } = getTesseractPaths();

  const worker = await createWorker("eng", 1, {
    workerPath,
    corePath,
    cachePath,
    errorHandler: () => undefined,
  });

  try {
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      tessedit_do_invert: "0",
      textord_heavy_nr: "1",
      tessedit_enable_doc_dict: "1",
      language_model_penalty_non_freq_dict_word: "1",
      language_model_penalty_non_dict_word: "1",
      textord_min_linesize: "1.0",
    });

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
