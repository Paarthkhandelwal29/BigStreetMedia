import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { listPortfolio } from "@/lib/cms/store";

export default async function PortfolioAdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const portfolio = await listPortfolio();

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Portfolio projects</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin" className="text-sm font-semibold text-ink underline underline-offset-4">Dashboard</Link>
          <Link href="/admin/portfolio/new" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Add project</Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {portfolio.map((item) => (
          <div key={item.id} className="rounded-[1.5rem] border border-[#ececec] bg-surface p-6">
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <p className="mt-2 text-sm text-muted">{item.clientName || "Untitled client"}</p>
            <p className="mt-3 text-sm text-muted">{item.serviceType}</p>
            <p className="mt-4 text-sm text-muted">{item.featured ? "Featured" : "Standard"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
