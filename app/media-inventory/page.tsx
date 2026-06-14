import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MediaInventoryClient } from "@/components/inventory/MediaInventoryClient";

export const metadata: Metadata = {
  title: "Media Inventory — Browse Available Spaces",
  description:
    "Find available hoardings, bus shelters, unipoles, mall and transit media across India. Browse media inventory and check availability before your competitor does.",
};

export default function MediaInventoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Media Inventory"
        title="Browse our media inventory"
        subhead="Find available media spaces across India — before your competitor does."
      />
      <div className="py-12">
        <MediaInventoryClient />
      </div>
    </>
  );
}
