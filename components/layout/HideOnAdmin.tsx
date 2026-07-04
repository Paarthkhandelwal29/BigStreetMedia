"use client";

import { usePathname } from "next/navigation";

// The /admin area has its own shell (components/admin/AdminNav). Hide the
// public marketing chrome (navbar, footer, WhatsApp, sticky CTA) there so the
// CMS reads as a tool, not a landing page. Children render as a server-rendered
// payload and are simply not mounted on admin routes.
export function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
