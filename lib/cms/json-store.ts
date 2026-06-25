import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const cmsDir = path.join(process.cwd(), "data", "cms");

async function ensureCollectionFile(fileName: string) {
  await fs.mkdir(cmsDir, { recursive: true });
  const filePath = path.join(cmsDir, `${fileName}.json`);

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }

  return filePath;
}

export async function readJsonCollection<T>(fileName: string, fallback: T[] = []): Promise<T[]> {
  const filePath = await ensureCollectionFile(fileName);
  const content = await fs.readFile(filePath, "utf8");

  if (!content.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(content) as T[];
  } catch {
    return fallback;
  }
}

export async function writeJsonCollection<T>(fileName: string, items: T[]) {
  const filePath = await ensureCollectionFile(fileName);
  await fs.writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}

export async function appendJsonCollectionRecord<T extends { id: string }>(fileName: string, record: T): Promise<T> {
  const items = await readJsonCollection<T>(fileName);
  const nextRecord = { ...record, id: record.id || randomUUID() };
  await writeJsonCollection(fileName, [...items, nextRecord]);
  return nextRecord;
}

export async function updateJsonCollectionRecord<T extends { id: string }>(fileName: string, id: string, updates: Partial<T> & { id: string }) {
  const items = await readJsonCollection<T>(fileName);
  const nextItems = items.map((item) => (item.id === id ? { ...item, ...updates } : item));
  await writeJsonCollection(fileName, nextItems);
  return nextItems.find((item) => item.id === id) ?? null;
}

export async function deleteJsonCollectionRecord<T extends { id: string }>(fileName: string, id: string) {
  const items = await readJsonCollection<T>(fileName);
  const nextItems = items.filter((item) => item.id !== id);
  await writeJsonCollection(fileName, nextItems);
  return nextItems.length !== items.length;
}
