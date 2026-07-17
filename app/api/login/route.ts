import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { createSession, type AuthUser } from "@/lib/auth";
import { trackProviderActivity } from "@/lib/provider-activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || undefined;
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    const password = String(body?.password || "");

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

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    const passwordIsValid = await bcrypt.compare(
      password,
      provider.password
    );

    if (!passwordIsValid) {
      await trackProviderActivity({
        providerId: provider.id,
        event: "LOGIN_FAILED",
        description: "Fehlgeschlagener Login wegen falschem Passwort",
        page: "/login",
        ipAddress,
        userAgent,
        metadata: {
          reason: "INVALID_PASSWORD",
        },
      });

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

    if (provider.status === "PENDING") {
      await trackProviderActivity({
        providerId: provider.id,
        event: "LOGIN_BLOCKED",
        description:
          "Login abgelehnt, weil das Anbieterkonto noch geprüft wird",
        page: "/login",
        ipAddress,
        userAgent,
        metadata: {
          reason: "PENDING",
          providerStatus: provider.status,
        },
      });

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
      await trackProviderActivity({
        providerId: provider.id,
        event: "LOGIN_BLOCKED",
        description:
          "Login abgelehnt, weil das Anbieterkonto gesperrt ist",
        page: "/login",
        ipAddress,
        userAgent,
        metadata: {
          reason: "BLOCKED",
          providerStatus: provider.status,
        },
      });

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

    await trackProviderActivity({
      providerId: provider.id,
      event: "LOGIN",
      description: "Anbieter erfolgreich eingeloggt",
      page: "/login",
      ipAddress,
      userAgent,
      metadata: {
        companyName: provider.companyName,
        contactName: provider.contactName,
        creditsAtLogin: provider.credits,
        providerStatus: provider.status,
      },
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