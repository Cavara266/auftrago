import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(
  request: Request,
  { params }: RouteContext
) {
  try {
    const providerId = String(params.id || "").trim();
    const body = await request.json().catch(() => null);
    const password = String(body?.password || "");

    if (!providerId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Anbieter-ID fehlt.",
        },
        {
          status: 400,
        }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          error: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        },
        {
          status: 400,
        }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: {
        id: providerId,
      },
      select: {
        id: true,
        email: true,
        companyName: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        {
          ok: false,
          error: "Anbieter wurde nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.provider.update({
      where: {
        id: providerId,
      },
      data: {
        password: passwordHash,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Das Anbieter-Passwort wurde erfolgreich gespeichert.",
    });
  } catch (error) {
    console.error("SET PROVIDER PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Das Passwort konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      }
    );
  }
}