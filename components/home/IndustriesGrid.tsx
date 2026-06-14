import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { industries } from "@/data/industries";
import { icons } from "@/lib/icons";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export function IndustriesGrid() {
  return (
    <section className="bg-surface-2">
      <div className="container-bsm py-24">
        <SectionHeader
          eyebrow="Industries"
          title="We've executed campaigns in your industry"
          subhead="Two decades across ten-plus sectors — so your plan starts from experience, not guesswork."
        />

        <RevealGroup
          className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.05}
        >
          {industries.map((ind) => {
            const Icon = icons[ind.icon];
            return (
              <RevealItem key={ind.slug} className="h-full">
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group flex h-full items-start gap-4 rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-6 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-amber/15 text-amber-deep">
                    <Icon size={22} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold text-ink">{ind.name}</h3>
                      <ArrowUpRight
                        size={16}
                        className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                      />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-body">{ind.outcome}</p>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
