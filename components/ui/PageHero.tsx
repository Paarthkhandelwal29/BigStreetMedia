import { Reveal } from "@/components/ui/Reveal";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Standard inner-page hero. Dark ink background with amber glow,
 * clears the fixed navbar via top padding.
 */
export function PageHero({
  eyebrow,
  title,
  subhead,
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  subhead?: string;
  children?: ReactNode;
  align?: "left" | "center";
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
          "container-bsm relative z-10 flex flex-col gap-5 pb-20 pt-36",
          align === "center" && "items-center text-center"
        )}
      >
        {eyebrow && (
          <Reveal>
            <span className="eyebrow border-white/15 bg-white/5 text-white/80">{eyebrow}</span>
          </Reveal>
        )}
        <Reveal delay={0.06}>
          <h1 className="max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {subhead && (
          <Reveal delay={0.12}>
            <p className={cn("max-w-2xl text-base leading-relaxed text-white/65 md:text-lg", align === "center" && "mx-auto")}>
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
