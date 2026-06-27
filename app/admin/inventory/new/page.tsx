"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInventoryAction } from "@/app/admin/inventory/new/actions";
import { mediaTypes } from "@/data/inventory";

const acceptedImages = ".jpg,.jpeg,.png,.webp";

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
};

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
    <div className="container-bsm py-20">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">Save inventory</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Create one inventory location with multiple images stored as an array
          of ImageKit URLs.
        </p>
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
              required
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] px-4 text-sm"
            />
          </label>

          <label className="text-sm font-medium text-ink">
            Media Type
            <select
              name="mediaType"
              required
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] bg-surface px-4 text-sm"
            >
              <option value="">Select media type</option>
              {mediaTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-ink">
            Size
            <input
              name="size"
              required
              placeholder="40 × 20 ft"
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] px-4 text-sm"
            />
          </label>

          <label className="text-sm font-medium text-ink md:col-span-2">
            Location
            <textarea
              name="location"
              required
              className="mt-2 min-h-28 w-full rounded-[1.25rem] border border-[#ececec] px-4 py-3 text-sm"
            />
          </label>
        </div>

        <label className="mt-6 flex items-center gap-3 text-sm font-medium text-ink">
          <input type="checkbox" name="featured" className="h-4 w-4" />
          Featured
        </label>

        <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#d9d9d9] bg-surface-2 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Upload Images</p>
              <p className="mt-1 text-sm text-muted">
                Drag & drop or browse files. Supports jpg, jpeg, png and webp.
              </p>
            </div>
            <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
              Browse Images
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
            className="mt-4 flex min-h-32 cursor-pointer items-center justify-center rounded-[1.25rem] border border-dashed border-[#d9d9d9] bg-white/70 px-6 py-10 text-center text-sm text-muted"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              appendFiles(event.dataTransfer.files);
            }}
          >
            Drop inventory images here
          </label>
        </div>

        <div className="mt-6 space-y-3">
          {uploads.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-[1.25rem] border border-[#ececec] p-4 md:flex-row md:items-center"
            >
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="h-20 w-28 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">
                  {item.file.name}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveUpload(item.id, -1)}
                  disabled={index === 0}
                  className="rounded-full border border-[#ececec] px-3 py-2 text-xs font-semibold disabled:opacity-40"
                >
                  Move Up
                </button>
                <button
                  type="button"
                  onClick={() => moveUpload(item.id, 1)}
                  disabled={index === uploads.length - 1}
                  className="rounded-full border border-[#ececec] px-3 py-2 text-xs font-semibold disabled:opacity-40"
                >
                  Move Down
                </button>
                <button
                  type="button"
                  onClick={() => removeUpload(item.id)}
                  className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {uploads.length === 0 && (
            <p className="text-sm text-muted">No images selected yet.</p>
          )}
        </div>

        {error ? (
          <p className="mt-5 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving Inventory..." : "Save Inventory"}
        </button>
      </form>
    </div>
  );
}
