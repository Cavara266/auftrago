import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, type AuthUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    const password = String(body?.password || "");

    console.log("LOGIN TEST:", {
      email,
      passwordReceived: password.length > 0,
      passwordLength: password.length,
    });

    if (!email || !password) {
      return NextResponse.json(
        {
          ok: false,
          error: "E-Mail und Passwort sind erforderlich.",
        },
        {
          status: 400,
        }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: {
        email,
      },
    });

    console.log("LOGIN PROVIDER:", {
      found: Boolean(provider),
      providerEmail: provider?.email || null,
      status: provider?.status || null,
      passwordIsBcryptHash:
        provider?.password?.startsWith("$2a$") ||
        provider?.password?.startsWith("$2b$") ||
        provider?.password?.startsWith("$2y$") ||
        false,
    });

    if (!provider) {
      return NextResponse.json(
        {
          ok: false,
          error: "E-Mail oder Passwort ist falsch.",
        },
        {
          status: 401,
        }
      );
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      provider.password
    );

    console.log("LOGIN PASSWORD VALID:", passwordIsValid);

    if (!passwordIsValid) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Das eingegebene Passwort stimmt nicht mit dem gespeicherten Passwort überein.",
        },
        {
          status: 401,
        }
      );
    }

    if (provider.status === "PENDING") {
      return NextResponse.json(
        {
          ok: false,
          status: "PENDING",
          error:
            "Dein Anbieterkonto wird derzeit geprüft. Du erhältst eine E-Mail, sobald dein Konto freigegeben wurde.",
        },
        {
          status: 403,
        }
      );
    }

    if (provider.status === "BLOCKED") {
      return NextResponse.json(
        {
          ok: false,
          status: "BLOCKED",
          error:
            "Dieses Anbieterkonto wurde gesperrt. Bitte kontaktiere Auftrago.",
        },
        {
          status: 403,
        }
      );
    }

    const user: AuthUser = {
      id: provider.id,
      email: provider.email,
      name: provider.contactName,
      companyName: provider.companyName,
      contactName: provider.contactName,
      role: "provider",
      credits: provider.credits,
      status: provider.status,
    };

    await createSession(user);

    console.log("LOGIN SUCCESS:", {
      providerId: provider.id,
      email: provider.email,
    });

    return NextResponse.json({
      ok: true,
      provider: user,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Beim Login ist ein Serverfehler aufgetreten.",
      },
      {
        status: 500,
      }
    );
  }
}