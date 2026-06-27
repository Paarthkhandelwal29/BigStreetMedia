import type {
  CreatePortfolioWorkInput,
  PortfolioWorkRecord,
} from "@/lib/cms/types";
import { getSupabaseClient } from "@/lib/cms/supabase";

type PortfolioRow = {
  id: string;
  brand_name: string;
  category: string;
  format: string;
  city: string;
  media_url: string;
  media_type: "image" | "video";
  featured: boolean;
  created_at: string;
  updated_at: string;
};

function mapRowToRecord(row: PortfolioRow): PortfolioWorkRecord {
  return {
    id: row.id,
    brandName: row.brand_name,
    category: row.category as PortfolioWorkRecord["category"],
    format: row.format,
    city: row.city,
    mediaUrl: row.media_url,
    mediaType: row.media_type,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInputToRow(input: Partial<CreatePortfolioWorkInput>) {
  return {
    brand_name: input.brandName,
    category: input.category,
    format: input.format,
    city: input.city,
    media_url: input.mediaUrl,
    media_type: input.mediaType,
    featured: input.featured ?? false,
    updated_at: new Date().toISOString(),
  };
}

export class PortfolioRepository {
  async getAll() {
    const client = getSupabaseClient();
    if (!client) return [] as PortfolioWorkRecord[];

    const { data, error } = await client
      .from("portfolio_works")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => mapRowToRecord(row as PortfolioRow));
  }

  async getById(id: string) {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from("portfolio_works")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRowToRecord(data as PortfolioRow) : null;
  }

  async create(input: CreatePortfolioWorkInput) {
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
      .from("portfolio_works")
      .insert([
        { ...mapInputToRow(input), created_at: new Date().toISOString() },
      ])
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToRecord(data as PortfolioRow);
  }

  async createMany(inputs: CreatePortfolioWorkInput[]) {
    const client = getSupabaseClient();
    if (!client) {
      return inputs.map((input) => ({
        id: crypto.randomUUID(),
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
    }

    if (inputs.length === 0) return [];

    const { data, error } = await client
      .from("portfolio_works")
      .insert(
        inputs.map((input) => ({
          ...mapInputToRow(input),
          created_at: new Date().toISOString(),
        })),
      )
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map((row) => mapRowToRecord(row as PortfolioRow));
  }

  async update(id: string, input: Partial<CreatePortfolioWorkInput>) {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from("portfolio_works")
      .update(mapInputToRow(input))
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return mapRowToRecord(data as PortfolioRow);
  }

  async delete(id: string) {
    const client = getSupabaseClient();
    if (!client) return false;

    const { error } = await client
      .from("portfolio_works")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const portfolioRepository = new PortfolioRepository();
