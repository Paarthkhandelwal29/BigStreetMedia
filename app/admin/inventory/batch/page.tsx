import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import BatchInventoryPageClient from "./BatchInventoryPageClient";

export default async function InventoryBatchUploadPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">
            AI Batch Inventory Upload
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-muted">
            Upload one PPT, PPTX, or PDF. The batch extractor will detect
            inventory pages, group related photos, infer city, media type, size,
            and address, then let you review every draft before saving.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin"
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/inventory"
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            Inventory List
          </Link>
          <Link
            href="/admin/inventory/new"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            Add Inventory
          </Link>
        </div>
      </div>

      <BatchInventoryPageClient />
    </div>
  );
}
