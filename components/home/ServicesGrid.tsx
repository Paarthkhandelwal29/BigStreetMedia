"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/data/services";
import { icons } from "@/lib/icons";

function ServiceTile({ service, index }: { service: (typeof services)[number]; index: number }) {
  const Icon = icons[service.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={`/services/${service.slug}`}
        className="group relative flex h-full min-h-[156px] flex-col items-center justify-center gap-5 overflow-hidden border border-[#e8e8e8] bg-white px-5 py-10 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-amber hover:shadow-[0_20px_44px_-12px_rgba(255,193,7,0.4)]"
      >
        {/* amber wash that sweeps up on hover (transform, not layout) */}
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-amber/12 to-transparent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-amber/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber group-hover:text-ink">
          <Icon size={32} weight="regular" className="text-amber group-hover:text-ink" />
        </span>
        <span className="relative text-[11px] font-semibold uppercase leading-snug tracking-[0.1em] text-body transition-colors duration-200 group-hover:text-ink">
          {service.title}
        </span>
      </Link>
    </motion.div>
  );
}

export function ServicesGrid() {
  return (
    <section id="services" className="scroll-mt-28 bg-surface">
      <div className="container-bsm py-24">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Services"
            title="Every format. Every city. Every campaign."
            subhead="360° advertising — OOH to digital, Tier 1 to rural."
          />
          <ButtonLink href="/services" variant="ghost" size="md" className="shrink-0">
            All Services
          </ButtonLink>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {services.map((s, i) => (
            <ServiceTile key={s.slug} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
