import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";
import { FinalCTA } from "@/components/home/FinalCTA";
import { listPortfolio } from "@/lib/cms/store";

export const metadata: Metadata = {
  title: "Portfolio — Our Work Across India",
  description:
    "Real campaigns executed by Big Street Media — OOH, transit, events, exhibitions, store launches and signature Varanasi boat branding across India.",
};

export default async function PortfolioPage() {
  const portfolio = await listPortfolio();

  return (
    <>
      <PageHero
        compact
        density="tight"
        eyebrow="Portfolio"
        title="Our work across India"
        subhead="Every image is a real campaign, executed by Big Street Media. Filter by main category and then drill down into formats."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
      />
      <div className="pb-8 pt-4 md:pb-10 md:pt-5">
        <PortfolioGallery items={portfolio} />
      </div>
      <FinalCTA />
    </>
  );
}
