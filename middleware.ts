import {
  NextRequest,
  NextResponse,
} from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host =
    request.headers.get("host")?.split(":")[0] || "";

  /*
   * Immer dieselbe Hauptdomain verwenden.
   * So bleiben Login und Cookies stabil.
   */
  if (
    process.env.NODE_ENV === "production" &&
    host === "auftrago.ch"
  ) {
    const target = request.nextUrl.clone();

    target.hostname = "www.auftrago.ch";
    target.protocol = "https:";
    target.port = "";

    return NextResponse.redirect(target, 308);
  }

  /*
   * Alte Anbieter-Routen direkt ins neue Portal schicken.
   */
  if (pathname === "/credits") {
    return NextResponse.redirect(
      new URL("/portal/guthaben", request.url),
      307
    );
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(
      new URL("/portal", request.url),
      307
    );
  }

  if (pathname === "/leads") {
    return NextResponse.redirect(
      new URL("/portal/leads", request.url),
      307
    );
  }

  if (pathname.startsWith("/leads/")) {
    return NextResponse.redirect(
      new URL("/portal/leads", request.url),
      307
    );
  }

  const isPortalRoute =
    pathname === "/portal" ||
    pathname.startsWith("/portal/");

  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  const portalSession = request.cookies.get(
    "auftrago_session"
  )?.value;

  const adminSession = request.cookies.get(
    "auftrago_admin"
  )?.value;

  if (isPortalRoute && !portalSession) {
    const loginUrl = new URL(
      "/login",
      request.url
    );

    loginUrl.searchParams.set(
      "redirect",
      pathname
    );

    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute) {
    const adminSecret =
      process.env.ADMIN_SECRET;

    if (
      !adminSecret ||
      adminSession !== adminSecret
    ) {
      return NextResponse.redirect(
        new URL(
          "/admin-login",
          request.url
        )
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/credits",
    "/dashboard",
    "/leads/:path*",
    "/portal/:path*",
    "/admin/:path*",
  ],
};
