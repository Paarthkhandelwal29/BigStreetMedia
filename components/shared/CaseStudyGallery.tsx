"use client";

import { useState } from "react";

type CaseStudyGalleryProps = {
  brand: string;
};

export function CaseStudyGallery({ brand }: CaseStudyGalleryProps) {
  const [expanded, setExpanded] = useState(false);
  const items = Array.from({ length: 4 });
  const visibleItems = expanded ? items : items.slice(0, 2);

  return (
    <section className="border-t border-[#f0f0f0] pt-5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-deep">Project Gallery</span>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {visibleItems.map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl border border-[#f0f0f0] bg-surface-2 text-[10px] uppercase tracking-widest text-muted text-center p-2"
          >
            {brand} · {i + 1}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-ink bg-surface border border-[#e5e5e5] rounded-lg hover:bg-surface-2 transition-colors cursor-pointer"
        >
          {expanded ? "Show Less" : "View Full Gallery"}
        </button>
      </div>
    </section>
  );
}
