"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  portfolioCategories,
  portfolioFormatsByCategory,
  type PortfolioCategory,
  type PortfolioFormat,
} from "@/data/portfolio";
import type { PortfolioWorkRecord } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import {
  X,
  CaretLeft,
  CaretRight,
  FunnelSimple,
  PlayCircle,
  ImageSquare,
  ArrowRight,
  ArrowsCounterClockwise,
  Buildings,
  Train,
  Storefront,
  Megaphone,
  CalendarDots,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

type PortfolioGalleryProps = {
  items: PortfolioWorkRecord[];
};

type ActiveFormat = PortfolioFormat | "All Formats";
type ActiveBrand = string | "All Brands";

const categoryIcons = {
  All: Buildings,
  OOH: Buildings,
  Transit: Train,
  Events: CalendarDots,
  Exhibitions: Megaphone,
  "Retail Launches": Storefront,
  "Special Activations": Sparkle,
} as const;

function brandBadgeText(brand: string) {
  if (brand === "All Brands") return "★";

  return brand
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function PortfolioGallery({ items }: PortfolioGalleryProps) {
  const [activeBrand, setActiveBrand] = useState<ActiveBrand>("All Brands");
  const [activeCategory, setActiveCategory] = useState<
    PortfolioCategory | "All"
  >("All");
  const [activeFormat, setActiveFormat] = useState<ActiveFormat>("All Formats");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileFilterView, setMobileFilterView] = useState<
    "tabs" | "categories" | "brands" | "formats"
  >("tabs");
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();

  useEffect(() => {
    const category = searchParams.get("category");
    const nextCategory = portfolioCategories.find((cat) => cat === category);

    if (nextCategory && nextCategory !== "All") {
      const frame = requestAnimationFrame(() => {
        setActiveCategory(nextCategory);
        setActiveFormat("All Formats");
        setLightboxIndex(null);
      });

      return () => cancelAnimationFrame(frame);
    }
  }, [searchParams]);

  const availableBrands = useMemo(
    () => [
      "All Brands",
      ...Array.from(new Set(items.map((item) => item.brandName))).sort((a, b) =>
        a.localeCompare(b),
      ),
    ],
    [items],
  );

  const brandFilteredItems = useMemo(
    () =>
      activeBrand === "All Brands"
        ? items
        : items.filter((item) => item.brandName === activeBrand),
    [items, activeBrand],
  );

  const availableCategories = useMemo(() => {
    const categories = Array.from(
      new Set(brandFilteredItems.map((item) => item.category)),
    );
    return portfolioCategories.filter(
      (category) =>
        category === "All" ||
        categories.includes(category as PortfolioCategory),
    );
  }, [brandFilteredItems]);

  const formatOptions = useMemo(() => {
    if (activeCategory === "All") return [];

    const allowedFormats = new Set(
      brandFilteredItems
        .filter((item) => item.category === activeCategory)
        .map((item) => item.format),
    );

    return portfolioFormatsByCategory[activeCategory].filter((format) =>
      allowedFormats.has(format),
    );
  }, [activeCategory, brandFilteredItems]);

  const filtered = useMemo(
    () =>
      brandFilteredItems.filter((item) => {
        const matchesCategory =
          activeCategory === "All" || item.category === activeCategory;
        const matchesFormat =
          activeFormat === "All Formats" || item.format === activeFormat;

        return matchesCategory && matchesFormat;
      }),
    [brandFilteredItems, activeCategory, activeFormat],
  );

  const sortedFiltered = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }),
    [filtered],
  );

  const current =
    lightboxIndex !== null ? sortedFiltered[lightboxIndex] : null;

  const move = (dir: 1 | -1) => {
    if (lightboxIndex === null || sortedFiltered.length === 0) return;
    const next = (lightboxIndex + dir + sortedFiltered.length) % sortedFiltered.length;
    setLightboxIndex(next);
  };

  const handleBrandSelect = (brand: ActiveBrand) => {
    setActiveBrand(brand);
    setActiveCategory("All");
    setActiveFormat("All Formats");
    setLightboxIndex(null);
  };

  const handleCategorySelect = (category: PortfolioCategory | "All") => {
    setActiveCategory(category);
    setActiveFormat("All Formats");
    setLightboxIndex(null);
  };

  const handleFormatSelect = (format: ActiveFormat) => {
    setActiveFormat(format);
    setLightboxIndex(null);
  };

  const clearAllFilters = () => {
    setActiveBrand("All Brands");
    setActiveCategory("All");
    setActiveFormat("All Formats");
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
            onClick={() => {
              setMobileFilterView("tabs");
              setMobileFiltersOpen(true);
            }}
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
                activeCategory === "All" && "cursor-not-allowed opacity-50",
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
                      : "border-[#f0f0f0] bg-white text-body hover:border-ink/20 hover:text-ink",
                  )}
                >
                  {format}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)_210px] lg:items-start">
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-[1.35rem] border border-[#ececec] bg-surface p-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <p className="mb-3 px-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Categories
              </p>
              <div className="space-y-1.5">
                {availableCategories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const Icon =
                    categoryIcons[cat as keyof typeof categoryIcons] ??
                    Buildings;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleCategorySelect(cat)}
                      className={cn(
                        "flex min-h-10 w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                        isActive
                          ? "border-amber bg-amber text-ink shadow-sm"
                          : "border-[#f0f0f0] bg-white text-ink hover:border-ink/20",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-md border text-muted",
                          isActive
                            ? "border-ink/10 bg-white/70 text-ink"
                            : "border-[#ececec] bg-surface",
                        )}
                      >
                        <Icon size={15} weight="regular" />
                      </span>
                      <span className="flex-1">
                        {cat === "All" ? "All" : cat}
                      </span>
                      {isActive ? <ArrowRight size={14} weight="bold" /> : null}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-4 inline-flex items-center gap-2 px-2 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                <ArrowsCounterClockwise size={14} />
                Clear All
              </button>
            </div>
          </aside>

          <div>
            {sortedFiltered.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {sortedFiltered.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="group relative block w-full overflow-hidden rounded-[1.25rem] border border-[#f0f0f0] bg-surface-2 text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                  >
                    <div className="relative">
                      {item.mediaType === "image" ? (
                        <img
                          src={item.mediaUrl}
                          alt={`${item.brandName} - ${item.format}`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                      ) : (
                        <>
                          <video
                            src={item.mediaUrl}
                            className="aspect-[4/3] w-full bg-black object-cover"
                            muted
                          />
                          <div className="pointer-events-none absolute inset-0 bg-ink/20" />
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink shadow-sm">
                              <PlayCircle size={18} weight="fill" />
                              Video
                            </span>
                          </div>
                        </>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                        {item.category}
                      </span>
                    </div>
                    <span className="block p-4">
                      <span className="flex items-center justify-between gap-3">
                        <span className="block font-display text-sm font-semibold text-ink">
                          {item.brandName}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#ececec] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                          {item.mediaType === "video" ? (
                            <PlayCircle size={14} weight="fill" />
                          ) : (
                            <ImageSquare size={14} weight="fill" />
                          )}
                          {item.mediaType}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {item.format} · {item.city}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[#e6e6e6] bg-surface px-6 py-12 text-center">
                <p className="text-base font-medium text-ink">
                  No works found for this format yet.
                </p>
                <p className="mt-2 text-sm text-muted">
                  Try another format or switch the primary category above.
                </p>
              </div>
            )}
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <div className="rounded-[1.35rem] border border-[#ececec] bg-surface p-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <p className="mb-3 px-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Brands
              </p>
              <div className="max-h-[380px] space-y-1.5 overflow-y-auto">
                {availableBrands.map((brand) => {
                  const isActive = activeBrand === brand;
                  return (
                    <button
                      key={brand}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => handleBrandSelect(brand)}
                      className={cn(
                        "flex min-h-10 w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[13px] font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                        isActive
                          ? "border-ink bg-ink text-white shadow-sm"
                          : "border-[#f0f0f0] bg-white text-ink hover:border-ink/20",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold",
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-surface-2 text-ink",
                        )}
                      >
                        {brandBadgeText(brand)}
                      </span>
                      <span className="flex-1 truncate">{brand}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handleBrandSelect("All Brands")}
                className="mt-4 inline-flex items-center gap-2 px-2 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                <Buildings size={14} />
                View All Brands
              </button>
            </div>
          </aside>
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

              {mobileFilterView === "tabs" && (
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileFilterView("categories")}
                    className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[#f0f0f0] bg-surface text-base font-semibold text-ink transition-all"
                  >
                    Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileFilterView("brands")}
                    className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[#f0f0f0] bg-surface text-base font-semibold text-ink transition-all"
                  >
                    Brands
                  </button>
                </div>
              )}

              {mobileFilterView === "categories" && (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      handleCategorySelect("All");
                      setMobileFilterView("tabs");
                    }}
                    className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
                  >
                    <CaretLeft size={16} />
                    Back
                  </button>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Categories
                  </p>
                  <div className="flex flex-col gap-2">
                    {availableCategories.map((cat) => {
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => {
                            handleCategorySelect(cat);
                            if (cat === "All") {
                              setMobileFiltersOpen(false);
                            } else {
                              setMobileFilterView("formats");
                            }
                          }}
                          className={cn(
                            "min-h-11 w-full cursor-pointer rounded-2xl border px-4 py-3 text-left text-base font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                            isActive
                              ? "border-amber bg-amber text-ink"
                              : "border-[#f0f0f0] bg-white text-ink hover:border-ink/20",
                          )}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mobileFilterView === "formats" && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileFilterView("categories")}
                    className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
                  >
                    <CaretLeft size={16} />
                    Back
                  </button>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Formats
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      aria-pressed={activeFormat === "All Formats"}
                      onClick={() => {
                        handleFormatSelect("All Formats");
                        setMobileFiltersOpen(false);
                      }}
                      className={cn(
                        "min-h-9 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                        activeFormat === "All Formats"
                          ? "border-ink bg-ink text-white"
                          : "border-[#f0f0f0] bg-white text-body",
                        activeCategory === "All" &&
                          "cursor-not-allowed opacity-50",
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
                          onClick={() => {
                            handleFormatSelect(format);
                            setMobileFiltersOpen(false);
                          }}
                          className={cn(
                            "min-h-9 whitespace-nowrap cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                            isActive
                              ? "border-ink bg-ink text-white"
                              : "border-[#f0f0f0] bg-white text-body hover:border-ink/20 hover:text-ink",
                          )}
                        >
                          {format}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mobileFilterView === "brands" && (
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileFilterView("tabs")}
                    className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
                  >
                    <CaretLeft size={16} />
                    Back
                  </button>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Brands
                  </p>
                  <div className="flex flex-col gap-2">
                    {availableBrands.map((brand) => {
                      const isActive = activeBrand === brand;
                      return (
                        <button
                          key={brand}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => {
                            handleBrandSelect(brand);
                            setMobileFiltersOpen(false);
                          }}
                          className={cn(
                            "flex min-h-11 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                            isActive
                              ? "border-ink bg-ink text-white"
                              : "border-[#f0f0f0] bg-white text-ink hover:border-ink/20",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-bold",
                              isActive
                                ? "bg-white/15 text-white"
                                : "bg-surface-2 text-ink",
                            )}
                          >
                            {brandBadgeText(brand)}
                          </span>
                          <span className="flex-1 truncate">{brand}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              onClick={(e) => {
                e.stopPropagation();
                move(-1);
              }}
              aria-label="Previous"
              className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <CaretLeft size={20} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                move(1);
              }}
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
              <div className="overflow-hidden rounded-[1.5rem] bg-surface-2">
                {current.mediaType === "image" ? (
                  <img
                    src={current.mediaUrl}
                    alt={`${current.brandName} - ${current.format}`}
                    className="max-h-[75vh] w-full object-contain"
                  />
                ) : (
                  <video
                    src={current.mediaUrl}
                    controls
                    className="max-h-[75vh] w-full bg-black object-contain"
                  />
                )}
              </div>
              <figcaption className="mt-4 text-center text-white">
                <span className="font-display text-lg font-semibold">
                  {current.brandName}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  {current.mediaType === "video" ? (
                    <PlayCircle size={14} weight="fill" />
                  ) : (
                    <ImageSquare size={14} weight="fill" />
                  )}
                  {current.mediaType}
                </span>
                <span className="mt-2 block text-sm text-white/60">
                  {current.category} · {current.format} · {current.city}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
