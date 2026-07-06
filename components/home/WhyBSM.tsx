import { SectionHeader } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { icons, type IconName } from "@/lib/icons";

const reasons: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "map",
    title: "PAN India Reach",
    body: "Ground teams in 400+ cities ensure flawless execution — not just planning.",
  },
  {
    icon: "megaphone",
    title: "ATL + BTL + TTL",
    body: "One agency, every format. OOH, transit, radio, digital, events — coordinated.",
  },
  {
    icon: "handshake",
    title: "Single Point Accountability",
    body: "One contact manages your entire campaign. No juggling multiple vendors.",
  },
  {
    icon: "lightning",
    title: "Fast Execution",
    body: "From brief to live campaign in days. Agile teams, pre-approved vendor network.",
  },
  {
    icon: "gear",
    title: "Custom Strategy Per Brand",
    body: "No copy-paste plans. Every campaign is built around your product, market, and budget.",
  },
  {
    icon: "rupee",
    title: "Cost-Efficient Planning",
    body: "Our vendor network and 20 years of rate negotiation deliver more reach per rupee.",
  },
];

const mobileBullets = [
  { icon: "map", title: "PAN India Reach", desc: "PAN India execution in 400+ cities" },
  { icon: "megaphone", title: "coordinated agency", desc: "Single agency for OOH, BTL, Transit & Retail" },
  { icon: "handshake", title: "Dedicated managers", desc: "Dedicated campaign managers" },
  { icon: "rupee", title: "Transparent Pricing", desc: "Transparent pricing" },
  { icon: "lightning", title: "End-to-end execution", desc: "End-to-end execution" },
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
