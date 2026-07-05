import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { listCaseStudies, listInventory, listPortfolio } from "@/lib/cms/store";

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const [inventory, portfolio, caseStudies] = await Promise.all([
    listInventory(),
    listPortfolio(),
    listCaseStudies().catch(() => []),
  ]);

  const cards = [
    {
      label: "Portfolio Media",
      value: portfolio.length,
      href: "/admin/portfolio",
      helper: "Each uploaded file is stored as its own portfolio record.",
    },
    {
      label: "Case Studies",
      value: caseStudies.length,
      href: "/admin/case-studies",
      helper: "Case studies with strategy, execution, media labels, and results.",
    },
    {
      label: "Media Inventory",
      value: inventory.length,
      href: "/admin/inventory",
      helper: "Manage inventory locations and multiple photos per location.",
    },
    {
      label: "Featured Portfolio",
      value: portfolio.filter((item) => item.featured).length,
      href: "/admin/portfolio",
      helper: "Portfolio records currently marked as featured.",
    },
    {
      label: "Featured Inventory",
      value: inventory.filter((item) => item.featured).length,
      href: "/admin/inventory",
      helper: "Inventory records currently marked as featured.",
    },
    {
      label: "Service Media",
      value: "—",
      href: "/admin/service-media",
      helper: "Upload format photos per service for the service detail pages.",
    },
  ];

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">
            Big Street Media CMS
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            A simplified admin for portfolio works and media inventory powered
            by Supabase and ImageKit.
          </p>
        </div>
        <Link
          href="/admin/logout"
          className="text-sm font-semibold text-ink underline underline-offset-4"
        >
          Logout
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
