import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { uploadFile } from "@/lib/cms/imagekit";
import { resolveUploadFileName } from "@/lib/cms/inventory-batch/extract";
import {
  deleteBatchSession,
  readBatchSession,
} from "@/lib/cms/inventory-batch/session-store";
import type {
  BatchInventoryField,
  BatchSaveResponse,
  DraftNewImage,
  EditableBatchInventoryDraft,
} from "@/lib/cms/inventory-batch/types";
import { createInventory } from "@/lib/cms/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SaveBatchPayload = {
  sessionId?: string;
  drafts?: EditableBatchInventoryDraft[];
  newImages?: Record<string, DraftNewImage[]>;
};

const FIELD_LABELS: Record<BatchInventoryField, string> = {
  city: "City",
  mediaType: "Media Type",
  size: "Size",
  location: "Location",
};

function normalizeValue(value: string) {
  return value.trim();
}

function getActiveUnknownFields(
  unknownFields: BatchInventoryField[],
  draft: EditableBatchInventoryDraft,
) {
  return unknownFields.filter((field) => {
    const value = normalizeValue(
      field === "mediaType"
        ? draft.mediaType
        : field === "location"
          ? draft.location
          : draft[field],
    );

    return value.length === 0 || value.toLowerCase() === "unknown";
  });
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json<BatchSaveResponse>(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const payload = (await request.json()) as SaveBatchPayload;
    const sessionId = payload.sessionId?.trim();
    const drafts = payload.drafts || [];
    const newImages = payload.newImages || {};

    if (!sessionId || drafts.length === 0) {
      return NextResponse.json<BatchSaveResponse>(
        {
          success: false,
          error: "Batch session and edited drafts are required.",
        },
        { status: 400 },
      );
    }

    const session = await readBatchSession(sessionId);
    if (!session) {
      return NextResponse.json<BatchSaveResponse>(
        {
          success: false,
          error:
            "This batch upload preview has expired. Please upload the document again.",
        },
        { status: 404 },
      );
    }

    const storedById = new Map(
      session.drafts.map((draft) => [draft.id, draft]),
    );
    let createdCount = 0;

    for (const draft of drafts) {
      const storedDraft = storedById.get(draft.id);
      if (!storedDraft) {
        return NextResponse.json<BatchSaveResponse>(
          { success: false, error: `Unknown draft id: ${draft.id}` },
          { status: 400 },
        );
      }

      const draftNewImages = newImages[draft.id] || [];
      for (const newImg of draftNewImages) {
        storedDraft.imagePreviews.push({
          id: crypto.randomUUID(),
          fileName: newImg.fileName,
          previewUrl: newImg.dataUrl,
          mimeType: newImg.dataUrl.split(";")[0].replace("data:", ""),
          base64: newImg.dataUrl.split(",")[1],
          source: "embedded",
        });
      }

      const city = normalizeValue(draft.city);
      const mediaType = normalizeValue(draft.mediaType);
      const size = normalizeValue(draft.size);
      const location = normalizeValue(draft.location);

      if (!city || !mediaType || !size || !location) {
        return NextResponse.json<BatchSaveResponse>(
          {
            success: false,
            error: `Please complete all required fields for ${storedDraft.sourceLabel}.`,
            createdCount,
          },
          { status: 400 },
        );
      }

      const activeUnknownFields = getActiveUnknownFields(
        storedDraft.unknownFields,
        draft,
      );

      if (activeUnknownFields.length > 0 && !draft.unknownConfirmed) {
        const fieldLabels = activeUnknownFields.map(
          (field) => FIELD_LABELS[field],
        );
        return NextResponse.json<BatchSaveResponse>(
          {
            success: false,
            error: `${storedDraft.sourceLabel} still has unresolved unknown fields: ${fieldLabels.join(", ")}. Confirm them or update the values before saving.`,
            createdCount,
          },
          { status: 400 },
        );
      }

      const images = await Promise.all(
        storedDraft.imagePreviews.map(async (image) => {
          const buffer = Buffer.from(image.base64, "base64");
          const imageUrl = await uploadFile(
            buffer,
            resolveUploadFileName(image, storedDraft),
          );

          if (!imageUrl) {
            throw new Error(
              `ImageKit did not return a URL for ${storedDraft.sourceLabel}.`,
            );
          }

          return imageUrl;
        }),
      );

      await createInventory({
        city,
        mediaType,
        size,
        location,
        featured: draft.featured,
        images,
      });

      createdCount += 1;
    }

    await deleteBatchSession(sessionId);
    revalidatePath("/admin/inventory");
    revalidatePath("/media-inventory");

    return NextResponse.json<BatchSaveResponse>({
      success: true,
      createdCount,
    });
  } catch (error) {
    return NextResponse.json<BatchSaveResponse>(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save inventory drafts.",
      },
      { status: 500 },
    );
  }
}
