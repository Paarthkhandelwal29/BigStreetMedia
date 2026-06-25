"use server";

import { redirect } from "next/navigation";
import { uploadFile } from "@/lib/cms/imagekit";
import { createInventory } from "@/lib/cms/store";
import { isAdminAuthenticated } from "@/lib/cms/auth";

export async function createInventoryAction(formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) return { success: false, error: "Unauthorized" };

  const imageFile = formData.get("image") as File | null;
  const galleryFiles = formData.getAll("gallery") as File[];

  const imageUrl = imageFile && imageFile.size > 0 ? await uploadFile(Buffer.from(await imageFile.arrayBuffer()), imageFile.name) : "";
  const galleryImages = [] as string[];

  for (const file of galleryFiles) {
    if (file.size > 0) galleryImages.push(await uploadFile(Buffer.from(await file.arrayBuffer()), file.name));
  }

  const record = await createInventory({
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    siteCode: String(formData.get("siteCode") || ""),
    city: String(formData.get("city") || ""),
    state: String(formData.get("state") || ""),
    locality: String(formData.get("locality") || ""),
    address: String(formData.get("address") || ""),
    googleMapsUrl: String(formData.get("googleMapsUrl") || ""),
    mediaType: String(formData.get("mediaType") || ""),
    mediaCategory: String(formData.get("mediaCategory") || ""),
    width: formData.get("width") ? Number(formData.get("width")) : undefined,
    height: formData.get("height") ? Number(formData.get("height")) : undefined,
    size: String(formData.get("size") || ""),
    illumination: String(formData.get("illumination") || ""),
    trafficVolume: String(formData.get("trafficVolume") || ""),
    mediaOwner: String(formData.get("mediaOwner") || ""),
    industries: String(formData.get("industries") || "").split(",").map((value) => value.trim()).filter(Boolean),
    tags: String(formData.get("tags") || "").split(",").map((value) => value.trim()).filter(Boolean),
    imageUrl,
    galleryImages,
    availability: formData.get("availability") === "on",
    featured: formData.get("featured") === "on",
  });

  redirect("/admin/inventory");
  return { success: true, record };
}
