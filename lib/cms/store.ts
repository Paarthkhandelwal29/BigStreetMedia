import type {
  CaseStudyRecord,
  CreateMediaInventoryInput,
  CreatePortfolioWorkInput,
  CreateServiceFormatImageInput,
  MediaInventoryRecord,
  PortfolioWorkRecord,
  ServiceFormatImageRecord,
} from "./types";
import { caseStudyRepository } from "./repositories/case-study-repository";
import { inventoryRepository } from "./repositories/inventory-repository";
import { portfolioRepository } from "./repositories/portfolio-repository";
import { serviceFormatRepository } from "./repositories/service-format-repository";

export async function listInventory(): Promise<MediaInventoryRecord[]> {
  return inventoryRepository.getAll();
}

export async function getInventory(
  id: string,
): Promise<MediaInventoryRecord | null> {
  return inventoryRepository.getById(id);
}

export async function createInventory(
  input: CreateMediaInventoryInput,
): Promise<MediaInventoryRecord> {
  return inventoryRepository.create(input);
}

export async function updateInventory(
  id: string,
  input: Partial<CreateMediaInventoryInput>,
): Promise<MediaInventoryRecord | null> {
  return inventoryRepository.update(id, input);
}

export async function deleteInventory(id: string): Promise<boolean> {
  return inventoryRepository.delete(id);
}

export async function listPortfolio(): Promise<PortfolioWorkRecord[]> {
  return portfolioRepository.getAll();
}

export async function getPortfolio(
  id: string,
): Promise<PortfolioWorkRecord | null> {
  return portfolioRepository.getById(id);
}

export async function createPortfolio(
  input: CreatePortfolioWorkInput,
): Promise<PortfolioWorkRecord> {
  return portfolioRepository.create(input);
}

export async function createPortfolioBatch(
  inputs: CreatePortfolioWorkInput[],
): Promise<PortfolioWorkRecord[]> {
  return portfolioRepository.createMany(inputs);
}

export async function updatePortfolio(
  id: string,
  input: Partial<CreatePortfolioWorkInput>,
): Promise<PortfolioWorkRecord | null> {
  return portfolioRepository.update(id, input);
}

export async function deletePortfolio(id: string): Promise<boolean> {
  return portfolioRepository.delete(id);
}

export async function listCaseStudies(): Promise<CaseStudyRecord[]> {
  return caseStudyRepository.getAll();
}

export async function getCaseStudy(
  id: string,
): Promise<CaseStudyRecord | null> {
  return caseStudyRepository.getById(id);
}

export async function createCaseStudy(
  input: Partial<CaseStudyRecord>,
): Promise<CaseStudyRecord> {
  return caseStudyRepository.create(input);
}

export async function updateCaseStudy(
  id: string,
  input: Partial<CaseStudyRecord>,
): Promise<CaseStudyRecord | null> {
  return caseStudyRepository.update(id, input);
}

export async function deleteCaseStudy(id: string): Promise<boolean> {
  return caseStudyRepository.delete(id);
}

export async function listServiceFormatImages(): Promise<ServiceFormatImageRecord[]> {
  return serviceFormatRepository.getAll();
}

export async function getServiceFormatImagesByService(
  slug: string,
): Promise<ServiceFormatImageRecord[]> {
  return serviceFormatRepository.getByServiceSlug(slug);
}

export async function upsertServiceFormatImage(
  input: CreateServiceFormatImageInput,
): Promise<ServiceFormatImageRecord> {
  return serviceFormatRepository.upsert(input);
}

export async function deleteServiceFormatImage(id: string): Promise<boolean> {
  return serviceFormatRepository.delete(id);
}
