"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

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
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-between overflow-hidden">
      <div className="absolute inset-0 bg-ink" aria-hidden />
      <div
        className="absolute inset-0 opacity-50"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 0%, rgba(255,193,7,0.22), transparent 70%), radial-gradient(50% 50% at 85% 90%, rgba(255,179,0,0.12), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(circle at 50% 40%, black, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50"
        aria-hidden
      />

      <div className="container-bsm relative z-10 flex flex-1 flex-col items-center justify-center pt-28 pb-6 text-center">
        <motion.span
          {...rise(0)}
          className="eyebrow border-white/15 bg-white/5 text-white/80"
        >
          Established 2004 · PAN India
        </motion.span>

        <motion.h1
          {...rise(0.08)}
          className="mt-5 max-w-4xl text-balance text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Creating Visibility.
          <br />
          Building <span className="text-amber">Brands.</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base md:text-lg"
        >
          From a single hoarding to a 400-city campaign — Big Street Media
          executes advertising that reaches your customer wherever they live,
          work, and travel.
        </motion.p>

        <motion.div
          {...rise(0.24)}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <ButtonLink href="/services">Explore Services</ButtonLink>
          <ButtonLink href="/contact" variant="ghost-light">
            Get Free Media Plan
          </ButtonLink>
        </motion.div>
      </div>

      <motion.div
        {...rise(0.32)}
        className="container-bsm relative z-10 pb-10 md:pb-12"
      >
        <div className="section-divider mb-5 opacity-30" aria-hidden />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-dark flex flex-col items-center justify-center px-3 py-3.5 sm:px-4 sm:py-4"
            >
              <HeroCounter value={stat.value} suffix={stat.suffix} />
              <span className="mt-1.5 text-center text-[10px] font-medium uppercase tracking-[0.1em] text-amber/90 sm:text-[11px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

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
