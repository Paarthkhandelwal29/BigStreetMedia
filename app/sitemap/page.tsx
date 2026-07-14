import type { Metadata } from "next";
import Link from "next/link";
import { routeGroups } from "@/lib/routes";
import { BreadcrumbListSchema } from "@/components/shared/Schema";

export const metadata: Metadata = {
  title: "Sitemap | Big Street Media",
  description: "Browse all pages, services, and featured advertising projects of Big Street Media.",
  alternates: {
    canonical: "/sitemap",
  },
};

export default function SitemapPage() {
  return (
    <>
      <BreadcrumbListSchema
        crumbs={[
          { name: "Home", item: "/" },
          { name: "Sitemap", item: "/sitemap" },
        ]}
      />
      <section className="container-bsm py-16 pt-32">
      <span className="eyebrow">Sitemap</span>
      <h1 className="mt-5 font-display text-4xl font-extrabold text-ink">All pages</h1>

      <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {routeGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{group.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-body transition-colors hover:text-amber-deep">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
    </>
  );
}
