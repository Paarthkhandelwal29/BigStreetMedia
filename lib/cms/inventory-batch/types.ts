export type BatchInventoryField = "city" | "mediaType" | "size" | "location";

export type BatchDocumentType = "pdf" | "pptx";

export type BatchInventoryImageSource = "embedded" | "screenshot";

export type BatchInventoryImagePreview = {
  id: string;
  fileName: string;
  previewUrl: string;
  mimeType: string;
  source: BatchInventoryImageSource;
  width?: number;
  height?: number;
};

export type StoredBatchInventoryImage = BatchInventoryImagePreview & {
  base64: string;
};

export type BatchInventoryDraftPreview = {
  id: string;
  sourceType: BatchDocumentType;
  sourceLabel: string;
  city: string;
  mediaType: string;
  size: string;
  location: string;
  featured: boolean;
  confidence: number;
  unknownFields: BatchInventoryField[];
  imagePreviews: BatchInventoryImagePreview[];
  rawText: string;
  ocrText: string;
};

export type StoredBatchInventoryDraft = Omit<
  BatchInventoryDraftPreview,
  "imagePreviews"
> & {
  imagePreviews: StoredBatchInventoryImage[];
};

export type BatchInventorySession = {
  id: string;
  fileName: string;
  createdAt: string;
  drafts: StoredBatchInventoryDraft[];
  warnings: string[];
};

export type EditableBatchInventoryDraft = {
  id: string;
  city: string;
  mediaType: string;
  size: string;
  location: string;
  featured: boolean;
  unknownConfirmed: boolean;
};

export type DraftNewImage = {
  fileName: string;
  dataUrl: string;
};

export type BatchExtractResponse =
  | {
      success: true;
      sessionId: string;
      drafts: BatchInventoryDraftPreview[];
      warnings: string[];
    }
  | {
      success: false;
      error: string;
    };

export type BatchSaveResponse =
  | {
      success: true;
      createdCount: number;
    }
  | {
      success: false;
      error: string;
      createdCount?: number;
      failures?: Array<{
        draftId: string;
        message: string;
      }>;
    };

export type InventorySourceUnit = {
  label: string;
  sourceType: BatchDocumentType;
  text: string;
  ocrText?: string;
  imageCount: number;
};

export type InventoryAnalysisResult = {
  city: string;
  mediaType: string;
  size: string;
  location: string;
  unknownFields: BatchInventoryField[];
  confidence: number;
};

export interface InventoryBatchAnalyzer {
  analyze(unit: InventorySourceUnit): Promise<InventoryAnalysisResult>;
}
