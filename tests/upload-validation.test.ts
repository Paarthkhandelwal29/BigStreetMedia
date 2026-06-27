import { describe, expect, it } from "vitest";
import { validateUploadFiles } from "@/lib/cms/upload-validation";

// validateUploadFiles only reads name/type/size, so we duck-type fake files
// instead of allocating real (potentially 25 MB) File buffers.
function fakeFile(type: string, size = 1024, name = "x"): File {
  return { name, type, size } as unknown as File;
}

describe("validateUploadFiles", () => {
  it("accepts a normal image (images-only)", () => {
    expect(validateUploadFiles([fakeFile("image/jpeg")])).toBeNull();
    expect(validateUploadFiles([fakeFile("image/png")])).toBeNull();
    expect(validateUploadFiles([fakeFile("image/webp")])).toBeNull();
  });

  it("rejects a non-image disguised by name", () => {
    const error = validateUploadFiles([
      fakeFile("application/pdf", 1024, "invoice.jpg"),
    ]);
    expect(error).toMatch(/unsupported file type/i);
    expect(error).toContain("invoice.jpg");
  });

  it("rejects an unknown/empty MIME type", () => {
    expect(validateUploadFiles([fakeFile("")])).toMatch(/unsupported/i);
  });

  it("rejects files over the 25 MB ceiling", () => {
    const tooBig = fakeFile("image/png", 26 * 1024 * 1024, "huge.png");
    expect(validateUploadFiles([tooBig])).toMatch(/too large/i);
  });

  it("only allows video when allowVideo is set", () => {
    const video = fakeFile("video/mp4", 1024, "clip.mp4");
    expect(validateUploadFiles([video])).toMatch(/unsupported/i);
    expect(validateUploadFiles([video], { allowVideo: true })).toBeNull();
  });

  it("flags the first offending file in a mixed batch", () => {
    const error = validateUploadFiles([
      fakeFile("image/jpeg"),
      fakeFile("text/plain", 1024, "notes.txt"),
    ]);
    expect(error).toContain("notes.txt");
  });
});
