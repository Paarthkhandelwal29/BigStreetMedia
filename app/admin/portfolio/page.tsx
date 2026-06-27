import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { deletePortfolio, listPortfolio } from "@/lib/cms/store";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import {
  PageHeader,
  Panel,
  controlInput,
  ghostButton,
  primaryButton,
} from "@/components/admin/ui";

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
  const hasFilters = Boolean(search || category || format || city);

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

  const selectClass = controlInput + " appearance-none pr-9";

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Portfolio works"
        description="Campaign media shown on the public portfolio. Every uploaded file is its own record."
        action={
          <Link href="/admin/portfolio/new" className={primaryButton}>
            Add media
          </Link>
        }
      />

      <Panel className="mb-5 p-3">
        <form className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            name="search"
            defaultValue={params.search || ""}
            placeholder="Search brand"
            className={controlInput}
          />
          <select name="category" defaultValue={category} className={selectClass}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select name="format" defaultValue={format} className={selectClass}>
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
            className={controlInput}
          />
          <select name="sort" defaultValue={sort} className={selectClass}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3 lg:justify-end">
            <button type="submit" className={primaryButton}>
              Apply
            </button>
            {hasFilters ? (
              <Link href="/admin/portfolio" className={ghostButton}>
                Clear
              </Link>
            ) : null}
          </div>
        </form>
      </Panel>

      <div className="mb-3 px-1 text-xs text-muted">
        {filtered.length} of {portfolio.length}{" "}
        {portfolio.length === 1 ? "item" : "items"}
      </div>

      <Panel className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState hasFilters={hasFilters} total={portfolio.length} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                  <th className="px-4 py-3 font-semibold">Preview</th>
                  <th className="px-4 py-3 font-semibold">Brand</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Format</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-hairline last:border-0 transition-colors hover:bg-surface-2"
                  >
                    <td className="px-4 py-3">
                      {item.mediaType === "image" ? (
                        <Image
                          src={item.mediaUrl}
                          alt={item.brandName}
                          width={56}
                          height={42}
                          className="h-10 w-14 rounded-md border border-hairline object-cover"
                          unoptimized
                        />
                      ) : (
                        <video
                          src={item.mediaUrl}
                          className="h-10 w-14 rounded-md border border-hairline object-cover"
                          muted
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">
                        {item.brandName}
                      </div>
                      <div className="text-xs capitalize text-muted">
                        {item.mediaType}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body">{item.category}</td>
                    <td className="px-4 py-3 text-body">{item.format}</td>
                    <td className="px-4 py-3 text-body">{item.city}</td>
                    <td className="px-4 py-3">
                      {item.featured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-2.5 py-1 text-xs font-semibold text-ink">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-deep" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-muted">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/portfolio/${item.id}`}
                          className="text-sm font-medium text-ink transition-colors hover:text-amber-deep"
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
                          <ConfirmSubmit
                            message="Delete this portfolio item? This cannot be undone."
                            className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                          >
                            Delete
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}

function EmptyState({
  hasFilters,
  total,
}: {
  hasFilters: boolean;
  total: number;
}) {
  if (hasFilters && total > 0) {
    return (
      <div className="px-6 py-16 text-center">
        <p className="text-sm font-semibold text-ink">No matching media</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          No portfolio items match these filters.
        </p>
        <Link
          href="/admin/portfolio"
          className={ghostButton + " mt-5 inline-flex"}
        >
          Clear filters
        </Link>
      </div>
    );
  }
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-sm font-semibold text-ink">No portfolio media yet</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
        Upload campaign images or video to build out the public portfolio.
      </p>
      <Link
        href="/admin/portfolio/new"
        className={primaryButton + " mt-5 inline-flex"}
      >
        Add media
      </Link>
    </div>
  );
}
