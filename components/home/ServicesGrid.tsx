"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/data/services";
import { icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

/**
 * Clean icon-tile layout matching the reference screenshot:
 * white background, large amber icon centred, service name below in caps.
 * Grid: 2 cols mobile → 3 cols sm → 4 cols md → 6 cols lg
 */
function ServiceTile({ service, index }: { service: (typeof services)[number]; index: number }) {
  const Icon = icons[service.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/services/${service.slug}`}
        className="group flex flex-col items-center justify-center gap-4 border border-[#e8e8e8] bg-white px-4 py-8 text-center transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-amber hover:shadow-[0_4px_24px_rgba(255,193,7,0.15)] hover:-translate-y-0.5"
      >
        {/* Icon container */}
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber/10 transition-colors duration-200 group-hover:bg-amber/20">
          <Icon
            size={36}
            weight="regular"
            className="text-amber transition-transform duration-200 group-hover:scale-110"
          />
        </span>

        {/* Service name */}
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-body transition-colors duration-200 group-hover:text-ink">
          {service.title}
        </span>
      </Link>
    </motion.div>
  );
}

export function ServicesGrid() {
  return (
    <section className="bg-surface">
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

        {/* Tile grid — padded container with border radius, shared borders inside */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-[#e8e8e8]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {services.map((s, i) => (
              <div
                key={s.slug}
                className={cn(
                  "border-b border-r border-[#e8e8e8]",
                  // Remove right border on last col of each row to avoid double border with container
                  (i + 1) % 2 === 0 && "sm:border-r",
                  (i + 1) % 3 === 0 && "sm:border-r-0 md:border-r",
                  (i + 1) % 4 === 0 && "md:border-r-0 lg:border-r",
                  (i + 1) % 6 === 0 && "lg:border-r-0",
                  // Remove bottom border on last row items
                  i >= services.length - 6 && "lg:border-b-0",
                  i >= services.length - 4 && "md:last:border-b-0",
                )}
              >
                <ServiceTile service={s} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
