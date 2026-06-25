"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortfolioAction } from "@/app/admin/portfolio/new/actions";

export default function NewPortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await createPortfolioAction(formData);
    setLoading(false);
    if (result.success) router.push("/admin/portfolio");
    else setError(result.error || "Unable to save project.");
  }

  return (
    <div className="container-bsm py-20">
      <h1 className="text-3xl font-bold text-ink">Add portfolio project</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-6 rounded-[1.5rem] border border-[#ececec] bg-surface p-8">
        <input name="title" placeholder="Project Title" className="h-12 rounded-full border border-[#ececec] px-4" required />
        <input name="clientName" placeholder="Client Name" className="h-12 rounded-full border border-[#ececec] px-4" />
        <input name="serviceType" placeholder="Service Type" className="h-12 rounded-full border border-[#ececec] px-4" required />
        <input name="location" placeholder="Location" className="h-12 rounded-full border border-[#ececec] px-4" />
        <input name="projectDate" placeholder="Project Date" className="h-12 rounded-full border border-[#ececec] px-4" />
        <textarea name="description" placeholder="Description" className="min-h-28 rounded-[1.25rem] border border-[#ececec] px-4 py-3" required />
        <label className="text-sm text-muted">Images<input type="file" accept="image/*" multiple name="images" className="mt-2 block" /></label>
        <label className="text-sm text-muted">Videos<input type="file" accept="video/*" multiple name="videos" className="mt-2 block" /></label>
        <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="featured" /> Featured</label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
          {loading ? "Saving..." : "Save project"}
        </button>
      </form>
    </div>
  );
}
