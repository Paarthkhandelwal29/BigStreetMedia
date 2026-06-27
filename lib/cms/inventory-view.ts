import {
  mediaTypes,
  type InventoryItem,
  type MediaType,
} from "@/data/inventory";
import type { MediaInventoryRecord } from "./types";

const MEDIA_TYPE_SET = new Set<string>(mediaTypes);

// Map a CMS inventory record to the shape the public gallery renders. The CMS
// schema is leaner than the static placeholder type, so a couple of display
// fields are filled with sensible defaults.
export function inventoryRecordsToItems(
  records: MediaInventoryRecord[],
): InventoryItem[] {
  return records.map((record) => ({
    id: record.id,
    city: record.city || "India",
    type: (MEDIA_TYPE_SET.has(record.mediaType)
      ? record.mediaType
      : "Hoardings") as MediaType,
    landmark: record.location || record.city,
    size: record.size || "Custom",
    dailyTraffic: "Contact for details",
    available: true,
  }));
}
