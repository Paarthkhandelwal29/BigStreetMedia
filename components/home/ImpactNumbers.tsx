import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const impact = [
  { value: "1000+", label: "Campaigns", sub: "Executed" },
  { value: "400+", label: "Cities", sub: "Covered" },
  { value: "20+", label: "Years", sub: "of Excellence" },
  { value: "100+", label: "Brands", sub: "Served" },
];

export function ImpactNumbers() {
  return (
    <section className="bg-ink">
      <div className="container-bsm py-24">
        <RevealGroup className="grid grid-cols-2 gap-y-12 md:grid-cols-4" stagger={0.1}>
          {impact.map((s) => (
            <RevealItem key={s.label} className="flex flex-col items-center text-center">
              <AnimatedCounter
                value={s.value}
                className="text-5xl font-bold leading-none text-amber md:text-6xl lg:text-7xl"
              />
              <span className="mt-3 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                {s.label}
              </span>
              <span className="mt-1 text-[13px] text-white/40">{s.sub}</span>
            </RevealItem>
          ))}
        </RevealGroup>
        <p className="mt-12 text-center text-sm text-white/40">…and counting.</p>
      </div>
    </section>
  );
}
