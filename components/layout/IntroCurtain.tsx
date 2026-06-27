"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// One-time brand intro: an ink curtain with the logo that lifts to reveal the
// site. Shows once per browser session (not on every navigation), never on the
// admin CMS, and is skipped entirely for reduced-motion users.
const SESSION_KEY = "bsm-intro-shown";
const HOLD_MS = 1500;
const EASE = [0.16, 1, 0.3, 1] as const;

export function IntroCurtain() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  // Render visible on first paint for public pages so the site never flashes
  // before the curtain. Effects below dismiss it when it shouldn't run.
  const [show, setShow] = useState(!isAdmin);

  useEffect(() => {
    if (isAdmin || reduceMotion) {
      setShow(false);
      return;
    }
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(SESSION_KEY));
    } catch {
      seen = false;
    }
    if (seen) {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore (private mode); intro will simply replay next load
    }
    const timer = setTimeout(() => setShow(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, [isAdmin, reduceMotion]);

  // Lock scroll while the curtain is up.
  useEffect(() => {
    if (!show) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [show]);

  if (isAdmin) return null;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="intro"
          aria-hidden
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Image
              src="/logo-light.png"
              alt="Big Street Media"
              width={240}
              height={80}
              priority
              className="h-12 w-auto md:h-16"
            />
            <motion.span
              className="block h-0.5 w-24 origin-left rounded-full bg-amber"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.2 }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
