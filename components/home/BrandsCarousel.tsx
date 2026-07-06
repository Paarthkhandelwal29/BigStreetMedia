"use client";

import { useMemo } from "react";
import { brands, type Brand } from "@/data/brands";
import { BrandLogo } from "@/components/brands/BrandLogo";

// Curated rows for balanced brand presentation across rows
const row1Names = [
  "Hero",
  "LG",
  "Style Baazar",
  "Adani Cement",
  "Cashify",
  "Tata Motors",
  "Extramarks",
  "Gulf Oil",
  "V-Mart",
  "L&T",
  "Reliance Digital",
  "ILBS",
  "Citykart",
  "Sensodyne"
];

const row2Names = [
  "TVS",
  "Ather",
  "Britannica Education",
  "Fenesta",
  "The Times Group",
  "Ecozen",
  "Youtag",
  "Gallantt TMT",
  "Vishal Mega Mart",
  "Trends",
  "V-Bazaar",
  "Shyam Steel",
  "Ambuja Cement",
  "Luminous"
];

function MarqueeRow({
  brandsList,
  direction,
}: {
  brandsList: Brand[];
  direction: "left" | "right";
}) {
  const marqueeItems = useMemo(() => [...brandsList, ...brandsList], [brandsList]);
  const animClass = direction === "left" ? "animate-marquee-left-new" : "animate-marquee-right-new";

  return (
    <div className="marquee-row overflow-x-hidden overflow-y-visible py-2.5 md:py-6">
      {/* 
        The parent flex wrapper holds the single scrolling container.
        Using pr-[40px] md:pr-[60px] lg:pr-[80px] on the container ensures 
        that the trailing gap after the 28th item matches the inner gaps.
        This provides a mathematically perfect loop when translating by -50%.
        Using overflow-y-visible ensures scaled logos are not clipped vertically.
      */}
      <div className="marquee-mask w-full overflow-x-hidden overflow-y-visible">
        <div className={`flex w-max shrink-0 items-center gap-[40px] md:gap-[60px] lg:gap-[80px] pr-[40px] md:pr-[60px] lg:pr-[80px] ${animClass}`}>
          {marqueeItems.map((b, i) => (
            <div
              key={`${b.name}-${i}`}
              className="flex items-center justify-center h-[50px] md:h-[62px] lg:h-[75px]"
            >
              <BrandLogo name={b.name} logo={b.logo} scale={b.scale} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandsCarousel() {
  const row1Brands = useMemo(
    () => row1Names.map((name) => brands.find((b) => b.name === name)!).filter(Boolean),
    []
  );
  
  const row2Brands = useMemo(
    () => row2Names.map((name) => brands.find((b) => b.name === name)!).filter(Boolean),
    []
  );

  return (
    <section className="border-b border-[#f0f0f0] bg-surface-2 py-6 md:py-20 select-none">
      <div className="container-bsm">
        <div className="mx-auto max-w-3xl text-center mb-8 md:mb-16">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Brands That Trust Big Street
          </h2>
          <p className="hidden md:block mt-4 text-base md:text-lg text-body/80">
            We&apos;ve partnered with leading brands across retail, FMCG, automobiles, education, finance and more.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <MarqueeRow brandsList={row1Brands} direction="right" />
        <MarqueeRow brandsList={row2Brands} direction="left" />
      </div>
    </section>
  );
}
