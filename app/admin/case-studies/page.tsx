import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { deleteCaseStudy, listCaseStudies } from "@/lib/cms/store";

export default async function CaseStudiesAdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; status?: string; sort?: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const params = (await searchParams) ?? {};
  const search = (params.search || "").trim().toLowerCase();
  const status = (params.status || "").trim();
  const sort = params.sort === "oldest" ? "oldest" : "newest";

  const caseStudies = await listCaseStudies().catch(() => []);
  const filtered = caseStudies
    .filter((item) =>
      !search
        ? true
        : item.title.toLowerCase().includes(search) ||
          (item.brandName ?? "").toLowerCase().includes(search),
    )
    .filter((item) => (!status ? true : item.status === status))
    .sort((a, b) =>
      sort === "oldest"
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt),
    );

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Case Studies</h1>
          <p className="mt-3 text-sm text-muted">
            Manage case study records. Each case study can include strategy,
            execution, media labels, and results.
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
            href="/admin/case-studies/new"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            Add case study
          </Link>
        </div>
      </div>

      <form className="mb-6 grid gap-4 rounded-[1.5rem] border border-[#ececec] bg-surface p-5 md:grid-cols-4">
        <input
          type="text"
          name="search"
          defaultValue={params.search || ""}
          placeholder="Search title or brand"
          className="h-11 rounded-full border border-[#ececec] px-4 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-full border border-[#ececec] bg-surface px-4 text-sm"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select
          name="sort"
          defaultValue={sort}
          className="h-11 rounded-full border border-[#ececec] bg-surface px-4 text-sm"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-ink px-5 text-sm font-semibold text-white"
        >
          Apply
        </button>
      </form>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#ececec] bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-t border-[#ececec] align-top"
              >
                <td className="px-4 py-3 font-semibold text-ink">
                  {item.title}
                </td>
                <td className="px-4 py-3">{item.brandName ?? "—"}</td>
                <td className="px-4 py-3">{item.industry ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      item.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {item.featured ? "Yes" : "No"}
                </td>
                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/case-studies/${item.id}`}
                      className="text-sm font-semibold text-ink underline underline-offset-4"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCaseStudy(item.id);
                        revalidatePath("/admin/case-studies");
                      }}
                    >
                      <button
                        type="submit"
                        className="text-sm font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No case studies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
