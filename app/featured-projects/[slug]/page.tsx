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
import { CaseStudyGallery } from "@/components/shared/CaseStudyGallery";
import { listPortfolio } from "@/lib/cms/store";
import { portfolio as localPortfolio } from "@/data/portfolio";

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

  // Fetch portfolio items from CMS repository
  const dbItems = await listPortfolio().catch(() => []);
  
  // Map local hardcoded portfolio items as robust fallback
  // Items without an image use cs.image as fallback so portfolio items show even without CMS uploads
  const localItemsMapped = localPortfolio
    .map((item) => ({
      id: item.id,
      brandName: item.brand,
      category: item.category,
      format: item.format,
      city: item.city,
      mediaUrl: item.image ?? cs.image,
      mediaType: "image" as const,
      featured: !!item.featured,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

  const allPortfolio = [...dbItems];
  const dbIds = new Set(dbItems.map((item) => item.id));
  for (const item of localItemsMapped) {
    if (!dbIds.has(item.id)) {
      allPortfolio.push(item);
    }
  }

  // Filter photos matching this case study brand (case-insensitive)
  const matchedPhotos = allPortfolio.filter((item) => {
    const itemBrand = item.brandName.toLowerCase();
    const csBrand = cs.brand.toLowerCase();
    return itemBrand.includes(csBrand) || csBrand.includes(itemBrand);
  });

  // Cap at 4 photos and fallback to main project image if none matched
  let galleryPhotos = [...matchedPhotos].slice(0, 4);
  if (galleryPhotos.length === 0 && cs.image) {
    galleryPhotos = [
      {
        id: `fallback-${cs.slug}`,
        brandName: cs.brand,
        category: "OOH" as const,
        format: cs.campaignType,
        city: cs.brief.cities.split(",")[0].trim(),
        mediaUrl: cs.image,
        mediaType: "image" as const,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

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
      {/* Desktop-only view */}
      <div className="hidden md:block">
        {/* Challenge + Image */}
        <section className="container-bsm py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
            <Reveal>
              <span className="eyebrow">Project Overview</span>
              <p className="mt-5 text-lg leading-relaxed text-ink md:text-xl whitespace-pre-line">{cs.overview || cs.challenge}</p>
            </Reveal>
            <div className="flex flex-col gap-6">
              <Reveal delay={0.1}>
                <div className="overflow-hidden rounded-[1.5rem] border border-[#f0f0f0] shadow-sm aspect-[4/3] w-full">
                  <img
                    src={cs.image}
                    alt={`${cs.brand} campaign execution`}
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </Reveal>
              {cs.highlights && (
                <Reveal delay={0.15}>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted mb-3">Project Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {cs.highlights.map((h) => (
                        <span key={h} className="rounded-full bg-amber/10 px-3.5 py-1.5 text-xs font-semibold text-amber-deep border border-amber/15">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>

        {/* Services Delivered / Strategy */}
        {cs.servicesDelivered ? (
          <section className="bg-surface-2">
            <div className="container-bsm py-20">
              <SectionHeader eyebrow="Services Delivered" title="Services we provided for this project" />
              <RevealGroup className={`mt-10 grid gap-5 md:grid-cols-2 ${cs.servicesDelivered.length > 4 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`} stagger={0.08}>
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
              
              {cs.executionProcess.map((step, i) => {
                const title = typeof step === "string" ? step : step.title;
                const desc = typeof step === "string" ? null : step.description;
                return (
                  <Reveal key={title} delay={i * 0.08} className="flex-1">
                    <div className="flex flex-col items-center text-center group">
                      {/* Step circle */}
                      <div className="h-14 w-14 rounded-full bg-ink border-4 border-surface shadow-md flex items-center justify-center text-amber font-mono font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:border-amber/40 group-hover:bg-amber-deep group-hover:text-ink">
                        0{i + 1}
                      </div>
                      {/* Step Label */}
                      <span className="mt-4 text-sm font-semibold text-ink leading-snug max-w-[150px]">
                        {title}
                      </span>
                      {desc && (
                        <p className="mt-2 text-xs leading-relaxed text-muted max-w-[180px] mx-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                          {desc}
                        </p>
                      )}
                    </div>
                  </Reveal>
                );
              })}
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

        {/* Campaign Gallery */}
        <CaseStudyGallery brand={cs.brand} photos={galleryPhotos} />

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
      </div>

      {/* Mobile-optimized view */}
      <div className="block md:hidden space-y-6 px-4 py-5 bg-surface text-ink">
        {/* Project Overview & Brief */}
        <section className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-deep block">Project Overview</span>
          
          {(() => {
            const paragraphs = cs.overview
              ? cs.overview.split("\n\n").map((p) => p.replace(/\s+/g, " ").trim())
              : [cs.challenge];
            
            const firstPara = paragraphs[0];
            const remainingParas = paragraphs.slice(1);

            return (
              <div className="text-xs text-body leading-relaxed text-ink space-y-4">
                {/* Paragraph 1 */}
                <p className="text-justify">{firstPara}</p>
                
                {/* Full-width Image */}
                <div className="overflow-hidden rounded-xl border border-[#f0f0f0] aspect-[16/10] w-full shadow-sm">
                  <img
                    src={cs.image}
                    alt={`${cs.brand} execution`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Paragraph 2, 3, etc. */}
                {remainingParas.map((para, idx) => (
                  <p key={idx} className="text-justify">{para}</p>
                ))}
              </div>
            );
          })()}
        </section>


        {/* Campaign Highlights (Numbers) */}
        {cs.results && (
          <section className="border-t border-[#f0f0f0] pt-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-deep">Campaign Results</span>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {cs.results.map((r) => (
                <div key={r.label} className="bg-surface-2 border border-[#f0f0f0] rounded-xl p-3 flex flex-col justify-center shadow-sm">
                  <span className="text-base font-extrabold text-ink leading-tight">{r.value}</span>
                  <span className="text-[10px] text-muted leading-tight mt-0.5">{r.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Services Delivered */}
        {cs.servicesDelivered && (
          <section className="border-t border-[#f0f0f0] pt-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-deep">Services Delivered</span>
              <span className="text-[10px] text-muted font-medium">Swipe →</span>
            </div>
            {/* Horizontal scroll snapping container */}
            <div className="mt-3 flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {cs.servicesDelivered.map((s, i) => (
                <div
                  key={s.title}
                  className="snap-start shrink-0 w-[72%] bg-surface border border-[#f0f0f0] rounded-xl p-4 flex flex-col justify-between h-[140px] shadow-sm"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-deep">0{i + 1}</span>
                    <h4 className="mt-1 text-xs font-bold text-ink leading-tight">{s.title}</h4>
                    <p className="mt-1.5 text-[11px] leading-snug text-body line-clamp-3">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Execution Process Zig-Zag */}
        {cs.executionProcess && (
          <section className="border-t border-[#f0f0f0] pt-5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-deep">Execution Process</span>
            <div className="mt-4 relative">
              {/* Zig Zag grid (3 cols, 2 rows) */}
              <div className="grid grid-cols-3 gap-x-2 gap-y-8 relative">
                {(() => {
                  const steps = cs.executionProcess.map((step, idx) => {
                    const title = typeof step === "string" ? step : step.title;
                    const desc = typeof step === "string" ? "" : step.description;
                    return { title, desc, index: idx + 1 };
                  });
                  return (
                    <>
                      {/* Step 1 */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="h-8 w-8 rounded-full bg-ink text-amber text-xs font-mono font-bold flex items-center justify-center border-2 border-surface shadow">01</div>
                        <span className="mt-1 text-[10px] font-bold text-ink leading-tight truncate w-full px-1">{steps[0].title}</span>
                        {steps[0].desc && <span className="mt-0.5 text-[9px] text-muted line-clamp-1 px-1">{steps[0].desc}</span>}
                      </div>

                      {/* Right Arrow 1 -> 2 */}
                      <div className="absolute top-3 left-[20%] right-[60%] flex justify-center text-muted text-xs pointer-events-none">→</div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="h-8 w-8 rounded-full bg-ink text-amber text-xs font-mono font-bold flex items-center justify-center border-2 border-surface shadow">02</div>
                        <span className="mt-1 text-[10px] font-bold text-ink leading-tight truncate w-full px-1">{steps[1].title}</span>
                        {steps[1].desc && <span className="mt-0.5 text-[9px] text-muted line-clamp-1 px-1">{steps[1].desc}</span>}
                      </div>

                      {/* Right Arrow 2 -> 3 */}
                      <div className="absolute top-3 left-[53%] right-[27%] flex justify-center text-muted text-xs pointer-events-none">→</div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="h-8 w-8 rounded-full bg-ink text-amber text-xs font-mono font-bold flex items-center justify-center border-2 border-surface shadow">03</div>
                        <span className="mt-1 text-[10px] font-bold text-ink leading-tight truncate w-full px-1">{steps[2].title}</span>
                        {steps[2].desc && <span className="mt-0.5 text-[9px] text-muted line-clamp-1 px-1">{steps[2].desc}</span>}
                      </div>

                      {/* Down Arrow 3 -> 4 */}
                      <div className="absolute top-8 right-[10%] flex justify-center items-center text-muted text-xs pointer-events-none h-12">↓</div>

                      {/* Step 6 (Row 2, Col 1) */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="h-8 w-8 rounded-full bg-ink text-amber text-xs font-mono font-bold flex items-center justify-center border-2 border-surface shadow">06</div>
                        <span className="mt-1 text-[10px] font-bold text-ink leading-tight truncate w-full px-1">{steps[5].title}</span>
                        {steps[5].desc && <span className="mt-0.5 text-[9px] text-muted line-clamp-1 px-1">{steps[5].desc}</span>}
                      </div>

                      {/* Left Arrow 5 -> 6 */}
                      <div className="absolute bottom-10 left-[20%] right-[60%] flex justify-center text-muted text-xs pointer-events-none">←</div>

                      {/* Step 5 (Row 2, Col 2) */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="h-8 w-8 rounded-full bg-ink text-amber text-xs font-mono font-bold flex items-center justify-center border-2 border-surface shadow">05</div>
                        <span className="mt-1 text-[10px] font-bold text-ink leading-tight truncate w-full px-1">{steps[4].title}</span>
                        {steps[4].desc && <span className="mt-0.5 text-[9px] text-muted line-clamp-1 px-1">{steps[4].desc}</span>}
                      </div>

                      {/* Left Arrow 4 -> 5 */}
                      <div className="absolute bottom-10 left-[53%] right-[27%] flex justify-center text-muted text-xs pointer-events-none">←</div>

                      {/* Step 4 (Row 2, Col 3) */}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div className="h-8 w-8 rounded-full bg-ink text-amber text-xs font-mono font-bold flex items-center justify-center border-2 border-surface shadow">04</div>
                        <span className="mt-1 text-[10px] font-bold text-ink leading-tight truncate w-full px-1">{steps[3].title}</span>
                        {steps[3].desc && <span className="mt-0.5 text-[9px] text-muted line-clamp-1 px-1">{steps[3].desc}</span>}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </section>
        )}

        {/* Project Gallery */}
        <CaseStudyGallery brand={cs.brand} photos={galleryPhotos} isMobile />

        {/* Testimonial */}
        {cs.testimonial && (
          <section className="border-t border-[#f0f0f0] pt-5">
            <div className="bg-surface-2 rounded-xl p-4 text-center border border-[#f0f0f0]">
              <Quotes size={24} weight="fill" className="mx-auto text-amber" />
              <blockquote className="mt-2 text-xs font-medium leading-snug text-ink italic">
                "{cs.testimonial.quote}"
              </blockquote>
              <p className="mt-2 text-[10px] text-muted">
                <span className="font-semibold text-ink">{cs.testimonial.name}</span> · {cs.testimonial.title}
              </p>
            </div>
          </section>
        )}

        {/* Related */}
        <section className="border-t border-[#f0f0f0] pt-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-deep">More Work</span>
          <div className="mt-3 space-y-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/featured-projects/${r.slug}`}
                className="flex items-center justify-between p-3 border border-[#f0f0f0] rounded-xl hover:bg-surface-2 bg-surface transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-ink">{r.brand}</h4>
                  <span className="text-[10px] text-muted">{r.campaignType}</span>
                </div>
                <ArrowUpRight size={14} className="text-muted" />
              </Link>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-amber rounded-xl p-5 text-center mt-4 shadow-sm">
          <h2 className="text-base font-extrabold text-ink leading-tight">
            Want results like these for your brand?
          </h2>
          <div className="mt-3">
            <ButtonLink href="/contact" variant="dark" className="w-full text-xs py-2">
              Get Free Media Plan
            </ButtonLink>
          </div>
        </section>
      </div>
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
