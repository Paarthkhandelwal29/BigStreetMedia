"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { services } from "@/data/services";
import { icons } from "@/lib/icons";

const ease = [0.16, 1, 0.3, 1] as const;

function HeroCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(() => (reduce ? value : 0));

  useEffect(() => {
    if (reduce) return;

    const duration = 1800;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 600);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, reduce]);

  return (
    <span className="text-lg font-bold leading-none text-white tabular-nums sm:text-xl md:text-2xl">
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const stats = [
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 400, suffix: "+", label: "Cities Covered" },
  { value: 1000, suffix: "+", label: "Campaigns" },
  { value: 100, suffix: "+", label: "Brands Served" },
];

export function HeroSection() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.8, delay, ease },
        };

  return (
    <section className="relative flex min-h-[55dvh] md:min-h-[100dvh] flex-col items-center justify-between overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-ink">
        <Image
          src={`https://ik.imagekit.io/${"Paarthkhandelwal29"}/bigstreetmedia/ChatGPT%20Image%20Jul%208,%202026,%2011_36_04%20PM.png`}
          alt="Big Street Media Billboard Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        {/* Radial dark vignette overlay centered behind the text to enhance contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,17,17,0.88)_0%,rgba(17,17,17,0.55)_60%,rgba(17,17,17,0.8)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      <div className="container-bsm relative z-10 flex flex-1 flex-col items-center justify-center pt-16 md:pt-28 pb-4 md:pb-6 text-center">
        <span
          className="relative z-10 eyebrow border-white/15 bg-white/5 text-white/80"
        >
          Established 2004 · PAN India
        </span>

        <h1
          className="relative z-10 mt-3 md:mt-5 max-w-4xl text-balance text-[32px] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] md:leading-[1.05] text-white"
        >
          <span className="text-amber">BIG STREET.</span> Bigger Impact. PAN-India.
        </h1>

        <p
          className="relative z-10 mt-3 md:mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-white/70 sm:text-base md:text-lg"
        >
          Get a rough sense of what your budget can achieve across India.
        </p>

        <div
          className="relative z-10 mt-5 md:mt-8 flex flex-col gap-2 sm:gap-3 sm:flex-row sm:justify-center w-full max-w-[280px] sm:max-w-none"
        >
          <ButtonLink href="/services">Explore Services</ButtonLink>
          <ButtonLink href="/contact" variant="ghost-light">
            Get Free Media Plan
          </ButtonLink>
        </div>

        {/* Compact statistics trust strip for mobile */}
        <div
          className="flex md:hidden items-center justify-center flex-wrap gap-x-2.5 gap-y-1 text-amber/90 font-medium text-[13px] tracking-wide mt-6 border-t border-white/10 pt-4 w-full max-w-[280px]"
        >
          <span>20+ Years</span>
          <span className="text-white/20">•</span>
          <span>1000+ Campaigns</span>
          <span className="text-white/20">•</span>
          <span>400+ Cities</span>
          <span className="text-white/20">•</span>
          <span>100+ Brands</span>
        </div>
      </div>

      <div
        className="container-bsm relative z-10 pb-6 md:pb-12 w-full hidden md:block"
      >
        <div className="section-divider mb-3 md:mb-5 opacity-30" aria-hidden />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-dark flex flex-col items-center justify-center px-2 py-2 sm:px-4 sm:py-4 h-[68px] sm:h-auto"
            >
              <HeroCounter value={stat.value} suffix={stat.suffix} />
              <span className="mt-1 text-center text-[8px] sm:text-[10px] md:text-[11px] font-medium uppercase tracking-[0.08em] text-amber/90 leading-tight">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Full-width Services Bar at the absolute bottom of the hero section */}
      <div
        className="w-full bg-black/60 backdrop-blur-md border-t border-white/10 py-3.5 relative z-10 mt-auto"
      >
        <div className="container-bsm flex items-center justify-start xl:justify-center gap-x-7 gap-y-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {services
            .filter((s) => s.slug !== "radio" && s.slug !== "digital")
            .map((s) => {
              const Icon = icons[s.icon];
              const displayTitle =
                s.slug === "ooh-media"
                  ? "Outdoor"
                  : s.slug === "influencer"
                  ? "Influencer"
                  : s.slug === "cinema"
                  ? "Cinema"
                  : s.title;
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="flex items-center gap-2 shrink-0 text-white/80 hover:text-amber transition-colors text-xs font-semibold tracking-wider uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber focus-visible:ring-offset-1 rounded px-1"
                >
                  {Icon && <Icon size={14} className="text-amber" />}
                  <span>{displayTitle}</span>
                </Link>
              );
            })}
        </div>
      </div>

      {!reduce && (
        <motion.div
          className="absolute bottom-[4.5rem] left-1/2 z-10 hidden -translate-x-1/2 text-white/30 sm:block"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <CaretDown size={18} />
        </motion.div>
      )}
    </section>
  );
}
