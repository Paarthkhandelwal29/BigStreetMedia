"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInventoryAction } from "@/app/admin/inventory/[id]/actions";
import { mediaTypes } from "@/data/inventory";
import type { MediaInventoryRecord } from "@/lib/cms/types";

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
    <div className="container-bsm py-20">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">
          Edit inventory record
        </h1>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-[1.75rem] border border-[#ececec] bg-surface p-6 shadow-sm md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
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
            Media Type
            <select
              name="mediaType"
              defaultValue={item.mediaType}
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] bg-surface px-4 text-sm"
            >
              {mediaTypes.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-ink">
            Size
            <input
              name="size"
              defaultValue={item.size}
              required
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] px-4 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-ink md:col-span-2">
            Location
            <textarea
              name="location"
              defaultValue={item.location}
              required
              className="mt-2 min-h-28 w-full rounded-[1.25rem] border border-[#ececec] px-4 py-3 text-sm"
            />
          </label>
        </div>

        <div className="mt-6 rounded-[1.25rem] border border-[#ececec] bg-surface-2 p-4">
          <p className="text-sm font-semibold text-ink">Images</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {item.images.map((image) => (
              <img
                key={image}
                src={image}
                alt={item.location}
                className="h-40 w-full rounded-xl object-cover"
              />
            ))}
            {item.images.length === 0 && (
              <p className="text-sm text-muted">
                No images uploaded for this location.
              </p>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            Image replacement is intentionally not included here. This edit
            updates metadata only.
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
