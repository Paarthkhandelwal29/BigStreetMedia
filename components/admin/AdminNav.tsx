"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/case-studies", label: "Case Studies" },
  { href: "/admin/service-media", label: "Service Media" },
  { href: "/admin/inventory", label: "Inventory" },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

// Active state uses the amber underline — the same "amber = active" rule the
// public nav follows, kept consistent in the CMS.
function tab(active: boolean) {
  return cn(
    "relative inline-flex h-16 items-center text-sm font-medium transition-colors",
    "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-amber after:transition-transform after:duration-200 after:ease-out",
    active
      ? "text-ink after:scale-x-100"
      : "text-muted hover:text-ink after:scale-x-0 hover:after:scale-x-100",
  );
}

export function AdminNav() {
  const pathname = usePathname() ?? "";
  const isLogin = pathname === "/admin/login";

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-8 px-5 md:px-8">
        <div className="flex items-center gap-8">
          <Link
            href={isLogin ? "/" : "/admin"}
            className="flex items-center gap-2.5"
          >
            <Logo className="h-7 w-auto" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              CMS
            </span>
          </Link>

          {!isLogin && (
            <nav className="hidden items-center gap-6 sm:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={tab(isActive(pathname, item.href))}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="hidden text-muted transition-colors hover:text-ink sm:inline"
          >
            View site
          </Link>
          {!isLogin && (
            <Link
              href="/admin/logout"
              className="font-medium text-ink transition-colors hover:text-amber-deep"
            >
              Log out
            </Link>
          )}
        </div>
      </div>

      {!isLogin && (
        <nav className="flex items-center gap-6 overflow-x-auto border-t border-hairline px-5 sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative inline-flex h-12 items-center whitespace-nowrap text-sm font-medium",
                "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-amber after:transition-transform",
                isActive(pathname, item.href)
                  ? "text-ink after:scale-x-100"
                  : "text-muted after:scale-x-0",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
