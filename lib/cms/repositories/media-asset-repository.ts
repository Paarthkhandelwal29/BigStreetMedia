import { getSupabaseClient } from "@/lib/cms/supabase";

export type MediaAssetRecord = {
  id: string;
  ownerType: string;
  ownerId: string;
  kind: "image" | "video";
  url: string;
  imagekitFileId?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  caption?: string;
  sortOrder?: number;
  createdAt?: string;
};

export class MediaAssetRepository {
  async createMany(input: { ownerType: string; ownerId: string; items: Array<{ kind: "image" | "video"; url: string; imagekitFileId?: string; width?: number; height?: number; fileSize?: number; caption?: string; sortOrder?: number }> }) {
    const client = getSupabaseClient();
    if (!client) {
      return [];
    }

    const { data, error } = await client.from("media_assets").insert(
      input.items.map((item) => ({
        owner_type: input.ownerType,
        owner_id: input.ownerId,
        kind: item.kind,
        url: item.url,
        imagekit_file_id: item.imagekitFileId ?? null,
        width: item.width ?? null,
        height: item.height ?? null,
        file_size: item.fileSize ?? null,
        caption: item.caption ?? null,
        sort_order: item.sortOrder ?? 0,
      }))
    ).select();

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => ({
      id: item.id,
      ownerType: item.owner_type,
      ownerId: item.owner_id,
      kind: item.kind,
      url: item.url,
      imagekitFileId: item.imagekit_file_id ?? undefined,
      width: item.width ?? undefined,
      height: item.height ?? undefined,
      fileSize: item.file_size ?? undefined,
      caption: item.caption ?? undefined,
      sortOrder: item.sort_order ?? 0,
      createdAt: item.created_at ?? undefined,
    })) as MediaAssetRecord[];
  }

  async deleteForOwner(ownerType: string, ownerId: string) {
    const client = getSupabaseClient();
    if (!client) {
      return;
    }
    await client.from("media_assets").delete().eq("owner_type", ownerType).eq("owner_id", ownerId);
  }

  async count() {
    const client = getSupabaseClient();
    if (!client) {
      return 0;
    }
    const { count, error } = await client.from("media_assets").select("*", { count: "exact", head: true });
    if (error) {
      throw error;
    }
    return count ?? 0;
  }
}

export const mediaAssetRepository = new MediaAssetRepository();
