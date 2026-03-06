import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "session";

export function middleware(req: NextRequest) {
  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/credits/:path*"],
};