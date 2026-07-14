import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { BrandsGrid } from "@/components/brands/BrandsGrid";
import { FinalCTA } from "@/components/home/FinalCTA";
import { BreadcrumbListSchema } from "@/components/shared/Schema";

export const metadata: Metadata = {
  title: "Brands We Serve | National & Retail Advertising Clients",
  description:
    "From Hero and TVS to V-Mart, LG, P&G, and Extramarks — the brands that trust Big Street Media to execute their campaigns across Noida, Delhi NCR, and PAN India.",
  alternates: {
    canonical: "/brands",
  },
};

export default function BrandsPage() {
  return (
    <>
      <BreadcrumbListSchema
        crumbs={[
          { name: "Home", item: "/" },
          { name: "Brands", item: "/brands" },
        ]}
      />
      <PageHero
        compact
        eyebrow="Brands"
        title="Brands that trust Big Street Media"
        subhead="Filter by industry to see the brands we've executed for in your sector."
      />
      <div className="py-12">
        <BrandsGrid />
      </div>
      <FinalCTA />
    </>
  );
}
