import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FinalCTA } from "@/components/home/FinalCTA";
import { site } from "@/lib/site";
import { Target, Eye, Heart, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "About — 20 Years, 400 Cities, One Mission",
  description:
    "Big Street Media has executed 1000+ advertising campaigns across 400+ Indian cities since 2004. Meet the execution partner behind India's most visible brands.",
};

const milestones = [
  { year: "2004", text: "Founded in Uttar Pradesh with a focus on OOH execution." },
  { year: "2007", text: "Expanded to 50+ cities with a growing vendor network." },
  { year: "2010", text: "First major national brand campaign delivered." },
  { year: "2015", text: "200+ cities; Transit Media vertical launched." },
  { year: "2018", text: "Events & Activations division launched." },
  { year: "2020", text: "Digital & Influencer Marketing integrated." },
  { year: "2022", text: "400+ cities; 1000+ campaigns milestone crossed." },
  { year: "2024", text: "Partnered with 100+ national brands across 10+ industries." },
  { year: "2025", text: "Continued expansion; launch of digital media planning tools." },
];

const mvv = [
  {
    icon: Target,
    title: "Mission",
    body: "Deliver every campaign on time, on budget, with maximum reach — no excuses.",
  },
  {
    icon: Eye,
    title: "Vision",
    body: "To be India's most trusted 360° campaign execution partner for brands of every size.",
  },
  {
    icon: Heart,
    title: "Values",
    body: "Transparency. Execution excellence. Innovation. Accountability. Client success.",
  },
];

const team = [
  { name: "Founder & Managing Director", role: "Leadership", years: "Since 2004" },
  { name: "Head of Operations", role: "Execution", years: "12 years" },
  { name: "Head of Media Planning", role: "Strategy", years: "9 years" },
  { name: "Head of Client Servicing", role: "Accounts", years: "7 years" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="About Us"
        title="20 years. 400 cities. One mission."
        subhead="We started Big Street Media in 2004 with a belief that great advertising shouldn't require a giant budget — it requires the right execution partner."
      />

      {/* Timeline */}
      <section className="container-bsm py-24">
        <SectionHeader eyebrow="Our Story" title="Two decades of putting brands on the map" />
        <RevealGroup className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-[#f0f0f0] bg-[#f0f0f0] sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {milestones.map((m) => (
            <RevealItem key={m.year} className="bg-surface p-7">
              <span className="font-mono text-2xl font-bold text-amber-deep">{m.year}</span>
              <p className="mt-3 text-sm leading-relaxed text-body">{m.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Founder message */}
      <section className="bg-surface-2">
        <div className="container-bsm py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <div className="aspect-[4/5] max-w-sm overflow-hidden rounded-[1.5rem] border-2 border-amber bg-surface">
                <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-muted">
                  Founder Photo
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="eyebrow">From the Founder</span>
              <blockquote className="mt-5 space-y-4 text-lg leading-relaxed text-body md:text-xl">
                <p>
                  &ldquo;When we started in 2004, most agencies sold ideas. We decided
                  to sell something rarer: campaigns that actually go live, in every
                  city, exactly as promised.&rdquo;
                </p>
                <p>
                  &ldquo;Twenty years later, that&apos;s still the whole business.
                  Ground teams in 400 cities, one point of accountability, and a
                  rate book built over two decades of negotiation.&rdquo;
                </p>
                <p>
                  &ldquo;If you want a partner who treats your campaign like their
                  own reputation depends on it, you&apos;ve found us.&rdquo;
                </p>
              </blockquote>
              <p className="mt-6 font-display font-semibold text-ink">
                Founder &amp; Managing Director
                <span className="block text-sm font-normal text-muted">{site.name}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="container-bsm py-24">
        <SectionHeader eyebrow="What Drives Us" title="Mission, vision, values" />
        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.08}>
          {mvv.map((m) => (
            <RevealItem key={m.title}>
              <div className="h-full rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15 text-amber-deep">
                  <m.icon size={24} />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-ink">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{m.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Team */}
      <section className="bg-surface-2">
        <div className="container-bsm py-24">
          <SectionHeader
            eyebrow="The Team"
            title="The people who execute it"
            subhead="Placeholders for now — real names and photos drop in here as they're provided."
          />
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {team.map((t, i) => (
              <RevealItem key={i}>
                <div className="group rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-5">
                  <div className="flex aspect-square items-center justify-center rounded-[1rem] bg-surface-2 text-xs uppercase tracking-widest text-muted">
                    Photo
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-ink">{t.name}</h3>
                  <p className="text-sm text-muted">{t.role}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-muted">{t.years}</span>
                    <LinkedinLogo size={18} className="text-muted transition-colors group-hover:text-amber-deep" />
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
