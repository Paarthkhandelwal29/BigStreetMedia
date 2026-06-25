"use server";

import { redirect } from "next/navigation";
import { uploadFile } from "@/lib/cms/imagekit";
import { createCaseStudy } from "@/lib/cms/store";
import { isAdminAuthenticated } from "@/lib/cms/auth";

export async function createCaseStudyAction(formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return { success: false, error: "Unauthorized" };

  const imageFiles = formData.getAll("images") as File[];
  const videoFiles = formData.getAll("videos") as File[];

  const images = [] as string[];
  for (const file of imageFiles) {
    if (file.size > 0) images.push(await uploadFile(Buffer.from(await file.arrayBuffer()), file.name));
  }

  const videos = [] as string[];
  for (const file of videoFiles) {
    if (file.size > 0) videos.push(await uploadFile(Buffer.from(await file.arrayBuffer()), file.name));
  }

  await createCaseStudy({
    title: String(formData.get("title") || ""),
    clientName: String(formData.get("clientName") || ""),
    objective: String(formData.get("objective") || ""),
    challenge: String(formData.get("challenge") || ""),
    solution: String(formData.get("solution") || ""),
    execution: String(formData.get("execution") || ""),
    results: String(formData.get("results") || ""),
    images,
    videos,
    featured: formData.get("featured") === "on",
  });

  redirect("/admin/case-studies");
  return { success: true };
}
