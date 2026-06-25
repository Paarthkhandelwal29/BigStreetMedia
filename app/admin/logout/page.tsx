import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/cms/auth";

export default async function LogoutPage() {
  await clearAdminSession();
  redirect("/admin/login");
}
