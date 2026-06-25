import type { CaseStudyRecord, MediaInventoryRecord, PortfolioProjectRecord } from "./types";
import { inventoryRepository } from "./repositories/inventory-repository";
import { portfolioRepository } from "./repositories/portfolio-repository";
import { caseStudyRepository } from "./repositories/case-study-repository";

export async function listInventory(): Promise<MediaInventoryRecord[]> {
  return inventoryRepository.getAll();
}

export async function getInventory(id: string): Promise<MediaInventoryRecord | null> {
  return inventoryRepository.getById(id);
}

export async function createInventory(input: Omit<MediaInventoryRecord, "id" | "createdAt" | "updatedAt">): Promise<MediaInventoryRecord> {
  return inventoryRepository.create(input as Partial<MediaInventoryRecord>);
}

export async function updateInventory(id: string, input: Partial<MediaInventoryRecord>): Promise<MediaInventoryRecord | null> {
  return inventoryRepository.update(id, input);
}

export async function deleteInventory(id: string): Promise<boolean> {
  return inventoryRepository.delete(id);
}

export async function listPortfolio(): Promise<PortfolioProjectRecord[]> {
  return portfolioRepository.getAll();
}

export async function getPortfolio(id: string): Promise<PortfolioProjectRecord | null> {
  return portfolioRepository.getById(id);
}

export async function createPortfolio(input: Omit<PortfolioProjectRecord, "id" | "createdAt" | "updatedAt">): Promise<PortfolioProjectRecord> {
  return portfolioRepository.create(input as Partial<PortfolioProjectRecord>);
}

export async function updatePortfolio(id: string, input: Partial<PortfolioProjectRecord>): Promise<PortfolioProjectRecord | null> {
  return portfolioRepository.update(id, input);
}

export async function deletePortfolio(id: string): Promise<boolean> {
  return portfolioRepository.delete(id);
}

export async function listCaseStudies(): Promise<CaseStudyRecord[]> {
  return caseStudyRepository.getAll();
}

export async function getCaseStudy(id: string): Promise<CaseStudyRecord | null> {
  return caseStudyRepository.getById(id);
}

export async function createCaseStudy(input: Omit<CaseStudyRecord, "id" | "createdAt" | "updatedAt">): Promise<CaseStudyRecord> {
  return caseStudyRepository.create(input as Partial<CaseStudyRecord>);
}

export async function updateCaseStudy(id: string, input: Partial<CaseStudyRecord>): Promise<CaseStudyRecord | null> {
  return caseStudyRepository.update(id, input);
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  return caseStudyRepository.delete(id);
}
