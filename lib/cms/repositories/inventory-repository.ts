import type {
  CreateMediaInventoryInput,
  MediaInventoryRecord,
} from "@/lib/cms/types";
import { getSupabaseClient } from "@/lib/cms/supabase";

type InventoryRow = {
  id: string;
  city: string;
  media_type: string;
  size: string;
  location: string;
  images: string[] | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

function mapRowToRecord(row: InventoryRow): MediaInventoryRecord {
  return {
    id: row.id,
    city: row.city,
    mediaType: row.media_type,
    size: row.size,
    location: row.location,
    images: row.images ?? [],
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInputToRow(input: Partial<CreateMediaInventoryInput>) {
  return {
    city: input.city,
    media_type: input.mediaType,
    size: input.size,
    location: input.location,
    images: input.images,
    featured: input.featured ?? false,
    updated_at: new Date().toISOString(),
  };
}

export class InventoryRepository {
  async getAll() {
    const client = getSupabaseClient();
    if (!client) return [] as MediaInventoryRecord[];

    const { data, error } = await client
      .from("media_inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => mapRowToRecord(row as InventoryRow));
  }

  async getById(id: string) {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from("media_inventory")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToRecord(data as InventoryRow) : null;
  }

  async create(input: CreateMediaInventoryInput) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const { data, error } = await client
      .from("media_inventory")
      .insert([
        { ...mapInputToRow(input), created_at: new Date().toISOString() },
      ])
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToRecord(data as InventoryRow);
  }

  async update(id: string, input: Partial<CreateMediaInventoryInput>) {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from("media_inventory")
      .update(mapInputToRow(input))
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToRecord(data as InventoryRow);
  }

  async delete(id: string) {
    const client = getSupabaseClient();
    if (!client) return false;

    const { error } = await client
      .from("media_inventory")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const inventoryRepository = new InventoryRepository();
