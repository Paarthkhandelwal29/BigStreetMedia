"use client";

import { useState } from "react";
import type { PortfolioWorkRecord } from "@/lib/cms/types";
import {
  X,
  CaretLeft,
  CaretRight,
  PlayCircle,
  ImageSquare,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type CaseStudyGalleryProps = {
  brand: string;
  photos: PortfolioWorkRecord[];
  isMobile?: boolean;
};

export function CaseStudyGallery({ brand, photos, isMobile = false }: CaseStudyGalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  if (photos.length === 0) return null;

  const n = photos.length;
  
  // Dynamic columns for desktop and mobile
  const gridCols =
    n === 1
      ? "grid-cols-1"
      : n === 2
      ? "grid-cols-2"
      : n === 3
      ? "grid-cols-3"
      : isMobile
      ? "grid-cols-2"
      : "grid-cols-2 md:grid-cols-4";

  // Aspect ratio classes depending on image count
  const aspectClass =
    n === 1
      ? "aspect-[21/9] sm:aspect-[16/7]"
      : n === 2
      ? "aspect-[16/10]"
      : n === 3
      ? "aspect-[4/3] sm:aspect-square"
      : "aspect-square";

  // Handle mobile collapsing if there are 4 or more photos
  const showViewMoreButton = isMobile && n > 2;
  const visiblePhotos = showViewMoreButton && !expanded ? photos.slice(0, 2) : photos;

  const current = lightboxIndex !== null ? photos[lightboxIndex] : null;

  const move = (dir: 1 | -1) => {
    if (lightboxIndex === null || photos.length === 0) return;
    const next = (lightboxIndex + dir + photos.length) % photos.length;
    setLightboxIndex(next);
  };

  return (
    <section className={cn("border-t border-[#f0f0f0] pt-5", !isMobile && "container-bsm py-20 border-t-0")}>
      {isMobile ? (
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-deep">
          Project Gallery
        </span>
      ) : (
        <div className="mb-10 text-left">
          <span className="eyebrow">Campaign Gallery</span>
          <h2 className="mt-3 text-3xl font-extrabold text-ink md:text-4xl">On the ground</h2>
          <p className="mt-2 text-sm text-muted">
            Real campaign photography captured during execution.
          </p>
        </div>
      )}

      <div className={cn("mt-3 grid gap-3 md:gap-4", gridCols)}>
        {visiblePhotos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="group relative block w-full overflow-hidden rounded-xl md:rounded-[1.25rem] border border-[#f0f0f0] bg-surface-2 text-left transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber w-full"
          >
            <div className={cn("relative w-full overflow-hidden", aspectClass)}>
              {photo.mediaType === "image" ? (
                <img
                  src={photo.mediaUrl}
                  alt={`${photo.brandName} - ${photo.format}`}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <>
                  <video
                    src={photo.mediaUrl}
                    className="h-full w-full bg-black object-cover"
                    muted
                  />
                  <div className="pointer-events-none absolute inset-0 bg-ink/20" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/92 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink shadow-sm">
                      <PlayCircle size={12} weight="fill" />
                      Video
                    </span>
                  </div>
                </>
              )}
              {n >= 4 && (
                <span className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.14em] text-ink">
                  {photo.format}
                </span>
              )}
            </div>
            
            {/* Show label details only if we have larger sizes (less than 4 items) */}
            {n < 4 && (
              <span className="block p-3 md:p-4 bg-surface border-t border-[#f8f8f8]">
                <span className="flex items-center justify-between gap-3">
                  <span className="block font-display text-xs md:text-sm font-bold text-ink">
                    {photo.brandName}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#ececec] px-2 py-0.5 text-[8px] md:text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {photo.mediaType === "video" ? (
                      <PlayCircle size={10} weight="fill" />
                    ) : (
                      <ImageSquare size={10} weight="fill" />
                    )}
                    {photo.mediaType}
                  </span>
                </span>
                <span className="mt-1 block text-[10px] md:text-xs text-muted">
                  {photo.format} · {photo.city}
                </span>
              </span>
            )}
          </button>
        ))}
      </div>

      {showViewMoreButton && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-ink bg-surface border border-[#e5e5e5] rounded-lg hover:bg-surface-2 transition-colors cursor-pointer"
          >
            {expanded ? "Show Less" : "View Full Gallery"}
          </button>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
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
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    move(-1);
                  }}
                  aria-label="Previous"
                  className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
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
                  className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
                >
                  <CaretRight size={20} />
                </button>
              </>
            )}

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
                    className="max-h-[70vh] md:max-h-[75vh] w-full object-contain mx-auto"
                  />
                ) : (
                  <video
                    src={current.mediaUrl}
                    controls
                    className="max-h-[70vh] md:max-h-[75vh] w-full bg-black object-contain mx-auto"
                  />
                )}
              </div>
              <figcaption className="mt-4 text-center text-white">
                <span className="font-display text-base md:text-lg font-semibold block">
                  {current.brandName}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  {current.mediaType === "video" ? (
                    <PlayCircle size={14} weight="fill" />
                  ) : (
                    <ImageSquare size={14} weight="fill" />
                  )}
                  {current.mediaType}
                </span>
                <span className="mt-2 block text-xs md:text-sm text-white/60">
                  {current.category} · {current.format} · {current.city}
                </span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
