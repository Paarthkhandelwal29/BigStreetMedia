import { cn } from "@/lib/utils";

/**
 * Typographic wordmark placeholder. Swap for a real logo SVG later by
 * replacing this component's markup — every usage updates automatically.
 */
export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 font-display text-lg font-extrabold tracking-tight leading-none",
        light ? "text-white" : "text-ink",
        className
      )}
    >
      {/* amber square mark = the "action" ink */}
      <span className="grid h-7 w-7 place-items-center rounded-md bg-amber text-ink text-sm font-extrabold">
        B
      </span>
      <span className="hidden sm:inline">
        Big Street<span className="text-amber">.</span>
      </span>
    </span>
  );
}
