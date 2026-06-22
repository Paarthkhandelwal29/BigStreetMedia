import { cn } from "@/lib/utils";

export function BrandWordmark({
  name,
  className,
  compact = false,
}: {
  name: string;
  className?: string;
  compact?: boolean;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-xl border border-[#ececec] bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300",
        compact ? "px-3 py-2" : "px-4 py-2.5",
        className
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-surface-2 font-display font-bold text-ink/80",
          compact ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-[11px]"
        )}
        aria-hidden
      >
        {initials}
      </span>
      <span
        className={cn(
          "whitespace-nowrap font-display font-semibold text-ink/80",
          compact ? "text-xs" : "text-sm"
        )}
      >
        {name}
      </span>
    </span>
  );
}
