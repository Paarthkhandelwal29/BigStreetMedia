import type {
  CreateMediaInventoryInput,
  CreatePortfolioWorkInput,
  MediaInventoryRecord,
  PortfolioWorkRecord,
} from "./types";
import { inventoryRepository } from "./repositories/inventory-repository";
import { portfolioRepository } from "./repositories/portfolio-repository";

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
