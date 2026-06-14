"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/Section";
import { brands, brandCategories, type BrandCategory } from "@/data/brands";
import { cn } from "@/lib/utils";

export function BrandsCarousel() {
  const [active, setActive] = useState<BrandCategory | "all">("all");

  const filtered = useMemo(
    () => (active === "all" ? brands : brands.filter((b) => b.industry === active)),
    [active]
  );

  return (
    <section className="container-bsm py-24">
      <SectionHeader
        eyebrow="Trusted By"
        title="Some of India's most trusted brands, trust us"
        subhead="Filter by industry — see the brands we've executed for in your sector, not a generic logo wall."
        align="center"
        className="mx-auto items-center"
      />

      {/* filter tabs */}
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
                  ? "border-amber bg-amber text-ink"
                  : "border-[#f0f0f0] bg-surface text-body hover:border-ink/20 hover:text-ink"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* marquee (all) or static grid (filtered) */}
      {active === "all" ? (
        <div className="marquee-track marquee-mask mt-12 overflow-hidden">
          <div className="animate-marquee flex w-max gap-3">
            {[...brands, ...brands].map((b, i) => (
              <BrandChip key={`${b.name}-${i}`} name={b.name} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {filtered.map((b) => (
            <BrandChip key={b.name} name={b.name} />
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted">More brands in this sector coming soon.</p>
          )}
        </div>
      )}
    </section>
  );
}

function BrandChip({ name }: { name: string }) {
  return (
    <span className="flex h-16 min-w-[150px] items-center justify-center rounded-xl border border-[#f0f0f0] bg-surface px-6 font-display text-lg font-semibold text-ink/70 grayscale transition-all duration-300 hover:text-ink hover:grayscale-0">
      {name}
    </span>
  );
}
