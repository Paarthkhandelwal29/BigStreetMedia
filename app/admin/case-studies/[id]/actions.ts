"use server";

import { isAdminAuthenticated } from "@/lib/cms/auth";
import { updateCaseStudy } from "@/lib/cms/store";

export async function updateCaseStudyAction(
  id: string,
  formData: FormData,
) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) return { success: false, error: "Unauthorized" };

    await updateCaseStudy(id, {
      title: String(formData.get("title") || "").trim(),
      brandName:
        String(formData.get("brandName") || "").trim() || undefined,
      industry: String(formData.get("industry") || "").trim() || undefined,
      campaignType:
        String(formData.get("campaignType") || "").trim() || undefined,
      challenge:
        String(formData.get("challenge") || "").trim() || undefined,
      objective:
        String(formData.get("objective") || "").trim() || undefined,
      duration: String(formData.get("duration") || "").trim() || undefined,
      cities: String(formData.get("cities") || "").trim() || undefined,
      briefType:
        String(formData.get("briefType") || "").trim() || undefined,
      featured: formData.get("featured") === "on",
      status: (formData.get("status") as "draft" | "published") ??
        "published",
      testimonialQuote:
        String(formData.get("testimonialQuote") || "").trim() ||
        undefined,
      testimonialName:
        String(formData.get("testimonialName") || "").trim() || undefined,
      testimonialTitle:
        String(formData.get("testimonialTitle") || "").trim() || undefined,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to update case study.",
    };
  }
}
