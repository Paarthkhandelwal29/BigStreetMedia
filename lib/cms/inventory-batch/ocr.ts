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

const MAX_OCR_WORKERS = 2;

async function ocrOne(worker: import("tesseract.js").Worker, buffer: Buffer) {
  try {
    const result = await worker.recognize(buffer);
    return result.data.text || "";
  } catch {
    return "";
  }
}

export async function runOcrOnBuffers(buffers: Buffer[]) {
  if (buffers.length === 0) return [];

  const { createWorker, PSM } = await import("tesseract.js");
  const { workerPath, corePath, cachePath } = getTesseractPaths();

  const workers = await Promise.all(
    Array.from({ length: MAX_OCR_WORKERS }, () =>
      createWorker("eng", 1, {
        workerPath,
        corePath,
        cachePath,
        errorHandler: () => undefined,
      }),
    ),
  );

  try {
    for (const worker of workers) {
      await worker.setParameters({
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        tessedit_do_invert: "0",
        textord_heavy_nr: "1",
        tessedit_enable_doc_dict: "1",
        language_model_penalty_non_freq_dict_word: "1",
        language_model_penalty_non_dict_word: "1",
        textord_min_linesize: "1.0",
      });
    }

    const results: string[] = new Array(buffers.length);
    const batches: Promise<void>[] = [];

    for (let i = 0; i < buffers.length; i++) {
      const workerIndex = i % MAX_OCR_WORKERS;
      const buffer = buffers[i];
      const index = i;
      batches.push(
        ocrOne(workers[workerIndex], buffer).then((text) => {
          results[index] = text;
        }),
      );
    }

    await Promise.all(batches);
    return results;
  } finally {
    await Promise.all(workers.map((w) => w.terminate()));
  }
}
