"use client";

import Link from "next/link";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/Section";
import { ArrowRight, X, ArrowUpRight, MegaphoneSimple, Bus, Confetti } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

type GalleryItem = {
  brand: string;
  category: string;
  city: string;
  gradient: string;
  icon: "ooh" | "transit" | "events";
  description: string;
};

const items: GalleryItem[] = [
  {
    brand: "Tata Motors",
    category: "Events",
    city: "Lucknow",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    icon: "events",
    description: "Large-format product launch with on-ground activations and brand experience zones.",
  },
  {
    brand: "Extramarks",
    category: "OOH / Hoarding",
    city: "Lucknow",
    gradient: "from-[#111111] via-[#1c1c1c] to-[#2d2a1f]",
    icon: "ooh",
    description: "High-visibility hoarding campaign across prime arterial roads and education corridors.",
  },
  {
    brand: "Cashify",
    category: "Transit / Auto Branding",
    city: "Kanpur",
    gradient: "from-[#0d2818] via-[#1a3a2a] to-[#111111]",
    icon: "transit",
    description: "Auto rickshaw wrap campaign delivering hyper-local reach across high-traffic zones.",
  },
];

const icons = {
  ooh: MegaphoneSimple,
  transit: Bus,
  events: Confetti,
};

function CampaignCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  const Icon = icons[item.icon];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative shrink-0 aspect-auto w-[250px] h-[180px] md:aspect-[4/3] md:w-full md:h-auto overflow-hidden rounded-2xl md:rounded-[1.25rem] border border-[#f0f0f0] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 cursor-pointer snap-center"
      aria-label={`View ${item.brand} campaign`}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105",
          item.gradient
        )}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber backdrop-blur-sm">
            <Icon size={20} weight="fill" />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div>
          <p className="text-lg font-semibold leading-tight text-white">{item.brand}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-amber">
            {item.category} · {item.city}
          </p>
        </div>
      </div>
    </button>
  );
}

export function CampaignGallery() {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  return (
    <section className="bg-surface">
      <div className="container-bsm py-6 md:py-16">
        <SectionHeader
          title="Campaigns we've executed across India"
          subhead="Real work. Real brands. Real cities — OOH, transit, events, and more."
        />

        <div className="mt-6 md:mt-12 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-none md:grid md:grid-cols-3 md:gap-4 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {items.map((item) => (
            <CampaignCard key={item.brand} item={item} onClick={() => setLightbox(item)} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-deep hover:text-amber transition-colors"
          >
            View All Campaigns →
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg overflow-hidden rounded-[1.5rem] bg-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={cn(
                  "relative aspect-[16/10] w-full bg-gradient-to-br",
                  lightbox.gradient
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {(() => {
                    const Icon = icons[lightbox.icon];
                    return (
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-amber backdrop-blur-sm">
                        <Icon size={32} weight="fill" />
                      </span>
                    );
                  })()}
                </div>
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div>
                  <p className="text-lg font-semibold text-white">{lightbox.brand}</p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.08em] text-amber">
                    {lightbox.category} · {lightbox.city}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    {lightbox.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  aria-label="Close lightbox"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
