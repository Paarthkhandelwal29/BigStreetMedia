import { describe, expect, it } from "vitest";
import { inventoryRecordsToItems } from "@/lib/cms/inventory-view";
import type { MediaInventoryRecord } from "@/lib/cms/types";

function record(overrides: Partial<MediaInventoryRecord> = {}): MediaInventoryRecord {
  return {
    id: "id-1",
    city: "Lucknow",
    mediaType: "Hoardings",
    size: "20x10",
    location: "Hazratganj",
    images: [],
    featured: false,
    createdAt: "2026-06-27T00:00:00Z",
    updatedAt: "2026-06-27T00:00:00Z",
    ...overrides,
  };
}

describe("inventoryRecordsToItems", () => {
  it("maps core fields onto the public InventoryItem shape", () => {
    const [item] = inventoryRecordsToItems([record()]);
    expect(item).toMatchObject({
      id: "id-1",
      city: "Lucknow",
      type: "Hoardings",
      landmark: "Hazratganj",
      size: "20x10",
      available: true,
    });
  });

  it("falls back to Hoardings for an unknown media type", () => {
    const [item] = inventoryRecordsToItems([record({ mediaType: "Skywriting" })]);
    expect(item.type).toBe("Hoardings");
  });

  it("supplies defaults for blank fields", () => {
    const [item] = inventoryRecordsToItems([
      record({ city: "", size: "", location: "" }),
    ]);
    expect(item.city).toBe("India");
    expect(item.size).toBe("Custom");
    // landmark falls back to city, which itself defaulted to "India"
    expect(item.landmark).toBe("India");
    expect(item.dailyTraffic).toBe("Contact for details");
  });

  it("returns an empty array for no records", () => {
    expect(inventoryRecordsToItems([])).toEqual([]);
  });
});
