"use server";

import { isAdminAuthenticated } from "@/lib/cms/auth";
import { updateInventory } from "@/lib/cms/store";

export async function updateInventoryAction(id: string, formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return { success: false, error: "Unauthorized" };

  try {
    await updateInventory(id, {
      city: String(formData.get("city") || "").trim(),
      mediaType: String(formData.get("mediaType") || "").trim(),
      size: String(formData.get("size") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      featured: formData.get("featured") === "on",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update inventory record.",
    };
  }
}
