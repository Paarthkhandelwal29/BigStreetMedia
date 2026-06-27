"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortfolioAction } from "@/app/admin/portfolio/new/actions";
import {
  portfolioFormatsByCategory,
  type PortfolioCategory,
} from "@/data/portfolio";

const categories = Object.keys(
  portfolioFormatsByCategory,
) as PortfolioCategory[];
const acceptedMedia = ".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm";

type UploadItem = {
  id: string;
  file: File;
  previewUrl: string;
  status: "ready" | "uploading" | "error";
};

export default function NewPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [category, setCategory] = useState<PortfolioCategory | "">("");
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const formats = useMemo(() => {
    return category ? [...portfolioFormatsByCategory[category]] : [];
  }, [category]);

  function appendFiles(fileList: FileList | null) {
    if (!fileList) return;

    const allowed = new Set([
      "jpg",
      "jpeg",
      "png",
      "webp",
      "mp4",
      "mov",
      "webm",
    ]);
    const next = Array.from(fileList)
      .filter((file) =>
        allowed.has(file.name.split(".").pop()?.toLowerCase() || ""),
      )
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: "ready" as const,
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
    setSuccess("");
    setUploads((current) =>
      current.map((item) => ({ ...item, status: "uploading" })),
    );

    const formData = new FormData(event.currentTarget);
    uploads.forEach((item) => formData.append("media", item.file));

    const result = await createPortfolioAction(formData);

    if (result.success) {
      setSuccess("Portfolio media saved successfully.");
      router.push("/admin/portfolio");
      return;
    }

    setUploads((current) =>
      current.map((item) => ({ ...item, status: "error" })),
    );
    setError(result.error || "Unable to save portfolio media.");
    setLoading(false);
  }

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">
            Save portfolio media
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Upload mixed media together. Each uploaded file becomes its own
            portfolio row in Supabase.
          </p>
        </div>
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
              required
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] px-4 text-sm"
            />
          </label>

          <label className="text-sm font-medium text-ink">
            City
            <input
              name="city"
              required
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] px-4 text-sm"
            />
          </label>

          <label className="text-sm font-medium text-ink">
            Category
            <select
              name="category"
              required
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as PortfolioCategory)
              }
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] bg-surface px-4 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-ink">
            Format
            <select
              name="format"
              required
              disabled={!category}
              className="mt-2 h-12 w-full rounded-full border border-[#ececec] bg-surface px-4 text-sm disabled:cursor-not-allowed disabled:bg-surface-2"
              defaultValue=""
            >
              <option value="">
                {category ? "Select format" : "Select category first"}
              </option>
              {formats.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-6 flex items-center gap-3 text-sm font-medium text-ink">
          <input type="checkbox" name="featured" className="h-4 w-4" />
          Featured
        </label>

        <div className="mt-6 rounded-[1.5rem] border border-dashed border-[#d9d9d9] bg-surface-2 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Upload Media</p>
              <p className="mt-1 text-sm text-muted">
                Drag & drop, or browse files. Supports jpg, jpeg, png, webp,
                mp4, mov, webm.
              </p>
            </div>
            <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
              Browse Files
              <input
                type="file"
                multiple
                accept={acceptedMedia}
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
            Drop files here to add them to the upload queue
          </label>
        </div>

        <div className="mt-6 space-y-3">
          {uploads.map((item, index) => {
            const isVideo = item.file.type.startsWith("video/");
            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-[1.25rem] border border-[#ececec] p-4 md:flex-row md:items-center"
              >
                <div className="h-20 w-28 overflow-hidden rounded-xl bg-surface-2">
                  {isVideo ? (
                    <video
                      src={item.previewUrl}
                      className="h-full w-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">
                    {item.file.name}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {(item.file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                    {isVideo ? "Video" : "Image"}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {item.status === "uploading"
                      ? "Uploading on save..."
                      : item.status === "error"
                        ? "Upload failed. You can retry by saving again."
                        : "Ready to upload"}
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
            );
          })}
          {uploads.length === 0 && (
            <p className="text-sm text-muted">No files selected yet.</p>
          )}
        </div>

        {error ? (
          <p className="mt-5 text-sm font-medium text-red-600">{error}</p>
        ) : null}
        {success ? (
          <p className="mt-5 text-sm font-medium text-green-600">{success}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving Portfolio..." : "Save Portfolio"}
        </button>
      </form>
    </div>
  );
}
