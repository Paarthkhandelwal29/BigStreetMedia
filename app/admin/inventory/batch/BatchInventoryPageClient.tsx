"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { mediaTypes } from "@/data/inventory";
import type {
  BatchExtractResponse,
  BatchInventoryDraftPreview,
  BatchInventoryField,
  BatchSaveResponse,
  DraftNewImage,
  EditableBatchInventoryDraft,
} from "@/lib/cms/inventory-batch/types";

const acceptedDocuments = ".ppt,.pptx,.pdf";
const processingStages = [
  "Uploading...",
  "Reading slides...",
  "Extracting images...",
  "Running OCR...",
  "Creating preview...",
] as const;

type EditableDraft = EditableBatchInventoryDraft & {
  sourceLabel: string;
  confidence: number;
  imagePreviews: BatchInventoryDraftPreview["imagePreviews"];
  unknownFields: BatchInventoryField[];
};

function getActiveUnknownFields(draft: EditableDraft) {
  return draft.unknownFields.filter((field) => {
    const value =
      field === "mediaType"
        ? draft.mediaType
        : field === "location"
          ? draft.location
          : draft[field];

    return (
      value.trim().length === 0 || value.trim().toLowerCase() === "unknown"
    );
  });
}

function getConfidenceTone(confidence: number) {
  if (confidence >= 85) return "bg-emerald-100 text-emerald-700";
  if (confidence >= 65) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function UnknownFieldHint({ fields }: { fields: BatchInventoryField[] }) {
  if (fields.length === 0) return null;

  return (
    <p className="mt-2 text-xs font-medium text-amber-700">
      Review highlighted fields before saving.
    </p>
  );
}

export default function BatchInventoryPageClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [drafts, setDrafts] = useState<EditableDraft[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [newImages, setNewImages] = useState<Record<string, DraftNewImage[]>>({});

  useEffect(() => {
    if (!extracting) return;

    const timers = processingStages.map((_, index) =>
      window.setTimeout(() => {
        setStageIndex((current) => Math.max(current, index));
      }, index * 1100),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [extracting]);

  const hasDrafts = drafts.length > 0;
  const unresolvedDraftCount = useMemo(
    () =>
      drafts.filter((draft) => {
        const activeUnknownFields = getActiveUnknownFields(draft);
        return activeUnknownFields.length > 0 && !draft.unknownConfirmed;
      }).length,
    [drafts],
  );

  function resetState() {
    setSelectedFile(null);
    setSessionId("");
    setDrafts([]);
    setWarnings([]);
    setError("");
    setExtracting(false);
    setSaving(false);
    setStageIndex(0);
    setNewImages({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function deleteDraft(id: string) {
    setDrafts((current) => current.filter((d) => d.id !== id));
    setNewImages((current) => {
      const copy = { ...current };
      delete copy[id];
      return copy;
    });
  }

  function deleteImageFromDraft(draftId: string, imageId: string) {
    setDrafts((current) =>
      current.map((draft) => {
        if (draft.id !== draftId) return draft;
        const removed = draft.imagePreviews.find((i) => i.id === imageId);
        const remaining = draft.imagePreviews.filter(
          (i) => i.id !== imageId,
        );
        if (removed) {
          setNewImages((ni) => {
            const draftNew = ni[draftId] || [];
            const filtered = draftNew.filter(
              (n) => n.dataUrl !== removed.previewUrl,
            );
            if (filtered.length === draftNew.length) return ni;
            return { ...ni, [draftId]: filtered };
          });
        }
        return { ...draft, imagePreviews: remaining };
      }),
    );
  }

  function addPhotoToDraft(draftId: string, file: File) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const newEntry: DraftNewImage = {
        fileName: file.name,
        dataUrl,
      };

      setNewImages((current) => ({
        ...current,
        [draftId]: [...(current[draftId] || []), newEntry],
      }));

      setDrafts((current) =>
        current.map((draft) => {
          if (draft.id !== draftId) return draft;
          return {
            ...draft,
            imagePreviews: [
              ...draft.imagePreviews,
              {
                id: crypto.randomUUID(),
                fileName: file.name,
                previewUrl: dataUrl,
                mimeType: file.type || "image/jpeg",
                source: "embedded" as const,
              },
            ],
          };
        }),
      );
    };
    reader.readAsDataURL(file);
  }

  function onFileChosen(file: File | null) {
    setSelectedFile(file);
    setError("");
    setWarnings([]);
  }

  function updateDraft(id: string, patch: Partial<EditableDraft>) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === id ? { ...draft, ...patch } : draft,
      ),
    );
  }

  async function extractDrafts() {
    if (!selectedFile) {
      setError("Please choose a PPT, PPTX, or PDF file first.");
      return;
    }

    setStageIndex(0);
    setExtracting(true);
    setError("");
    setWarnings([]);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/inventory-batch/extract", {
        method: "POST",
        body: formData,
      });
      const responseText = await response.text();
      let result: BatchExtractResponse | null = null;

      try {
        result = JSON.parse(responseText) as BatchExtractResponse;
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result && !result.success
            ? result.error
            : responseText.startsWith("<!DOCTYPE") ||
                responseText.startsWith("<html")
              ? "The batch extract endpoint returned an HTML error page. Please refresh the page and try again. If it keeps happening, restart the dev server to refresh Next route manifests."
              : responseText || "Unable to extract drafts.",
        );
      }

      setSessionId(result.sessionId);
      setWarnings(result.warnings);
      setDrafts(
        result.drafts.map((draft) => ({
          id: draft.id,
          city: draft.city,
          mediaType: draft.mediaType,
          size: draft.size,
          location: draft.location,
          featured: draft.featured,
          unknownConfirmed: false,
          sourceLabel: draft.sourceLabel,
          confidence: draft.confidence,
          imagePreviews: draft.imagePreviews,
          unknownFields: draft.unknownFields,
        })),
      );
      setStageIndex(processingStages.length - 1);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to extract inventory drafts.",
      );
    } finally {
      setExtracting(false);
    }
  }

  async function saveAll() {
    if (!sessionId || drafts.length === 0) {
      setError("Upload and review a document before saving.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/inventory-batch/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          drafts: drafts.map((draft) => ({
            id: draft.id,
            city: draft.city,
            mediaType: draft.mediaType,
            size: draft.size,
            location: draft.location,
            featured: draft.featured,
            unknownConfirmed: draft.unknownConfirmed,
          })),
          newImages,
        }),
      });

      const responseText = await response.text();
      let result: BatchSaveResponse | null = null;

      try {
        result = JSON.parse(responseText) as BatchSaveResponse;
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result && !result.success
            ? result.error
            : responseText.startsWith("<!DOCTYPE") ||
                responseText.startsWith("<html")
              ? "The batch save endpoint returned an HTML error page. Please refresh the page and try again. If it keeps happening, restart the dev server to refresh Next route manifests."
              : responseText || "Unable to save drafts.",
        );
      }

      router.push("/admin/inventory");
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save inventory drafts.",
      );
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-[#ececec] bg-surface p-6 shadow-sm md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="text-xl font-semibold text-ink">
              Upload one PPT / PPTX / PDF
            </h2>
            <p className="mt-2 text-sm text-muted">
              The AI will detect every inventory page, extract billboard photos,
              infer city, media type, size, and address, then create one draft
              inventory card per detected site.
            </p>

            <ul className="mt-5 grid gap-2 text-sm text-muted sm:grid-cols-2">
              <li>✓ detect every inventory page</li>
              <li>✓ extract billboard photos</li>
              <li>✓ detect city</li>
              <li>✓ detect media type</li>
              <li>✓ detect size</li>
              <li>✓ detect address</li>
            </ul>

            <div
              className={`mt-6 rounded-[1.5rem] border-2 border-dashed p-6 transition-colors ${
                dragging
                  ? "border-amber bg-amber/10"
                  : "border-[#d9d9d9] bg-surface-2"
              }`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                onFileChosen(event.dataTransfer.files[0] || null);
              }}
            >
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <p className="text-lg font-semibold text-ink">Drag & Drop</p>
                <p className="mt-2 text-sm text-muted">
                  Supports .ppt, .pptx and .pdf batch documents.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
                >
                  Browse Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptedDocuments}
                  className="hidden"
                  onChange={(event) =>
                    onFileChosen(event.target.files?.[0] || null)
                  }
                />
                {selectedFile ? (
                  <p className="mt-4 text-sm font-medium text-ink">
                    Selected: {selectedFile.name}
                  </p>
                ) : (
                  <p className="mt-4 text-sm text-muted">
                    No file selected yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#ececec] bg-white/80 p-5">
            <p className="text-sm font-semibold text-ink">Processing</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f1f1f1]">
              <div
                className="h-full rounded-full bg-ink transition-all duration-500"
                style={{
                  width: extracting
                    ? `${Math.min(92, 20 + stageIndex * 18)}%`
                    : hasDrafts
                      ? "100%"
                      : "0%",
                }}
              />
            </div>

            <div className="mt-5 space-y-3">
              {processingStages.map((stage, index) => {
                const active = extracting
                  ? index <= stageIndex
                  : hasDrafts
                    ? true
                    : false;
                return (
                  <div
                    key={stage}
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      active
                        ? "border-ink/20 bg-ink/5 text-ink"
                        : "border-[#ececec] text-muted"
                    }`}
                  >
                    {stage}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              disabled={!selectedFile || extracting}
              onClick={extractDrafts}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-50"
            >
              {extracting ? "Processing document..." : "Create AI Preview"}
            </button>

            <p className="mt-3 text-xs text-muted">
              Legacy .ppt files are accepted in the UI, but on this server they
              may require exporting to .pptx or .pdf first.
            </p>
          </div>
        </div>
      </section>

      {warnings.length > 0 ? (
        <section className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <p className="font-semibold">Extraction notes</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {error ? (
        <section className="rounded-[1.5rem] border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
          {error}
        </section>
      ) : null}

      {hasDrafts ? (
        <>
          <section className="rounded-[1.5rem] border border-[#ececec] bg-surface p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">Draft preview</p>
                <p className="mt-1 text-sm text-muted">
                  {drafts.length} inventory draft
                  {drafts.length === 1 ? "" : "s"} detected.
                  {unresolvedDraftCount > 0
                    ? ` ${unresolvedDraftCount} still need unknown-field confirmation.`
                    : " All drafts are ready to save."}
                </p>
              </div>
              <button
                type="button"
                onClick={resetState}
                className="rounded-full border border-[#ececec] px-4 py-2 text-sm font-semibold text-ink"
              >
                Cancel
              </button>
            </div>
          </section>

          <div className="space-y-5">
            {drafts.map((draft) => {
              const activeUnknownFields = getActiveUnknownFields(draft);

              return (
                <section
                  key={draft.id}
                  className="rounded-[1.75rem] border border-[#ececec] bg-surface p-5 shadow-sm md:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {draft.sourceLabel}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {draft.imagePreviews.length} extracted photo
                        {draft.imagePreviews.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getConfidenceTone(
                          draft.confidence,
                        )}`}
                      >
                        Confidence {draft.confidence}%
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteDraft(draft.id)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      {draft.imagePreviews.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                           {draft.imagePreviews.map((image) => (
                            <div
                              key={image.id}
                              className="group relative overflow-hidden rounded-[1.25rem] border border-[#ececec] bg-surface-2"
                            >
                              <img
                                src={image.previewUrl}
                                alt={image.fileName}
                                className="h-44 w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  deleteImageFromDraft(draft.id, image.id)
                                }
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                              >
                                ✕
                              </button>
                              <div className="p-3">
                                <p className="truncate text-xs font-medium text-ink">
                                  {image.fileName}
                                </p>
                                <p className="mt-1 text-xs text-muted">
                                  {image.source === "embedded"
                                    ? "Embedded image"
                                    : "Page preview"}
                                </p>
                              </div>
                            </div>
                          ))}
                          <label className="flex cursor-pointer items-center justify-center rounded-[1.25rem] border border-dashed border-[#d9d9d9] bg-surface-2 text-xs text-muted hover:border-ink/30 min-h-[11rem]">
                            <span>+ Add Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) addPhotoToDraft(draft.id, file);
                                event.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-[1.25rem] border border-dashed border-[#d9d9d9] bg-surface-2 p-4 text-sm text-muted">
                          <span>No photos were extracted for this draft.</span>
                          <label className="cursor-pointer rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:opacity-90">
                            Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) addPhotoToDraft(draft.id, file);
                                event.target.value = "";
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-4">
                      <label className="text-sm font-medium text-ink">
                        City
                        <input
                          value={draft.city}
                          onChange={(event) =>
                            updateDraft(draft.id, {
                              city: event.target.value,
                              unknownConfirmed: false,
                            })
                          }
                          className={`mt-2 h-11 w-full rounded-full border px-4 text-sm ${
                            activeUnknownFields.includes("city")
                              ? "border-amber-300 bg-amber-50"
                              : "border-[#ececec]"
                          }`}
                        />
                      </label>

                      <label className="text-sm font-medium text-ink">
                        Media Type
                        <select
                          value={draft.mediaType}
                          onChange={(event) =>
                            updateDraft(draft.id, {
                              mediaType: event.target.value,
                              unknownConfirmed: false,
                            })
                          }
                          className={`mt-2 h-11 w-full rounded-full border bg-surface px-4 text-sm ${
                            activeUnknownFields.includes("mediaType")
                              ? "border-amber-300 bg-amber-50"
                              : "border-[#ececec]"
                          }`}
                        >
                          <option value="Unknown">Unknown</option>
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
                          value={draft.size}
                          onChange={(event) =>
                            updateDraft(draft.id, {
                              size: event.target.value,
                              unknownConfirmed: false,
                            })
                          }
                          className={`mt-2 h-11 w-full rounded-full border px-4 text-sm ${
                            activeUnknownFields.includes("size")
                              ? "border-amber-300 bg-amber-50"
                              : "border-[#ececec]"
                          }`}
                        />
                      </label>

                      <label className="text-sm font-medium text-ink">
                        Address / Location
                        <textarea
                          value={draft.location}
                          onChange={(event) =>
                            updateDraft(draft.id, {
                              location: event.target.value,
                              unknownConfirmed: false,
                            })
                          }
                          className={`mt-2 min-h-28 w-full rounded-[1.25rem] border px-4 py-3 text-sm ${
                            activeUnknownFields.includes("location")
                              ? "border-amber-300 bg-amber-50"
                              : "border-[#ececec]"
                          }`}
                        />
                      </label>

                      <label className="flex items-center gap-3 text-sm font-medium text-ink">
                        <input
                          type="checkbox"
                          checked={draft.featured}
                          onChange={(event) =>
                            updateDraft(draft.id, {
                              featured: event.target.checked,
                            })
                          }
                          className="h-4 w-4"
                        />
                        Featured
                      </label>

                      <UnknownFieldHint fields={activeUnknownFields} />

                      {activeUnknownFields.length > 0 ? (
                        <label className="flex items-start gap-3 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                          <input
                            type="checkbox"
                            checked={draft.unknownConfirmed}
                            onChange={(event) =>
                              updateDraft(draft.id, {
                                unknownConfirmed: event.target.checked,
                              })
                            }
                            className="mt-0.5 h-4 w-4"
                          />
                          <span>
                            I confirm the highlighted unknown fields for this
                            draft are ready to save as entered.
                          </span>
                        </label>
                      ) : null}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <section className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[#ececec] bg-surface p-5 shadow-sm">
            <button
              type="button"
              onClick={resetState}
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#ececec] px-5 text-sm font-semibold text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={saveAll}
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving all drafts..." : "Save All"}
            </button>
          </section>
        </>
      ) : null}
    </div>
  );
}
