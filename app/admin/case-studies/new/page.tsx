"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCaseStudyAction } from "@/app/admin/case-studies/new/actions";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await createCaseStudyAction(formData);
    setLoading(false);
    if (result.success) router.push("/admin/case-studies");
    else setError(result.error || "Unable to save case study.");
  }

  return (
    <div className="container-bsm py-20">
      <h1 className="text-3xl font-bold text-ink">Add case study</h1>
      <form onSubmit={onSubmit} className="mt-8 grid gap-6 rounded-[1.5rem] border border-[#ececec] bg-surface p-8">
        <input name="title" placeholder="Title" className="h-12 rounded-full border border-[#ececec] px-4" required />
        <input name="clientName" placeholder="Client Name" className="h-12 rounded-full border border-[#ececec] px-4" required />
        <textarea name="objective" placeholder="Objective" className="min-h-24 rounded-[1.25rem] border border-[#ececec] px-4 py-3" required />
        <textarea name="challenge" placeholder="Challenge" className="min-h-24 rounded-[1.25rem] border border-[#ececec] px-4 py-3" required />
        <textarea name="solution" placeholder="Solution" className="min-h-24 rounded-[1.25rem] border border-[#ececec] px-4 py-3" required />
        <textarea name="execution" placeholder="Execution" className="min-h-24 rounded-[1.25rem] border border-[#ececec] px-4 py-3" required />
        <textarea name="results" placeholder="Results" className="min-h-24 rounded-[1.25rem] border border-[#ececec] px-4 py-3" required />
        <label className="text-sm text-muted">Images<input type="file" accept="image/*" multiple name="images" className="mt-2 block" /></label>
        <label className="text-sm text-muted">Videos<input type="file" accept="video/*" multiple name="videos" className="mt-2 block" /></label>
        <label className="flex items-center gap-2 text-sm text-muted"><input type="checkbox" name="featured" /> Featured</label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white">
          {loading ? "Saving..." : "Save case study"}
        </button>
      </form>
    </div>
  );
}
