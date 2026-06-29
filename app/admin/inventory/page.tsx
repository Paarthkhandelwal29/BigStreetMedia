import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { deleteInventory, listInventory } from "@/lib/cms/store";

export default async function InventoryAdminPage({
  searchParams,
}: {
  searchParams?: Promise<{
    city?: string;
    mediaType?: string;
  }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const params = (await searchParams) ?? {};
  const city = (params.city || "").trim().toLowerCase();
  const mediaType = (params.mediaType || "").trim().toLowerCase();

  const inventory = await listInventory();
  const filtered = inventory.filter(
    (item) =>
      (!city || item.city.toLowerCase().includes(city)) &&
      (!mediaType || item.mediaType.toLowerCase().includes(mediaType)),
  );

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Media inventory</h1>
          <p className="mt-3 text-sm text-muted">
            Each inventory record stores one location with multiple ImageKit
            image URLs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="text-sm font-semibold text-ink underline underline-offset-4"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/inventory/new"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white"
          >
            Add Inventory
          </Link>
          <Link
            href="/admin/inventory/batch"
            className="rounded-full border border-[#ececec] px-5 py-2.5 text-sm font-semibold text-ink"
          >
            Batch Upload (AI)
          </Link>
        </div>
      </div>

      <form className="mb-6 grid gap-4 rounded-[1.5rem] border border-[#ececec] bg-surface p-5 md:grid-cols-3">
        <input
          type="text"
          name="city"
          defaultValue={params.city || ""}
          placeholder="Search city"
          className="h-11 rounded-full border border-[#ececec] px-4 text-sm"
        />
        <input
          type="text"
          name="mediaType"
          defaultValue={params.mediaType || ""}
          placeholder="Search media type"
          className="h-11 rounded-full border border-[#ececec] px-4 text-sm"
        />
        <button
          type="submit"
          className="h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white"
        >
          Apply
        </button>
      </form>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#ececec] bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">First Image Preview</th>
              <th className="px-4 py-3">Media Type</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-[#ececec] align-top">
                <td className="px-4 py-3">
                  {item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.location}
                      width={64}
                      height={48}
                      className="h-12 w-16 rounded object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-muted">No image</span>
                  )}
                </td>
                <td className="px-4 py-3">{item.mediaType}</td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {item.city}
                </td>
                <td className="px-4 py-3">{item.size}</td>
                <td className="px-4 py-3 max-w-sm">{item.location}</td>
                <td className="px-4 py-3">{item.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/inventory/${item.id}`}
                      className="text-sm font-semibold text-ink underline underline-offset-4"
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
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-muted"
                >
                  No inventory records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
