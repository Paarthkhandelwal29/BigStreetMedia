import { HeroSection } from "@/components/home/HeroSection";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { CampaignGallery } from "@/components/home/CampaignGallery";
import { WhyBSM } from "@/components/home/WhyBSM";
import { ROIEstimator } from "@/components/home/ROIEstimator";
import { ImpactNumbers } from "@/components/home/ImpactNumbers";
import { FinalCTA } from "@/components/home/FinalCTA";
import { LocalBusinessSchema } from "@/components/shared/Schema";

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />
      <HeroSection />
      <BrandsCarousel />
      <ServicesGrid />
      <CampaignGallery />
      <WhyBSM />
      <ROIEstimator />
      <ImpactNumbers />
      <FinalCTA />
    </>
  );
}
