"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCaseStudyAction } from "@/app/admin/case-studies/new/actions";

type StrItem = { id: string; value: string };

function blankStr(): StrItem {
  return { id: crypto.randomUUID(), value: "" };
}

type ResultItem = { id: string; label: string; value: string };

function blankResult(): ResultItem {
  return { id: crypto.randomUUID(), label: "", value: "" };
}

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [strategyPoints, setStrategyPoints] = useState<StrItem[]>([blankStr()]);
  const [executionPoints, setExecutionPoints] = useState<StrItem[]>([
    blankStr(),
  ]);
  const [mediaLabels, setMediaLabels] = useState<StrItem[]>([blankStr()]);
  const [results, setResults] = useState<ResultItem[]>([blankResult()]);

  function updateStr(
    list: StrItem[],
    setter: (v: StrItem[]) => void,
    id: string,
    value: string,
  ) {
    setter(list.map((item) => (item.id === id ? { ...item, value } : item)));
  }

  function removeStr(list: StrItem[], setter: (v: StrItem[]) => void, id: string) {
    setter(list.filter((item) => item.id !== id));
  }

  function addStr(list: StrItem[], setter: (v: StrItem[]) => void) {
    setter([...list, blankStr()]);
  }

  function updateResult(id: string, field: "label" | "value", val: string) {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    );
  }

  function removeResult(id: string) {
    setResults((prev) => prev.filter((r) => r.id !== id));
  }

  function addResult() {
    setResults((prev) => [...prev, blankResult()]);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    strategyPoints.forEach((item, i) => {
      if (item.value.trim()) formData.set(`strategy_${i}`, item.value.trim());
    });
    executionPoints.forEach((item, i) => {
      if (item.value.trim())
        formData.set(`execution_${i}`, item.value.trim());
    });
    mediaLabels.forEach((item, i) => {
      if (item.value.trim()) formData.set(`media_label_${i}`, item.value.trim());
    });
    results.forEach((item, i) => {
      if (item.label.trim()) formData.set(`result_label_${i}`, item.label.trim());
      if (item.value.trim()) formData.set(`result_value_${i}`, item.value.trim());
    });

    const result = await createCaseStudyAction(formData);

    if (result.success) {
      setSuccess("Case study saved successfully.");
      router.push("/admin/case-studies");
      return;
    }

    setError(result.error || "Unable to save case study.");
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
        <h1 className="mt-3 text-3xl font-bold text-ink">New case study</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Create a new case study record with strategy, execution, media labels,
          and results.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-8 rounded-[1.75rem] border border-[#ececec] bg-surface p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-ink">
            Title *
            <input name="title" required className={inputClass} />
          </label>
          <label className="text-sm font-medium text-ink">
            Slug
            <input
              name="slug"
              placeholder="Auto-generated from title"
              className={inputClass}
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Brand Name
            <input name="brandName" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-ink">
            Industry
            <input name="industry" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-ink">
            Campaign Type
            <input name="campaignType" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-ink">
            Duration
            <input name="duration" placeholder="e.g. 6 weeks" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-ink">
            Cities
            <input name="cities" className={inputClass} />
          </label>
          <label className="text-sm font-medium text-ink">
            Brief Type
            <input name="briefType" className={inputClass} />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-ink">
            Challenge
            <textarea name="challenge" rows={3} className={textareaClass} />
          </label>
          <label className="text-sm font-medium text-ink">
            Objective
            <textarea name="objective" rows={3} className={textareaClass} />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="text-sm font-medium text-ink">
            Status
            <select
              name="status"
              defaultValue="published"
              className={inputClass + " bg-surface"}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="flex items-center gap-3 pt-6 text-sm font-medium text-ink">
            <input type="checkbox" name="featured" className="h-4 w-4" />
            Featured
          </label>
        </div>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Strategy Points
          </legend>
          {strategyPoints.map((item) => (
            <div key={item.id} className="mb-3 flex items-start gap-2">
              <input
                value={item.value}
                onChange={(e) =>
                  updateStr(strategyPoints, setStrategyPoints, item.id, e.target.value)
                }
                placeholder="Strategy point…"
                className="flex-1 rounded-full border border-[#ececec] px-4 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  removeStr(strategyPoints, setStrategyPoints, item.id)
                }
                className="rounded-full border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addStr(strategyPoints, setStrategyPoints)}
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            + Add point
          </button>
        </fieldset>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Execution Points
          </legend>
          {executionPoints.map((item) => (
            <div key={item.id} className="mb-3 flex items-start gap-2">
              <input
                value={item.value}
                onChange={(e) =>
                  updateStr(executionPoints, setExecutionPoints, item.id, e.target.value)
                }
                placeholder="Execution point…"
                className="flex-1 rounded-full border border-[#ececec] px-4 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  removeStr(executionPoints, setExecutionPoints, item.id)
                }
                className="rounded-full border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addStr(executionPoints, setExecutionPoints)}
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            + Add point
          </button>
        </fieldset>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Media Labels
          </legend>
          {mediaLabels.map((item) => (
            <div key={item.id} className="mb-3 flex items-start gap-2">
              <input
                value={item.value}
                onChange={(e) =>
                  updateStr(mediaLabels, setMediaLabels, item.id, e.target.value)
                }
                placeholder="e.g. Hoardings"
                className="flex-1 rounded-full border border-[#ececec] px-4 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  removeStr(mediaLabels, setMediaLabels, item.id)
                }
                className="rounded-full border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addStr(mediaLabels, setMediaLabels)}
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            + Add label
          </button>
        </fieldset>

        <fieldset className="rounded-[1.25rem] border border-[#ececec] p-5">
          <legend className="px-2 text-sm font-semibold text-ink">
            Results
          </legend>
          {results.map((item) => (
            <div key={item.id} className="mb-3 grid grid-cols-2 gap-2">
              <input
                value={item.label}
                onChange={(e) => updateResult(item.id, "label", e.target.value)}
                placeholder="Label (e.g. Total Reach)"
                className="rounded-full border border-[#ececec] px-4 py-2.5 text-sm"
              />
              <div className="flex gap-2">
                <input
                  value={item.value}
                  onChange={(e) => updateResult(item.id, "value", e.target.value)}
                  placeholder="Value (e.g. 25 Lakh+)"
                  className="flex-1 rounded-full border border-[#ececec] px-4 py-2.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeResult(item.id)}
                  className="rounded-full border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addResult}
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            + Add result
          </button>
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
                rows={2}
                className={textareaClass}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-ink">
                Name
                <input name="testimonialName" className={inputClass} />
              </label>
              <label className="text-sm font-medium text-ink">
                Title
                <input name="testimonialTitle" className={inputClass} />
              </label>
            </div>
          </div>
        </fieldset>

        {error ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}
        {success ? (
          <p className="text-sm font-medium text-green-600">{success}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save Case Study"}
        </button>
      </form>
    </div>
  );
}
