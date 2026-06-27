import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Insights — Coming Soon",
  description:
    "Big Street Media insights on out-of-home, transit, and 360° advertising across India. New articles are on the way.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Insights"
        title="Insights are on the way"
        subhead="We're putting together field notes on OOH, transit, and 360° campaigns across India. Check back soon — or reach out and we'll share what we're seeing in your market."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Insights" }]}
      />
      <FinalCTA />
    </>
  );
}
