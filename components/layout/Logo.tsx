import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  const src = light ? "/logo-light.png" : "/logo-dark.png";
  return (
    <img
      src={src}
      alt="Big Street Media"
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
