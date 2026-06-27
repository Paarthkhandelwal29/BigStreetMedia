"use server";

import { isAdminAuthenticated } from "@/lib/cms/auth";
import { updatePortfolio } from "@/lib/cms/store";

export async function updatePortfolioAction(id: string, formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return { success: false, error: "Unauthorized" };

  try {
    await updatePortfolio(id, {
      brandName: String(formData.get("brandName") || "").trim(),
      category: String(formData.get("category") || "").trim() as never,
      format: String(formData.get("format") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      featured: formData.get("featured") === "on",
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to update portfolio record.",
    };
  }
}
