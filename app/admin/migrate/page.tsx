import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";

export default async function MigrateAdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  return (
    <div className="container-bsm py-20">
      <div className="mb-8">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-3xl font-bold text-ink">
          Migrate legacy CMS data
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Use this only if you still need to import old JSON-based inventory,
          portfolio, and case-study records into Supabase.
        </p>
      </div>

      <form
        action="/api/admin/migrate"
        method="post"
        className="rounded-[1.5rem] border border-[#ececec] bg-surface p-8"
      >
        <p className="text-sm text-muted">
          Run this once after configuring your Supabase credentials.
        </p>
        <button
          type="submit"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white"
        >
          Run migration
        </button>
      </form>

      <div className="mt-6">
        <Link
          href="/admin"
          className="text-sm font-semibold text-ink underline underline-offset-4"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
