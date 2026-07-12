import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FinalCTA } from "@/components/home/FinalCTA";
import { services } from "@/data/services";
import { BreadcrumbListSchema } from "@/components/shared/Schema";

export const metadata: Metadata = {
  title: "Outdoor Advertising & OOH Services Noida | Transit & BTL Media",
  description:
    "Explore our 360° outdoor advertising (OOH) & media services in Noida & PAN India. Experts in billboard hoardings, transit wraps, retail branding, and BTL activations.",
};

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbListSchema
        crumbs={[
          { name: "Home", item: "/" },
          { name: "Services", item: "/services" },
        ]}
      />
      <PageHero
        compact
        eyebrow="Services"
        title="360° advertising across every format and city"
        subhead="Choose a service to see how Big Street Media executes it at scale — with ground teams, not just plans."
      />

      <section className="container-bsm py-20">
        <RevealGroup
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
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
