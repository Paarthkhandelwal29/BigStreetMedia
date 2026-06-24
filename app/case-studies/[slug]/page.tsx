import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { caseStudies, caseStudyBySlug } from "@/data/caseStudies";
import { ArrowUpRight, Quotes } from "@phosphor-icons/react/dist/ssr";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudyBySlug(slug);
  if (!cs) return {};
  return {
    title: `${cs.brand} — ${cs.campaignType} Case Study`,
    description: cs.challenge,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudyBySlug(slug);
  if (!cs) notFound();

  const related = caseStudies.filter((c) => c.slug !== cs.slug).slice(0, 3);

  return (
    <>
      <PageHero
        compact
        eyebrow={`${cs.brand} · ${cs.campaignType}`}
        title={`${cs.brand} — ${cs.campaignType} Campaign`}
        subhead={cs.industry}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
          { label: cs.brand },
        ]}
      />

      {/* Challenge + Brief */}
      <section className="container-bsm py-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <span className="eyebrow">The Challenge</span>
            <p className="mt-5 text-xl leading-relaxed text-ink md:text-2xl">{cs.challenge}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[1.5rem] border border-[#f0f0f0] bg-surface-2 p-7">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">The Brief</h3>
              <dl className="mt-5 space-y-4 text-sm">
                <Row k="Client" v={cs.brand} />
                <Row k="Industry" v={cs.industry} />
                <Row k="Objective" v={cs.brief.objective} />
                <Row k="Duration" v={cs.brief.duration} />
                <Row k="Cities" v={cs.brief.cities} />
                <Row k="Type" v={cs.brief.type} />
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Strategy */}
      <section className="bg-surface-2">
        <div className="container-bsm py-20">
          <SectionHeader eyebrow="Our Strategy" title="How we approached the brief" />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3" stagger={0.08}>
            {cs.strategy.map((s, i) => (
              <RevealItem key={i}>
                <div className="h-full rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-7">
                  <span className="font-mono text-2xl font-bold text-amber-deep">0{i + 1}</span>
                  <p className="mt-3 text-sm leading-relaxed text-body">{s}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Execution + media */}
      <section className="container-bsm py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <span className="eyebrow">Execution</span>
            <ul className="mt-5 space-y-4">
              {cs.execution.map((e, i) => (
                <li key={i} className="flex gap-3 text-base leading-relaxed text-body">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber" />
                  {e}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">Media Used</span>
            <div className="mt-5 flex flex-wrap gap-2">
              {cs.media.map((m) => (
                <span key={m} className="rounded-full border border-[#f0f0f0] bg-surface px-4 py-2 text-sm font-medium text-ink">
                  {m}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Results */}
      <section className="bg-ink">
        <div className="container-bsm py-20">
          <SectionHeader eyebrow="Results" title="The numbers" dark align="center" className="mx-auto items-center" />
          <RevealGroup className="mt-12 grid grid-cols-2 gap-y-10 md:grid-cols-4" stagger={0.1}>
            {cs.results.map((r) => (
              <RevealItem key={r.label} className="text-center">
                <AnimatedCounter value={r.value} className="text-4xl font-bold text-amber md:text-5xl" />
                <p className="mt-2 text-sm text-white/60">{r.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Gallery placeholder */}
      <section className="container-bsm py-20">
        <SectionHeader eyebrow="Campaign Gallery" title="On the ground" subhead="Real campaign photography drops in here once assets are added." />
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4" stagger={0.05}>
          {Array.from({ length: 4 }).map((_, i) => (
            <RevealItem key={i}>
              <div className="flex aspect-square items-center justify-center rounded-[1.25rem] border border-[#f0f0f0] bg-surface-2 text-xs uppercase tracking-widest text-muted">
                {cs.brand} · {i + 1}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Testimonial */}
      {cs.testimonial && (
        <section className="bg-surface-2">
          <div className="container-bsm py-20">
            <Reveal className="mx-auto max-w-3xl text-center">
              <Quotes size={40} weight="fill" className="mx-auto text-amber" />
              <blockquote className="mt-6 font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
                {cs.testimonial.quote}
              </blockquote>
              <p className="mt-6 text-sm text-muted">
                <span className="font-semibold text-ink">{cs.testimonial.name}</span> · {cs.testimonial.title}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Related */}
      <section className="container-bsm py-20">
        <SectionHeader eyebrow="More Work" title="You may also like" />
        <RevealGroup className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3" stagger={0.06}>
          {related.map((r) => (
            <RevealItem key={r.slug} className="h-full">
              <Link
                href={`/case-studies/${r.slug}`}
                className="group flex h-full flex-col rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <span className="text-xs font-semibold text-amber-deep">{r.campaignType}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{r.brand}</h3>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink">
                  Read case study
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-amber">
        <div className="container-bsm flex flex-col items-center gap-6 py-16 text-center">
          <h2 className="max-w-2xl text-balance text-3xl font-extrabold text-ink md:text-4xl">
            Want results like these for your brand?
          </h2>
          <ButtonLink href="/contact" variant="dark">
            Get Free Media Plan
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#ececec] pb-3 last:border-b-0 last:pb-0">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium text-ink">{v}</dd>
    </div>
  );
}
