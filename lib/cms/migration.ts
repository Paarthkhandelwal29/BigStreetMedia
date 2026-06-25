import { promises as fs } from "fs";
import path from "path";
import { inventoryRepository } from "./repositories/inventory-repository";
import { portfolioRepository } from "./repositories/portfolio-repository";
import { caseStudyRepository } from "./repositories/case-study-repository";
import type { MediaInventoryRecord, PortfolioProjectRecord, CaseStudyRecord } from "./types";

const dataDir = path.join(process.cwd(), "data", "cms");

async function readJson<T>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as T;
}

export async function migrateLegacyCmsToSupabase() {
  const inventory = await readJson<MediaInventoryRecord[]>(path.join(dataDir, "inventory.json"));
  const portfolio = await readJson<PortfolioProjectRecord[]>(path.join(dataDir, "portfolio.json"));
  const caseStudies = await readJson<CaseStudyRecord[]>(path.join(dataDir, "case-studies.json"));

  for (const item of inventory) {
    await inventoryRepository.create({
      ...item,
      imageUrl: item.imageUrl,
      galleryImages: item.galleryImages,
    });
  }

  for (const item of portfolio) {
    await portfolioRepository.create({
      ...item,
      images: item.images,
      videos: item.videos,
    });
  }

  for (const item of caseStudies) {
    await caseStudyRepository.create({
      ...item,
      images: item.images,
      videos: item.videos,
    });
  }

  return { inventory: inventory.length, portfolio: portfolio.length, caseStudies: caseStudies.length };
}
