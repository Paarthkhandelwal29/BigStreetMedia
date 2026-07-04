"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// Brand intro: an ink screen with the logo and a light sweep (shine) that
// dissolves to reveal the site. Shows ONCE per browser session (sessionStorage)
// so it doesn't replay on every reload or navigation. Never on /admin; skipped
// for reduced motion.
const SESSION_KEY = "bsm-intro-shown";

const HOLD_MS = 2600;
const EASE = [0.16, 1, 0.3, 1] as const;
const LOGO = "/logo-light.png";

export function IntroCurtain() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isHome = pathname === "/";

  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return true;
    if (window.location.pathname !== "/") return false;

    try {
      return !window.sessionStorage.getItem(SESSION_KEY);
    } catch {
      return true;
    }
  });

  const shouldShow = isHome && !reduceMotion && show;

  useEffect(() => {
    if (!shouldShow) return;

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore (private mode); intro simply replays next session
    }

    const timer = setTimeout(() => setShow(false), HOLD_MS);
    return () => clearTimeout(timer);
  }, [shouldShow]);

  // Lock scroll while the curtain is up.
  useEffect(() => {
    if (!shouldShow) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [shouldShow]);

  if (!isHome || !shouldShow) return null;

  return (
    <AnimatePresence>
      {shouldShow ? (
        <motion.div
          key="intro"
          aria-hidden
          onClick={() => setShow(false)}
          className="fixed inset-0 z-[120] flex cursor-pointer items-center justify-center overflow-hidden bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {/* soft amber glow behind the mark */}
          <motion.div
            className="pointer-events-none absolute h-[40rem] w-[40rem] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,193,7,0.16), transparent 60%)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
          />

          <motion.div
            className="relative flex flex-col items-center gap-5"
            initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{
              opacity: 0,
              scale: 1.08,
              transition: { duration: 0.55, ease: EASE },
            }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="relative inline-block">
              <Image
                src={LOGO}
                alt="Big Street Media"
                width={300}
                height={100}
                priority
                className="h-14 w-auto md:h-20"
              />

              {/* shine: a bright band swept across, clipped to the logo shape */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  WebkitMaskImage: `url(${LOGO})`,
                  maskImage: `url(${LOGO})`,
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                }}
              >
                <motion.div
                  className="absolute inset-y-0 w-1/2 -skew-x-12"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 45%, rgba(255,193,7,0.85) 60%, transparent)",
                  }}
                  initial={{ x: "-220%" }}
                  animate={{ x: "320%" }}
                  transition={{ duration: 1.15, ease: EASE, delay: 0.55 }}
                />
              </div>
            </div>

            {/* base accent line, draws in under the mark */}
            <motion.span
              className="block h-0.5 w-20 origin-center rounded-full bg-amber"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
