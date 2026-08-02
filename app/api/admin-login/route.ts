import {
  NextRequest,
  NextResponse,
} from "next/server";

const ADMIN_COOKIE_NAME = "auftrago_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function bytesToHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function createSignature(
  value: string,
  secret: string,
): Promise<string> {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );

  return bytesToHex(signature);
}

function safeCompare(
  first: string,
  second: string,
): boolean {
  if (first.length !== second.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < first.length; index += 1) {
    difference |=
      first.charCodeAt(index) ^
      second.charCodeAt(index);
  }

  return difference === 0;
}

async function readPassword(
  request: NextRequest,
): Promise<string> {
  const contentType =
    request.headers.get("content-type") || "";

  if (
    contentType.includes("application/json")
  ) {
    const body = (await request.json()) as {
      password?: unknown;
    };

    return typeof body.password === "string"
      ? body.password
      : "";
  }

  const formData = await request.formData();
  const password = formData.get("password");

  return typeof password === "string"
    ? password
    : "";
}

export async function POST(
  request: NextRequest,
) {
  try {
    const expectedPassword =
      process.env.ADMIN_PASSWORD ||
      process.env.ADMIN_SECRET;

    const signingSecret =
      process.env.ADMIN_SECRET ||
      process.env.ADMIN_PASSWORD;

    if (!expectedPassword || !signingSecret) {
      console.error(
        "ADMIN_PASSWORD oder ADMIN_SECRET fehlt.",
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Die Admin-Konfiguration ist unvollständig.",
        },
        {
          status: 500,
        },
      );
    }

    const submittedPassword =
      await readPassword(request);

    if (
      !safeCompare(
        submittedPassword,
        expectedPassword,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Falsches Admin-Passwort.",
        },
        {
          status: 401,
        },
      );
    }

    const timestamp = Math.floor(
      Date.now() / 1000,
    ).toString();

    const signature = await createSignature(
      timestamp,
      signingSecret,
    );

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: `${timestamp}.${signature}`,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Der Admin-Login konnte nicht ausgeführt werden.",
      },
      {
        status: 500,
      },
    );
  }
}
