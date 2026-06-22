import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import type { ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  subhead,
  align = "left",
  className,
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subhead?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={cn(
          "max-w-3xl text-balance text-3xl font-bold leading-[1.08] md:text-[2.75rem]",
          // Amber left-border accent only on light-background sections and left-aligned headings
          !dark && align !== "center" && "section-heading",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {subhead && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed md:text-lg",
            dark ? "text-white/60" : "text-body"
          )}
        >
          {subhead}
        </p>
      )}
    </Reveal>
  );
}
