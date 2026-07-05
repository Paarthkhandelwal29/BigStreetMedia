import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { services } from "@/data/services";
import { listServiceFormatImages } from "@/lib/cms/store";
import { ServiceMediaClient } from "./ServiceMediaClient";

export const metadata = { title: "Service Media — CMS" };

export default async function ServiceMediaPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const records = await listServiceFormatImages().catch(() => []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            CMS / Service Media
          </p>
          <h1 className="mt-1 text-xl font-bold text-ink">
            Service Format Images
          </h1>
          <p className="mt-1 text-sm text-muted">
            Upload a photo for each service format. It will appear on the
            service page card.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          ← Dashboard
        </Link>
      </div>

      <ServiceMediaClient services={services} records={records} />
    </div>
  );
}
