import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Portfolio — Our Work Across India",
  description:
    "Real campaigns executed by Big Street Media — OOH, transit, events, exhibitions, store launches and signature Varanasi boat branding across India.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        compact
        density="tight"
        eyebrow="Portfolio"
        title="Our work across India"
        subhead="Every image is a real campaign, executed by Big Street Media. Filter by main category and then drill down into formats."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Portfolio" },
        ]}
      />
      <div className="pb-8 pt-4 md:pb-10 md:pt-5">
        <Suspense fallback={null}>
          <PortfolioGallery />
        </Suspense>
      </div>
      <FinalCTA />
    </>
  );
}
