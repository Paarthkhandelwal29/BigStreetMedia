"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  portfolio,
  portfolioCategories,
  portfolioFormatsByCategory,
  type PortfolioCategory,
  type PortfolioFormat,
} from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { X, CaretLeft, CaretRight, FunnelSimple } from "@phosphor-icons/react/dist/ssr";

export function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | "All">("All");
  const [activeFormat, setActiveFormat] = useState<PortfolioFormat | "All Formats">("All Formats");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  useEffect(() => {
    const category = searchParams.get("category");
    const nextCategory = portfolioCategories.find((cat) => cat === category);

    if (nextCategory) {
      const frame = requestAnimationFrame(() => {
        setActiveCategory(nextCategory);
        setActiveFormat("All Formats");
        setLightboxIndex(null);
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [searchParams]);

  const formatOptions =
    activeCategory === "All" ? [] : portfolioFormatsByCategory[activeCategory];

  const filtered = useMemo(
    () =>
      portfolio.filter((item) => {
        const matchesCategory =
          activeCategory === "All" || item.category === activeCategory;
        const matchesFormat =
          activeFormat === "All Formats" || item.format === activeFormat;

        return matchesCategory && matchesFormat;
      }),
    [activeCategory, activeFormat]
  );

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const move = (dir: 1 | -1) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + filtered.length) % filtered.length;
    setLightboxIndex(next);
  };

  const handleCategorySelect = (category: PortfolioCategory) => {
    setActiveCategory(category);
    setActiveFormat("All Formats");
    setLightboxIndex(null);
  };

  const handleFormatSelect = (format: PortfolioFormat | "All Formats") => {
    setActiveFormat(format);
    setLightboxIndex(null);
  };

  useEffect(() => {
    if (!mobileFiltersOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [mobileFiltersOpen]);

  return (
    <>
      <div className="container-bsm pb-12">
        <div className="mb-6 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#f0f0f0] bg-surface px-4 py-2 text-sm font-semibold text-ink transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
          >
            <FunnelSimple size={16} />
            Filters
          </button>
        </div>

        <div className="mb-6 hidden lg:block lg:mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Formats
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={activeFormat === "All Formats"}
              onClick={() => handleFormatSelect("All Formats")}
              className={cn(
                "min-h-9 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                activeFormat === "All Formats"
                  ? "border-ink bg-ink text-white"
                  : "border-[#f0f0f0] bg-white text-body",
                activeCategory === "All" && "cursor-not-allowed opacity-50"
              )}
              disabled={activeCategory === "All"}
            >
              All Formats
            </button>

            {formatOptions.map((format) => {
              const isActive = activeFormat === format;
              return (
                <button
                  key={format}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleFormatSelect(format)}
                  className={cn(
                    "min-h-9 whitespace-nowrap cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                    isActive
                      ? "border-ink bg-ink text-white"
                      : "border-[#f0f0f0] bg-white text-body hover:border-ink/20 hover:text-ink"
                  )}
                >
                  {format}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          {/* filters */}
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Categories
              </p>
              <div className="flex flex-col gap-2">
                {portfolioCategories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleCategorySelect(cat)}
                      className={cn(
                        "min-h-11 w-full cursor-pointer rounded-2xl border px-4 py-3 text-left text-base font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                        isActive
                          ? "border-amber bg-amber text-ink"
                          : "border-[#f0f0f0] bg-white text-ink hover:border-ink/20"
                      )}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* masonry */}
          <div>
            {filtered.length > 0 ? (
              <div className="columns-2 gap-4 md:columns-3 xl:columns-4 [&>*]:mb-4">
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
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                      {item.category}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs uppercase tracking-widest text-muted">
                      {item.format}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="block font-display text-sm font-semibold text-white">{item.brand}</span>
                      <span className="block text-xs text-white/70">
                        {item.format} · {item.city} · {item.year}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[#e6e6e6] bg-surface px-6 py-12 text-center">
                <p className="text-base font-medium text-ink">No works found for this format yet.</p>
                <p className="mt-2 text-sm text-muted">
                  Try another format or switch the primary category above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/45 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[1.75rem] bg-white px-4 pb-6 pt-4 shadow-[0_-18px_40px_rgba(0,0,0,0.12)]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  Filters
                </p>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#f0f0f0] bg-white text-ink transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Categories
                  </p>
                  <div className="flex flex-col gap-2">
                    {portfolioCategories.map((cat) => {
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => handleCategorySelect(cat)}
                          className={cn(
                            "min-h-11 w-full cursor-pointer rounded-2xl border px-4 py-3 text-left text-base font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                            isActive
                              ? "border-amber bg-amber text-ink"
                              : "border-[#f0f0f0] bg-white text-ink hover:border-ink/20"
                          )}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Formats
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      aria-pressed={activeFormat === "All Formats"}
                      onClick={() => handleFormatSelect("All Formats")}
                      className={cn(
                        "min-h-9 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                        activeFormat === "All Formats"
                          ? "border-ink bg-ink text-white"
                          : "border-[#f0f0f0] bg-white text-body",
                        activeCategory === "All" && "cursor-not-allowed opacity-50"
                      )}
                      disabled={activeCategory === "All"}
                    >
                      All Formats
                    </button>

                    {formatOptions.map((format) => {
                      const isActive = activeFormat === format;
                      return (
                        <button
                          key={format}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => handleFormatSelect(format)}
                          className={cn(
                            "min-h-9 whitespace-nowrap cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                            isActive
                              ? "border-ink bg-ink text-white"
                              : "border-[#f0f0f0] bg-white text-body hover:border-ink/20 hover:text-ink"
                          )}
                        >
                          {format}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                {current.format}
              </div>
              <figcaption className="mt-4 text-center text-white">
                <span className="font-display text-lg font-semibold">{current.brand}</span>
                <span className="mt-1 block text-sm text-white/60">
                  {current.category} · {current.format} · {current.city} · {current.year}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
