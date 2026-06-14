import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { industries, industryBySlug } from "@/data/industries";
import { services } from "@/data/services";
import { brands } from "@/data/brands";
import { icons } from "@/lib/icons";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) return {};
  return {
    title: `${ind.name} Advertising — ${ind.headline}`,
    description: ind.outcome,
  };
}

// Recommended service slugs per industry (falls back to a sensible default set).
const recommended: Record<string, string[]> = {
  fmcg: ["ooh-media", "rural", "btl-activations", "retail-branding"],
  automobile: ["ooh-media", "transit-media", "events-launches", "digital"],
  "real-estate": ["ooh-media", "btl-activations", "digital", "events-launches"],
  bfsi: ["ooh-media", "retail-branding", "radio", "digital"],
  healthcare: ["ooh-media", "btl-activations", "radio", "digital"],
  "telecom-tech": ["retail-branding", "transit-media", "btl-activations", "digital"],
  education: ["ooh-media", "digital", "btl-activations", "radio"],
  "retail-hospitality": ["retail-branding", "events-launches", "ooh-media", "btl-activations"],
  government: ["ooh-media", "rural", "radio", "transit-media"],
};

const challenges = [
  "Reaching the right audience in the right markets, not just the obvious metros",
  "Launching fast without sacrificing execution quality on the ground",
  "Proving reach and impact to leadership with real campaign data",
];

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) notFound();

  const recSlugs = recommended[ind.slug] ?? ["ooh-media", "transit-media", "btl-activations", "digital"];
  const recServices = recSlugs
    .map((s) => services.find((x) => x.slug === s))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <PageHero eyebrow={ind.name} title={ind.headline} subhead={ind.outcome}>
        <ButtonLink href="/contact">Plan a campaign for {ind.name}</ButtonLink>
      </PageHero>

      {/* Challenges we solve */}
      <section className="container-bsm py-20">
        <SectionHeader
          eyebrow="What We Solve"
          title={`Challenges we solve for ${ind.name}`}
        />
        <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3" stagger={0.08}>
          {challenges.map((c, i) => (
            <RevealItem key={i}>
              <div className="h-full rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-7">
                <CheckCircle size={26} weight="fill" className="text-amber-deep" />
                <p className="mt-4 text-sm leading-relaxed text-body">{c}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Recommended formats */}
      <section className="bg-surface-2">
        <div className="container-bsm py-20">
          <SectionHeader
            eyebrow="Recommended"
            title="Formats that work for this sector"
            subhead="A starting mix — we tailor the exact plan to your product, budget, and markets."
          />
          <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
            {recServices.map((s) => (
              <RevealItem key={s.slug} className="h-full">
                <ServiceCard service={s} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Brands */}
      <section className="container-bsm py-20">
        <SectionHeader eyebrow="Track Record" title="Brands we've worked with" />
        <RevealGroup className="mt-10 flex flex-wrap gap-3" stagger={0.03}>
          {brands.slice(0, 12).map((b) => (
            <RevealItem key={b.name}>
              <span className="flex h-14 min-w-[130px] items-center justify-center rounded-xl border border-[#f0f0f0] bg-surface px-5 font-display font-semibold text-ink/70">
                {b.name}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Gallery placeholder */}
      <section className="bg-surface-2">
        <div className="container-bsm py-20">
          <SectionHeader eyebrow="Campaign Gallery" title={`${ind.name} campaigns`} subhead="Real campaign photography drops in here once assets are added." />
          <RevealGroup className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3" stagger={0.05}>
            {Array.from({ length: 6 }).map((_, i) => (
              <RevealItem key={i}>
                <div className="flex aspect-[4/3] items-center justify-center rounded-[1.25rem] border border-[#f0f0f0] bg-surface text-xs uppercase tracking-widest text-muted">
                  {ind.name} · {i + 1}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink">
        <div className="container-bsm flex flex-col items-center gap-6 py-20 text-center">
          <Reveal>
            <h2 className="max-w-2xl text-balance text-3xl font-bold text-white md:text-4xl">
              Ready to plan a campaign for {ind.name.toLowerCase()}?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/contact">Request Free Media Plan</ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
