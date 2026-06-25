"use server";

import { redirect } from "next/navigation";
import { setAdminSession } from "@/lib/cms/auth";

export async function loginAction(_prevState: { error: string; success?: boolean }, formData: FormData) {
  const password = formData.get("password");
  if (password === process.env.ADMIN_PASSWORD) {
    await setAdminSession();
    return { success: true, error: "" };
  }

  return { success: false, error: "Incorrect password." };
}
