import { Breadcrumbs, type Crumb } from "@/components/shared/Breadcrumbs";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatChip = { value: string; label: string };

/**
 * Inner-page hero — two-column layout on md+:
 * Left:  breadcrumbs, eyebrow, headline, subhead
 * Right: stat chips grid (service pages) OR sideContent (industry / other pages)
 *
 * `children` is no longer used — pass a button via `sideContent` to place it on the right.
 */
export function PageHero({
  eyebrow,
  title,
  subhead,
  align = "left",
  breadcrumbs,
  stats,
  sideContent,
  // legacy props ignored silently so existing call-sites don't break
  children: _children,
  compact: _compact,
}: {
  eyebrow?: string;
  title: ReactNode;
  subhead?: string;
  /** @deprecated use sideContent instead */
  children?: ReactNode;
  align?: "left" | "center";
  breadcrumbs?: Crumb[];
  stats?: StatChip[];
  /** Rendered on the right column, vertically centred alongside the headline */
  sideContent?: ReactNode;
  /** @deprecated no longer used */
  compact?: boolean;
}) {
  const hasRight = (stats && stats.length > 0 && align !== "center") || !!sideContent;

  return (
    <section className="relative overflow-hidden bg-ink">
      {/* Amber radial glow */}
      <div
        className="absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 80% at 80% 50%, rgba(255,193,7,0.12), transparent 70%), radial-gradient(40% 60% at 5% 0%, rgba(255,193,7,0.14), transparent 60%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container-bsm relative z-10 pb-6 pt-20">
        {/* Breadcrumbs — full width */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs crumbs={breadcrumbs} dark className="mb-4" />
        )}

        {/* Two-column when there's right-side content */}
        <div
          className={cn(
            "flex flex-col gap-6",
            hasRight && "md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-10"
          )}
        >
          {/* Left — text content */}
          <div className={cn("flex flex-col gap-3", align === "center" && "items-center text-center")}>
            {eyebrow && (
              <span className="inline-flex w-fit items-center rounded-full border border-amber/40 bg-amber/10 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber">
                {eyebrow}
              </span>
            )}

            <h1 className="max-w-2xl text-balance text-2xl font-extrabold leading-[1.1] text-white md:text-3xl lg:text-[2.5rem]">
              {title}
            </h1>

            {subhead && (
              <p className={cn("max-w-xl text-sm leading-relaxed text-white/60", align === "center" && "mx-auto")}>
                {subhead}
              </p>
            )}
          </div>

          {/* Right — stat chips OR sideContent */}
          {hasRight && (
            <div className="flex items-center justify-start md:justify-end">
              {sideContent ? (
                sideContent
              ) : (
                /* Stat chips grid (service pages) */
                <div className="grid grid-cols-2 gap-2 md:min-w-[260px]">
                  {stats!.map((s) => (
                    <div
                      key={s.label}
                      className="flex flex-col rounded-xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm"
                    >
                      <span className="text-base font-extrabold leading-tight text-white">{s.value}</span>
                      <span className="mt-0.5 text-[11px] font-medium leading-tight text-amber">{s.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
