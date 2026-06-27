"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateInventoryAction } from "@/app/admin/inventory/[id]/actions";
import { mediaTypes } from "@/data/inventory";
import type { MediaInventoryRecord } from "@/lib/cms/types";
import {
  CrumbLink,
  Field,
  PageHeader,
  controlInput,
  ghostButton,
  primaryButton,
} from "@/components/admin/ui";

const textareaClass =
  "w-full rounded-lg border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink/25 focus:ring-2 focus:ring-amber/35";

export function EditInventoryPageClient({
  item,
}: {
  item: MediaInventoryRecord;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await updateInventoryAction(item.id, formData);
    if (result.success) {
      router.push("/admin/inventory");
      return;
    }
    setError(result.error || "Unable to update inventory record.");
    setLoading(false);
  }

  return (
    <>
      <div className="mb-4">
        <CrumbLink href="/admin/inventory">Back to inventory</CrumbLink>
      </div>
      <PageHeader
        eyebrow="Inventory"
        title={`Edit ${item.city}`}
        description="Update this location's details, and add or replace its images."
      />

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-hairline bg-surface p-5 shadow-[0_1px_2px_rgba(17,17,17,0.04)] md:p-7"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="City">
            <input
              name="city"
              defaultValue={item.city}
              required
              className={controlInput}
            />
          </Field>
          <Field label="Media type">
            <select
              name="mediaType"
              defaultValue={item.mediaType}
              className={controlInput + " appearance-none pr-9"}
            >
              {mediaTypes.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Size">
            <input
              name="size"
              defaultValue={item.size}
              required
              className={controlInput}
            />
          </Field>
          <Field label="Location" className="md:col-span-2">
            <textarea
              name="location"
              defaultValue={item.location}
              required
              rows={3}
              className={textareaClass}
            />
          </Field>
        </div>

        <div className="mt-6 rounded-xl border border-hairline bg-surface-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">
            Current images
          </p>
          {item.images.length > 0 ? (
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {item.images.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={image}
                  src={image}
                  alt={item.location}
                  className="aspect-[4/3] w-full rounded-lg border border-hairline object-cover"
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">
              No images uploaded for this location yet.
            </p>
          )}

          <div className="mt-4 space-y-3 border-t border-hairline pt-4">
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="block w-full text-sm text-ink file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-surface"
            />
            <label className="flex w-fit items-center gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                name="replaceImages"
                className="h-4 w-4 accent-amber-deep"
              />
              Replace existing images instead of adding to them
            </label>
            <p className="text-xs text-muted">
              New images are appended by default. Leave empty to keep the current
              images unchanged.
            </p>
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
          <Link href="/admin/inventory" className={ghostButton}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
