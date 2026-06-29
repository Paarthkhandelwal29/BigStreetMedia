import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import {
  extractInventoryBatchFile,
  toBatchDraftPreview,
} from "@/lib/cms/inventory-batch/extract";
import { saveBatchSession } from "@/lib/cms/inventory-batch/session-store";
import type { BatchExtractResponse } from "@/lib/cms/inventory-batch/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json<BatchExtractResponse>(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json<BatchExtractResponse>(
        { success: false, error: "Please upload a PPT, PPTX, or PDF file." },
        { status: 400 },
      );
    }

    const { drafts, warnings } = await extractInventoryBatchFile(file);
    const session = await saveBatchSession({
      fileName: file.name,
      drafts,
      warnings,
    });

    return NextResponse.json<BatchExtractResponse>({
      success: true,
      sessionId: session.id,
      drafts: session.drafts.map(toBatchDraftPreview),
      warnings: session.warnings,
    });
  } catch (error) {
    return NextResponse.json<BatchExtractResponse>(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to extract inventory drafts.",
      },
      { status: 400 },
    );
  }
}
