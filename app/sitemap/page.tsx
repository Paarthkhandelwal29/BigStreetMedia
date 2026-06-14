import type { Metadata } from "next";
import Link from "next/link";
import { routeGroups } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Every page on the Big Street Media website, in one place.",
};

export default function SitemapPage() {
  return (
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
  );
}
