import { SectionHeader } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { icons, type IconName } from "@/lib/icons";

const reasons: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "map",
    title: "PAN India Campaign Execution",
    body: "Flawless on-ground planning and execution across Mumbai, Bengaluru, Delhi NCR, Noida, and 400+ cities nationwide.",
  },
  {
    icon: "megaphone",
    title: "360° Advertising Solutions",
    body: "Integrated ATL & BTL media formats. Single agency accountability for Outdoor Advertising (OOH), Transit Media, Retail Branding, and Events.",
  },
  {
    icon: "handshake",
    title: "20+ Years of Trust",
    body: "Established in 2004, serving 100+ national brands with transparent coordination and single-point contact accountability.",
  },
  {
    icon: "lightning",
    title: "Agile Execution & Vendor Network",
    body: "From strategy to campaign rollout in days. Leverage our verified nationwide vendor network for immediate media deployment.",
  },
  {
    icon: "gear",
    title: "Tailored Brand Strategy",
    body: "No cookie-cutter campaigns. Every campaign is designed around your budget, brand objectives, and target consumer demography.",
  },
  {
    icon: "rupee",
    title: "Proven Campaign ROI",
    body: "1000+ campaigns executed. Our industry experience and buying power ensure highly competitive media rates and maximum reach.",
  },
];

const mobileBullets = [
  { icon: "map", title: "PAN India Execution", desc: "National presence across 400+ cities" },
  { icon: "megaphone", title: "360° Ad Solutions", desc: "Integrated Outdoor, Transit Media, & BTL campaigns" },
  { icon: "handshake", title: "20+ Years of Trust", desc: "Established in 2004, serving 100+ brands" },
  { icon: "rupee", title: "Competitive Rates", desc: "Verified vendor network pricing advantage" },
  { icon: "lightning", title: "Turn-key Delivery", desc: "End-to-end campaign deployment & monitoring" },
];

export function WhyBSM() {
  return (
    <section className="bg-surface-2">
      <div className="container-bsm py-6 md:py-16">
        <SectionHeader
          title="Why 100+ brands choose Big Street Media"
          subhead="Not just an agency. Your dedicated campaign partner."
        />

        {/* Mobile compact bullet points */}
        <div className="mt-6 md:hidden flex flex-col gap-4">
          {mobileBullets.map((b) => {
            const Icon = icons[b.icon as IconName];
            return (
              <div key={b.title} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber/10 text-amber-deep">
                  <Icon size={14} weight="bold" />
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-ink leading-tight">✓ {b.title}</span>
                  <span className="text-xs text-body leading-normal mt-0.5">{b.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop/Tablet card grid */}
        <RevealGroup className="hidden md:grid mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {reasons.map((r) => {
            const Icon = icons[r.icon];
            return (
              <RevealItem key={r.title}>
                <div className="group card-surface h-full p-7 hover:-translate-y-1">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15 text-amber-deep transition-colors duration-300 group-hover:bg-amber group-hover:text-ink">
                    <Icon size={24} />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold text-ink">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{r.body}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
