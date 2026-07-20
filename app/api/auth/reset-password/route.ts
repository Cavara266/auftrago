import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Das Passwort muss mindestens 8 Zeichen lang sein.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Das Passwort muss mindestens einen Grossbuchstaben enthalten.";
  }

  if (!/[a-z]/.test(password)) {
    return "Das Passwort muss mindestens einen Kleinbuchstaben enthalten.";
  }

  if (!/[0-9]/.test(password)) {
    return "Das Passwort muss mindestens eine Zahl enthalten.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const token = String(body?.token || "").trim();
    const password = String(body?.password || "");
    const passwordConfirmation = String(
      body?.passwordConfirmation || ""
    );

    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Der Link zum Zurücksetzen des Passworts ist ungültig.",
        },
        {
          status: 400,
        }
      );
    }

    if (!password || !passwordConfirmation) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bitte fülle beide Passwortfelder aus.",
        },
        {
          status: 400,
        }
      );
    }

    if (password !== passwordConfirmation) {
      return NextResponse.json(
        {
          ok: false,
          error: "Die eingegebenen Passwörter stimmen nicht überein.",
        },
        {
          status: 400,
        }
      );
    }

    const passwordError = validatePassword(password);

    if (passwordError) {
      return NextResponse.json(
        {
          ok: false,
          error: passwordError,
        },
        {
          status: 400,
        }
      );
    }

    const tokenHash = hashResetToken(token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        tokenHash,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Der Link ist ungültig oder wurde bereits verwendet.",
        },
        {
          status: 400,
        }
      );
    }

    if (resetToken.usedAt) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Dieser Link wurde bereits verwendet. Bitte fordere einen neuen Link an.",
        },
        {
          status: 400,
        }
      );
    }

    if (resetToken.expiresAt.getTime() <= Date.now()) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Dieser Link ist abgelaufen. Bitte fordere einen neuen Link an.",
        },
        {
          status: 400,
        }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: {
        email: resetToken.email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!provider) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Das zugehörige Anbieterkonto wurde nicht gefunden.",
        },
        {
          status: 400,
        }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const usedAt = new Date();

    await prisma.$transaction([
      prisma.provider.update({
        where: {
          id: provider.id,
        },
        data: {
          password: passwordHash,
        },
      }),

      prisma.passwordResetToken.update({
        where: {
          id: resetToken.id,
        },
        data: {
          usedAt,
        },
      }),

      /*
       * Alle weiteren offenen Tokens derselben E-Mail ungültig machen.
       */
      prisma.passwordResetToken.updateMany({
        where: {
          email: resetToken.email,
          usedAt: null,
          id: {
            not: resetToken.id,
          },
        },
        data: {
          usedAt,
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message:
        "Dein Passwort wurde erfolgreich geändert. Du kannst dich jetzt einloggen.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          "Beim Ändern des Passworts ist ein Serverfehler aufgetreten.",
      },
      {
        status: 500,
      }
    );
  }
}