import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Insights — 20 Years of Indian Advertising",
  description:
    "Practical insights on OOH, transit, brand launches, Tier 2 & 3 marketing, events and retail branding from Big Street Media.",
};

const categories = [
  "OOH Advertising Trends",
  "Transit Media",
  "Brand Launch Playbooks",
  "Marketing in Tier 2 & 3 Cities",
  "Event & Exhibition Marketing",
  "Retail Branding",
];

const posts = [
  { title: "Why Tier 2 cities are India's biggest untapped ad opportunity", cat: "Marketing in Tier 2 & 3 Cities", read: "6 min" },
  { title: "The launch playbook: how to open a store to a crowd", cat: "Brand Launch Playbooks", read: "8 min" },
  { title: "OOH vs digital: where each rupee actually works harder", cat: "OOH Advertising Trends", read: "5 min" },
  { title: "Transit branding math: frequency beats size", cat: "Transit Media", read: "4 min" },
  { title: "Boat branding on the Varanasi ghats: a format no one else uses", cat: "OOH Advertising Trends", read: "5 min" },
  { title: "What makes an exhibition stall actually generate leads", cat: "Event & Exhibition Marketing", read: "7 min" },
];

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Insights from 20 years of Indian advertising"
        subhead="Field-tested thinking on reaching customers across every city and format."
      />

      <section className="container-bsm py-20">
        {/* categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span key={c} className="rounded-full border border-[#f0f0f0] bg-surface px-4 py-1.5 text-sm text-body">
              {c}
            </span>
          ))}
        </div>

        <SectionHeader eyebrow="Latest" title="Recent articles" className="mt-14" />
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
          {posts.map((p) => (
            <RevealItem key={p.title} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[#f0f0f0] bg-surface transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
                <div className="flex aspect-[16/9] items-center justify-center bg-surface-2 text-xs uppercase tracking-widest text-muted">
                  Featured Image
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold text-amber-deep">{p.cat}</span>
                  <h3 className="mt-2 flex-1 font-display text-lg font-semibold leading-snug text-ink">{p.title}</h3>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                    <span>Big Street Media</span>
                    <span>·</span>
                    <span>{p.read} read</span>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <FinalCTA />
    </>
  );
}
