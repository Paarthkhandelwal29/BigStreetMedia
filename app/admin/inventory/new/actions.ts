"use server";

import { isAdminAuthenticated } from "@/lib/cms/auth";
import { uploadFile } from "@/lib/cms/imagekit";
import { createInventory } from "@/lib/cms/store";

export async function createInventoryAction(formData: FormData) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) return { success: false, error: "Unauthorized" };

    const city = String(formData.get("city") || "").trim();
    const mediaType = String(formData.get("mediaType") || "").trim();
    const size = String(formData.get("size") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const featured = formData.get("featured") === "on";
    const files = (formData.getAll("images") as File[]).filter(
      (file) => file.size > 0,
    );

    if (!city || !mediaType || !size || !location) {
      return { success: false, error: "Please fill all required fields." };
    }

    console.log("[inventory] upload:start", { count: files.length });

    const images = await Promise.all(
      files.map(async (file, index) => {
        console.log("[inventory] upload:file:start", {
          index,
          fileName: file.name,
          size: file.size,
        });

        const imageUrl = await uploadFile(
          Buffer.from(await file.arrayBuffer()),
          file.name,
        );

        console.log("[inventory] upload:file:done", {
          index,
          fileName: file.name,
          imageUrl,
        });

        return imageUrl;
      }),
    );

    console.log("[inventory] upload:complete", { count: images.length });

    await createInventory({
      city,
      mediaType,
      size,
      location,
      images,
      featured,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unable to save inventory.",
    };
  }
}
