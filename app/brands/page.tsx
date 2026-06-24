import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { BrandsGrid } from "@/components/brands/BrandsGrid";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Brands — Trusted by India's Best",
  description:
    "From Hero and TVS to V-Mart, LG, P&G and Extramarks — the brands that trust Big Street Media to execute their campaigns across India.",
};

export default function BrandsPage() {
  return (
    <>
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
