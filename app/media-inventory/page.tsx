import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MediaInventoryClient } from "@/components/inventory/MediaInventoryClient";
import { listInventory } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Media Inventory - Browse Available Spaces",
  description:
    "Find available hoardings, bus shelters, unipoles, mall and transit media across India. Browse media inventory and check availability before your competitor does.",
};

export default async function MediaInventoryPage() {
  const inventory = await listInventory();

  return (
    <>
      <PageHero
        compact
        eyebrow="Media Inventory"
        title="Media Inventory"
        subhead="Find available media spaces across India - before your competitor does."
      />
      <div className="py-6 md:py-8">
        <MediaInventoryClient items={inventory} />
      </div>
    </>
  );
}
