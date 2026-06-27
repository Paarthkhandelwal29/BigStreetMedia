import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Section";
import { AuroraBackdrop } from "./AuroraBackdrop";

const impact = [
  { value: "1000+", label: "Campaigns", sub: "Executed nationwide" },
  { value: "400+", label: "Cities", sub: "Ground coverage" },
  { value: "20+", label: "Years", sub: "Of excellence" },
  { value: "100+", label: "Brands", sub: "Trust us" },
];

export function ImpactNumbers() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <AuroraBackdrop />
      <div
        className="absolute inset-0 opacity-[0.05]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at 50% 50%, black, transparent 78%)",
        }}
      />
      <div className="container-bsm relative z-10 py-24 md:py-28">
        <SectionHeader
          eyebrow="Our Impact"
          title="Numbers that speak for themselves"
          subhead="Two decades of execution excellence across India's advertising landscape."
          align="center"
          dark
          className="mx-auto items-center"
        />

        <RevealGroup
          className="mt-16 grid grid-cols-2 gap-y-14 md:grid-cols-4 md:divide-x md:divide-white/10"
          stagger={0.1}
        >
          {impact.map((s) => (
            <RevealItem
              key={s.label}
              className="flex flex-col items-center px-4 text-center"
            >
              <AnimatedCounter
                value={s.value}
                className="font-display text-5xl font-extrabold leading-none tracking-[-0.03em] text-amber tabular-nums sm:text-6xl lg:text-[4rem]"
              />
              <span className="mt-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">
                {s.label}
              </span>
              <span className="mt-1 text-[13px] text-white/40">{s.sub}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
