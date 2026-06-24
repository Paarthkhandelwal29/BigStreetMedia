import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FinalCTA } from "@/components/home/FinalCTA";
import { caseStudies } from "@/data/caseStudies";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Case Studies — Real Campaigns, Real Results",
  description:
    "How Big Street Media helped India's top brands hit their objectives — strategy, execution, and measured results across OOH, transit, events and retail.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Case Studies"
        title="Real campaigns. Real results."
        subhead="Here's how we helped some of India's top brands achieve their objectives — starting with their problem, not our activity."
      />

      <section className="container-bsm py-8 md:py-10">
        <RevealGroup className="grid grid-cols-1 gap-5 md:grid-cols-2" stagger={0.06}>
          {caseStudies.map((cs) => (
            <RevealItem key={cs.slug} className="h-full">
              <Link
                href={`/case-studies/${cs.slug}`}
                className="group flex h-full flex-col rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-7 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-amber/15 px-3 py-1 text-xs font-semibold text-amber-deep">
                    {cs.campaignType}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-ink">{cs.brand}</h3>
                <p className="text-sm text-muted">{cs.industry}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-body">{cs.challenge}</p>
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#f0f0f0] pt-5">
                  {cs.results.slice(0, 2).map((r) => (
                    <div key={r.label}>
                      <span className="block font-mono text-lg font-bold text-ink">{r.value}</span>
                      <span className="text-xs text-muted">{r.label}</span>
                    </div>
                  ))}
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <FinalCTA />
    </>
  );
}

