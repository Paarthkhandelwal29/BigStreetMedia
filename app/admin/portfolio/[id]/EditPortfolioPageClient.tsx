"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updatePortfolioAction } from "@/app/admin/portfolio/[id]/actions";
import {
  portfolioFormatsByCategory,
  type PortfolioCategory,
} from "@/data/portfolio";
import type { PortfolioWorkRecord } from "@/lib/cms/types";
import {
  CrumbLink,
  Field,
  PageHeader,
  controlInput,
  ghostButton,
  primaryButton,
} from "@/components/admin/ui";

const selectClass = controlInput + " appearance-none pr-9";

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
    <>
      <div className="mb-4">
        <CrumbLink href="/admin/portfolio">Back to portfolio</CrumbLink>
      </div>
      <PageHeader
        eyebrow="Portfolio"
        title={`Edit ${item.brandName}`}
        description="Update this record's details. Media file replacement is not available here."
      />

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-hairline bg-surface p-5 shadow-[0_1px_2px_rgba(17,17,17,0.04)] md:p-7"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Brand name">
            <input
              name="brandName"
              defaultValue={item.brandName}
              required
              className={controlInput}
            />
          </Field>
          <Field label="City">
            <input
              name="city"
              defaultValue={item.city}
              required
              className={controlInput}
            />
          </Field>
          <Field label="Category">
            <select
              name="category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as PortfolioCategory)
              }
              className={selectClass}
            >
              {(
                Object.keys(portfolioFormatsByCategory) as PortfolioCategory[]
              ).map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Format">
            <select
              name="format"
              defaultValue={item.format}
              className={selectClass}
            >
              {portfolioFormatsByCategory[category].map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-6 rounded-xl border border-hairline bg-surface-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
            Current media
          </p>
          <div className="mt-3">
            {item.mediaType === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.mediaUrl}
                alt={item.brandName}
                className="max-h-64 rounded-lg border border-hairline object-cover"
              />
            ) : (
              <video
                src={item.mediaUrl}
                controls
                className="max-h-64 rounded-lg border border-hairline"
              />
            )}
          </div>
        </div>

        <label className="mt-5 flex w-fit items-center gap-2.5 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={item.featured}
            className="h-4 w-4 accent-amber-deep"
          />
          Mark as featured
        </label>

        {error ? (
          <p className="mt-5 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="mt-6 flex items-center gap-2.5">
          <button type="submit" disabled={loading} className={primaryButton}>
            {loading ? "Saving…" : "Save changes"}
          </button>
          <Link href="/admin/portfolio" className={ghostButton}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
