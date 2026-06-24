import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FinalCTA } from "@/components/home/FinalCTA";
import { industries } from "@/data/industries";
import { icons } from "@/lib/icons";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Industries — Campaigns Built for Your Sector",
  description:
    "FMCG, Automobile, Real Estate, BFSI, Healthcare, Telecom, Education, Retail and Government — advertising campaigns executed across India by Big Street Media.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Industries"
        title="We've executed campaigns in your industry"
        subhead="Pick your sector to see how Big Street Media plans and runs campaigns built around its specific buyers, seasons, and markets."
      />

      <section className="container-bsm py-20">
        <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {industries.map((ind) => {
            const Icon = icons[ind.icon];
            return (
              <RevealItem key={ind.slug} className="h-full">
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group flex h-full flex-col rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-7 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15 text-amber-deep">
                      <Icon size={24} />
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{ind.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{ind.outcome}</p>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <FinalCTA />
    </>
  );
}
