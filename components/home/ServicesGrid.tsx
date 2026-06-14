import { SectionHeader } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/data/services";

export function ServicesGrid() {
  return (
    <section className="container-bsm py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeader
          eyebrow="Services"
          title="Every format. Every city. Every campaign."
          subhead="Browse our 360° advertising solutions — built to be executed, not just pitched."
        />
        <ButtonLink href="/services" variant="ghost" size="md" className="shrink-0">
          All Services
        </ButtonLink>
      </div>

      <RevealGroup
        className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.05}
      >
        {services.map((s) => (
          <RevealItem key={s.slug} className="h-full">
            <ServiceCard service={s} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
