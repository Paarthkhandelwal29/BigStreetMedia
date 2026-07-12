import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { CampaignGallery } from "@/components/home/CampaignGallery";
import { WhyBSM } from "@/components/home/WhyBSM";
import { ROIEstimator } from "@/components/home/ROIEstimator";
import { FinalCTA } from "@/components/home/FinalCTA";
import { LocalBusinessSchema } from "@/components/shared/Schema";

export const metadata: Metadata = {
  title: "Big Street Media | PAN India Outdoor Advertising & OOH Agency",
  description:
    "India's leading 360° agency specializing in Outdoor Advertising (OOH), billboard hoardings, transit media branding, and BTL activations across Noida, Delhi NCR, Mumbai, Bengaluru, and 400+ cities.",
};

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
      <FinalCTA />
    </>
  );
}
