"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createInventoryAction } from "@/app/admin/inventory/new/actions";
import { mediaTypes } from "@/data/inventory";
import {
  CrumbLink,
  Field,
  PageHeader,
  controlInput,
  ghostButton,
  primaryButton,
} from "@/components/admin/ui";

const acceptedImages = ".jpg,.jpeg,.png,.webp";
const textareaClass =
  "w-full rounded-lg border border-hairline bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-ink/25 focus:ring-2 focus:ring-amber/35";

type UploadItem = { id: string; file: File; previewUrl: string };

export default function NewInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  function appendFiles(fileList: FileList | null) {
    if (!fileList) return;
    const allowed = new Set(["jpg", "jpeg", "png", "webp"]);
    const next = Array.from(fileList)
      .filter((file) =>
        allowed.has(file.name.split(".").pop()?.toLowerCase() || ""),
      )
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
    setUploads((current) => [...current, ...next]);
  }

  function removeUpload(id: string) {
    setUploads((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  function moveUpload(id: string, direction: -1 | 1) {
    setUploads((current) => {
      const index = current.findIndex((item) => item.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length)
        return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    uploads.forEach((item) => formData.append("images", item.file));
    const result = await createInventoryAction(formData);
    if (result.success) {
      router.push("/admin/inventory");
      return;
    }
    setError(result.error || "Unable to save inventory.");
    setLoading(false);
  }

  return (
    <>
      <div className="mb-4">
        <CrumbLink href="/admin/inventory">Back to inventory</CrumbLink>
      </div>
      <PageHeader
        eyebrow="Inventory"
        title="Add a location"
        description="One inventory location with its photos. The first image is used as the preview."
      />

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-hairline bg-surface p-5 shadow-[0_1px_2px_rgba(17,17,17,0.04)] md:p-7"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="City">
            <input name="city" required className={controlInput} />
          </Field>
          <Field label="Media type">
            <select
              name="mediaType"
              required
              className={controlInput + " appearance-none pr-9"}
            >
              <option value="">Select media type</option>
              {mediaTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Size">
            <input
              name="size"
              required
              placeholder="40 × 20 ft"
              className={controlInput}
            />
          </Field>
          <Field label="Location" className="md:col-span-2">
            <textarea
              name="location"
              required
              rows={3}
              className={textareaClass}
            />
          </Field>
        </div>

        <label className="mt-5 flex w-fit items-center gap-2.5 text-sm font-medium text-ink">
          <input type="checkbox" name="featured" className="h-4 w-4 accent-amber-deep" />
          Mark as featured
        </label>

        <div className="mt-6 rounded-xl border border-dashed border-hairline bg-surface-2 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Images</p>
              <p className="mt-0.5 text-xs text-muted">
                jpg, jpeg, png, webp. Up to 25 MB each.
              </p>
            </div>
            <label className={primaryButton + " cursor-pointer"}>
              Browse files
              <input
                type="file"
                multiple
                accept={acceptedImages}
                className="hidden"
                onChange={(event) => appendFiles(event.target.files)}
              />
            </label>
          </div>

          <label
            className="mt-4 flex min-h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-hairline bg-surface px-6 py-8 text-center text-sm text-muted transition-colors hover:border-ink/25 hover:text-ink"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              appendFiles(event.dataTransfer.files);
            }}
          >
            Drop images here
          </label>

          {uploads.length > 0 && (
            <div className="mt-4 space-y-2.5">
              {uploads.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-lg border border-hairline bg-surface p-2.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="h-12 w-16 shrink-0 rounded-md border border-hairline object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-muted">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB
                      {index === 0 ? " · preview" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveUpload(item.id, -1)}
                      disabled={index === 0}
                      className="rounded-md border border-hairline px-2 py-1.5 text-xs font-medium text-ink disabled:opacity-35"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveUpload(item.id, 1)}
                      disabled={index === uploads.length - 1}
                      className="rounded-md border border-hairline px-2 py-1.5 text-xs font-medium text-ink disabled:opacity-35"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeUpload(item.id)}
                      className="rounded-md border border-hairline px-2.5 py-1.5 text-xs font-medium text-red-600 hover:border-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-5 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="mt-6 flex items-center gap-2.5">
          <button type="submit" disabled={loading} className={primaryButton}>
            {loading ? "Saving…" : "Save location"}
          </button>
          <Link href="/admin/inventory" className={ghostButton}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
