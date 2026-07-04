import { analyzeInventorySource } from "./heuristics";
import type { InventoryBatchAnalyzer } from "./types";

export const heuristicInventoryBatchAnalyzer: InventoryBatchAnalyzer = {
  analyze(unit) {
    return Promise.resolve(analyzeInventorySource(unit));
  },
};
