"use server";

import { isAdminAuthenticated } from "@/lib/cms/auth";
import { uploadFile } from "@/lib/cms/imagekit";
import { createPortfolioBatch } from "@/lib/cms/store";

function getMediaType(fileName: string): "image" | "video" {
  const lower = fileName.toLowerCase();
  return lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".webm")
    ? "video"
    : "image";
}

export async function createPortfolioAction(formData: FormData) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) return { success: false, error: "Unauthorized" };

    const brandName = String(formData.get("brandName") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const format = String(formData.get("format") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const featured = formData.get("featured") === "on";
    const files = formData.getAll("media") as File[];

    if (!brandName || !category || !format || !city) {
      return { success: false, error: "Please fill all required fields." };
    }

    const validFiles = files.filter((file) => file.size > 0);
    if (validFiles.length === 0) {
      return {
        success: false,
        error: "Please upload at least one media file.",
      };
    }

    console.log("[portfolio] upload:start", { count: validFiles.length });

    const uploaded = await Promise.all(
      validFiles.map(async (file, index) => {
        console.log("[portfolio] upload:file:start", {
          index,
          fileName: file.name,
          size: file.size,
        });

        const mediaUrl = await uploadFile(
          Buffer.from(await file.arrayBuffer()),
          file.name,
        );

        console.log("[portfolio] upload:file:done", {
          index,
          fileName: file.name,
          mediaUrl,
        });

        return { mediaUrl, mediaType: getMediaType(file.name) };
      }),
    );

    console.log("[portfolio] upload:complete", { count: uploaded.length });

    const validUploads = uploaded.filter((item): item is { mediaUrl: string; mediaType: "image" | "video" } => typeof item.mediaUrl === "string");

    await createPortfolioBatch(
      validUploads.map((item) => ({
        brandName,
        category: category as never,
        format,
        city,
        mediaUrl: item.mediaUrl,
        mediaType: item.mediaType,
        featured,
      })),
    );

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to save portfolio media.",
    };
  }
}
