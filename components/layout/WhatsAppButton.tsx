"use client";

import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { whatsappLink } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-5 z-40 flex items-center gap-3 bottom-[85px] md:bottom-5"
    >
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full border border-[#ececec] bg-white px-3 py-1.5 text-sm text-ink shadow-[0_8px_30px_rgba(0,0,0,0.08)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
        Chat with us on WhatsApp
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-active:scale-95">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.5s]" />
        <WhatsappLogo size={28} weight="fill" className="relative" />
      </span>
    </a>
  );
}
