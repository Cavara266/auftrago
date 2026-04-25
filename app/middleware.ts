import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isPortalRoute = request.nextUrl.pathname.startsWith("/portal");
  const session = request.cookies.get("auftrago_session")?.value;

  if (isPortalRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*"],
};