import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// First-line guard for the admin area. Edge middleware can't run the Node
// `crypto` HMAC check, so it only verifies a session cookie is present and
// redirects to /admin/login when it isn't. Each admin page still performs the
// full `isAdminAuthenticated()` signature check (defense in depth) — this just
// makes it impossible to reach an admin route with no session at all.
const ADMIN_COOKIE_NAME = "admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page and logout route must stay reachable without a session.
  if (pathname === "/admin/login" || pathname === "/admin/logout") {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
  if (!hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only the admin app — leaves /api/admin/health and all public routes alone.
  matcher: ["/admin/:path*"],
};
