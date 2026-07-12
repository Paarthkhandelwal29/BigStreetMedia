import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { LeadForm } from "@/components/shared/LeadForm";
import { FAQ } from "@/components/shared/FAQ";
import { services, serviceBySlug } from "@/data/services";
import { BreadcrumbListSchema, ServiceSchema } from "@/components/shared/Schema";
import { cityTiers } from "@/data/cities";
import { listPortfolio, getServiceFormatImagesByService } from "@/lib/cms/store";
import { icons } from "@/lib/icons";
import {
  ArrowRight,
  MapPin,
  Handshake,
  CurrencyInr,
  Lightning,
  UserCircle,
  Airplane,
  Signpost,
  PaintBrush,
  House,
  Bus,
  Train,
  Car,
  Storefront,
  Gift,
  Tent,
  Lightbulb,
  ShoppingCart,
  Briefcase,
  Trophy,
  Wrench,
  Users,
  QrCode,
  Microphone,
  Television,
  Chair,
  Target,
  ShareNetwork,
  Globe,
  Browser,
  Star,
  ListChecks,
} from "@phosphor-icons/react/dist/ssr";

const formatIcons: Record<string, any> = {
  // OOH Media
  "Hoardings & Billboards": Signpost,
  "Unipoles & Gantries": Signpost,
  "Wall Painting": PaintBrush,
  "Society Gate Branding": House,
  "Bus Shelters": Bus,
  "Metro Media": Train,
  "Airport Media": Airplane,
  "Railway Media": Train,
  "Airport Advertising": Airplane,

  // Transit Media
  "Bus Branding & Wraps": Bus,
  "Auto & E-Rickshaw Branding": Car,
  "Cab Branding": Car,
  "Metro Station Media": Train,
  "Railway Station Media": Train,

  // BTL Activations
  "Mall Activations": Storefront,
  "RWA & Society Activations": Users,
  "Sampling Campaigns": Gift,
  "Road Shows": Car,
  "Canopy & Kiosk Activities": Tent,

  // Retail Branding
  "In-Store Branding": Storefront,
  "Shop Front Boards": Signpost,
  "Dealer Branding": Handshake,
  "Glow Sign Boards": Lightbulb,
  "POS & Visual Merchandising": ShoppingCart,

  // Events & Launches
  "Product Launches": Gift,
  "Store Openings": Storefront,
  "Dealer Meets": Handshake,
  "Corporate Events": Briefcase,
  "Award Functions": Trophy,

  // Exhibition Management
  "Custom Stall Design": PaintBrush,
  "Fabrication & Setup": Wrench,
  "On-Ground Staffing": Users,
  "Lead Capture Systems": QrCode,

  // Radio Advertising
  "FM Spots": Microphone,
  "RJ Mentions": Microphone,
  "Radio Contests": Trophy,
  "Sponsorships": Handshake,

  // Cinema Advertising
  "On-Screen Ads": Television,
  "Lobby Branding": Signpost,
  "Multiplex Standees": Signpost,
  "Seat Branding": Chair,

  // Digital Marketing
  "Performance Ads": Target,
  "Social Media": ShareNetwork,
  "SEO": Globe,
  "Programmatic": Wrench,
  "Landing Pages": Browser,

  // Influencer Marketing
  "Macro Influencers": Star,
  "Micro & Nano Creators": Users,
  "Regional Creators": Globe,
  "Campaign Management": ListChecks,
};

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

  const seoData: Record<string, { title: string; desc: string }> = {
    "ooh-media": {
      title: "PAN India Outdoor Advertising & OOH Agency | Billboard Hoardings",
      desc: "India's leading outdoor advertising (OOH) agency. Prime billboard, hoarding, and transit media locations in Noida, Delhi NCR, Mumbai, Bengaluru, and PAN India.",
    },
    "transit-media": {
      title: "Transit Media Agency India | Bus, Cab & Metro Advertising",
      desc: "Reach millions of commuters daily. Turn-key transit media campaigns, bus branding wraps, e-rickshaws, metro, and railway station branding across India.",
    },
    "btl-activations": {
      title: "BTL Activation & Experiential Marketing Agency India",
      desc: "Drive consumer engagement with on-ground BTL activations, mall events, society roadshows, and experiential marketing across 400+ Indian cities.",
    },
    "retail-branding": {
      title: "Retail Branding Agency India | Shop Front & In-Store Displays",
      desc: "Dominate retail touchpoints. Expert dealer boards, shop front branding, glow sign boards, and in-store visual merchandising across nationwide retail networks.",
    },
    "digital": {
      title: "Digital Marketing Agency India | Performance Marketing & SEO",
      desc: "Accelerate business growth online. Premium SEO services, search engine marketing, social media campaigns, and performance marketing.",
    },
    "influencer": {
      title: "Influencer Marketing Agency India | Creator Campaigns",
      desc: "Build trust with targeted creator partnerships. Collaborations with top Indian tier-1 and regional influencers to amplify your message.",
    },
    "cinema": {
      title: "Cinema Advertising India | Multiplex Screen Ads",
      desc: "Captivate high-intent audiences on the silver screen. Ad placements across multiplexes and single screen theatres throughout India.",
    },
    "events": {
      title: "Corporate Event Management Agency India | Exhibitions & Shows",
      desc: "Flawless corporate event execution. Dealer meets, product launches, custom exhibition design, and end-to-end event management.",
    },
    "radio": {
      title: "Radio Advertising India | FM Radio Spots",
      desc: "Engage local audiences with targeted radio spots on top FM stations, jingle creation, and custom radio integrations.",
    },
  };

  const seo = seoData[slug] || {
    title: `${service.title} — ${service.headline}`,
    desc: service.outcome,
  };

  return {
    title: seo.title,
    description: seo.desc,
  };
}

/* Colour palette for format cards */
const cardColors = [
  "from-blue-800 to-blue-950",
  "from-red-800 to-red-950",
  "from-emerald-700 to-emerald-950",
  "from-orange-700 to-orange-950",
  "from-violet-800 to-violet-950",
  "from-cyan-700 to-cyan-950",
  "from-rose-800 to-rose-950",
  "from-sky-700 to-sky-950",
];

const whyPoints = [
  { icon: MapPin,      title: "Pan India Presence",          sub: "Access to 100+ cities" },
  { icon: Handshake,   title: "Strong Media Partnerships",    sub: "Tie-ups with leading operators" },
  { icon: CurrencyInr, title: "Best Rates & Transparent",    sub: "Value for money, always" },
  { icon: Lightning,   title: "End to End Execution",        sub: "Planning to reporting" },
  { icon: UserCircle,  title: "Dedicated Account Manager",   sub: "Single point of contact" },
];

function faqsFor(title: string) {
  return [
    { q: "How long does it take to go live?",
      a: `For most ${title} campaigns we move from brief to live in a matter of days, thanks to a pre-approved vendor network across 400+ cities.` },
    { q: "What's the minimum budget?",
      a: "We build plans across budgets — from single-city activations to PAN-India campaigns." },
    { q: "Do you handle the creative?",
      a: "Yes. We can take a finished creative or design it for you, adapting it to every format and city." },
    { q: "How do I know it actually ran?",
      a: "You receive geo-tagged photos and a monitoring report for every site." },
    { q: "Which cities can you cover?",
      a: `${title} can run across Tier 1, Tier 2, and Tier 3 markets — wherever your customers are.` },
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
  const portfolioItems = await listPortfolio().catch(() => []);
  const categoryItems = service.portfolioCategory
    ? portfolioItems.filter((i) => i.category === service.portfolioCategory)
    : [];
  const shuffled = [...categoryItems].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return Math.random() - 0.5;
  });
  const recentCampaigns = shuffled.slice(0, 4);

  const formatImages = await getServiceFormatImagesByService(slug).catch(() => []);
  const imageMap = new Map<string, string>();
  for (const img of formatImages) {
    imageMap.set(img.formatName, img.imageUrl);
  }

  /* Build format cards */
  const formatCards = service.formats.map((f, i) => ({
    label: f,
    desc: `High-impact ${f.toLowerCase()} across major Indian cities.`,
    color: cardColors[i % cardColors.length],
    imageUrl: imageMap.get(f) ?? null,
    isAirport: false,
  }));

  const topCities = [
    ...cityTiers["Tier 1"],
    ...cityTiers["Tier 2"].slice(0, 6),
    "100+ Cities Across India",
  ];

  return (
    <>
      <ServiceSchema
        name={`${service.title} - PAN India`}
        description={service.outcome}
        serviceType={`${service.title} Advertising`}
      />
      <BreadcrumbListSchema
        crumbs={[
          { name: "Home", item: "/" },
          { name: "Services", item: "/services" },
          { name: service.title, item: `/services/${service.slug}` },
        ]}
      />

      {/* ── Hero: no CTA buttons, stats on right ── */}
      <PageHero
        eyebrow={service.title}
        title={service.headline}
        subhead={service.outcome}
        stats={service.heroStats}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      {/* ── Format cards — 3 per row ── */}
      <section className="bg-surface">
        <div className="container-bsm py-8 md:py-14">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="section-heading text-xl font-bold text-ink md:text-2xl">
              Reach commuters at every touchpoint
            </h2>
            <Link
              href="/media-inventory"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-body transition-colors hover:text-amber"
            >
              View All {service.title} Options <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {formatCards.map((card, i) => {
              const CardIcon = formatIcons[card.label] || Icon;
              return (
                <div
                  key={card.label}
                  className="group overflow-hidden rounded-xl sm:rounded-2xl border border-[#ebebeb] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
                >
                  {/* Image area */}
                  <div
                    className={`relative h-28 xs:h-36 sm:h-52 overflow-hidden ${card.imageUrl ? "" : `bg-gradient-to-br ${card.color}`}`}
                  >
                    {card.imageUrl && (
                      <Image
                        src={card.imageUrl}
                        alt={card.label}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10" />
                    {/* Icon badge */}
                    <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex h-8 w-8 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-amber text-ink shadow-md z-10">
                      <CardIcon className="h-4 w-4 sm:h-[22px] sm:w-[22px]" />
                    </span>
                  </div>
                  {/* Text */}
                  <div className="p-3 sm:p-5">
                    <p className="text-sm sm:text-base font-semibold text-ink">{card.label}</p>
                    <p className="mt-1 text-xs sm:text-sm sm:mt-1.5 leading-relaxed text-muted">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Info panel: large Campaigns left + Cities & Why BSM stacked right ── */}
      {recentCampaigns.length > 0 && (
      <section className="bg-surface-2">
        <div className="container-bsm py-8 md:py-14">
          <div className="grid gap-5 md:grid-cols-[1.8fr_0.8fr]">

            {/* Left — Our Recent Campaigns (large) */}
            <div className="rounded-2xl border border-[#ebebeb] bg-white p-6">
              <h3 className="section-heading text-base font-bold text-ink">Our Recent Campaigns</h3>
              <div className="mt-5 grid grid-cols-2 gap-4">
                {recentCampaigns.map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-xl border border-[#f0f0f0]">
                    {item.mediaType === "image" ? (
                      <Image
                        src={item.mediaUrl}
                        alt={item.brandName}
                        width={400}
                        height={208}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <video src={item.mediaUrl} className="h-52 w-full object-cover" muted />
                    )}
                    <div className="p-3">
                      <p className="text-sm font-semibold leading-tight text-ink">{item.brandName}</p>
                      <p className="mt-0.5 text-xs text-muted">{item.format}</p>
                      <p className="text-xs text-muted">{item.city}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/portfolio"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-amber"
              >
                View All Work <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right — Cities + Why BSM stacked */}
            <div className="flex flex-col gap-5">

              {/* Top Cities */}
              <div className="rounded-2xl border border-[#ebebeb] bg-white p-5">
                <h3 className="section-heading text-sm font-bold text-ink">Top Cities We Serve</h3>
                <div className="mt-4 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                  <div className="flex flex-wrap gap-2">
                    {topCities.map((city) => (
                      <span
                        key={city}
                        className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                          city === "100+ Cities Across India"
                            ? "border-amber bg-amber/10 text-ink"
                            : "border-[#e8e8e8] bg-[#f5f5f5] text-body"
                        }`}
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href="/media-inventory"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-ink transition-colors hover:text-amber"
                >
                  View All Cities <ArrowRight size={12} />
                </Link>
              </div>

              {/* Why Choose BSM */}
              <div className="rounded-2xl border border-[#ebebeb] bg-white p-5">
                <h3 className="section-heading text-sm font-bold text-ink">Why Choose Big Street Media?</h3>
                <ul className="mt-4 space-y-3">
                  {whyPoints.map((point) => {
                    const WIcon = point.icon;
                    return (
                      <li key={point.title} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber/10">
                          <WIcon size={14} className="text-amber-deep" />
                        </span>
                        <div>
                          <p className="text-[12px] font-semibold leading-tight text-ink">{point.title}</p>
                          <p className="mt-0.5 text-[11px] leading-snug text-muted">{point.sub}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>)}

      {/* ── FAQ ── */}
      <section className="bg-surface">
        <div className="container-bsm py-8 md:py-14">
          <SectionHeader eyebrow="FAQ" title="Questions clients ask us" align="center" className="mx-auto items-center" />
          <div className="mt-8">
            <FAQ items={faqsFor(service.title)} />
          </div>
        </div>
      </section>

      {/* ── Lead form ── */}
      <section className="bg-surface-2">
        <div className="container-bsm py-8 md:py-14">
          <div className="mx-auto max-w-2xl">
            <SectionHeader
              eyebrow="Let's Talk"
              title={`Start your ${service.title} campaign`}
              align="center"
              className="mx-auto items-center"
            />
            <div className="mt-8 rounded-2xl border border-[#f0f0f0] bg-white p-6 md:p-8">
              <LeadForm
                subject={`${service.title} campaign enquiry — Big Street Media`}
                submitLabel="Request Free Media Plan"
                fields={[
                  { name: "name",    label: "Name",         required: true, placeholder: "Your name" },
                  { name: "company", label: "Company",                      placeholder: "Company name" },
                  { name: "city",    label: "City",                         placeholder: "Target city / cities" },
                  { name: "budget",  label: "Budget Range",                 placeholder: "e.g. ₹10L" },
                  { name: "message", label: "Message",      type: "textarea", placeholder: "Tell us about your campaign goal" },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Related services ── */}
      <section className="bg-surface">
        <div className="container-bsm py-8 md:py-14">
          <SectionHeader eyebrow="Explore More" title="Related services" />
          <RevealGroup className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
            {related.map((s) => {
              const RIcon = icons[s.icon];
              return (
                <RevealItem key={s.slug} className="h-full">
                  <ButtonLink
                    href={`/services/${s.slug}`}
                    variant="ghost"
                    withIcon={false}
                    className="flex h-full w-full flex-col items-start gap-3 rounded-2xl !px-6 !py-6 text-left"
                  >
                    <RIcon size={22} className="text-amber-deep" />
                    <span className="font-semibold text-ink">{s.title}</span>
                  </ButtonLink>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
