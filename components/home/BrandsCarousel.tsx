"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/Section";
import { BrandWordmark } from "@/components/shared/BrandWordmark";
import { brands, brandCategories, type BrandCategory } from "@/data/brands";
import { cn } from "@/lib/utils";

export function BrandsCarousel() {
  const [active, setActive] = useState<BrandCategory | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? brands : brands.filter((b) => b.industry === active)),
    [active]
  );

  return (
    <section className="border-b border-[#f0f0f0] bg-surface-2">
      <div className="container-bsm py-16">
        <SectionHeader
          eyebrow="Trusted By"
          title="Brands that trust us with their visibility"
          subhead="100+ national brands across automobile, FMCG, retail, education, and more."
          align="center"
          className="mx-auto items-center"
        />

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {brandCategories.map((cat) => {
            const isActive = active === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(cat.key)}
                className={cn(
                  "min-h-9 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                  isActive
                    ? "border-amber bg-amber text-ink shadow-[0_2px_8px_rgba(255,193,7,0.25)]"
                    : "border-[#f0f0f0] bg-surface text-body hover:border-ink/20 hover:text-ink"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {active === "all" ? (
          <div className="marquee-track marquee-mask mt-10 overflow-hidden py-2">
            <div className="animate-marquee flex w-max items-center gap-4">
              {[...brands, ...brands].map((b, i) => (
                <BrandWordmark key={`${b.name}-${i}`} name={b.name} compact className="hover:-translate-y-0.5 hover:border-amber/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]" />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {filtered.map((b) => (
              <BrandWordmark key={b.name} name={b.name} className="hover:-translate-y-0.5 hover:border-amber/40 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]" />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted">More brands in this sector coming soon.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
