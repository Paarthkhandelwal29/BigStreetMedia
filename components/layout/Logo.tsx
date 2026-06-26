import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  const src = light ? "/logo-light.png" : "/logo-dark.png";
  return (
    <Image
      src={src}
      alt="Big Street Media"
      width={240}
      height={80}
      priority
      className={cn("h-10 w-auto object-contain", className)}
    />
  );
}
