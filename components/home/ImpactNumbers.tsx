import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/Section";

const impact = [
  { value: "1000+", label: "Campaigns", sub: "Executed nationwide" },
  { value: "400+", label: "Cities", sub: "Ground coverage" },
  { value: "20+", label: "Years", sub: "Of excellence" },
  { value: "100+", label: "Brands", sub: "Trust us" },
];

export function ImpactNumbers() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        className="absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(50% 50% at 50% 100%, rgba(255,193,7,0.15), transparent 70%)",
        }}
      />
      <div className="container-bsm relative z-10 py-16">
        <SectionHeader
          eyebrow="Our Impact"
          title="Numbers that speak for themselves"
          subhead="Two decades of execution excellence across India's advertising landscape."
          align="center"
          dark
          className="mx-auto items-center"
        />

        <RevealGroup className="mt-14 grid grid-cols-2 gap-y-12 md:grid-cols-4" stagger={0.1}>
          {impact.map((s) => (
            <RevealItem key={s.label} className="flex flex-col items-center text-center">
              <AnimatedCounter
                value={s.value}
                className="text-4xl font-bold leading-none text-amber md:text-5xl lg:text-6xl"
              />
              <span className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-white">
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
