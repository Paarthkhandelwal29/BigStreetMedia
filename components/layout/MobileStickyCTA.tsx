"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-[#f0f0f0] bg-white px-4 py-3 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex gap-3">
        <a
          href={`tel:${site.phones[0].replace(/[^+\d]/g, "")}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-ink/5 active:scale-[0.98]"
          aria-label="Call Big Street Media"
        >
          <Phone size={18} />
          Call Now
        </a>
        <Link
          href="/contact"
          className="flex flex-1 items-center justify-center rounded-full bg-amber py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-amber-deep active:scale-[0.98]"
        >
          Get Free Plan →
        </Link>
      </div>
    </div>
  );
}
