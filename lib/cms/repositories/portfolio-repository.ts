import type { PortfolioProjectRecord } from "@/lib/cms/types";
import { getSupabaseClient } from "@/lib/cms/supabase";
import { mediaAssetRepository } from "./media-asset-repository";
import { normalizeMediaInputs, slugify, type MediaAssetInput } from "./utils";

type PortfolioRow = {
  id: string;
  title: string;
  slug?: string | null;
  client_name?: string | null;
  service_type?: string | null;
  location?: string | null;
  project_date?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  thumbnail_url?: string | null;
  featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function mapRowToRecord(row: PortfolioRow): PortfolioProjectRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug ?? undefined,
    clientName: row.client_name ?? undefined,
    serviceType: row.service_type ?? "",
    location: row.location ?? undefined,
    projectDate: row.project_date ?? undefined,
    description: row.description ?? "",
    images: [],
    videos: [],
    featured: row.featured ?? false,
    coverImageUrl: row.cover_image_url ?? row.thumbnail_url ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? row.cover_image_url ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function mapInputToRow(input: Partial<PortfolioProjectRecord> & { images?: Array<string | MediaAssetInput>; videos?: Array<string | MediaAssetInput> }) {
  const cover = normalizeMediaInputs(input.images ?? []).at(0);
  return {
    title: input.title ?? "",
    slug: input.slug ?? slugify(input.title ?? ""),
    client_name: input.clientName ?? null,
    service_type: input.serviceType ?? null,
    location: input.location ?? null,
    project_date: input.projectDate ?? null,
    description: input.description ?? null,
    cover_image_url: cover?.url ?? null,
    thumbnail_url: cover?.url ?? null,
    featured: input.featured ?? false,
    updated_at: new Date().toISOString(),
  };
}

export class PortfolioRepository {
  async getAll() {
    const client = getSupabaseClient();
    if (!client) {
      return [] as PortfolioProjectRecord[];
    }

    const { data, error } = await client.from("portfolio_projects").select("*").order("created_at", { ascending: false });
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

    const { data, error } = await client.from("portfolio_projects").select("*").eq("id", id).maybeSingle();
    if (error) {
      throw error;
    }

    return data ? mapRowToRecord(data as PortfolioRow) : null;
  }

  async create(input: Partial<PortfolioProjectRecord> & { images?: Array<string | MediaAssetInput>; videos?: Array<string | MediaAssetInput> }) {
    const client = getSupabaseClient();
    if (!client) {
      const record: PortfolioProjectRecord = {
        id: crypto.randomUUID(),
        title: input.title ?? "Untitled",
        slug: input.slug ?? slugify(input.title ?? "Untitled"),
        clientName: input.clientName,
        serviceType: input.serviceType ?? "",
        location: input.location,
        projectDate: input.projectDate,
        description: input.description ?? "",
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
    const { data, error } = await client.from("portfolio_projects").insert([{ ...row, created_at: new Date().toISOString() }]).select().single();
    if (error) {
      throw error;
    }

    const record = mapRowToRecord(data as PortfolioRow);
    const mediaItems = normalizeMediaInputs(input.images ?? []);
    if (record.id) {
      await mediaAssetRepository.createMany({ ownerType: "portfolio", ownerId: record.id, items: mediaItems.map((item, index) => ({ kind: "image", url: item.url, imagekitFileId: item.fileId, width: item.width, height: item.height, fileSize: item.fileSize, sortOrder: index })) });
    }

    return record;
  }

  async update(id: string, input: Partial<PortfolioProjectRecord> & { images?: Array<string | MediaAssetInput>; videos?: Array<string | MediaAssetInput> }) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        id,
        title: input.title ?? "Untitled",
        slug: input.slug ?? slugify(input.title ?? "Untitled"),
        clientName: input.clientName,
        serviceType: input.serviceType ?? "",
        location: input.location,
        projectDate: input.projectDate,
        description: input.description ?? "",
        images: normalizeMediaInputs(input.images ?? []).map((item) => item.url),
        videos: normalizeMediaInputs(input.videos ?? []).map((item) => item.url),
        featured: input.featured ?? false,
        coverImageUrl: normalizeMediaInputs(input.images ?? []).at(0)?.url,
        thumbnailUrl: normalizeMediaInputs(input.images ?? []).at(0)?.url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as PortfolioProjectRecord;
    }

    const row = mapInputToRow(input);
    const { data, error } = await client.from("portfolio_projects").update(row).eq("id", id).select().single();
    if (error) {
      throw error;
    }

    const record = mapRowToRecord(data as PortfolioRow);
    if (input.images && input.images.length > 0) {
      await mediaAssetRepository.deleteForOwner("portfolio", id);
      const mediaItems = normalizeMediaInputs(input.images ?? []);
      await mediaAssetRepository.createMany({ ownerType: "portfolio", ownerId: record.id, items: mediaItems.map((item, index) => ({ kind: "image", url: item.url, imagekitFileId: item.fileId, width: item.width, height: item.height, fileSize: item.fileSize, sortOrder: index })) });
    }
    return record;
  }

  async delete(id: string) {
    const client = getSupabaseClient();
    if (!client) {
      return false;
    }
    const { error } = await client.from("portfolio_projects").delete().eq("id", id);
    if (error) {
      throw error;
    }
    await mediaAssetRepository.deleteForOwner("portfolio", id);
    return true;
  }
}

export const portfolioRepository = new PortfolioRepository();
