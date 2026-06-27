import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MediaInventoryClient } from "@/components/inventory/MediaInventoryClient";
import { listInventory } from "@/lib/cms/store";
import { inventoryRecordsToItems } from "@/lib/cms/inventory-view";
import { inventory as staticInventory } from "@/data/inventory";

export const metadata: Metadata = {
  title: "Media Inventory - Browse Available Spaces",
  description:
    "Find available hoardings, bus shelters, unipoles, mall and transit media across India. Browse media inventory and check availability before your competitor does.",
};

export default async function MediaInventoryPage() {
  // Prefer CMS-managed inventory; fall back to the curated placeholder set
  // when the CMS is empty or unconfigured, so the page is never blank.
  const cmsItems = inventoryRecordsToItems(await listInventory());
  const items = cmsItems.length > 0 ? cmsItems : staticInventory;

  return (
    <>
      <PageHero
        compact
        eyebrow="Media Inventory"
        title="Media Inventory"
        subhead="Find available media spaces across India - before your competitor does."
      />
      <div className="py-6 md:py-8">
        <MediaInventoryClient items={items} />
      </div>
    </>
  );
}
