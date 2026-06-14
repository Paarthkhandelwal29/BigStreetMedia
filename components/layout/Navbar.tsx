"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navLinks } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

// Routes whose top section is a LIGHT background (no dark hero). The nav uses
// dark text at the top on these; every other route leads with a dark hero.
const LIGHT_TOP_ROUTES = new Set(["/contact", "/privacy-policy", "/sitemap"]);

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Light nav text only when floating transparently over a dark hero.
  const lightText = !scrolled && !LIGHT_TOP_ROUTES.has(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4">
      <nav
        className={cn(
          "mt-4 flex w-full max-w-6xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          scrolled
            ? "border border-[#ececec] bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl"
            : "border border-transparent bg-white/0"
        )}
      >
        <Link href="/" className="flex items-center gap-2 pl-1" aria-label={`Home — Big Street Media`}>
          <Logo className="h-7 w-auto" light={lightText} />
        </Link>

        {/* desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm transition-colors duration-200",
                    lightText
                      ? active
                        ? "text-white font-medium"
                        : "text-white/70 hover:text-white"
                      : active
                        ? "text-ink font-medium"
                        : "text-body hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" size="md" className="hidden sm:inline-flex">
            Get Free Media Plan
          </ButtonLink>

          {/* hamburger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#ececec] bg-white/70 lg:hidden cursor-pointer"
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-3.5 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-5 bg-ink transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  open && "top-1.5 rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-5 bg-ink transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  open && "bottom-1.5 -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 flex flex-col bg-white/90 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="block border-b border-[#f0f0f0] py-4 font-display text-2xl text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink href="/contact" className="w-full justify-center">
                Get Free Media Plan
              </ButtonLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
