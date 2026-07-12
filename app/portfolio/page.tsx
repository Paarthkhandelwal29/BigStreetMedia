import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { FinalCTA } from "@/components/home/FinalCTA";
import { listPortfolio } from "@/lib/cms/store";
import { BreadcrumbListSchema } from "@/components/shared/Schema";

export const metadata: Metadata = {
  title: "Our Advertising Campaign Portfolio | OOH & BTL Agency India",
  description:
    "Explore our gallery of advertising campaigns executed across India. Real photos of hoarding locations, transit branding, retail signs, and experiential activations.",
};

export default async function PortfolioPage() {
  const portfolio = await listPortfolio();

  return (
    <>
      <BreadcrumbListSchema
        crumbs={[
          { name: "Home", item: "/" },
          { name: "Portfolio", item: "/portfolio" },
        ]}
      />
      <PageHero
        compact
        eyebrow="Portfolio"
        title="Our work across India"
        subhead="Every image is a real campaign, executed by Big Street Media. Filter by main category and then drill down into formats."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
      />
      <div className="pb-8 pt-4 md:pb-10 md:pt-5">
        <Suspense fallback={<div className="flex items-center justify-center py-20 text-muted">Loading gallery...</div>}>
          <PortfolioGallery items={portfolio} />
        </Suspense>
      </div>
      <FinalCTA />
    </>
  );
}
