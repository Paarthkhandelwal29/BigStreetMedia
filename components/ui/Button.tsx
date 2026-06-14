import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "dark" | "ghost-light";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-ink hover:bg-amber-deep",
  dark: "bg-ink text-white hover:bg-black",
  ghost: "border border-[#e6e6e6] text-ink hover:border-ink bg-transparent",
  "ghost-light": "border border-white/40 text-white hover:bg-white/10 bg-transparent",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-[15px]",
};

function IconChip({ variant }: { variant: Variant }) {
  const chipBg =
    variant === "dark" || variant === "ghost-light"
      ? "bg-white/15"
      : "bg-black/5";
  return (
    <span
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105",
        chipBg
      )}
      aria-hidden
    >
      <ArrowUpRight size={15} weight="bold" />
    </span>
  );
}

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  withIcon?: boolean;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "lg",
  withIcon = true,
  className,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], withIcon && "pr-2", className)} {...rest}>
      {children}
      {withIcon && <IconChip variant={variant} />}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "lg",
  withIcon = true,
  className,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], withIcon && "pr-2", className)}
      {...rest}
    >
      {children}
      {withIcon && <IconChip variant={variant} />}
    </Link>
  );
}
