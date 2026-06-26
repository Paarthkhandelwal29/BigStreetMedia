import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { listInventory, listPortfolio, listCaseStudies } from "@/lib/cms/store";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const [inventory, portfolio, caseStudies] = await Promise.all([
    listInventory(),
    listPortfolio(),
    listCaseStudies(),
  ]);

  const cards = [
    {
      label: "Media Inventory",
      value: inventory.length,
      href: "/admin/inventory",
      helper: "Upload and manage site inventory photos and details",
    },
    {
      label: "Portfolio",
      value: portfolio.length,
      href: "/admin/portfolio",
      helper: "Upload project/work images and videos",
    },
    {
      label: "Case Studies",
      value: caseStudies.length,
      href: "/admin/case-studies",
      helper: "Upload case-study visuals and campaign writeups",
    },
    {
      label: "Featured Inventory",
      value: inventory.filter((item) => item.featured).length,
      href: "/admin/inventory",
      helper: "Items currently highlighted on the site",
    },
    {
      label: "Featured Projects",
      value: portfolio.filter((item) => item.featured).length,
      href: "/admin/portfolio",
      helper: "Portfolio work currently featured",
    },
    {
      label: "Featured Case Studies",
      value: caseStudies.filter((item) => item.featured).length,
      href: "/admin/case-studies",
      helper: "Case studies currently featured",
    },
  ];

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">
            Content dashboard
          </h1>
        </div>
        <Link
          href="/admin/logout"
          className="text-sm font-semibold text-ink underline underline-offset-4"
        >
          Logout
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-[1.5rem] border border-[#ececec] bg-surface p-6 shadow-sm transition-colors hover:border-amber/40"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-ink">{card.value}</p>
            <p className="mt-2 text-sm text-muted">{card.helper}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
