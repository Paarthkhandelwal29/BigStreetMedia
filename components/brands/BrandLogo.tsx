"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  name: string;
  logo: string;
  className?: string;
  scale?: number;
  priority?: boolean;
}

export function getOptimizedLogoUrl(logo: string) {
  const defaultSub = ["Paarthkhandelwal", "29"].join("");
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL || `https://ik.imagekit.io/${defaultSub}/bigstreetmedia`;
  if (baseUrl.includes("Paarthkhandelwal29")) {
    const transformedBase = baseUrl.replace(
      "Paarthkhandelwal29",
      "Paarthkhandelwal29/tr:f-auto,q-auto,dpr-auto"
    );
    return `${transformedBase}/Brands/${logo}`;
  }
  return `${baseUrl}/Brands/${logo}`;
}

function getInitials(companyName: string): string {
  const parts = companyName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function BrandLogo({ name, logo, className, scale, priority }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!logo || failed) {
    const initials = getInitials(name);
    return (
      <div className={cn("flex flex-col items-center justify-center text-center select-none", className)}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/10 border border-amber/20 text-amber-deep font-semibold text-xs shadow-sm">
          {initials}
        </div>
        <span className="mt-1 font-display text-[10px] font-semibold text-ink/60 leading-tight tracking-tight">
          {name}
        </span>
      </div>
    );
  }

  const logoUrl = getOptimizedLogoUrl(logo);

  const scaleStyle = scale && scale !== 1
    ? {
        "--logo-scale": scale,
      } as React.CSSProperties
    : undefined;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <Image
        src={logoUrl}
        alt={name}
        height={42}
        width={180}
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        decoding="async"
        sizes="(max-width: 768px) 120px, 180px"
        className={cn(
          "h-[26px] md:h-[38px] lg:h-[42px] w-auto max-w-[180px] object-contain transition-opacity duration-300",
          scale && scale !== 1 && "brand-logo-img"
        )}
        style={scaleStyle}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
