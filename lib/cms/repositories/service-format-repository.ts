import type {
  CreateServiceFormatImageInput,
  ServiceFormatImageRecord,
} from "@/lib/cms/types";
import { getSupabaseClient } from "@/lib/cms/supabase";

type Row = {
  id: string;
  service_slug: string;
  format_name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

function mapRowToRecord(row: Row): ServiceFormatImageRecord {
  return {
    id: row.id,
    serviceSlug: row.service_slug,
    formatName: row.format_name,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInputToRow(input: CreateServiceFormatImageInput) {
  return {
    service_slug: input.serviceSlug,
    format_name: input.formatName,
    image_url: input.imageUrl,
    updated_at: new Date().toISOString(),
  };
}

function inMemoryRecord(input: CreateServiceFormatImageInput): ServiceFormatImageRecord {
  return {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function isMissingTable(error: unknown): boolean {
  return error instanceof Error && error.message.includes("does not exist");
}

export class ServiceFormatRepository {
  async getAll(): Promise<ServiceFormatImageRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from("service_format_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && isMissingTable(error)) return [];
      if (error) throw error;
      return (data ?? []).map((row) => mapRowToRecord(row as Row));
    } catch (e) {
      if (isMissingTable(e)) return [];
      throw e;
    }
  }

  async getByServiceSlug(
    slug: string,
  ): Promise<ServiceFormatImageRecord[]> {
    const client = getSupabaseClient();
    if (!client) return [];

    try {
      const { data, error } = await client
        .from("service_format_images")
        .select("*")
        .eq("service_slug", slug)
        .order("format_name");

      if (error && isMissingTable(error)) return [];
      if (error) throw error;
      return (data ?? []).map((row) => mapRowToRecord(row as Row));
    } catch (e) {
      if (isMissingTable(e)) return [];
      throw e;
    }
  }

  async upsert(input: CreateServiceFormatImageInput): Promise<ServiceFormatImageRecord> {
    const client = getSupabaseClient();
    if (!client) return inMemoryRecord(input);

    try {
      const existing = await client
        .from("service_format_images")
        .select("id")
        .eq("service_slug", input.serviceSlug)
        .eq("format_name", input.formatName)
        .maybeSingle();

      if (existing.error && isMissingTable(existing.error)) return inMemoryRecord(input);
      if (existing.error) throw existing.error;

      if (existing.data) {
        const { data, error } = await client
          .from("service_format_images")
          .update(mapInputToRow(input))
          .eq("id", existing.data.id)
          .select("*")
          .single();

        if (error) throw error;
        return mapRowToRecord(data as Row);
      }

      const { data, error } = await client
        .from("service_format_images")
        .insert([mapInputToRow(input)])
        .select("*")
        .single();

      if (error) throw error;
      return mapRowToRecord(data as Row);
    } catch (e) {
      if (isMissingTable(e)) return inMemoryRecord(input);
      throw e;
    }
  }

  async delete(id: string): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client
        .from("service_format_images")
        .delete()
        .eq("id", id);

      if (error && isMissingTable(error)) return false;
      if (error) throw error;
      return true;
    } catch (e) {
      if (isMissingTable(e)) return false;
      throw e;
    }
  }
}

export const serviceFormatRepository = new ServiceFormatRepository();
