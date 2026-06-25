import type { CaseStudyRecord } from "@/lib/cms/types";
import { getSupabaseClient } from "@/lib/cms/supabase";
import { mediaAssetRepository } from "./media-asset-repository";
import { normalizeMediaInputs, slugify, type MediaAssetInput } from "./utils";

type CaseStudyRow = {
  id: string;
  title: string;
  slug?: string | null;
  client_name?: string | null;
  objective?: string | null;
  challenge?: string | null;
  solution?: string | null;
  execution?: string | null;
  results?: string | null;
  cover_image_url?: string | null;
  thumbnail_url?: string | null;
  featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function mapRowToRecord(row: CaseStudyRow): CaseStudyRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug ?? undefined,
    clientName: row.client_name ?? "",
    objective: row.objective ?? "",
    challenge: row.challenge ?? "",
    solution: row.solution ?? "",
    execution: row.execution ?? "",
    results: row.results ?? "",
    images: [],
    videos: [],
    featured: row.featured ?? false,
    coverImageUrl: row.cover_image_url ?? row.thumbnail_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? row.cover_image_url ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function mapInputToRow(input: Partial<CaseStudyRecord> & { images?: Array<string | MediaAssetInput>; videos?: Array<string | MediaAssetInput> }) {
  const cover = normalizeMediaInputs(input.images ?? []).at(0);
  return {
    title: input.title ?? "",
    slug: input.slug ?? slugify(input.title ?? ""),
    client_name: input.clientName ?? null,
    objective: input.objective ?? null,
    challenge: input.challenge ?? null,
    solution: input.solution ?? null,
    execution: input.execution ?? null,
    results: input.results ?? null,
    cover_image_url: cover?.url ?? null,
    thumbnail_url: cover?.url ?? null,
    featured: input.featured ?? false,
    updated_at: new Date().toISOString(),
  };
}

export class CaseStudyRepository {
  async getAll() {
    const client = getSupabaseClient();
    if (!client) {
      return [] as CaseStudyRecord[];
    }

    const { data, error } = await client.from("case_studies").select("*").order("created_at", { ascending: false });
    if (error) {
      throw error;
    }

    return (data ?? []).map(mapRowToRecord);
  }

  async getById(id: string) {
    const client = getSupabaseClient();
    if (!client) {
      return null;
    }

    const { data, error } = await client.from("case_studies").select("*").eq("id", id).maybeSingle();
    if (error) {
      throw error;
    }

    return data ? mapRowToRecord(data as CaseStudyRow) : null;
  }

  async create(input: Partial<CaseStudyRecord> & { images?: Array<string | MediaAssetInput>; videos?: Array<string | MediaAssetInput> }) {
    const client = getSupabaseClient();
    if (!client) {
      const record: CaseStudyRecord = {
        id: crypto.randomUUID(),
        title: input.title ?? "Untitled",
        slug: input.slug ?? slugify(input.title ?? "Untitled"),
        clientName: input.clientName ?? "",
        objective: input.objective ?? "",
        challenge: input.challenge ?? "",
        solution: input.solution ?? "",
        execution: input.execution ?? "",
        results: input.results ?? "",
        images: normalizeMediaInputs(input.images ?? []).map((item) => item.url),
        videos: normalizeMediaInputs(input.videos ?? []).map((item) => item.url),
        featured: input.featured ?? false,
        coverImageUrl: normalizeMediaInputs(input.images ?? []).at(0)?.url,
        thumbnailUrl: normalizeMediaInputs(input.images ?? []).at(0)?.url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return record;
    }

    const row = mapInputToRow(input);
    const { data, error } = await client.from("case_studies").insert([{ ...row, created_at: new Date().toISOString() }]).select().single();
    if (error) {
      throw error;
    }

    const record = mapRowToRecord(data as CaseStudyRow);
    const mediaItems = normalizeMediaInputs(input.images ?? []);
    if (record.id) {
      await mediaAssetRepository.createMany({ ownerType: "case_study", ownerId: record.id, items: mediaItems.map((item, index) => ({ kind: "image", url: item.url, imagekitFileId: item.fileId, width: item.width, height: item.height, fileSize: item.fileSize, sortOrder: index })) });
    }

    return record;
  }

  async update(id: string, input: Partial<CaseStudyRecord> & { images?: Array<string | MediaAssetInput>; videos?: Array<string | MediaAssetInput> }) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        id,
        title: input.title ?? "Untitled",
        slug: input.slug ?? slugify(input.title ?? "Untitled"),
        clientName: input.clientName ?? "",
        objective: input.objective ?? "",
        challenge: input.challenge ?? "",
        solution: input.solution ?? "",
        execution: input.execution ?? "",
        results: input.results ?? "",
        images: normalizeMediaInputs(input.images ?? []).map((item) => item.url),
        videos: normalizeMediaInputs(input.videos ?? []).map((item) => item.url),
        featured: input.featured ?? false,
        coverImageUrl: normalizeMediaInputs(input.images ?? []).at(0)?.url,
        thumbnailUrl: normalizeMediaInputs(input.images ?? []).at(0)?.url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CaseStudyRecord;
    }

    const row = mapInputToRow(input);
    const { data, error } = await client.from("case_studies").update(row).eq("id", id).select().single();
    if (error) {
      throw error;
    }

    const record = mapRowToRecord(data as CaseStudyRow);
    if (input.images && input.images.length > 0) {
      await mediaAssetRepository.deleteForOwner("case_study", id);
      const mediaItems = normalizeMediaInputs(input.images ?? []);
      await mediaAssetRepository.createMany({ ownerType: "case_study", ownerId: record.id, items: mediaItems.map((item, index) => ({ kind: "image", url: item.url, imagekitFileId: item.fileId, width: item.width, height: item.height, fileSize: item.fileSize, sortOrder: index })) });
    }
    return record;
  }

  async delete(id: string) {
    const client = getSupabaseClient();
    if (!client) {
      return false;
    }
    const { error } = await client.from("case_studies").delete().eq("id", id);
    if (error) {
      throw error;
    }
    await mediaAssetRepository.deleteForOwner("case_study", id);
    return true;
  }
}

export const caseStudyRepository = new CaseStudyRepository();
