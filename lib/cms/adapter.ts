import type { InventoryItem, MediaType } from "@/data/inventory";
import {
  portfolioFormatsByCategory,
  type PortfolioItem,
  type PortfolioCategory,
  type PortfolioFormat,
} from "@/data/portfolio";
import type { CaseStudy } from "@/data/caseStudies";
import type { CaseStudyRecord, MediaInventoryRecord, PortfolioProjectRecord } from "./types";

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function inventoryFromCms(records: MediaInventoryRecord[]): InventoryItem[] {
  return records.map((record) => ({
    id: record.id,
    city: record.city || "India",
    type: (record.mediaType || "Hoardings") as MediaType,
    landmark: record.locality || record.title,
    size: record.size || [record.width, record.height].filter(Boolean).join(" × ") || "Custom",
    dailyTraffic: record.trafficVolume || "Contact for details",
    available: record.availability,
  }));
}

export function portfolioFromCms(records: PortfolioProjectRecord[]): PortfolioItem[] {
  const formatEntries = Object.entries(portfolioFormatsByCategory) as Array<
    [PortfolioCategory, readonly PortfolioFormat[]]
  >;

  return records.map((record) => {
    const serviceType = record.serviceType || "OOH";
    const matchedCategory = formatEntries.find(
      ([category, formats]) =>
        category === serviceType || formats.includes(serviceType as PortfolioFormat)
    );
    const category = matchedCategory?.[0] ?? "OOH";
    const format =
      matchedCategory?.[1].find((item) => item === serviceType) ??
      portfolioFormatsByCategory[category][0];

    return {
      id: record.id,
      brand: record.title,
      category,
      format,
      city: record.location || "India",
      year: record.projectDate ? new Date(record.projectDate).getFullYear().toString() : "2025",
      tall: record.featured,
    };
  });
}

export function caseStudiesFromCms(records: CaseStudyRecord[]): CaseStudy[] {
  return records.map((record) => ({
    slug: record.id,
    brand: record.clientName || record.title,
    industry: record.title,
    campaignType: record.title,
    challenge: record.challenge || record.objective,
    brief: {
      objective: record.objective,
      duration: "Custom",
      cities: record.title,
      type: record.solution,
    },
    strategy: [record.solution, record.execution].filter(Boolean),
    execution: [record.execution].filter(Boolean),
    media: record.images.length > 0 ? ["Visual Assets", "Video Assets"] : ["Campaign Assets"],
    results: [{ label: "Outcome", value: record.results || "Delivered successfully" }],
  }));
}

export function cmsSlugFromTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function normalizeTagList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatMediaLabel(value: string) {
  return toTitleCase(value);
}
