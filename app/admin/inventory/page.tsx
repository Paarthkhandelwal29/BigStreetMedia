import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { listInventory, deleteInventory } from "@/lib/cms/store";

export default async function InventoryAdminPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const inventory = await listInventory();

  return (
    <div className="container-bsm py-20">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-3xl font-bold text-ink">Media inventory</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin" className="text-sm font-semibold text-ink underline underline-offset-4">Dashboard</Link>
          <Link href="/admin/inventory/new" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Add inventory</Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-[#ececec] bg-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-4 py-3">Thumbnail</th>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t border-[#ececec]">
                <td className="px-4 py-3">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-12 w-16 rounded object-cover" /> : <span className="text-muted">No image</span>}
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{item.title}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">{item.mediaType}</td>
                <td className="px-4 py-3">{item.availability ? "Available" : "Hidden"}</td>
                <td className="px-4 py-3">{item.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/inventory/${item.id}`} className="text-sm font-semibold text-ink underline underline-offset-4">Edit</Link>
                    <form action={async () => { "use server"; await deleteInventory(item.id); }}>
                      <button className="text-sm font-semibold text-red-600">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
