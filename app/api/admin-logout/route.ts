import {
  NextRequest,
  NextResponse,
} from "next/server";

const ADMIN_COOKIE_NAME = "auftrago_admin_session";

function createLogoutResponse(
  request: NextRequest,
) {
  const response = NextResponse.redirect(
    new URL("/admin-login", request.url),
  );

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export async function GET(
  request: NextRequest,
) {
  return createLogoutResponse(request);
}

export async function POST(
  request: NextRequest,
) {
  return createLogoutResponse(request);
}
