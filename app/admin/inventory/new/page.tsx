"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInventoryAction } from "@/app/admin/inventory/new/actions";

export default function NewInventoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await createInventoryAction(formData);
    setLoading(false);
    if (result.success) router.push("/admin/inventory");
    else setError(result.error || "Unable to save inventory.");
  }

  return (
    <div className="container-bsm py-20">
      <h1 className="text-3xl font-bold text-ink">Add inventory</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-6 rounded-[1.5rem] border border-[#ececec] bg-surface p-8">
        <input name="title" placeholder="Title" className="h-12 rounded-full border border-[#ececec] px-4" required />
        <textarea name="description" placeholder="Description" className="min-h-28 rounded-[1.25rem] border border-[#ececec] px-4 py-3" />
        <div className="grid gap-4 md:grid-cols-2">
          <input name="siteCode" placeholder="Site Code" className="h-12 rounded-full border border-[#ececec] px-4" />
          <input name="city" placeholder="City" className="h-12 rounded-full border border-[#ececec] px-4" required />
          <input name="state" placeholder="State" className="h-12 rounded-full border border-[#ececec] px-4" required />
          <input name="locality" placeholder="Locality" className="h-12 rounded-full border border-[#ececec] px-4" />
        </div>
        <input name="address" placeholder="Address" className="h-12 rounded-full border border-[#ececec] px-4" />
        <input name="googleMapsUrl" placeholder="Google Maps URL" className="h-12 rounded-full border border-[#ececec] px-4" />
        <div className="grid gap-4 md:grid-cols-2">
          <input name="mediaType" placeholder="Media Type" className="h-12 rounded-full border border-[#ececec] px-4" required />
          <input name="mediaCategory" placeholder="Media Category" className="h-12 rounded-full border border-[#ececec] px-4" />
          <input name="width" type="number" placeholder="Width" className="h-12 rounded-full border border-[#ececec] px-4" />
          <input name="height" type="number" placeholder="Height" className="h-12 rounded-full border border-[#ececec] px-4" />
        </div>
        <input name="size" placeholder="Size" className="h-12 rounded-full border border-[#ececec] px-4" />
        <input name="illumination" placeholder="Illumination" className="h-12 rounded-full border border-[#ececec] px-4" />
        <input name="trafficVolume" placeholder="Traffic Volume" className="h-12 rounded-full border border-[#ececec] px-4" />
        <input name="mediaOwner" placeholder="Media Owner / Vendor" className="h-12 rounded-full border border-[#ececec] px-4" />
        <input name="industries" placeholder="Industries (comma separated)" className="h-12 rounded-full border border-[#ececec] px-4" />
        <input name="tags" placeholder="Tags (comma separated)" className="h-12 rounded-full border border-[#ececec] px-4" />
        <label className="text-sm text-muted">Main image<input type="file" accept="image/*" name="image" className="mt-2 block" /></label>
        <label className="text-sm text-muted">Gallery images<input type="file" accept="image/*" multiple name="gallery" className="mt-2 block" /></label>
        <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="availability" defaultChecked /> Available</label>
        <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="featured" /> Featured</label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
          {loading ? "Saving..." : "Save inventory"}
        </button>
      </form>
    </div>
  );
}
