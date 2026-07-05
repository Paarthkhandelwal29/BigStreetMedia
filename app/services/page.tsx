import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FinalCTA } from "@/components/home/FinalCTA";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — 360° Advertising Solutions",
  description:
    "OOH, Transit, BTL, Retail, Events, Radio, Cinema, Digital and Influencer marketing — executed across 400+ Indian cities by Big Street Media.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Services"
        title="360° advertising across every format and city"
        subhead="Choose a service to see how Big Street Media executes it at scale — with ground teams, not just plans."
      />

      <section className="container-bsm py-20">
        <RevealGroup
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.05}
        >
          {services.map((s) => (
            <RevealItem key={s.slug} className="h-full">
              <ServiceCard service={s} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <FinalCTA />
    </>
  );
}
