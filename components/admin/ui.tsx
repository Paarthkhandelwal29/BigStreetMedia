import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Shared control styling for the CMS. Tool register: tighter radii than the
// marketing site, hairline borders, ink primary actions, amber reserved for
// active/affordance accents.
export const controlInput =
  "h-11 w-full rounded-lg border border-hairline bg-surface px-3.5 text-sm text-ink shadow-[0_1px_0_rgba(17,17,17,0.02)] outline-none transition-colors placeholder:text-muted/80 focus:border-ink/25 focus:ring-2 focus:ring-amber/35";

export const controlLabel =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-muted";

export const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-surface transition-colors hover:bg-ink/90 disabled:opacity-55";

export const ghostButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-ink/25";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-hairline bg-surface shadow-[0_1px_2px_rgba(17,17,17,0.04)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-[1.7rem] font-bold leading-tight tracking-tight text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-body">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={controlLabel}>
        {label}
      </label>
      {children}
    </div>
  );
}

// Small inline link styled as a "back"/secondary nav crumb.
export function CrumbLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-ink"
    >
      {children}
    </Link>
  );
}
