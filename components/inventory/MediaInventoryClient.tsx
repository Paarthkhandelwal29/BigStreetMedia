"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/shared/LeadForm";
import {
  inventory,
  inventoryCities,
  mediaTypes,
  type InventoryItem,
} from "@/data/inventory";
import { cn } from "@/lib/utils";
import { X, MapPin } from "@phosphor-icons/react/dist/ssr";

type CityFilter = (typeof inventoryCities)[number] | "All Cities";
type TypeFilter = (typeof mediaTypes)[number] | "All Types";
type AvailFilter = "All" | "Available" | "Coming Soon";

export function MediaInventoryClient() {
  const [city, setCity] = useState<CityFilter>("All Cities");
  const [type, setType] = useState<TypeFilter>("All Types");
  const [avail, setAvail] = useState<AvailFilter>("All");
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () =>
      inventory.filter(
        (i) =>
          (city === "All Cities" || i.city === city) &&
          (type === "All Types" || i.type === type) &&
          (avail === "All" ||
            (avail === "Available" ? i.available : !i.available))
      ),
    [city, type, avail]
  );

  return (
    <>
      {/* filters */}
      <div className="container-bsm">
        <div className="rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <FilterRow label="City">
            <Chip active={city === "All Cities"} onClick={() => setCity("All Cities")}>
              All Cities
            </Chip>
            {inventoryCities.map((c) => (
              <Chip key={c} active={city === c} onClick={() => setCity(c)}>
                {c}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Media Type">
            <Chip active={type === "All Types"} onClick={() => setType("All Types")}>
              All Types
            </Chip>
            {mediaTypes.map((t) => (
              <Chip key={t} active={type === t} onClick={() => setType(t)}>
                {t}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Availability">
            {(["All", "Available", "Coming Soon"] as AvailFilter[]).map((a) => (
              <Chip key={a} active={avail === a} onClick={() => setAvail(a)}>
                {a}
              </Chip>
            ))}
          </FilterRow>
        </div>
      </div>

      {/* results */}
      <div className="container-bsm py-12">
        <p className="mb-6 text-sm text-muted">
          {filtered.length} media space{filtered.length === 1 ? "" : "s"} found
        </p>
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {filtered.map((item) => (
            <RevealItem key={item.id} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[#f0f0f0] bg-surface transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
                {/* photo placeholder */}
                <div className="relative flex aspect-[16/10] items-center justify-center bg-surface-2 text-xs uppercase tracking-widest text-muted">
                  {item.type}
                  <span className="absolute left-3 top-3 rounded-full bg-amber px-3 py-1 text-[11px] font-semibold text-ink">
                    {item.type}
                  </span>
                  <span
                    className={cn(
                      "absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      item.available ? "bg-success/15 text-success" : "bg-ink/10 text-muted"
                    )}
                  >
                    {item.available ? "Available" : "Coming Soon"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="flex items-center gap-1.5 font-display text-base font-semibold text-ink">
                    <MapPin size={16} className="text-amber-deep" /> {item.landmark}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{item.city}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted">Size</dt>
                      <dd className="font-medium text-ink">{item.size}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Daily Traffic</dt>
                      <dd className="font-medium text-ink">{item.dailyTraffic}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => setSelected(item)}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-black cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2"
                  >
                    Check Availability
                  </button>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted">
            No spaces match these filters. Try widening your search or{" "}
            <button onClick={() => setSelected(inventory[0])} className="font-medium text-ink underline cursor-pointer">
              ask us directly
            </button>
            .
          </p>
        )}
      </div>

      {/* enquiry modal */}
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
              aria-label={`Check availability — ${selected.landmark}`}
              className="w-full max-w-lg rounded-[1.5rem] bg-surface p-6 shadow-2xl md:p-8"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    Check availability
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {selected.type} · {selected.landmark}, {selected.city}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#f0f0f0] text-muted hover:text-ink cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-6">
                <LeadForm
                  subject={`Inventory enquiry — ${selected.type}, ${selected.landmark}, ${selected.city}`}
                  submitLabel="Send Enquiry"
                  fields={[
                    { name: "dates", label: "Campaign Dates", placeholder: "e.g. Aug–Oct 2026" },
                    { name: "brand", label: "Brand Name", required: true, placeholder: "Your brand" },
                    { name: "email", label: "Email", type: "email", placeholder: "you@company.com" },
                    { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "Phone" },
                  ]}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-[#f5f5f5] py-3 last:border-b-0 md:flex-row md:items-center md:gap-4">
      <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
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
        "min-h-9 cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
        active
          ? "border-amber bg-amber text-ink"
          : "border-[#f0f0f0] bg-surface text-body hover:border-ink/20 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
