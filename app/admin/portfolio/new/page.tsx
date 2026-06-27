"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPortfolioAction } from "@/app/admin/portfolio/new/actions";
import {
  portfolioFormatsByCategory,
  type PortfolioCategory,
} from "@/data/portfolio";
import {
  CrumbLink,
  Field,
  PageHeader,
  controlInput,
  ghostButton,
  primaryButton,
} from "@/components/admin/ui";

const categories = Object.keys(
  portfolioFormatsByCategory,
) as PortfolioCategory[];
const acceptedMedia = ".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm";
const selectClass = controlInput + " appearance-none pr-9";

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
    setUploads((current) =>
      current.map((item) => ({ ...item, status: "uploading" })),
    );

    const formData = new FormData(event.currentTarget);
    uploads.forEach((item) => formData.append("media", item.file));

    const result = await createPortfolioAction(formData);
    if (result.success) {
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
    <>
      <div className="mb-4">
        <CrumbLink href="/admin/portfolio">Back to portfolio</CrumbLink>
      </div>
      <PageHeader
        eyebrow="Portfolio"
        title="Add media"
        description="Upload images and video together. Each file becomes its own portfolio record."
      />

      <form
        onSubmit={onSubmit}
        className="rounded-xl border border-hairline bg-surface p-5 shadow-[0_1px_2px_rgba(17,17,17,0.04)] md:p-7"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Brand name">
            <input name="brandName" required className={controlInput} />
          </Field>
          <Field label="City">
            <input name="city" required className={controlInput} />
          </Field>
          <Field label="Category">
            <select
              name="category"
              required
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as PortfolioCategory)
              }
              className={selectClass}
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Format">
            <select
              name="format"
              required
              disabled={!category}
              className={selectClass + " disabled:cursor-not-allowed disabled:bg-surface-2"}
              defaultValue=""
            >
              <option value="">
                {category ? "Select format" : "Select a category first"}
              </option>
              {formats.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <label className="mt-5 flex w-fit items-center gap-2.5 text-sm font-medium text-ink">
          <input type="checkbox" name="featured" className="h-4 w-4 accent-amber-deep" />
          Mark as featured
        </label>

        <div className="mt-6 rounded-xl border border-dashed border-hairline bg-surface-2 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Media</p>
              <p className="mt-0.5 text-xs text-muted">
                Images or video. jpg, png, webp, mp4, mov, webm. Up to 25 MB each.
              </p>
            </div>
            <label className={primaryButton + " cursor-pointer"}>
              Browse files
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
            className="mt-4 flex min-h-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-hairline bg-surface px-6 py-8 text-center text-sm text-muted transition-colors hover:border-ink/25 hover:text-ink"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              appendFiles(event.dataTransfer.files);
            }}
          >
            Drop files here
          </label>

          {uploads.length > 0 && (
            <div className="mt-4 space-y-2.5">
              {uploads.map((item, index) => {
                const isVideo = item.file.type.startsWith("video/");
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-hairline bg-surface p-2.5"
                  >
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md border border-hairline bg-surface-2">
                      {isVideo ? (
                        <video
                          src={item.previewUrl}
                          className="h-full w-full object-cover"
                          muted
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {item.file.name}
                      </p>
                      <p className="text-xs text-muted">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                        {isVideo ? "Video" : "Image"}
                        {item.status === "uploading" ? " · uploading…" : ""}
                        {item.status === "error" ? " · failed, save to retry" : ""}
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
                );
              })}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-5 text-sm font-medium text-red-600">{error}</p>
        ) : null}

        <div className="mt-6 flex items-center gap-2.5">
          <button type="submit" disabled={loading} className={primaryButton}>
            {loading ? "Saving…" : "Save media"}
          </button>
          <Link href="/admin/portfolio" className={ghostButton}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
