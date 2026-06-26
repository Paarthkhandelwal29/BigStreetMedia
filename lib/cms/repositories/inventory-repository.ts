import type { MediaInventoryRecord } from "@/lib/cms/types";
import { getSupabaseClient } from "@/lib/cms/supabase";
import { mediaAssetRepository } from "./media-asset-repository";
import { normalizeMediaInputs, slugify, type MediaAssetInput } from "./utils";

type InventoryRow = {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  site_code?: string | null;
  city?: string | null;
  state?: string | null;
  locality?: string | null;
  address?: string | null;
  google_maps_url?: string | null;
  media_type?: string | null;
  media_category?: string | null;
  width?: number | null;
  height?: number | null;
  size?: string | null;
  illumination?: string | null;
  traffic_volume?: string | null;
  media_owner?: string | null;
  industries?: string[] | null;
  tags?: string[] | null;
  cover_image_url?: string | null;
  thumbnail_url?: string | null;
  availability?: boolean | null;
  featured?: boolean | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function mapRowToRecord(row: InventoryRow): MediaInventoryRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug ?? undefined,
    description: row.description ?? undefined,
    siteCode: row.site_code ?? undefined,
    city: row.city ?? "",
    state: row.state ?? "",
    locality: row.locality ?? undefined,
    address: row.address ?? undefined,
    googleMapsUrl: row.google_maps_url ?? undefined,
    mediaType: row.media_type ?? "",
    mediaCategory: row.media_category ?? undefined,
    width: row.width ?? undefined,
    height: row.height ?? undefined,
    size: row.size ?? undefined,
    illumination: row.illumination ?? undefined,
    trafficVolume: row.traffic_volume ?? undefined,
    mediaOwner: row.media_owner ?? undefined,
    industries: row.industries ?? [],
    tags: row.tags ?? [],
    imageUrl: row.cover_image_url ?? row.thumbnail_url ?? "",
    galleryImages: [],
    availability: row.availability ?? true,
    featured: row.featured ?? false,
    status: (row.status as MediaInventoryRecord["status"]) ?? "active",
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function mapInputToRow(
  input: Partial<MediaInventoryRecord> & {
    imageUrl?: string | MediaAssetInput;
    galleryImages?: Array<string | MediaAssetInput>;
  },
): Partial<InventoryRow> {
  const cover =
    typeof input.imageUrl === "string"
      ? { url: input.imageUrl }
      : input.imageUrl;

  return {
    title: input.title ?? "",
    slug: input.slug ?? slugify(input.title ?? ""),
    description: input.description ?? null,
    site_code: input.siteCode ?? null,
    city: input.city ?? null,
    state: input.state ?? null,
    locality: input.locality ?? null,
    address: input.address ?? null,
    google_maps_url: input.googleMapsUrl ?? null,
    media_type: input.mediaType ?? null,
    media_category: input.mediaCategory ?? null,
    width: input.width ?? null,
    height: input.height ?? null,
    size: input.size ?? null,
    illumination: input.illumination ?? null,
    traffic_volume: input.trafficVolume ?? null,
    media_owner: input.mediaOwner ?? null,
    industries: input.industries ?? [],
    tags: input.tags ?? [],
    cover_image_url: cover?.url ?? null,
    thumbnail_url: cover?.url ?? null,
    availability: input.availability ?? true,
    featured: input.featured ?? false,
    status: input.status ?? "active",
    updated_at: new Date().toISOString(),
  };
}

export class InventoryRepository {
  async getAll() {
    const client = getSupabaseClient();
    if (!client) {
      return [] as MediaInventoryRecord[];
    }

    const { data, error } = await client
      .from("inventory_items")
      .select("*")
      .order("created_at", { ascending: false });
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

    const { data, error } = await client
      .from("inventory_items")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      throw error;
    }

    return data ? mapRowToRecord(data as InventoryRow) : null;
  }

  async create(
    input: Partial<MediaInventoryRecord> & {
      imageUrl?: string | MediaAssetInput;
      galleryImages?: Array<string | MediaAssetInput>;
    },
  ) {
    const client = getSupabaseClient();
    const primaryImage =
      typeof input.imageUrl === "string"
        ? input.imageUrl
        : (normalizeMediaInputs([input.imageUrl]).at(0)?.url ?? "");
    if (!client) {
      const record: MediaInventoryRecord = {
        id: crypto.randomUUID(),
        title: input.title ?? "Untitled",
        slug: input.slug ?? slugify(input.title ?? "Untitled"),
        description: input.description,
        siteCode: input.siteCode,
        city: input.city ?? "",
        state: input.state ?? "",
        locality: input.locality,
        address: input.address,
        googleMapsUrl: input.googleMapsUrl,
        mediaType: input.mediaType ?? "",
        mediaCategory: input.mediaCategory,
        width: input.width,
        height: input.height,
        size: input.size,
        illumination: input.illumination,
        trafficVolume: input.trafficVolume,
        mediaOwner: input.mediaOwner,
        industries: input.industries ?? [],
        tags: input.tags ?? [],
        imageUrl: primaryImage,
        galleryImages: normalizeMediaInputs(input.galleryImages ?? []).map(
          (item) => item.url,
        ),
        availability: input.availability ?? true,
        featured: input.featured ?? false,
        status: input.status ?? "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return record;
    }

    const row = mapInputToRow(input);
    const { data, error } = await client
      .from("inventory_items")
      .insert([{ ...row, created_at: new Date().toISOString() }])
      .select()
      .single();
    if (error) {
      throw error;
    }

    const record = mapRowToRecord(data as InventoryRow);
    const mediaItems = normalizeMediaInputs([
      input.imageUrl,
      ...(input.galleryImages ?? []),
    ]);
    if (record.id) {
      const withKind = mediaItems.map((item, index) => ({
        kind: "image" as const,
        url: item.url,
        imagekitFileId: item.fileId,
        width: item.width,
        height: item.height,
        fileSize: item.fileSize,
        sortOrder: index,
      }));
      await mediaAssetRepository.createMany({
        ownerType: "inventory",
        ownerId: record.id,
        items: withKind,
      });
    }

    return record;
  }

  async update(
    id: string,
    input: Partial<MediaInventoryRecord> & {
      imageUrl?: string | MediaAssetInput;
      galleryImages?: Array<string | MediaAssetInput>;
    },
  ) {
    const client = getSupabaseClient();
    const primaryImage =
      typeof input.imageUrl === "string"
        ? input.imageUrl
        : (normalizeMediaInputs([input.imageUrl]).at(0)?.url ?? "");
    if (!client) {
      return {
        id,
        title: input.title ?? "Untitled",
        slug: input.slug,
        description: input.description,
        siteCode: input.siteCode,
        city: input.city ?? "",
        state: input.state ?? "",
        locality: input.locality,
        address: input.address,
        googleMapsUrl: input.googleMapsUrl,
        mediaType: input.mediaType ?? "",
        mediaCategory: input.mediaCategory,
        width: input.width,
        height: input.height,
        size: input.size,
        illumination: input.illumination,
        trafficVolume: input.trafficVolume,
        mediaOwner: input.mediaOwner,
        industries: input.industries ?? [],
        tags: input.tags ?? [],
        imageUrl: primaryImage,
        galleryImages: normalizeMediaInputs(input.galleryImages ?? []).map(
          (item) => item.url,
        ),
        availability: input.availability ?? true,
        featured: input.featured ?? false,
        status: input.status ?? "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as MediaInventoryRecord;
    }

    const row = mapInputToRow(input);
    const { data, error } = await client
      .from("inventory_items")
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      throw error;
    }

    const record = mapRowToRecord(data as InventoryRow);
    if (
      input.imageUrl ||
      (input.galleryImages && input.galleryImages.length > 0)
    ) {
      await mediaAssetRepository.deleteForOwner("inventory", id);
      const mediaItems = normalizeMediaInputs([
        input.imageUrl,
        ...(input.galleryImages ?? []),
      ]);
      await mediaAssetRepository.createMany({
        ownerType: "inventory",
        ownerId: record.id,
        items: mediaItems.map((item, index) => ({
          kind: "image",
          url: item.url,
          imagekitFileId: item.fileId,
          width: item.width,
          height: item.height,
          fileSize: item.fileSize,
          sortOrder: index,
        })),
      });
    }
    return record;
  }

  async delete(id: string) {
    const client = getSupabaseClient();
    if (!client) {
      return false;
    }
    const { error } = await client
      .from("inventory_items")
      .delete()
      .eq("id", id);
    if (error) {
      throw error;
    }
    await mediaAssetRepository.deleteForOwner("inventory", id);
    return true;
  }
}

export const inventoryRepository = new InventoryRepository();
