"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// Slow-drifting amber light for dark sections. Pure ambience: transforms only,
// fully removed for reduced-motion users.
export function AuroraBackdrop({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <motion.div
        className="absolute -left-[15%] top-[-25%] h-[34rem] w-[34rem] rounded-full bg-amber/20 blur-[130px]"
        animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[15%] bottom-[-25%] h-[30rem] w-[30rem] rounded-full bg-amber-deep/15 blur-[130px]"
        animate={{ x: [0, -70, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
