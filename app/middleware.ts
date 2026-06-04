import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPortalRoute = pathname.startsWith("/portal");
  const isAdminRoute = pathname.startsWith("/admin");

  const portalSession = request.cookies.get("auftrago_session")?.value;
  const adminSession = request.cookies.get("auftrago_admin")?.value;

  if (isPortalRoute && !portalSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminRoute && adminSession !== process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};