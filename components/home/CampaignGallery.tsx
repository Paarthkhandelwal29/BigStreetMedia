"use client";
import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/Section";
import { ArrowUpRight, MegaphoneSimple, Bus, Confetti } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { caseStudies, type CaseStudy } from "@/data/caseStudies";

const icons = {
  ooh: MegaphoneSimple,
  transit: Bus,
  events: Confetti,
};

function CampaignCard({
  item,
}: {
  item: CaseStudy;
}) {
  const Icon = icons[item.icon];

  return (
    <Link
      href={`/featured-projects/${item.slug}`}
      className="group relative shrink-0 aspect-auto w-[250px] h-[180px] md:aspect-[4/3] md:w-full md:h-auto overflow-hidden rounded-2xl md:rounded-[1.25rem] border border-[#f0f0f0] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 cursor-pointer snap-center block"
      aria-label={`View ${item.brand} campaign`}
    >
      {/* Background Campaign Image with Hover transition */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(max-width: 768px) 250px, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-all duration-750 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
        />
        {/* Brand color overlay wash */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br mix-blend-multiply opacity-30 transition-opacity duration-500 group-hover:opacity-15",
            item.gradient
          )}
          aria-hidden
        />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Dark bottom gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" aria-hidden />
      </div>

      <div className="relative flex h-full flex-col justify-between p-5 z-10">
        <div className="flex items-start justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-amber backdrop-blur-sm">
            <Icon size={20} weight="fill" />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <div>
          <h3 className="text-lg font-semibold leading-tight text-white">{item.brand}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-amber">
            {item.campaignType} · {item.brief.cities.replace(" +", "")}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function CampaignGallery() {
  return (
    <section className="bg-surface">
      <div className="container-bsm py-6 md:py-16">
        <SectionHeader
          title="Campaigns we've executed across India"
          subhead="Real work. Real brands. Real cities — OOH, transit, events, and more."
        />

        <div className="mt-6 md:mt-12 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-none md:grid md:grid-cols-3 md:gap-6 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {caseStudies.map((item) => (
            <CampaignCard key={item.brand} item={item} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/featured-projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-deep hover:text-amber transition-colors"
          >
            View All Featured Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
