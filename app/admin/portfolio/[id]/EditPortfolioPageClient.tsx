"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePortfolioAction } from "@/app/admin/portfolio/[id]/actions";
import {
  portfolioFormatsByCategory,
  type PortfolioCategory,
} from "@/data/portfolio";
import type { PortfolioWorkRecord } from "@/lib/cms/types";

export function EditPortfolioPageClient({
  item,
}: {
  item: PortfolioWorkRecord;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<PortfolioCategory>(item.category);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await updatePortfolioAction(item.id, formData);
    if (result.success) {
      router.push("/admin/portfolio");
      return;
    }
    setError(result.error || "Unable to update portfolio record.");
    setLoading(false);
  }

  return (
    <div className="container-bsm py-20">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">
          Edit portfolio record
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-[1.75rem] border border-[#ececec] bg-surface p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium text-ink">
            Brand Name
            <input
              name="brandName"
              defaultValue={item.brandName}
              required
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] px-4 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-ink">
            City
            <input
              name="city"
              defaultValue={item.city}
              required
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] px-4 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-ink">
            Category
            <select
              name="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as PortfolioCategory)
              }
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] bg-surface px-4 text-sm"
            >
              {(
                Object.keys(portfolioFormatsByCategory) as PortfolioCategory[]
              ).map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Format
            <select
              name="format"
              defaultValue={item.format}
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] bg-surface px-4 text-sm"
            >
              {portfolioFormatsByCategory[category].map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[#ececec] bg-surface-2 p-4">
          <p className="text-sm font-semibold text-ink">Media Preview</p>
          <div className="mt-3">
            {item.mediaType === "image" ? (
              <img
                src={item.mediaUrl}
                alt={item.brandName}
                className="max-h-72 rounded-xl object-cover"
              />
            ) : (
              <video
                src={item.mediaUrl}
                controls
                className="max-h-72 rounded-xl"
              />
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            Media file replacement is intentionally not included here. This edit
            only updates this record’s metadata.
          </p>
        </div>

        <label className="mt-6 flex items-center gap-3 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={item.featured}
            className="h-4 w-4"
          />
          Featured
        </label>

        {error ? (
          <p className="mt-5 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
