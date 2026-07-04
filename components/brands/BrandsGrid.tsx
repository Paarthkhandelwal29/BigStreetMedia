"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  brands,
  brandCategories,
  type Brand,
  type BrandCategory,
} from "@/data/brands";
import { caseStudies } from "@/data/caseStudies";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";
import { X } from "@phosphor-icons/react/dist/ssr";

// Map a brand name to a case study slug when one exists.
const caseStudyForBrand = (name: string) =>
  caseStudies.find((c) => c.brand.toLowerCase() === name.toLowerCase());

export function BrandsGrid() {
  const [active, setActive] = useState<BrandCategory | "all">("all");
  const [selected, setSelected] = useState<Brand | null>(null);

  const filtered = useMemo(
    () =>
      active === "all" ? brands : brands.filter((b) => b.industry === active),
    [active],
  );

  return (
    <>
      <div className="container-bsm">
        <div className="flex flex-wrap gap-2">
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
      </div>

      <div className="container-bsm py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((b) => {
            const cs = caseStudyForBrand(b.name);
            const content = (
              <span className="flex h-24 items-center justify-center font-display text-lg font-semibold text-ink/70 grayscale transition-all duration-300 group-hover:text-ink group-hover:grayscale-0">
                {b.name}
              </span>
            );
            const className =
              "group relative block rounded-[1.25rem] border border-[#f0f0f0] bg-surface px-4 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)] cursor-pointer";
            return cs ? (
              <Link
                key={b.name}
                href={`/case-studies/${cs.slug}`}
                className={className}
              >
                {content}
                <span className="absolute right-3 top-3 rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-semibold text-amber-deep">
                  Case Study
                </span>
              </Link>
            ) : (
              <button
                key={b.name}
                type="button"
                onClick={() => setSelected(b)}
                className={cn(
                  className,
                  "text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
                )}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal
              aria-label={selected.name}
              className="w-full max-w-md rounded-[1.5rem] bg-surface p-8 shadow-2xl"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-display text-2xl font-bold text-ink">
                  {selected.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f0f0f0] text-muted hover:text-ink cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="mt-1 text-sm capitalize text-muted">
                {selected.industry}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-body">
                We&apos;ve executed campaigns for {selected.name} across
                multiple cities and formats. A detailed case study is in the
                works.
              </p>
              <a
                href={whatsappLink(
                  `Hi, I'd like to know more about your work with ${selected.name}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-amber px-5 text-sm font-medium text-ink transition-colors hover:bg-amber-deep cursor-pointer"
              >
                Ask about this work
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
