"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { inventory, mediaTypes } from "@/data/inventory";
import { cn } from "@/lib/utils";
import {
  X,
  MapPin,
  MagnifyingGlass,
  FunnelSimple,
} from "@phosphor-icons/react/dist/ssr";

type TypeFilter = (typeof mediaTypes)[number] | "All Types";

export function MediaInventoryClient() {
  const [citySearch, setCitySearch] = useState("");
  const [type, setType] = useState<TypeFilter>("All Types");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const reduce = useReducedMotion();
  const hasActiveFilters = citySearch.trim() || type !== "All Types";

  const filtered = useMemo(() => {
    const cityQuery = citySearch.trim().toLowerCase();

    return inventory.filter(
      (i) =>
        (!cityQuery || i.city.toLowerCase().includes(cityQuery)) &&
        (type === "All Types" || i.type === type),
    );
  }, [citySearch, type]);

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
            />
          </aside>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {filtered.length} media space{filtered.length === 1 ? "" : "s"}{" "}
                found
              </p>
              <div className="flex items-center gap-3">
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
                    className="text-sm font-medium text-ink underline underline-offset-4"
                  >
                    Reset filters
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
                    onApply={() => setFiltersOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <div key={item.id} className="h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#eeeeee] bg-surface transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.06)]">
                    <div className="relative flex aspect-[16/8.5] items-center justify-center bg-surface-2 text-[11px] uppercase tracking-widest text-muted">
                      {item.type}
                      <span className="absolute left-3 top-3 rounded-full bg-amber px-2.5 py-1 text-[10px] font-semibold text-ink">
                        {item.type}
                      </span>
                      <span
                        className={cn(
                          "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                          item.available
                            ? "bg-success/15 text-success"
                            : "bg-ink/10 text-muted",
                        )}
                      >
                        {item.available ? "Available" : "Coming Soon"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="flex items-center gap-1.5 font-display text-base font-semibold text-ink">
                        <MapPin size={16} className="text-amber-deep" />{" "}
                        {item.landmark}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{item.city}</p>
                      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <dt className="text-xs text-muted">Size</dt>
                          <dd className="font-medium text-ink">{item.size}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-muted">Daily Traffic</dt>
                          <dd className="font-medium text-ink">
                            {item.dailyTraffic}
                          </dd>
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
    </>
  );
}

function FilterPanel({
  citySearch,
  type,
  setCitySearch,
  setType,
  onApply,
}: {
  citySearch: string;
  type: TypeFilter;
  setCitySearch: (value: string) => void;
  setType: (value: TypeFilter) => void;
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

      <p className="border-t border-[#f5f5f5] pt-4 text-sm leading-relaxed text-muted">
        Media inventory is subject to availability. Contact us for a customized
        media plan.
      </p>

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
    <div className="border-b border-[#f5f5f5] pb-4 mb-4 last:mb-0">
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
