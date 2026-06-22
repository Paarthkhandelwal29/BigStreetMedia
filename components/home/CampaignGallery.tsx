"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/Section";
import { ArrowRight, X, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "motion/react";

type GalleryItem = {
  src: string;
  brand: string;
  category: string;
  city: string;
  alt: string;
};

const items: GalleryItem[] = [
  {
    src: "/images/tata_event.png",
    brand: "Tata Motors",
    category: "Events",
    city: "Lucknow",
    alt: "Tata Motors event activation — Lucknow",
  },
  {
    src: "/images/ooh_hoarding.png",
    brand: "Extramarks",
    category: "OOH / Hoarding",
    city: "Lucknow",
    alt: "Extramarks OOH hoarding campaign — Lucknow",
  },
  {
    src: "/images/transit_wrap.png",
    brand: "Cashify",
    category: "Transit / Auto Branding",
    city: "Kanpur",
    alt: "Cashify auto rickshaw transit branding — Kanpur",
  },
];

export function CampaignGallery() {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  return (
    <section className="bg-surface">
      <div className="container-bsm py-24">
        <SectionHeader
          eyebrow="Campaign Gallery"
          title="Campaigns We've Executed Across India"
          subhead="Real work. Real brands. Real cities."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item) => (
            <button
              key={item.brand}
              type="button"
              onClick={() => setLightbox(item)}
              className="group relative aspect-video w-full overflow-hidden rounded-[1.25rem] border border-[#f0f0f0] bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 cursor-pointer"
              aria-label={`View ${item.brand} campaign`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-left text-base font-semibold leading-tight text-white">
                  {item.brand}
                </p>
                <p className="mt-1 text-left text-xs font-medium uppercase tracking-[0.08em] text-amber">
                  {item.category} · {item.city}
                </p>
              </div>
              <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowUpRight size={16} />
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors duration-200 hover:text-amber"
          >
            See All Campaigns
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
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
              className="relative w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
              <div className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="text-lg font-semibold text-white">{lightbox.brand}</p>
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.08em] text-amber">
                    {lightbox.category} · {lightbox.city}
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
