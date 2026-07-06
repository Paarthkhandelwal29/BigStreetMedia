"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";
import { services } from "@/data/services";
import {
  CaretDown,
  X,
  House,
  List,
  Database,
  Images,
  ChartBar,
  Info,
  PhoneCall,
  MagnifyingGlass
} from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

const LIGHT_TOP_ROUTES = new Set(["/contact", "/privacy-policy", "/sitemap"]);
const servicePortfolioFilters: Record<string, string> = {
  "ooh-media": "OOH",
  "transit-media": "Transit",
  "btl-activations": "Events",
  "retail-branding": "Store Launch",
  "events-launches": "Events",
  exhibitions: "Exhibitions",
};

function serviceHref(slug: string) {
  const category = servicePortfolioFilters[slug];
  return category ? `/portfolio?category=${encodeURIComponent(category)}` : `/services/${slug}`;
}

// Shared link class — uses relative + after pseudo for underline (no pb that shifts baseline)
function navLinkClass(active: boolean, light: boolean) {
  return cn(
    "relative inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200",
    "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:rounded-full after:transition-transform after:duration-200",
    active
      ? "font-semibold after:bg-amber after:scale-x-100"
      : "after:bg-amber after:scale-x-0 hover:after:scale-x-100",
    light
      ? active ? "text-white" : "text-white/70 hover:text-white"
      : active ? "text-ink" : "text-body hover:text-ink"
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<"services" | null>(null);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const lightText = !scrolled && !LIGHT_TOP_ROUTES.has(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const servicesActive = pathname.startsWith("/services");
  const portfolioActive = pathname === "/portfolio";
  const caseStudiesActive = pathname.startsWith("/case-studies");
  const mediaInventoryActive = pathname === "/media-inventory";
  const aboutActive = pathname === "/about";

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="container-bsm pt-2 sm:pt-4">
        <nav
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2.5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            scrolled
              ? "border border-[#ececec] bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl"
              : "border border-transparent bg-white/0"
          )}
        >
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center pl-1" aria-label="Home — Big Street Media">
          <Logo className="h-8 w-auto sm:h-9" light={lightText} />
        </Link>

        {/* Desktop nav links — all in one flex row, vertically centred */}
        <ul className="hidden items-center gap-7 lg:flex">

          {/* Services */}
          <li
            className="relative"
            onMouseEnter={() => setHoveredDropdown("services")}
            onMouseLeave={() => setHoveredDropdown(null)}
          >
            <Link href="/#services" className={navLinkClass(servicesActive, lightText)}>
              Services <CaretDown size={13} />
            </Link>
            <AnimatePresence>
              {hoveredDropdown === "services" && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-1/2 top-full mt-3 w-[440px] -translate-x-1/2 rounded-2xl border border-[#ececec] bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] z-50"
                >
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={serviceHref(s.slug)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-body transition-colors hover:bg-surface-2 hover:text-ink"
                      >
                        {s.title}
                      </Link>
                    ))}
                    <div className="col-span-2 mt-1 border-t border-[#f0f0f0] pt-2">
                      <Link
                        href="/media-inventory"
                        className="flex items-center justify-between rounded-lg bg-amber/10 px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-amber/20"
                      >
                        Media Inventory →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>

          {/* Media Inventory */}
          <li>
            <Link href="/media-inventory" className={navLinkClass(mediaInventoryActive, lightText)}>
              Media Inventory
            </Link>
          </li>

          {/* Portfolio */}
          <li>
            <Link href="/portfolio" className={navLinkClass(portfolioActive, lightText)}>
              Portfolio
            </Link>
          </li>

          {/* Case Studies */}
          <li>
            <Link href="/case-studies" className={navLinkClass(caseStudiesActive, lightText)}>
              Case Studies
            </Link>
          </li>

          {/* About */}
          <li>
            <Link href="/about" className={navLinkClass(aboutActive, lightText)}>
              About
            </Link>
          </li>
        </ul>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-2">
          <ButtonLink
            href="/contact"
            size="md"
            withIcon={false}
            className="hidden sm:inline-flex !rounded-[6px] !font-semibold !px-5 !py-2.5 !bg-amber !text-ink hover:!bg-amber-deep border-none shadow-none active:scale-[0.98]"
          >
            Get Free Media Plan
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-full border lg:hidden cursor-pointer transition-colors",
              lightText
                ? "border-white/20 bg-white/10 backdrop-blur-sm"
                : "border-[#ececec] bg-white/70"
            )}
          >
            <span className="sr-only">Menu</span>
            <span className="relative block h-3.5 w-5">
              <span className={cn("absolute left-0 top-0 h-0.5 w-5 transition-all duration-300", lightText ? "bg-white" : "bg-ink", open && "top-1.5 rotate-45")} />
              <span className={cn("absolute bottom-0 left-0 h-0.5 w-5 transition-all duration-300", lightText ? "bg-white" : "bg-ink", open && "bottom-1.5 -rotate-45")} />
            </span>
          </button>
        </div>
      </nav>
      </div>

      {/* Mobile overlay (Sidebar Navigation Drawer) */}
      <AnimatePresence>
        {open && (
          <>
            {/* Semi-transparent Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-40 rounded-l-[1.75rem] lg:hidden"
            >
              <div className="flex flex-col">
                {/* Header: Logo + Close button */}
                <div className="flex items-center justify-between">
                  <Logo className="h-7 w-auto" />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f9fa] text-body hover:text-ink transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X size={16} />
                  </button>
                </div>


                {/* Navigation Links list */}
                <nav className="mt-5 flex flex-col gap-1">
                  {[
                    { label: "Home", href: "/", icon: House },
                    { label: "Services", href: "/#services", icon: List },
                    { label: "Media Inventory", href: "/media-inventory", icon: Database },
                    { label: "Portfolio", href: "/portfolio", icon: Images },
                    { label: "Case Studies", href: "/case-studies", icon: ChartBar },
                    { label: "About Us", href: "/about", icon: Info },
                  ].map((link) => {
                    const Icon = link.icon;
                    // Active check:
                    const active =
                      pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(link.href));

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-amber/10 text-amber-deep font-semibold"
                            : "text-body hover:bg-surface hover:text-ink"
                        )}
                      >
                        <Icon size={18} className={active ? "text-amber-deep" : "text-body/70"} />
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Promo Upgrade Box */}
                <div className="bg-amber/5 border border-amber/15 rounded-2xl p-4 text-center mt-5">
                  <h4 className="font-bold text-xs text-ink leading-tight">Need a Custom Plan? 🚀</h4>
                  <p className="text-[10px] text-body mt-1.5 leading-normal">
                    Get a free media plan and unlock the best advertising rates across India.
                  </p>
                  <button
                    onClick={() => {
                      setOpen(false);
                      window.location.href = "/contact";
                    }}
                    className="mt-3 w-full bg-amber text-ink hover:bg-amber-deep py-2 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Get Free Plan
                  </button>
                </div>
              </div>

              {/* Bottom Utilities: Help & Contact */}
              <div className="flex flex-col gap-2 border-t border-[#f0f0f0] pt-4 mt-6">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-xs font-medium text-body hover:text-ink transition-colors"
                >
                  <Info size={16} className="text-body/60" />
                  Help & Information
                </Link>
                <a
                  href={`tel:${site.phones[0]}`}
                  className="flex items-center gap-3 py-1.5 px-2 rounded-lg text-xs font-medium text-body hover:text-ink transition-colors"
                >
                  <PhoneCall size={16} className="text-body/60" />
                  Call Support: {site.phones[0]}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
