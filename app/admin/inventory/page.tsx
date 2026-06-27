import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { deleteInventory, listInventory } from "@/lib/cms/store";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import {
  PageHeader,
  Panel,
  controlInput,
  ghostButton,
  primaryButton,
} from "@/components/admin/ui";

export default async function InventoryAdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ city?: string; mediaType?: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const params = (await searchParams) ?? {};
  const city = (params.city || "").trim().toLowerCase();
  const mediaType = (params.mediaType || "").trim().toLowerCase();
  const hasFilters = Boolean(city || mediaType);

  const inventory = await listInventory();
  const filtered = inventory.filter(
    (item) =>
      (!city || item.city.toLowerCase().includes(city)) &&
      (!mediaType || item.mediaType.toLowerCase().includes(mediaType)),
  );

  return (
    <>
      <PageHeader
        eyebrow="Inventory"
        title="Media inventory"
        description="Locations shown on the public inventory page. Each record holds one location with its photos."
        action={
          <Link href="/admin/inventory/new" className={primaryButton}>
            Add inventory
          </Link>
        }
      />

      <Panel className="mb-5 p-3">
        <form className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <input
            type="text"
            name="city"
            defaultValue={params.city || ""}
            placeholder="Filter by city"
            className={controlInput + " sm:max-w-xs"}
          />
          <input
            type="text"
            name="mediaType"
            defaultValue={params.mediaType || ""}
            placeholder="Filter by media type"
            className={controlInput + " sm:max-w-xs"}
          />
          <div className="flex items-center gap-2">
            <button type="submit" className={primaryButton}>
              Apply
            </button>
            {hasFilters ? (
              <Link href="/admin/inventory" className={ghostButton}>
                Clear
              </Link>
            ) : null}
          </div>
        </form>
      </Panel>

      <div className="mb-3 px-1 text-xs text-muted">
        {filtered.length} of {inventory.length}{" "}
        {inventory.length === 1 ? "location" : "locations"}
      </div>

      <Panel className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState hasFilters={hasFilters} total={inventory.length} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-hairline text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                  <th className="px-4 py-3 font-semibold">Preview</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Size</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Added</th>
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
                      {item.images[0] ? (
                        <Image
                          src={item.images[0]}
                          alt={item.location}
                          width={56}
                          height={42}
                          className="h-10 w-14 rounded-md border border-hairline object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-10 w-14 items-center justify-center rounded-md border border-dashed border-hairline text-[10px] text-muted">
                          None
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink">{item.city}</div>
                      <div className="max-w-xs truncate text-xs text-muted">
                        {item.location}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body">{item.mediaType}</td>
                    <td className="px-4 py-3 text-body">{item.size}</td>
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
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/inventory/${item.id}`}
                          className="text-sm font-medium text-ink transition-colors hover:text-amber-deep"
                        >
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteInventory(item.id);
                            revalidatePath("/admin/inventory");
                          }}
                        >
                          <ConfirmSubmit
                            message="Delete this inventory item? This cannot be undone."
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
        <p className="text-sm font-semibold text-ink">No matching locations</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
          No inventory matches these filters.
        </p>
        <Link
          href="/admin/inventory"
          className={ghostButton + " mt-5 inline-flex"}
        >
          Clear filters
        </Link>
      </div>
    );
  }
  return (
    <div className="px-6 py-16 text-center">
      <p className="text-sm font-semibold text-ink">No inventory yet</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted">
        Add your first media location to surface it on the public inventory
        page.
      </p>
      <Link
        href="/admin/inventory/new"
        className={primaryButton + " mt-5 inline-flex"}
      >
        Add inventory
      </Link>
    </div>
  );
}
