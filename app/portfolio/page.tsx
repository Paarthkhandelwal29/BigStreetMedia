import type { Metadata } from "next";
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
        eyebrow="Portfolio"
        title="Our work across India"
        subhead="Every image is a real campaign, executed by Big Street Media. Filter by format to explore."
      />
      <div className="py-12">
        <PortfolioGallery />
      </div>
      <FinalCTA />
    </>
  );
}
