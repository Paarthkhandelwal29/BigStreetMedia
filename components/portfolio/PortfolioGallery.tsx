"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  portfolio,
  portfolioCategories,
  type PortfolioCategory,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { X, CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

export function PortfolioGallery() {
  const [active, setActive] = useState<PortfolioCategory | "All">("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  useEffect(() => {
    const category = searchParams.get("category");
    const nextCategory = portfolioCategories.find((cat) => cat === category);

    if (nextCategory) {
      const frame = requestAnimationFrame(() => {
        setActive(nextCategory);
        setLightboxIndex(null);
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [searchParams]);

  const filtered = useMemo(
    () => (active === "All" ? portfolio : portfolio.filter((p) => p.category === active)),
    [active]
  );

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const move = (dir: 1 | -1) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + filtered.length) % filtered.length;
    setLightboxIndex(next);
  };

  return (
    <>
      {/* filters */}
      <div className="container-bsm">
        <div className="flex flex-wrap gap-2">
          {portfolioCategories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  setActive(cat);
                  setLightboxIndex(null);
                }}
                className={cn(
                  "min-h-9 cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                  isActive
                    ? "border-amber bg-amber text-ink"
                    : "border-[#f0f0f0] bg-surface text-body hover:border-ink/20 hover:text-ink"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* masonry */}
      <div className="container-bsm py-12">
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {filtered.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className={cn(
                "group relative block w-full overflow-hidden rounded-[1.25rem] border border-[#f0f0f0] bg-surface-2 text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber",
                item.tall ? "aspect-[3/4]" : "aspect-[4/3]"
              )}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-muted">
                {item.category}
              </span>
              <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block font-display text-sm font-semibold text-white">{item.brand}</span>
                <span className="block text-xs text-white/70">
                  {item.city} · {item.year}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); move(-1); }}
              aria-label="Previous"
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <CaretLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); move(1); }}
              aria-label="Next"
              className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <CaretRight size={20} />
            </button>
            <motion.figure
              className="w-full max-w-3xl"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex aspect-[16/10] items-center justify-center rounded-[1.5rem] bg-surface-2 text-sm uppercase tracking-widest text-muted">
                {current.category} Campaign
              </div>
              <figcaption className="mt-4 text-center text-white">
                <span className="font-display text-lg font-semibold">{current.brand}</span>
                <span className="mt-1 block text-sm text-white/60">
                  {current.category} · {current.city} · {current.year}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
