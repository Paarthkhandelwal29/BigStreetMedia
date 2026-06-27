import type { CaseStudyRecord } from "@/lib/cms/types";
import { getSupabaseClient } from "@/lib/cms/supabase";
import { slugify } from "./utils";

type CaseStudyRow = {
  id: string;
  title: string;
  slug?: string | null;
  brand_id?: string | null;
  brand_name?: string | null;
  industry?: string | null;
  campaign_type?: string | null;
  challenge?: string | null;
  objective?: string | null;
  duration?: string | null;
  cities?: string | null;
  brief_type?: string | null;
  featured?: boolean | null;
  status?: string | null;
  testimonial_quote?: string | null;
  testimonial_name?: string | null;
  testimonial_title?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function mapRowToRecord(row: CaseStudyRow): CaseStudyRecord {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug ?? undefined,
    brandId: row.brand_id ?? undefined,
    brandName: row.brand_name ?? undefined,
    industry: row.industry ?? undefined,
    campaignType: row.campaign_type ?? undefined,
    challenge: row.challenge ?? undefined,
    objective: row.objective ?? undefined,
    duration: row.duration ?? undefined,
    cities: row.cities ?? undefined,
    briefType: row.brief_type ?? undefined,
    featured: row.featured ?? false,
    status: (row.status as CaseStudyRecord["status"]) ?? "published",
    testimonialQuote: row.testimonial_quote ?? undefined,
    testimonialName: row.testimonial_name ?? undefined,
    testimonialTitle: row.testimonial_title ?? undefined,
    strategyPoints: [],
    executionPoints: [],
    mediaLabels: [],
    results: [],
    portfolioItemIds: [],
    portfolioMediaIds: [],
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
  };
}

function mapInputToRow(input: Partial<CaseStudyRecord>) {
  return {
    title: input.title ?? "",
    slug: input.slug ?? slugify(input.title ?? ""),
    brand_id: input.brandId ?? null,
    brand_name: input.brandName ?? null,
    industry: input.industry ?? null,
    campaign_type: input.campaignType ?? null,
    challenge: input.challenge ?? null,
    objective: input.objective ?? null,
    duration: input.duration ?? null,
    cities: input.cities ?? null,
    brief_type: input.briefType ?? null,
    featured: input.featured ?? false,
    status: input.status ?? "published",
    testimonial_quote: input.testimonialQuote ?? null,
    testimonial_name: input.testimonialName ?? null,
    testimonial_title: input.testimonialTitle ?? null,
    updated_at: new Date().toISOString(),
  };
}

async function hydrate(record: CaseStudyRecord) {
  const client = getSupabaseClient();
  if (!client) return record;

  const [strategy, execution, mediaLabels, results, itemLinks, mediaLinks] =
    await Promise.all([
      client
        .from("case_study_strategy_points")
        .select("*")
        .eq("case_study_id", record.id)
        .order("sort_order", { ascending: true }),
      client
        .from("case_study_execution_points")
        .select("*")
        .eq("case_study_id", record.id)
        .order("sort_order", { ascending: true }),
      client
        .from("case_study_media_labels")
        .select("*")
        .eq("case_study_id", record.id)
        .order("sort_order", { ascending: true }),
      client
        .from("case_study_results")
        .select("*")
        .eq("case_study_id", record.id)
        .order("sort_order", { ascending: true }),
      client
        .from("case_study_portfolio_items")
        .select("portfolio_item_id, sort_order")
        .eq("case_study_id", record.id)
        .order("sort_order", { ascending: true }),
      client
        .from("case_study_portfolio_media")
        .select("portfolio_media_id, sort_order")
        .eq("case_study_id", record.id)
        .order("sort_order", { ascending: true }),
    ]);

  if (strategy.error) throw strategy.error;
  if (execution.error) throw execution.error;
  if (mediaLabels.error) throw mediaLabels.error;
  if (results.error) throw results.error;
  if (itemLinks.error) throw itemLinks.error;
  if (mediaLinks.error) throw mediaLinks.error;

  return {
    ...record,
    strategyPoints: (strategy.data ?? []).map((item) => ({
      id: item.id,
      caseStudyId: item.case_study_id,
      content: item.content,
      sortOrder: item.sort_order ?? 0,
    })),
    executionPoints: (execution.data ?? []).map((item) => ({
      id: item.id,
      caseStudyId: item.case_study_id,
      content: item.content,
      sortOrder: item.sort_order ?? 0,
    })),
    mediaLabels: (mediaLabels.data ?? []).map((item) => ({
      id: item.id,
      caseStudyId: item.case_study_id,
      label: item.label,
      sortOrder: item.sort_order ?? 0,
    })),
    results: (results.data ?? []).map((item) => ({
      id: item.id,
      caseStudyId: item.case_study_id,
      label: item.label,
      value: item.value,
      sortOrder: item.sort_order ?? 0,
    })),
    portfolioItemIds: (itemLinks.data ?? []).map(
      (item) => item.portfolio_item_id,
    ),
    portfolioMediaIds: (mediaLinks.data ?? []).map(
      (item) => item.portfolio_media_id,
    ),
  };
}

export class CaseStudyRepository {
  async getAll() {
    const client = getSupabaseClient();
    if (!client) return [] as CaseStudyRecord[];

    const { data, error } = await client
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return Promise.all(
      (data ?? []).map((row) => hydrate(mapRowToRecord(row as CaseStudyRow))),
    );
  }

  async getById(id: string) {
    const client = getSupabaseClient();
    if (!client) return null;

    const { data, error } = await client
      .from("case_studies")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return hydrate(mapRowToRecord(data as CaseStudyRow));
  }

  async create(input: Partial<CaseStudyRecord>) {
    const client = getSupabaseClient();
    if (!client) {
      return {
        id: crypto.randomUUID(),
        title: input.title ?? "Untitled",
        slug: input.slug ?? slugify(input.title ?? "Untitled"),
        brandId: input.brandId,
        brandName: input.brandName,
        industry: input.industry,
        campaignType: input.campaignType,
        challenge: input.challenge,
        objective: input.objective,
        duration: input.duration,
        cities: input.cities,
        briefType: input.briefType,
        featured: input.featured ?? false,
        status: input.status ?? "published",
        testimonialQuote: input.testimonialQuote,
        testimonialName: input.testimonialName,
        testimonialTitle: input.testimonialTitle,
        strategyPoints: input.strategyPoints ?? [],
        executionPoints: input.executionPoints ?? [],
        mediaLabels: input.mediaLabels ?? [],
        results: input.results ?? [],
        portfolioItemIds: input.portfolioItemIds ?? [],
        portfolioMediaIds: input.portfolioMediaIds ?? [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CaseStudyRecord;
    }

    const row = mapInputToRow(input);
    const { data, error } = await client
      .from("case_studies")
      .insert([{ ...row, created_at: new Date().toISOString() }])
      .select("*")
      .single();

    if (error) throw error;
    const record = mapRowToRecord(data as CaseStudyRow);

    const caseStudyId = record.id;
    if ((input.strategyPoints ?? []).length > 0) {
      const { error: strategyError } = await client
        .from("case_study_strategy_points")
        .insert(
          (input.strategyPoints ?? []).map((item, index) => ({
            case_study_id: caseStudyId,
            content: item.content,
            sort_order: item.sortOrder ?? index,
          })),
        );
      if (strategyError) throw strategyError;
    }

    if ((input.executionPoints ?? []).length > 0) {
      const { error: executionError } = await client
        .from("case_study_execution_points")
        .insert(
          (input.executionPoints ?? []).map((item, index) => ({
            case_study_id: caseStudyId,
            content: item.content,
            sort_order: item.sortOrder ?? index,
          })),
        );
      if (executionError) throw executionError;
    }

    if ((input.mediaLabels ?? []).length > 0) {
      const { error: mediaLabelError } = await client
        .from("case_study_media_labels")
        .insert(
          (input.mediaLabels ?? []).map((item, index) => ({
            case_study_id: caseStudyId,
            label: item.label,
            sort_order: item.sortOrder ?? index,
          })),
        );
      if (mediaLabelError) throw mediaLabelError;
    }

    if ((input.results ?? []).length > 0) {
      const { error: resultsError } = await client
        .from("case_study_results")
        .insert(
          (input.results ?? []).map((item, index) => ({
            case_study_id: caseStudyId,
            label: item.label,
            value: item.value,
            sort_order: item.sortOrder ?? index,
          })),
        );
      if (resultsError) throw resultsError;
    }

    if ((input.portfolioItemIds ?? []).length > 0) {
      const { error: itemLinkError } = await client
        .from("case_study_portfolio_items")
        .insert(
          (input.portfolioItemIds ?? []).map((portfolioItemId, index) => ({
            case_study_id: caseStudyId,
            portfolio_item_id: portfolioItemId,
            sort_order: index,
          })),
        );
      if (itemLinkError) throw itemLinkError;
    }

    if ((input.portfolioMediaIds ?? []).length > 0) {
      const { error: mediaLinkError } = await client
        .from("case_study_portfolio_media")
        .insert(
          (input.portfolioMediaIds ?? []).map((portfolioMediaId, index) => ({
            case_study_id: caseStudyId,
            portfolio_media_id: portfolioMediaId,
            sort_order: index,
            is_featured: index === 0,
          })),
        );
      if (mediaLinkError) throw mediaLinkError;
    }

    return (await this.getById(caseStudyId)) as CaseStudyRecord;
  }

  async update(id: string, input: Partial<CaseStudyRecord>) {
    const client = getSupabaseClient();
    if (!client) return null;

    const row = mapInputToRow(input);
    const { error } = await client
      .from("case_studies")
      .update(row)
      .eq("id", id);
    if (error) throw error;

    await client
      .from("case_study_strategy_points")
      .delete()
      .eq("case_study_id", id);
    await client
      .from("case_study_execution_points")
      .delete()
      .eq("case_study_id", id);
    await client
      .from("case_study_media_labels")
      .delete()
      .eq("case_study_id", id);
    await client.from("case_study_results").delete().eq("case_study_id", id);
    await client
      .from("case_study_portfolio_items")
      .delete()
      .eq("case_study_id", id);
    await client
      .from("case_study_portfolio_media")
      .delete()
      .eq("case_study_id", id);

    return this.create({
      ...input,
      id,
      slug: input.slug,
      title: input.title ?? "Untitled",
    });
  }

  async delete(id: string) {
    const client = getSupabaseClient();
    if (!client) return false;
    const { error } = await client.from("case_studies").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}

export const caseStudyRepository = new CaseStudyRepository();
