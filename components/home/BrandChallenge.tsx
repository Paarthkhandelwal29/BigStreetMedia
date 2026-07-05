import Link from "next/link";
import { SectionHeader } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { icons } from "@/lib/icons";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

const challenges = [
  {
    icon: "map" as const,
    text: "I need my brand visible across multiple cities",
    route: "/services/ooh-media",
    label: "OOH & Transit Media",
  },
  {
    icon: "megaphone" as const,
    text: "I'm launching a product or opening a new store",
    route: "/services/events-launches",
    label: "Events & Activations",
  },
  {
    icon: "chart" as const,
    text: "I need a full 360° campaign planned and executed",
    route: "/media-planning",
    label: "Media Planning",
  },
];

export function BrandChallenge() {
  return (
    <section className="bg-surface">
      <div className="container-bsm py-16">
        <SectionHeader
          eyebrow="Start Here"
          title="What's your brand challenge?"
          subhead="Tell us where you are — we'll point you to exactly what you need. No scrolling through services you don't care about."
        />

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3" stagger={0.1}>
          {challenges.map((c) => {
            const Icon = icons[c.icon];
            return (
              <RevealItem key={c.label}>
                <Link
                  href={c.route}
                  className="group flex h-full min-h-[80px] flex-col justify-between rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-7 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] cursor-pointer hover:-translate-y-1 hover:border-amber hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/15 text-amber-deep">
                      <Icon size={24} weight="regular" />
                    </span>
                    <p className="mt-6 text-lg font-medium leading-snug text-ink">
                      &ldquo;{c.text}&rdquo;
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    {c.label}
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
