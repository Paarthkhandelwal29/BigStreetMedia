import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { MapPin, Briefcase } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Careers — Join the Team That Executes India's Campaigns",
  description:
    "Open roles at Big Street Media across operations, media planning, client servicing and field execution. Build a career in 360° advertising.",
};

const roles = [
  { title: "Account Manager", location: "Lucknow, UP", type: "Full-time", dept: "Client Servicing" },
  { title: "Media Planner", location: "Lucknow, UP", type: "Full-time", dept: "Strategy" },
  { title: "Field Execution Lead", location: "Multiple cities", type: "Full-time", dept: "Operations" },
  { title: "Graphic Designer", location: "Lucknow, UP", type: "Full-time", dept: "Creative" },
  { title: "Business Development Executive", location: "Lucknow / Remote", type: "Full-time", dept: "Sales" },
];

export default function CareersPage() {
  const applyHref = (role: string) =>
    `mailto:${site.email}?subject=${encodeURIComponent(`Application: ${role}`)}`;

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join the team that executes India's campaigns"
        subhead="We're a team that ships campaigns in 400 cities. If you like work that goes live in the real world, you'll fit right in."
      />

      <section className="container-bsm py-20">
        <SectionHeader eyebrow="Open Roles" title="Where you can join us" />
        <RevealGroup className="mt-10 flex flex-col gap-3" stagger={0.05}>
          {roles.map((r) => (
            <RevealItem key={r.title}>
              <div className="flex flex-col gap-4 rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-6 transition-all duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">{r.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    <span className="flex items-center gap-1.5"><MapPin size={15} /> {r.location}</span>
                    <span className="flex items-center gap-1.5"><Briefcase size={15} /> {r.type}</span>
                    <span>{r.dept}</span>
                  </div>
                </div>
                <a
                  href={applyHref(r.title)}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-amber px-6 text-sm font-medium text-ink transition-colors hover:bg-amber-deep cursor-pointer"
                >
                  Apply
                </a>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="bg-surface-2">
        <div className="container-bsm py-20">
          <SectionHeader
            eyebrow="Culture"
            title="What it's like to work here"
            subhead="Real campaigns, real deadlines, real impact. We move fast and we own our work."
          />
          <RevealGroup className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4" stagger={0.05}>
            {Array.from({ length: 4 }).map((_, i) => (
              <RevealItem key={i}>
                <div className="flex aspect-square items-center justify-center rounded-[1.25rem] border border-[#f0f0f0] bg-surface text-xs uppercase tracking-widest text-muted">
                  Team Photo
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
