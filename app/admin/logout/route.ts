import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clearAdminSession } from "@/lib/cms/auth";

export async function GET(request: NextRequest) {
  await clearAdminSession();
  // Redirect relative to the actual request origin so this works on any
  // domain without depending on NEXT_PUBLIC_SITE_URL being set.
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
