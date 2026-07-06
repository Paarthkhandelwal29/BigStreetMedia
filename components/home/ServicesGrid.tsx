"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/data/services";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

function ServiceTile({ service, index }: { service: (typeof services)[number]; index: number }) {
  const Icon = icons[service.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full", (service.slug === "radio" || service.slug === "digital") && "hidden md:block")}
    >
      <Link
        href={`/services/${service.slug}`}
        className="group flex h-full min-h-[92px] md:min-h-[190px] flex-col items-center justify-center gap-1.5 md:gap-5 border border-[#e8e8e8] bg-white p-2 md:px-6 md:py-12 text-center transition-colors duration-200 hover:border-amber hover:bg-[#fffdf5] rounded-xl md:rounded-none"
      >
        <span className="flex h-8 w-8 md:h-16 md:w-16 items-center justify-center bg-amber/10 transition-colors duration-200 group-hover:bg-amber/15 rounded-full">
          <Icon
            size="100%"
            weight="regular"
            className="text-amber w-4.5 h-4.5 md:w-[34px] md:h-[34px]"
          />
        </span>
        <span className="text-[11px] md:text-xs font-semibold uppercase leading-tight tracking-[0.02em] md:tracking-[0.1em] text-body transition-colors duration-200 group-hover:text-ink">
          {service.title}
        </span>
      </Link>
    </motion.div>
  );
}

export function ServicesGrid() {
  return (
    <section id="services" className="scroll-mt-28 bg-surface">
      <div className="container-bsm py-6 md:py-16">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            title="Every format. Every city. Every campaign."
            subhead="360° advertising — OOH to digital, Tier 1 to rural."
          />
          <ButtonLink href="/services" variant="ghost" size="md" className="shrink-0 hidden md:inline-flex">
            All Services
          </ButtonLink>
        </div>

        <div className="mt-6 md:mt-14 grid grid-cols-4 gap-2 md:grid-cols-3 lg:grid-cols-5 md:gap-5">
          {services.map((s, i) => (
            <ServiceTile key={s.slug} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
