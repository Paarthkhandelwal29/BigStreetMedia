"use server";

import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getInventory, updateInventory } from "@/lib/cms/store";
import { uploadFile } from "@/lib/cms/imagekit";
import { validateUploadFiles } from "@/lib/cms/upload-validation";
import type { CreateMediaInventoryInput } from "@/lib/cms/types";

export async function updateInventoryAction(id: string, formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return { success: false, error: "Unauthorized" };

  try {
    const update: Partial<CreateMediaInventoryInput> = {
      city: String(formData.get("city") || "").trim(),
      mediaType: String(formData.get("mediaType") || "").trim(),
      size: String(formData.get("size") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      featured: formData.get("featured") === "on",
    };

    // Optional image upload: append to existing images, or replace them all
    // when "replaceImages" is checked. With no files, images are untouched.
    const files = (formData.getAll("images") as File[]).filter(
      (file) => file.size > 0,
    );
    if (files.length > 0) {
      const typeError = validateUploadFiles(files, { allowVideo: false });
      if (typeError) return { success: false, error: typeError };

      const uploaded = await Promise.all(
        files.map(async (file) =>
          uploadFile(Buffer.from(await file.arrayBuffer()), file.name),
        ),
      );

      if (formData.get("replaceImages") === "on") {
        update.images = uploaded;
      } else {
        const existing = await getInventory(id);
        update.images = [...(existing?.images ?? []), ...uploaded];
      }
    }

    await updateInventory(id, update);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to update inventory record.",
    };
  }
}
