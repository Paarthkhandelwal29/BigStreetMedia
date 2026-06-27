"use server";

import { redirect } from "next/navigation";
import { setAdminSession } from "@/lib/cms/auth";

type LoginState = { error: string; success?: boolean };

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim() || "";
  if (!configuredPassword) {
    return { success: false, error: "Admin password is not configured." };
  }

  const password = String(formData.get("password") || "");
  if (password === configuredPassword) {
    await setAdminSession();
    redirect("/admin");
  }

  return { success: false, error: "Incorrect password." };
}
