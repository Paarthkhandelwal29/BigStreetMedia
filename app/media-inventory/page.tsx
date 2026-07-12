import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { MediaInventoryClient } from "@/components/inventory/MediaInventoryClient";
import { listInventory } from "@/lib/cms/store";
import { BreadcrumbListSchema } from "@/components/shared/Schema";

export const metadata: Metadata = {
  title: "Media Inventory Noida | Hoarding & Billboard Spaces Delhi NCR",
  description:
    "Browse available billboard, hoarding, and transit media advertising inventory in Noida, Delhi NCR, and PAN India. Check live availability and rates.",
};

export default async function MediaInventoryPage() {
  const inventory = await listInventory();

  return (
    <>
      <BreadcrumbListSchema
        crumbs={[
          { name: "Home", item: "/" },
          { name: "Media Inventory", item: "/media-inventory" },
        ]}
      />
      <PageHero
        compact
        eyebrow="Media Inventory"
        title="Media Inventory"
        subhead="Find available media spaces across India - before your competitor does."
      />
      <div className="container-bsm mt-4 overflow-hidden text-xs md:text-sm text-muted">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-mobile {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 45s linear infinite;
          }
          .animate-marquee-mobile:hover {
            animation-play-state: paused;
          }
          @media (min-width: 768px) {
            .animate-marquee-mobile {
              display: block;
              white-space: normal;
              animation: none;
            }
            .marquee-dup {
              display: none;
            }
          }
        `}} />
        <div className="w-full overflow-hidden">
          <div className="animate-marquee-mobile">
            <span className="pr-12">
              * Big Street offers owned media assets and third-party inventory through verified media partners, ensuring nationwide coverage. Not all media locations are owned by Big Street.
            </span>
            <span className="marquee-dup pr-12">
              * Big Street offers owned media assets and third-party inventory through verified media partners, ensuring nationwide coverage. Not all media locations are owned by Big Street.
            </span>
          </div>
        </div>
      </div>
      <div className="py-6 md:py-8">
        <MediaInventoryClient items={inventory} />
      </div>
    </>
  );
}
