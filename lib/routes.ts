import { services } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";

/** All routable paths, grouped for the HTML sitemap and flattened for XML. */
export const routeGroups = [
  {
    title: "Main",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Media Inventory", href: "/media-inventory" },
      { label: "Media Planning", href: "/media-planning" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Featured Projects", href: "/featured-projects" },
      { label: "Brands", href: "/brands" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "All Services", href: "/services" },
      ...services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
    ],
  },
  {
    title: "Featured Projects",
    links: caseStudies.map((c) => ({ label: c.brand, href: `/featured-projects/${c.slug}` })),
  },
];

export const allRoutes: string[] = [
  ...routeGroups.flatMap((g) => g.links.map((l) => l.href)),
  "/privacy-policy",
  "/sitemap",
];
