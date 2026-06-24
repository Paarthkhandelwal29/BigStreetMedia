import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Target, MapTrifold, ChartPieSlice, TrendUp, CalendarBlank } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Media Planning — Data-Driven Plans Across India",
  description:
    "Audience targeting, city selection, budget allocation, forecasting and timeline planning — media plans your budget can justify to your board.",
};

const steps = [
  {
    icon: Target,
    title: "Audience Targeting",
    body: "We identify exactly where your audience lives, works, and travels — city by city — so your spend lands where it converts.",
  },
  {
    icon: MapTrifold,
    title: "City Selection Framework",
    body: "Tier 1, Tier 2, or Tier 3? We prioritise markets based on your product, competition, and growth goals — not guesswork.",
  },
  {
    icon: ChartPieSlice,
    title: "Budget Allocation",
    body: "We split your budget across OOH, transit, digital, and events to maximise reach and frequency for your specific objective.",
  },
  {
    icon: TrendUp,
    title: "Campaign Forecasting",
    body: "Estimated reach, impressions, and frequency for every budget level — so you know what you're getting before you commit.",
  },
  {
    icon: CalendarBlank,
    title: "Timeline Planning",
    body: "From pre-launch to post-campaign monitoring, every phase is mapped so nothing slips and nothing surprises you.",
  },
];

export default function MediaPlanningPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Media Planning"
        title="Data-driven media planning across India"
        subhead="We don't just place ads. We build media plans that your budget can justify to your board."
      >
        <ButtonLink href="/contact">Build my media plan</ButtonLink>
      </PageHero>

      <section className="container-bsm py-20">
        <SectionHeader eyebrow="Our Process" title="How we build a plan that performs" />
        <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-[#f0f0f0] bg-[#f0f0f0] md:grid-cols-2" stagger={0.07}>
          {steps.map((s, i) => (
            <RevealItem key={s.title} className="bg-surface p-8">
              <div className="flex items-start gap-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber/15 text-amber-deep">
                  <s.icon size={24} />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted">0{i + 1}</span>
                    <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-body">{s.body}</p>
                </div>
              </div>
            </RevealItem>
          ))}
          <RevealItem className="flex flex-col justify-center bg-ink p-8">
            <h3 className="font-display text-xl font-bold text-white">Interactive Campaign Builder</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Tell us your goal and budget — we&apos;ll return a tailored plan with real rates in 48 hours.
            </p>
            <Reveal delay={0.1} className="mt-6">
              <ButtonLink href="/contact">Build my media plan</ButtonLink>
            </Reveal>
          </RevealItem>
        </RevealGroup>
      </section>

      <FinalCTA />
    </>
  );
}
