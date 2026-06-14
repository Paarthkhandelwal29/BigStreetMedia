import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const stats = [
  { value: "20+", label: "Years", sub: "Experience" },
  { value: "400+", label: "Cities", sub: "Covered" },
  { value: "PAN India", label: "Vendor", sub: "Network" },
  { value: "1000+", label: "Campaigns", sub: "Executed" },
  { value: "100+", label: "Brands", sub: "Served" },
];

export function StatsStrip() {
  return (
    <section className="bg-amber">
      <div className="container-bsm py-10">
        <RevealGroup
          className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-5"
          stagger={0.08}
        >
          {stats.map((s) => (
            <RevealItem
              key={s.label}
              className="flex flex-col items-center text-center md:items-start md:text-left"
            >
              <AnimatedCounter
                value={s.value}
                className="text-3xl font-bold leading-none text-ink md:text-4xl"
              />
              <span className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink">
                {s.label}
              </span>
              <span className="text-xs text-ink/60">{s.sub}</span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
