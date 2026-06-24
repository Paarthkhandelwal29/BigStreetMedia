import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { LeadForm } from "@/components/shared/LeadForm";
import { FAQ } from "@/components/shared/FAQ";
import { services, serviceBySlug } from "@/data/services";
import { industries } from "@/data/industries";
import { cityTiers } from "@/data/cities";
import { icons } from "@/lib/icons";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  return {
    title: `${service.title} — ${service.headline}`,
    description: service.outcome,
  };
}

const benefits = [
  {
    title: "Planned around your goal",
    body: "Every plan starts from your objective and budget — not a template we reuse for everyone.",
  },
  {
    title: "Executed by ground teams",
    body: "Local teams in every market handle setup, monitoring, and proof of display — so it actually runs.",
  },
  {
    title: "One point of accountability",
    body: "A single contact owns your campaign end to end. No chasing multiple vendors for updates.",
  },
];

function faqsFor(title: string) {
  return [
    {
      q: "How long does it take to go live?",
      a: `For most ${title} campaigns we move from brief to live in a matter of days, thanks to a pre-approved vendor network across 400+ cities.`,
    },
    {
      q: "What's the minimum budget?",
      a: "We build plans across budgets — from single-city activations to PAN-India campaigns. Share your goal and we'll recommend the right scale.",
    },
    {
      q: "Do you handle the creative?",
      a: "Yes. We can take a finished creative or design it for you, and we adapt it to every format and city in your plan.",
    },
    {
      q: "How do I know it actually ran?",
      a: "You receive geo-tagged photos and a monitoring report for every site, so you have proof of display for your records and your board.",
    },
    {
      q: "Which cities can you cover?",
      a: `${title} can run across Tier 1, Tier 2, and Tier 3 markets — wherever your customers are, including towns most agencies skip.`,
    },
  ];
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) notFound();

  const Icon = icons[service.icon];
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 4);

  return (
    <>
      <PageHero
        compact
        eyebrow={service.title}
        title={service.headline}
        subhead={service.outcome}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      >
        <ButtonLink href="/contact" variant="primary">
          Get a Media Plan for {service.title}
        </ButtonLink>
      </PageHero>

      {/* What is + why it works */}
      <section className="container-bsm py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber/15 text-amber-deep">
              <Icon size={28} />
            </span>
            <h2 className="mt-6 text-3xl font-bold text-ink">
              What {service.title} does for your brand
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-4 text-base leading-relaxed text-body md:text-lg">
            <p>
              {service.outcome} {service.title} puts your brand in the physical and
              cultural path of your customer — building the kind of awareness that
              compounds every single day a campaign is live.
            </p>
            <p>
              We don&apos;t just book space and walk away. Our teams plan the right
              mix of formats and locations for your objective, execute on the
              ground across every city in the plan, and report back with proof of
              display you can take to your board.
            </p>
            <p>
              The result is advertising that&apos;s impossible to skip, hard to
              forget, and measured against the goal you started with.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-surface-2">
        <div className="container-bsm py-20">
          <SectionHeader eyebrow="What You Get" title="Built to be executed, not just pitched" />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-3" stagger={0.08}>
            {benefits.map((b) => (
              <RevealItem key={b.title}>
                <div className="h-full rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-7">
                  <CheckCircle size={26} weight="fill" className="text-amber-deep" />
                  <h3 className="mt-4 text-lg font-semibold text-ink">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-body">{b.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Formats */}
      <section className="container-bsm py-20">
        <SectionHeader eyebrow="Formats" title={`${service.title} formats available`} />
        <RevealGroup className="mt-10 flex flex-wrap gap-3" stagger={0.04}>
          {service.formats.map((f) => (
            <RevealItem key={f}>
              <span className="inline-flex items-center rounded-full border border-[#f0f0f0] bg-surface px-5 py-2.5 text-sm font-medium text-ink">
                {f}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Cities */}
      <section className="bg-surface-2">
        <div className="container-bsm py-20">
          <SectionHeader
            eyebrow="Coverage"
            title="Cities where we execute this"
            subhead="A sample of our network — we run campaigns well beyond this list, including towns most agencies skip."
          />
          <div className="mt-10 space-y-8">
            {(Object.keys(cityTiers) as (keyof typeof cityTiers)[]).map((tier) => (
              <Reveal key={tier}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">
                  {tier}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {cityTiers[tier].map((city) => (
                    <span
                      key={city}
                      className="rounded-full border border-[#f0f0f0] bg-surface px-4 py-1.5 text-sm text-body"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign gallery (placeholder) */}
      <section className="container-bsm py-20">
        <SectionHeader
          eyebrow="Campaign Gallery"
          title={`${service.title} in the wild`}
          subhead="Real campaign photography drops in here. Placeholders shown until assets are added."
        />
        <RevealGroup className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3" stagger={0.05}>
          {Array.from({ length: 6 }).map((_, i) => (
            <RevealItem key={i}>
              <div className="flex aspect-[4/3] items-center justify-center rounded-[1.25rem] border border-[#f0f0f0] bg-surface-2 text-xs uppercase tracking-widest text-muted">
                {service.title} · {i + 1}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Industries */}
      <section className="bg-surface-2">
        <div className="container-bsm py-20">
          <SectionHeader eyebrow="Industries" title="Sectors that use this most" />
          <RevealGroup className="mt-10 flex flex-wrap gap-3" stagger={0.04}>
            {industries.map((ind) => {
              const IndIcon = icons[ind.icon];
              return (
                <RevealItem key={ind.slug}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#f0f0f0] bg-surface px-4 py-2.5 text-sm font-medium text-ink">
                    <IndIcon size={18} className="text-amber-deep" />
                    {ind.name}
                  </span>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-bsm py-20">
        <SectionHeader eyebrow="FAQ" title="Questions clients ask us" align="center" className="mx-auto items-center" />
        <div className="mt-10">
          <FAQ items={faqsFor(service.title)} />
        </div>
      </section>

      {/* Lead form */}
      <section className="bg-surface-2">
        <div className="container-bsm py-20">
          <div className="mx-auto max-w-2xl">
            <SectionHeader
              eyebrow="Let's Talk"
              title={`Start your ${service.title} campaign`}
              align="center"
              className="mx-auto items-center"
            />
            <div className="mt-8 rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-6 md:p-8">
              <LeadForm
                subject={`${service.title} campaign enquiry — Big Street Media`}
                submitLabel="Request Free Media Plan"
                fields={[
                  { name: "name", label: "Name", required: true, placeholder: "Your name" },
                  { name: "company", label: "Company", placeholder: "Company name" },
                  { name: "city", label: "City", placeholder: "Target city / cities" },
                  { name: "budget", label: "Budget Range", placeholder: "e.g. ₹10L" },
                  { name: "message", label: "Message", type: "textarea", placeholder: "Tell us about your campaign goal" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="container-bsm py-20">
        <SectionHeader eyebrow="Explore More" title="Related services" />
        <RevealGroup className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
          {related.map((s) => {
            const RIcon = icons[s.icon];
            return (
              <RevealItem key={s.slug} className="h-full">
                <ButtonLink
                  href={`/services/${s.slug}`}
                  variant="ghost"
                  withIcon={false}
                  className="flex h-full w-full flex-col items-start gap-3 rounded-[1.25rem] !px-6 !py-6 text-left"
                >
                  <RIcon size={22} className="text-amber-deep" />
                  <span className="font-semibold text-ink">{s.title}</span>
                </ButtonLink>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>
    </>
  );
}
