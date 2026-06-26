"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  /** e.g. "400+", "1000+", "20+", or non-numeric "PAN India" */
  value: string;
  className?: string;
  durationMs?: number;
};

/**
 * Counts up from 0 to the numeric portion of `value` once it enters view.
 * Preserves any prefix/suffix (₹, +, L, Cr). Non-numeric values render as-is.
 */
export function AnimatedCounter({
  value,
  className,
  durationMs = 1600,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const match = value.match(/([^\d]*)(\d[\d,]*)(.*)/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2].replace(/,/g, ""), 10) : NaN;
  const suffix = match?.[3] ?? "";

  const [display, setDisplay] = useState(() => {
    if (Number.isNaN(target)) return value;
    if (reduce && inView)
      return `${prefix}${target.toLocaleString("en-IN")}${suffix}`;
    return `${prefix}0${suffix}`;
  });

  useEffect(() => {
    if (Number.isNaN(target) || !inView || reduce) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(eased * target);
      setDisplay(`${prefix}${current.toLocaleString("en-IN")}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, prefix, suffix, value, durationMs, reduce]);

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      {display}
    </span>
  );
}
