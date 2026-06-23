import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumbs, type Crumb } from "@/components/shared/Breadcrumbs";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Standard inner-page hero. Dark ink background with amber glow,
 * clears the fixed navbar via top padding.
 * Optionally renders a breadcrumb trail inside the dark hero below the navbar.
 */
export function PageHero({
  eyebrow,
  title,
  subhead,
  children,
  align = "left",
  breadcrumbs,
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subhead?: string;
  children?: ReactNode;
  align?: "left" | "center";
  breadcrumbs?: Crumb[];
  compact?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        className="absolute inset-0 opacity-60"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 80% at 15% 0%, rgba(255,193,7,0.18), transparent 70%)",
        }}
      />
      <div
        className={cn(
          "container-bsm relative z-10 flex flex-col",
          compact ? "gap-3 pb-8 pt-32" : "gap-5 pb-20 pt-28",
          align === "center" && "items-center text-center"
        )}
      >
        {/* Breadcrumbs sit at the top of the dark hero, inside navbar clearance */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumbs crumbs={breadcrumbs} dark />
        )}

        {eyebrow && (
          <Reveal>
            <span className="eyebrow border-white/15 bg-white/5 text-white/80">{eyebrow}</span>
          </Reveal>
        )}
        <Reveal delay={0.06}>
          <h1
            className={cn(
              "max-w-3xl text-balance font-extrabold leading-[1.05] text-white",
              compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl"
            )}
          >
            {title}
          </h1>
        </Reveal>
        {subhead && (
          <Reveal delay={0.12}>
            <p
              className={cn(
                "max-w-2xl text-base leading-relaxed text-white/65",
                !compact && "md:text-lg",
                align === "center" && "mx-auto"
              )}
            >
              {subhead}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.18} className="mt-2">
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}
