"use server";

import { redirect } from "next/navigation";
import { uploadFile } from "@/lib/cms/imagekit";
import { createPortfolio } from "@/lib/cms/store";
import { isAdminAuthenticated } from "@/lib/cms/auth";

export async function createPortfolioAction(formData: FormData) {
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

  await createPortfolio({
    title: String(formData.get("title") || ""),
    clientName: String(formData.get("clientName") || ""),
    serviceType: String(formData.get("serviceType") || ""),
    location: String(formData.get("location") || ""),
    projectDate: String(formData.get("projectDate") || ""),
    description: String(formData.get("description") || ""),
    images,
    videos,
    featured: formData.get("featured") === "on",
  });

  redirect("/admin/portfolio");
  return { success: true };
}
