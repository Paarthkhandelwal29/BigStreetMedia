import { HeroSection } from "@/components/home/HeroSection";
import { StatsStrip } from "@/components/home/StatsStrip";
import { BrandChallenge } from "@/components/home/BrandChallenge";
import { WhyBSM } from "@/components/home/WhyBSM";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { IndustriesGrid } from "@/components/home/IndustriesGrid";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { ROIEstimator } from "@/components/home/ROIEstimator";
import { ImpactNumbers } from "@/components/home/ImpactNumbers";
import { FinalCTA } from "@/components/home/FinalCTA";
import { LocalBusinessSchema } from "@/components/shared/Schema";

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />
      <HeroSection />
      <StatsStrip />
      <BrandChallenge />
      <WhyBSM />
      <ServicesGrid />
      <IndustriesGrid />
      <BrandsCarousel />
      <ROIEstimator />
      <ImpactNumbers />
      <FinalCTA />
    </>
  );
}
