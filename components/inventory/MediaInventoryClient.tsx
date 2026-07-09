"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { MediaInventoryRecord } from "@/lib/cms/types";
import { cn } from "@/lib/utils";
import {
  X,
  MapPin,
  MagnifyingGlass,
  FunnelSimple,
  CaretLeft,
  CaretRight,
  ArrowsOut,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";

type InventoryViewItem = {
  id: string;
  city: string;
  type: string;
  landmark: string;
  size: string;
  images: string[];
  imageUrl?: string;
};

type TypeFilter = string | "All Types";

export function MediaInventoryClient({
  items,
}: {
  items: MediaInventoryRecord[];
}) {
  const [citySearch, setCitySearch] = useState("");
  const [type, setType] = useState<TypeFilter>("All Types");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [lightboxItemIndex, setLightboxItemIndex] = useState<number | null>(
    null,
  );
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const reduce = useReducedMotion();
  const hasActiveFilters = citySearch.trim() || type !== "All Types";

  const inventory = useMemo<InventoryViewItem[]>(
    () =>
      items.map((item) => ({
        id: item.id,
        city: item.city,
        type: item.mediaType,
        landmark: item.location,
        size: item.size,
        images: item.images,
        imageUrl: item.images[0],
      })),
    [items],
  );

  const mediaTypes = useMemo(
    () => Array.from(new Set(inventory.map((item) => item.type))).sort(),
    [inventory],
  );

  const filtered = useMemo(() => {
    const cityQuery = citySearch.trim().toLowerCase();

    return inventory.filter(
      (item) =>
        (!cityQuery || item.city.toLowerCase().includes(cityQuery)) &&
        (type === "All Types" || item.type === type),
    );
  }, [inventory, citySearch, type]);

  const currentItem =
    lightboxItemIndex !== null ? filtered[lightboxItemIndex] : null;
  const currentImage = currentItem?.images[lightboxImageIndex];

  function openLightbox(itemIndex: number) {
    if (!filtered[itemIndex]?.images.length) return;
    setLightboxItemIndex(itemIndex);
    setLightboxImageIndex(0);
  }

  function closeLightbox() {
    setLightboxItemIndex(null);
    setLightboxImageIndex(0);
  }

  function moveImage(direction: 1 | -1) {
    if (!currentItem || currentItem.images.length === 0) return;
    setLightboxImageIndex(
      (current) =>
        (current + direction + currentItem.images.length) %
        currentItem.images.length,
    );
  }

  return (
    <>
      <div className="container-bsm">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
            <FilterPanel
              citySearch={citySearch}
              type={type}
              setCitySearch={setCitySearch}
              setType={setType}
              mediaTypes={mediaTypes}
            />
          </aside>

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              {/* On Mobile: Show the city search filter bar */}
              <div className="relative flex-1 lg:hidden">
                <MagnifyingGlass
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Search by city"
                  aria-label="Search inventory by city"
                  autoComplete="off"
                  className="h-10 w-full rounded-full border border-[#eeeeee] bg-white pl-10 pr-8 text-sm font-medium text-ink outline-none transition-colors placeholder:text-muted focus:border-amber focus:ring-2 focus:ring-amber/30"
                />
                {citySearch && (
                  <button
                    type="button"
                    onClick={() => setCitySearch("")}
                    aria-label="Clear city search"
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-[#eeeeee] bg-surface px-4 text-sm font-medium text-ink shadow-[0_8px_22px_rgba(0,0,0,0.04)] lg:hidden"
                >
                  <FunnelSimple size={17} />
                  Filters
                  {hasActiveFilters && (
                    <span
                      className="h-2 w-2 rounded-full bg-amber"
                      aria-hidden
                    />
                  )}
                </button>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setCitySearch("");
                      setType("All Types");
                      setFiltersOpen(false);
                    }}
                    className="text-sm font-medium text-ink underline underline-offset-4 hidden sm:inline-block"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {filtersOpen && (
                <motion.div
                  className="mb-5 lg:hidden"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  <FilterPanel
                    citySearch={citySearch}
                    type={type}
                    setCitySearch={setCitySearch}
                    setType={setType}
                    mediaTypes={mediaTypes}
                    onApply={() => setFiltersOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-0 divide-y divide-[#f0f0f0] md:grid-cols-2 md:gap-4 md:divide-none xl:grid-cols-3">
              {filtered.map((item) => (
                <div key={item.id} className="h-full">
                  {/* Mobile High-Density Row View */}
                  <article className="flex md:hidden items-center gap-3.5 border-b border-[#f0f0f0] py-3.5 bg-surface transition-colors duration-200">
                    {/* Left: Thumbnail image button */}
                    <button
                      type="button"
                      onClick={() =>
                        openLightbox(
                          filtered.findIndex((entry) => entry.id === item.id),
                        )
                      }
                      disabled={!item.imageUrl}
                      className="relative block aspect-[16/10] w-[96px] shrink-0 overflow-hidden rounded-lg bg-surface-2 text-left disabled:cursor-default"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.landmark}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] uppercase tracking-wider text-muted font-semibold">
                          No Photo
                        </div>
                      )}
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-amber/90 px-1.5 py-0.5 text-[8px] font-bold text-ink uppercase tracking-wide">
                        {item.type.split(" ")[0]}
                      </span>
                    </button>

                    {/* Middle: Details content */}
                    <div className="flex-1 min-w-0 pr-2">
                      <button
                        type="button"
                        onClick={() =>
                          openLightbox(
                            filtered.findIndex((entry) => entry.id === item.id),
                          )
                        }
                        disabled={!item.imageUrl}
                        className="text-left block w-full focus:outline-none cursor-pointer"
                      >
                        <h3 className="font-display text-xs font-bold text-ink leading-snug line-clamp-1">
                          {item.landmark}
                        </h3>
                        <p className="text-[10px] text-body/80 mt-0.5 line-clamp-1">
                          {item.city}
                        </p>
                      </button>

                      <div className="mt-1.5 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-body/70">
                          <SquaresFour size={12} className="text-amber-deep shrink-0" />
                          <span className="line-clamp-1">{item.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-body/70">
                          <ArrowsOut size={12} className="text-amber-deep shrink-0" />
                          <span className="line-clamp-1">{item.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Chevron arrow */}
                    {item.imageUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          openLightbox(
                            filtered.findIndex((entry) => entry.id === item.id),
                          )
                        }
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-body hover:text-ink hover:bg-surface-3 transition-colors cursor-pointer"
                        aria-label="View Photo"
                      >
                        <CaretRight size={14} weight="bold" />
                      </button>
                    )}
                  </article>

                  {/* Desktop/Tablet Card View */}
                  <article className="hidden md:flex h-full flex-col overflow-hidden rounded-2xl border border-[#eeeeee] bg-surface transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.06)]">
                    <button
                      type="button"
                      onClick={() =>
                        openLightbox(
                          filtered.findIndex((entry) => entry.id === item.id),
                        )
                      }
                      disabled={!item.imageUrl}
                      className="relative block aspect-[16/8.5] w-full overflow-hidden bg-surface-2 text-left disabled:cursor-default"
                    >
                      {item.imageUrl ? (
                        <>
                          <img
                            src={item.imageUrl}
                            alt={item.landmark}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink">
                            View Photo{item.images.length > 1 ? "s" : ""}
                          </span>
                        </>
                      ) : (
                        <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-widest text-muted">
                          {item.type}
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-amber px-2.5 py-1 text-[10px] font-semibold text-ink">
                        {item.type}
                      </span>
                      {item.images.length > 1 ? (
                        <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white">
                          {item.images.length} Photos
                        </span>
                      ) : null}
                    </button>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="flex items-center gap-1.5 font-display text-base font-semibold text-ink">
                        <MapPin size={16} className="text-amber-deep" />
                        {item.landmark}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{item.city}</p>
                      <dl className="mt-3 grid grid-cols-1 gap-3 text-sm">
                        <div>
                          <dt className="text-xs text-muted">Size</dt>
                          <dd className="font-medium text-ink">{item.size}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="rounded-2xl border border-[#eeeeee] bg-surface px-5 py-10 text-center text-sm text-muted">
                No spaces match these filters. Try widening your search.
              </p>
            )}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {currentItem && currentImage ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X size={20} />
            </button>

            {currentItem.images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveImage(-1);
                  }}
                  aria-label="Previous image"
                  className="absolute left-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                >
                  <CaretLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    moveImage(1);
                  }}
                  aria-label="Next image"
                  className="absolute right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                >
                  <CaretRight size={20} />
                </button>
              </>
            ) : null}

            <motion.figure
              className="w-full max-w-5xl"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="overflow-hidden rounded-[1.5rem] bg-surface-2">
                <img
                  src={currentImage}
                  alt={currentItem.landmark}
                  className="max-h-[75vh] w-full object-contain"
                />
              </div>
              <figcaption className="mt-4 text-center text-white">
                <span className="font-display text-lg font-semibold">
                  {currentItem.landmark}
                </span>
                <span className="mt-1 block text-sm text-white/60">
                  {currentItem.type} · {currentItem.city} · {currentItem.size}
                </span>
                {currentItem.images.length > 1 ? (
                  <span className="mt-2 inline-block text-xs text-white/60">
                    Photo {lightboxImageIndex + 1} of{" "}
                    {currentItem.images.length}
                  </span>
                ) : null}
              </figcaption>
            </motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function FilterPanel({
  citySearch,
  type,
  setCitySearch,
  setType,
  mediaTypes,
  onApply,
}: {
  citySearch: string;
  type: TypeFilter;
  setCitySearch: (value: string) => void;
  setType: (value: TypeFilter) => void;
  mediaTypes: string[];
  onApply?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#eeeeee] bg-surface p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <FilterBlock label="City">
        <div className="relative">
          <MagnifyingGlass
            size={17}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search by city"
            aria-label="Search inventory by city"
            autoComplete="off"
            className="h-10 w-full rounded-full border border-[#eeeeee] bg-surface px-10 text-sm font-medium text-ink outline-none transition-colors placeholder:text-muted focus:border-amber focus:ring-2 focus:ring-amber/30"
          />
          {citySearch && (
            <button
              type="button"
              onClick={() => setCitySearch("")}
              aria-label="Clear city search"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </FilterBlock>

      <FilterBlock label="Media Type">
        <div className="flex flex-col gap-2">
          <Chip
            active={type === "All Types"}
            onClick={() => setType("All Types")}
          >
            All Types
          </Chip>
          {mediaTypes.map((t) => (
            <Chip key={t} active={type === t} onClick={() => setType(t)}>
              {t}
            </Chip>
          ))}
        </div>
      </FilterBlock>



      {onApply && (
        <button
          type="button"
          onClick={onApply}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-ink px-4 text-sm font-medium text-white transition-colors hover:bg-black"
        >
          Show Results
        </button>
      )}
    </div>
  );
}

function FilterBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 border-b border-[#f5f5f5] pb-4 last:mb-0">
      <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-9 w-full cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
        active
          ? "border-amber bg-amber text-ink"
          : "border-[#f0f0f0] bg-surface text-body hover:border-ink/20 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
