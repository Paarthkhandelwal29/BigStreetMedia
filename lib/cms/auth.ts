import { cookies } from "next/headers";

const adminPassword = process.env.ADMIN_PASSWORD;

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get("admin-auth")?.value === adminPassword;
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set("admin-auth", adminPassword || "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set("admin-auth", "", { maxAge: 0, path: "/" });
}
