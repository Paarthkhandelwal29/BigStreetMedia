import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { listInventory, listPortfolio } from "@/lib/cms/store";
import {
  PageHeader,
  Panel,
  ghostButton,
  primaryButton,
} from "@/components/admin/ui";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 px-5 py-4 sm:px-6 sm:py-5">
      <p className="font-mono text-2xl font-semibold tabular-nums text-ink">
        {value}
      </p>
      <p className="mt-0.5 text-xs uppercase tracking-[0.06em] text-muted">
        {label}
      </p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const [inventory, portfolio] = await Promise.all([
    listInventory(),
    listPortfolio(),
  ]);

  const featured =
    portfolio.filter((item) => item.featured).length +
    inventory.filter((item) => item.featured).length;

  const sections = [
    {
      name: "Portfolio",
      count: portfolio.length,
      blurb:
        "Campaign images and video. Each uploaded file is stored as its own record.",
      href: "/admin/portfolio",
      newHref: "/admin/portfolio/new",
    },
    {
      name: "Media inventory",
      count: inventory.length,
      blurb:
        "Available media locations with photos, surfaced on the public inventory page.",
      href: "/admin/inventory",
      newHref: "/admin/inventory/new",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Big Street Media"
        title="Content overview"
        description="Manage the portfolio and media inventory shown on the public site."
      />

      <Panel className="mb-8 flex divide-x divide-hairline">
        <Stat label="Portfolio items" value={portfolio.length} />
        <Stat label="Inventory locations" value={inventory.length} />
        <Stat label="Featured" value={featured} />
      </Panel>

      <div className="space-y-4">
        {sections.map((section) => (
          <Panel
            key={section.name}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {section.name}
                </h2>
                <span className="font-mono text-sm text-muted">
                  {section.count} {section.count === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-1 max-w-md text-sm text-body">{section.blurb}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2.5">
              <Link href={section.href} className={ghostButton}>
                Manage
              </Link>
              <Link href={section.newHref} className={primaryButton}>
                Add new
              </Link>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}
