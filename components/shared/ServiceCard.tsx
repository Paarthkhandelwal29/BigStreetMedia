import Link from "next/link";
import { icons } from "@/lib/icons";
import type { Service } from "@/data/services";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function ServiceCard({ service }: { service: Service }) {
  const Icon = icons[service.icon];
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-6 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-amber hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      {/* amber underline reveal */}
      <span className="absolute inset-x-6 bottom-0 h-0.5 origin-left scale-x-0 bg-amber transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100" />
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber/15 text-amber-deep transition-transform duration-300 group-hover:scale-110">
        <Icon size={22} />
      </span>
      <h3 className="mt-5 text-base font-semibold text-ink">{service.title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-body">{service.outcome}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
        Explore
        <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
