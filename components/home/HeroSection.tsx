"use client";

import { motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24, filter: "blur(8px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.9, delay, ease },
        };

  return (
    <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
      {/* Placeholder hero visual — swap for looping campaign reel <video> later.
          Layered: ink base + subtle amber glow + soft grid, with dark overlay. */}
      <div className="absolute inset-0 bg-ink" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.5]"
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
          maskImage: "radial-gradient(circle at 50% 40%, black, transparent 75%)",
        }}
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden />

      <div className="container-bsm relative z-10 flex flex-col items-center pt-24 text-center">
        <motion.span
          {...rise(0)}
          className="eyebrow border-white/15 bg-white/5 text-white/80"
        >
          Established 2004 · PAN India
        </motion.span>

        <motion.h1
          {...rise(0.08)}
          className="mt-6 max-w-4xl text-balance text-5xl font-extrabold leading-[1.02] text-white sm:text-6xl md:text-7xl"
        >
          Creating Visibility.
          <br />
          Building <span className="text-amber">Brands.</span>
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/70 md:text-lg"
        >
          From a single hoarding to a 400-city campaign — Big Street Media
          executes advertising that reaches your customer wherever they live,
          work, and travel.
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/services">Explore Services</ButtonLink>
          <ButtonLink href="/contact" variant="ghost-light">
            Get Free Media Plan
          </ButtonLink>
        </motion.div>
      </div>

      {/* scroll indicator */}
      {!reduce && (
        <motion.div
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <CaretDown size={22} />
        </motion.div>
      )}
    </section>
  );
}
