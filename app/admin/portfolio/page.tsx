import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { deletePortfolio, listPortfolio } from "@/lib/cms/store";

export default async function PortfolioAdminPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    format?: string;
    city?: string;
    sort?: string;
  }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const params = (await searchParams) ?? {};
  const search = (params.search || "").trim().toLowerCase();
  const category = (params.category || "").trim();
  const format = (params.format || "").trim();
  const city = (params.city || "").trim().toLowerCase();
  const sort = params.sort === "oldest" ? "oldest" : "newest";

  const portfolio = await listPortfolio();
  const filtered = portfolio
    .filter((item) =>
      !search ? true : item.brandName.toLowerCase().includes(search),
    )
    .filter((item) => (!category ? true : item.category === category))
    .filter((item) => (!format ? true : item.format === format))
    .filter((item) => (!city ? true : item.city.toLowerCase().includes(city)))
    .sort((a, b) =>
      sort === "oldest"
        ? a.createdAt.localeCompare(b.createdAt)
        : b.createdAt.localeCompare(a.createdAt),
    );

  const categories = Array.from(
    new Set(portfolio.map((item) => item.category)),
  ).sort();
  const formats = Array.from(
    new Set(portfolio.map((item) => item.format)),
  ).sort();

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Portfolio works</h1>
          <p className="mt-3 text-sm text-muted">
            Every uploaded file is listed as an individual portfolio record.
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
            href="/admin/portfolio/new"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            Add portfolio media
          </Link>
        </div>
      </div>

      <form className="mb-6 grid gap-4 rounded-[1.5rem] border border-[#ececec] bg-surface p-5 md:grid-cols-5">
        <input
          type="text"
          name="search"
          defaultValue={params.search || ""}
          placeholder="Search brand name"
          className="h-11 rounded-full border border-[#ececec] px-4 text-sm"
        />
        <select
          name="category"
          defaultValue={category}
          className="h-11 rounded-full border border-[#ececec] bg-surface px-4 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          name="format"
          defaultValue={format}
          className="h-11 rounded-full border border-[#ececec] bg-surface px-4 text-sm"
        >
          <option value="">All formats</option>
          {formats.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="city"
          defaultValue={params.city || ""}
          placeholder="Filter city"
          className="h-11 rounded-full border border-[#ececec] px-4 text-sm"
        />
        <div className="flex gap-3">
          <select
            name="sort"
            defaultValue={sort}
            className="h-11 flex-1 rounded-full border border-[#ececec] bg-surface px-4 text-sm"
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
        </div>
      </form>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#ececec] bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Brand Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Format</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Media Type</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-[#ececec] align-top">
                <td className="px-4 py-3">
                  {item.mediaType === "image" ? (
                    <Image
                      src={item.mediaUrl}
                      alt={item.brandName}
                      width={64}
                      height={48}
                      className="h-12 w-16 rounded object-cover"
                      unoptimized
                    />
                  ) : (
                    <video
                      src={item.mediaUrl}
                      className="h-12 w-16 rounded object-cover"
                      muted
                    />
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {item.brandName}
                </td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.format}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">
                  {item.mediaType === "image" ? "Image" : "Video"}
                </td>
                <td className="px-4 py-3">{item.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/portfolio/${item.id}`}
                      className="text-sm font-semibold text-ink underline underline-offset-4"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deletePortfolio(item.id);
                        revalidatePath("/admin/portfolio");
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
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No portfolio records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
