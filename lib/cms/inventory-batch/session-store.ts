import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type {
  BatchInventorySession,
  StoredBatchInventoryDraft,
} from "./types";

const SESSION_DIR = path.join(os.tmpdir(), "paarth-website-inventory-batch");
const SESSION_TTL_MS = 1000 * 60 * 60 * 24;

async function ensureSessionDirectory() {
  await mkdir(SESSION_DIR, { recursive: true });
}

function getSessionFilePath(sessionId: string) {
  if (!/^[a-f0-9-]+$/i.test(sessionId)) {
    throw new Error("Invalid batch session id.");
  }

  return path.join(SESSION_DIR, `${sessionId}.json`);
}

export async function cleanupBatchSessions() {
  await ensureSessionDirectory();

  const entries = await readdir(SESSION_DIR);
  const now = Date.now();

  await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".json"))
      .map(async (entry) => {
        const filePath = path.join(SESSION_DIR, entry);
        const metadata = await stat(filePath);
        if (now - metadata.mtimeMs > SESSION_TTL_MS) {
          await unlink(filePath).catch(() => undefined);
        }
      }),
  );
}

export async function saveBatchSession(input: {
  fileName: string;
  drafts: StoredBatchInventoryDraft[];
  warnings: string[];
}) {
  await cleanupBatchSessions();

  const sessionId = randomUUID();
  const session: BatchInventorySession = {
    id: sessionId,
    fileName: input.fileName,
    createdAt: new Date().toISOString(),
    drafts: input.drafts,
    warnings: input.warnings,
  };

  await writeFile(getSessionFilePath(sessionId), JSON.stringify(session), "utf8");

  return session;
}

export async function readBatchSession(sessionId: string) {
  await ensureSessionDirectory();

  try {
    const content = await readFile(getSessionFilePath(sessionId), "utf8");
    return JSON.parse(content) as BatchInventorySession;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

export async function deleteBatchSession(sessionId: string) {
  await unlink(getSessionFilePath(sessionId)).catch(() => undefined);
}
