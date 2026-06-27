// Server-side validation for admin uploads. Extension checks are trivially
// bypassed by renaming a file, so we validate the browser-reported MIME type
// and enforce a size ceiling that matches the Server Action body limit.

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/webm"]);

// Keep in sync with serverActions.bodySizeLimit in next.config.mjs.
const MAX_FILE_BYTES = 25 * 1024 * 1024;

/**
 * Returns an error message string if any file is invalid, or null if all pass.
 */
export function validateUploadFiles(
  files: File[],
  options: { allowVideo?: boolean } = {},
): string | null {
  const allowed = new Set([
    ...IMAGE_TYPES,
    ...(options.allowVideo ? VIDEO_TYPES : []),
  ]);
  const kindLabel = options.allowVideo ? "images or video" : "images";

  for (const file of files) {
    if (!allowed.has(file.type)) {
      return `Unsupported file type for "${file.name}" (${file.type || "unknown"}). Allowed: ${kindLabel}.`;
    }
    if (file.size > MAX_FILE_BYTES) {
      return `"${file.name}" is too large. Maximum file size is 25 MB.`;
    }
  }

  return null;
}
