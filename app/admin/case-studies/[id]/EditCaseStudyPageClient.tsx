"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCaseStudyAction } from "@/app/admin/case-studies/[id]/actions";
import type { CaseStudyRecord } from "@/lib/cms/types";

export function EditCaseStudyPageClient({
  item,
}: {
  item: CaseStudyRecord;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await updateCaseStudyAction(item.id, formData);
    if (result.success) {
      router.push("/admin/case-studies");
      return;
    }
    setError(result.error || "Unable to update case study.");
    setLoading(false);
  }

  const inputClass =
    "h-12 w-full rounded-full border border-[#ececec] px-4 text-sm";
  const textareaClass =
    "w-full rounded-2xl border border-[#ececec] px-4 py-3 text-sm";

  return (
    <div className="container-bsm py-20">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Edit case study</h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-8 rounded-[1.75rem] border border-[#ececec] bg-surface p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-ink">
            Title *
            <input
              name="title"
              defaultValue={item.title}
              required
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Slug
            <input
              name="slug"
              defaultValue={item.slug ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Brand Name
            <input
              name="brandName"
              defaultValue={item.brandName ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Industry
            <input
              name="industry"
              defaultValue={item.industry ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Campaign Type
            <input
              name="campaignType"
              defaultValue={item.campaignType ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Duration
            <input
              name="duration"
              defaultValue={item.duration ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Cities
            <input
              name="cities"
              defaultValue={item.cities ?? ""}
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Brief Type
            <input
              name="briefType"
              defaultValue={item.briefType ?? ""}
              className={inputClass}
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-ink">
            Challenge
            <textarea
              name="challenge"
              defaultValue={item.challenge ?? ""}
              rows={3}
              className={textareaClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Objective
            <textarea
              name="objective"
              defaultValue={item.objective ?? ""}
              rows={3}
              className={textareaClass}
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="text-sm font-medium text-ink">
            Status
            <select
              name="status"
              defaultValue={item.status}
              className={inputClass + " bg-surface"}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="flex items-center gap-3 pt-6 text-sm font-medium text-ink">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={item.featured}
              className="h-4 w-4"
            />
            Featured
          </label>
        </div>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Strategy Points ({item.strategyPoints.length})
          </legend>
          {item.strategyPoints.length > 0 ? (
            <ul className="list-inside list-disc text-sm text-muted">
              {item.strategyPoints.map((sp, i) => (
                <li key={sp.id ?? i}>{sp.content}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No strategy points.</p>
          )}
        </fieldset>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Execution Points ({item.executionPoints.length})
          </legend>
          {item.executionPoints.length > 0 ? (
            <ul className="list-inside list-disc text-sm text-muted">
              {item.executionPoints.map((ep, i) => (
                <li key={ep.id ?? i}>{ep.content}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No execution points.</p>
          )}
        </fieldset>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Media Labels ({item.mediaLabels.length})
          </legend>
          {item.mediaLabels.length > 0 ? (
            <ul className="list-inside list-disc text-sm text-muted">
              {item.mediaLabels.map((ml, i) => (
                <li key={ml.id ?? i}>{ml.label}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No media labels.</p>
          )}
        </fieldset>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Results ({item.results.length})
          </legend>
          {item.results.length > 0 ? (
            <ul className="list-inside list-disc text-sm text-muted">
              {item.results.map((r, i) => (
                <li key={r.id ?? i}>
                  {r.label}: {r.value}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No results.</p>
          )}
        </fieldset>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Testimonial (optional)
          </legend>
          <div className="grid gap-4">
            <label className="text-sm font-medium text-ink">
              Quote
              <textarea
                name="testimonialQuote"
                defaultValue={item.testimonialQuote ?? ""}
                rows={2}
                className={textareaClass}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-ink">
                Name
                <input
                  name="testimonialName"
                  defaultValue={item.testimonialName ?? ""}
                  className={inputClass}
                />
              </label>
              <label className="text-sm font-medium text-ink">
                Title
                <input
                  name="testimonialTitle"
                  defaultValue={item.testimonialTitle ?? ""}
                  className={inputClass}
                />
              </label>
            </div>
          </div>
        </fieldset>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
