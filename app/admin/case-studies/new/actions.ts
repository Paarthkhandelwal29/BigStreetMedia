"use server";

import { isAdminAuthenticated } from "@/lib/cms/auth";
import { createCaseStudy } from "@/lib/cms/store";
import { slugify } from "@/lib/cms/repositories/utils";

type StrategyPoint = { content: string; sortOrder: number };
type ExecutionPoint = { content: string; sortOrder: number };
type MediaLabel = { label: string; sortOrder: number };
type Result = { label: string; value: string; sortOrder: number };

export async function createCaseStudyAction(formData: FormData) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) return { success: false, error: "Unauthorized" };

    const title = String(formData.get("title") || "").trim();
    if (!title) return { success: false, error: "Title is required." };

    const strategyPoints: StrategyPoint[] = [];
    const executionPoints: ExecutionPoint[] = [];
    const mediaLabels: MediaLabel[] = [];
    const results: Result[] = [];

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("strategy_")) {
        const index = parseInt(key.replace("strategy_", ""), 10);
        strategyPoints[index] = { content: String(value), sortOrder: index };
      }
      if (key.startsWith("execution_")) {
        const index = parseInt(key.replace("execution_", ""), 10);
        executionPoints[index] = { content: String(value), sortOrder: index };
      }
      if (key.startsWith("media_label_")) {
        const index = parseInt(key.replace("media_label_", ""), 10);
        mediaLabels[index] = { label: String(value), sortOrder: index };
      }
      if (key.startsWith("result_label_")) {
        const index = parseInt(key.replace("result_label_", ""), 10);
        results[index] = {
          ...results[index] ?? { value: "" },
          label: String(value),
          sortOrder: index,
        };
      }
      if (key.startsWith("result_value_")) {
        const index = parseInt(key.replace("result_value_", ""), 10);
        results[index] = {
          ...results[index] ?? { label: "" },
          value: String(value),
          sortOrder: index,
        };
      }
    }

    const slugInput = String(formData.get("slug") || "").trim();

    await createCaseStudy({
      title,
      slug: slugInput || slugify(title),
      brandName: String(formData.get("brandName") || "").trim() || undefined,
      industry: String(formData.get("industry") || "").trim() || undefined,
      campaignType:
        String(formData.get("campaignType") || "").trim() || undefined,
      challenge: String(formData.get("challenge") || "").trim() || undefined,
      objective: String(formData.get("objective") || "").trim() || undefined,
      duration: String(formData.get("duration") || "").trim() || undefined,
      cities: String(formData.get("cities") || "").trim() || undefined,
      briefType: String(formData.get("briefType") || "").trim() || undefined,
      featured: formData.get("featured") === "on",
      status: (formData.get("status") as "draft" | "published") ?? "published",
      testimonialQuote:
        String(formData.get("testimonialQuote") || "").trim() || undefined,
      testimonialName:
        String(formData.get("testimonialName") || "").trim() || undefined,
      testimonialTitle:
        String(formData.get("testimonialTitle") || "").trim() || undefined,
      strategyPoints: strategyPoints.filter(Boolean),
      executionPoints: executionPoints.filter(Boolean),
      mediaLabels: mediaLabels.filter(Boolean),
      results: results.filter((r) => r.label || r.value),
      portfolioItemIds: [],
      portfolioMediaIds: [],
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to create case study.",
    };
  }
}
