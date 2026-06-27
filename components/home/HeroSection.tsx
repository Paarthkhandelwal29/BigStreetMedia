"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

const ease = [0.16, 1, 0.3, 1] as const;

function HeroCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
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
    }, 700);
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

// Floating amber motes — deterministic positions (no Math.random for SSR).
const motes = [
  { left: "12%", top: "30%", size: 6, delay: 0, dur: 9 },
  { left: "82%", top: "24%", size: 4, delay: 1.2, dur: 11 },
  { left: "68%", top: "62%", size: 5, delay: 0.6, dur: 10 },
  { left: "24%", top: "70%", size: 4, delay: 1.8, dur: 12 },
  { left: "46%", top: "18%", size: 3, delay: 2.4, dur: 8 },
];

export function HeroSection() {
  const reduce = useReducedMotion();

  // Per-line mask reveal: direct initial/animate so the clip wrappers don't
  // need variant propagation.
  const line = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { y: "115%" },
          animate: { y: 0 },
          transition: { duration: 0.95, ease, delay },
        };
  const fade = (delay: number): Variants =>
    reduce
      ? { hidden: {}, show: {} }
      : {
          hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
          show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, delay, ease },
          },
        };

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-between overflow-hidden bg-ink">
      {/* drifting amber aurora */}
      {!reduce && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-[-10%] h-[36rem] w-[36rem] rounded-full bg-amber/25 blur-[120px]"
            animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-24 bottom-[-12%] h-[32rem] w-[32rem] rounded-full bg-amber-deep/15 blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* static glow + grid + vignette */}
      <div
        className="absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 50% 0%, rgba(255,193,7,0.18), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 50% 40%, black, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55"
        aria-hidden
      />

      {/* floating motes */}
      {!reduce &&
        motes.map((mote, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-amber/60"
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
            }}
            animate={{ y: [0, -22, 0], opacity: [0.15, 0.7, 0.15] }}
            transition={{
              duration: mote.dur,
              delay: mote.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      <div className="container-bsm relative z-10 flex flex-1 flex-col items-center justify-center pt-28 pb-6 text-center">
        <motion.span
          variants={fade(0)}
          initial="hidden"
          animate="show"
          className="eyebrow border-amber/25 bg-amber/10 text-amber"
        >
          Established 2004 · PAN India
        </motion.span>

        {/* Oversized headline, revealed line by line behind a mask */}
        <h1 className="mt-6 max-w-5xl text-balance text-5xl font-extrabold leading-[0.98] tracking-[-0.02em] text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span
              className="block"
              {...line(0.25)}
            >
              Creating Visibility.
            </motion.span>
          </span>
          <span className="relative block overflow-hidden pb-[0.12em]">
            <motion.span className="block" {...line(0.4)}>
              Building{" "}
              <span className="relative inline-block text-amber">
                Brands.
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-full bg-amber/25 blur-2xl"
                    animate={{ opacity: [0.4, 0.85, 0.4] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
                  />
                )}
              </span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          variants={fade(0.5)}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base md:text-lg"
        >
          From a single hoarding to a 400-city campaign, Big Street Media
          executes advertising that reaches your customer wherever they live,
          work, and travel.
        </motion.p>

        <motion.div
          variants={fade(0.62)}
          initial="hidden"
          animate="show"
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <ButtonLink href="/services">Explore Services</ButtonLink>
          <ButtonLink href="/contact" variant="ghost-light">
            Get Free Media Plan
          </ButtonLink>
        </motion.div>
      </div>

      <motion.div
        variants={fade(0.72)}
        initial="hidden"
        animate="show"
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
