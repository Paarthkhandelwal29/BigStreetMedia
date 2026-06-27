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
  return records.map((record) => {
    const city = record.city || "India";
    return {
      id: record.id,
      city,
      type: (MEDIA_TYPE_SET.has(record.mediaType)
        ? record.mediaType
        : "Hoardings") as MediaType,
      landmark: record.location || city,
      size: record.size || "Custom",
      dailyTraffic: "Contact for details",
      available: true,
    };
  });
}
