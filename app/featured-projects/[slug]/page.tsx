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
    title: `${cs.brand} — ${cs.campaignType} Featured Project`,
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
          { label: "Featured Projects", href: "/featured-projects" },
          { label: cs.brand },
        ]}
      />

      {/* Challenge + Image */}
      <section className="container-bsm py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <Reveal>
            <span className="eyebrow">Project Overview</span>
            <p className="mt-5 text-lg leading-relaxed text-ink md:text-xl whitespace-pre-line">{cs.overview || cs.challenge}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-[1.5rem] border border-[#f0f0f0] shadow-sm aspect-[4/3] w-full">
              <img
                src={cs.image}
                alt={`${cs.brand} campaign execution`}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services Delivered / Strategy */}
      {cs.servicesDelivered ? (
        <section className="bg-surface-2">
          <div className="container-bsm py-20">
            <SectionHeader eyebrow="Services Delivered" title="Services we provided for this project" />
            <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
              {cs.servicesDelivered.map((s, i) => (
                <RevealItem key={s.title}>
                  <div className="h-full rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-7 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-2xl font-bold text-amber-deep">0{i + 1}</span>
                      <h4 className="mt-3 text-base font-bold text-ink">{s.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-body">{s.description}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      ) : (
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
      )}

      {/* Execution + media / Execution Process flowchart */}
      {cs.executionProcess ? (
        <section className="container-bsm py-20">
          <SectionHeader eyebrow="Our Execution Process" title="Our Execution Process" align="center" className="mx-auto items-center" />
          <div className="mt-12 flex flex-col md:flex-row md:items-start md:justify-between gap-6 relative">
            {/* Horizontal line for connecting dots on desktop */}
            <div className="hidden md:block absolute top-[28px] left-[8%] right-[8%] h-0.5 bg-amber/20 -z-10" />
            
            {cs.executionProcess.map((step, i) => (
              <Reveal key={step} delay={i * 0.08} className="flex-1">
                <div className="flex flex-col items-center text-center group">
                  {/* Step circle */}
                  <div className="h-14 w-14 rounded-full bg-ink border-4 border-surface shadow-md flex items-center justify-center text-amber font-mono font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:border-amber/40 group-hover:bg-amber-deep group-hover:text-ink">
                    0{i + 1}
                  </div>
                  {/* Step Label */}
                  <span className="mt-4 text-sm font-semibold text-ink leading-snug max-w-[130px]">
                    {step}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      ) : (
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
      )}

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
                href={`/featured-projects/${r.slug}`}
                className="group flex h-full flex-col rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
              >
                <span className="text-xs font-semibold text-amber-deep">{r.campaignType}</span>
                <h3 className="mt-2 font-display text-lg font-semibold text-ink">{r.brand}</h3>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink">
                  View project
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
