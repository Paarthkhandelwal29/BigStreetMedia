"use server";

import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { uploadFile } from "@/lib/cms/imagekit";
import { upsertServiceFormatImage } from "@/lib/cms/store";

export async function deleteServiceFormatImageAction(recordId: string) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) return { ok: false, msg: "Unauthorized" };

    const { deleteServiceFormatImage } = await import("@/lib/cms/store");
    await deleteServiceFormatImage(recordId);
    revalidatePath("/admin/service-media");
    return { ok: true, msg: "Deleted." };
  } catch (error) {
    return {
      ok: false,
      msg: error instanceof Error ? error.message : "Delete failed.",
    };
  }
}

export async function uploadServiceFormatImageAction(formData: FormData) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) return { ok: false, msg: "Unauthorized" };

    const serviceSlug = String(formData.get("serviceSlug") || "").trim();
    const formatName = String(formData.get("formatName") || "").trim();
    const file = formData.get("file") as File | null;

    if (!serviceSlug || !formatName || !file || file.size === 0) {
      return { ok: false, msg: "Please fill all fields and select a file." };
    }

    const imageUrl = await uploadFile(
      Buffer.from(await file.arrayBuffer()),
      file.name,
    );

    console.log("[service-media] upsert:start", { serviceSlug, formatName, imageUrl });
    await upsertServiceFormatImage({ serviceSlug, formatName, imageUrl });
    console.log("[service-media] upsert:done");

    revalidatePath("/admin/service-media");
    return { ok: true, msg: "Image uploaded successfully." };
  } catch (error) {
    console.error("[service-media] error", error);
    return {
      ok: false,
      msg: error instanceof Error ? error.message : "Upload failed.",
    };
  }
}
