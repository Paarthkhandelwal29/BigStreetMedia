import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({
  crumbs,
  className,
  dark = false,
}: {
  crumbs: Crumb[];
  className?: string;
  dark?: boolean;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1.5 text-[13px]", className)}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span
                className={dark ? "text-white/30" : "text-muted/60"}
                aria-hidden
              >
                ›
              </span>
            )}
            {isLast || !crumb.href ? (
              <span
                className={dark ? "text-white/70" : "text-ink"}
                aria-current={isLast ? "page" : undefined}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className={
                  dark
                    ? "text-white/50 transition-colors duration-200 hover:text-amber"
                    : "text-muted transition-colors duration-200 hover:text-amber"
                }
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
