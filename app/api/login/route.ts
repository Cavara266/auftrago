import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, type AuthUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          ok: false,
          error: "E-Mail und Passwort erforderlich.",
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

    const passwordIsValid = await bcrypt.compare(
      password,
      provider.password
    );

    if (!passwordIsValid) {
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

    if (provider.status === "BLOCKED") {
      return NextResponse.json(
        {
          ok: false,
          error: "Dieses Anbieterkonto wurde gesperrt.",
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