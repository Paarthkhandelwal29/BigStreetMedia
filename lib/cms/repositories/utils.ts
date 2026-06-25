export type MediaAssetInput = {
  url: string;
  fileId?: string;
  width?: number;
  height?: number;
  fileSize?: number;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeMediaInput(value: string | MediaAssetInput | undefined): MediaAssetInput | null {
  if (!value) return null;
  if (typeof value === "string") {
    return { url: value };
  }
  if (typeof value === "object" && typeof value.url === "string") {
    return value;
  }
  return null;
}

export function normalizeMediaInputs(value: Array<string | MediaAssetInput | undefined> | undefined): MediaAssetInput[] {
  if (!value) return [];
  return value.map(normalizeMediaInput).filter((item): item is MediaAssetInput => Boolean(item));
}
