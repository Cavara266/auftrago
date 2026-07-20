import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RESET_TOKEN_DURATION_MINUTES = 60;

function normalizeEmail(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function createResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashResetToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function getBaseUrl(request: Request) {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  return new URL(request.url).origin;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = normalizeEmail(body?.email);

    if (!email) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bitte gib deine E-Mail-Adresse ein.",
        },
        {
          status: 400,
        }
      );
    }

    const genericResponse = {
      ok: true,
      message:
        "Falls ein Konto mit dieser E-Mail-Adresse existiert, wurde ein Link zum Zurücksetzen des Passworts versendet.",
    };

    const provider = await prisma.provider.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        contactName: true,
        companyName: true,
      },
    });

    /*
     * Aus Sicherheitsgründen wird nicht offengelegt,
     * ob diese E-Mail-Adresse registriert ist.
     */
    if (!provider) {
      return NextResponse.json(genericResponse);
    }

    const token = createResetToken();
    const tokenHash = hashResetToken(token);

    const expiresAt = new Date(
      Date.now() + RESET_TOKEN_DURATION_MINUTES * 60 * 1000
    );

    /*
     * Alte, noch nicht verwendete Reset-Tokens entfernen.
     */
    await prisma.passwordResetToken.deleteMany({
      where: {
        email,
        usedAt: null,
      },
    });

    await prisma.passwordResetToken.create({
      data: {
        email,
        tokenHash,
        expiresAt,
      },
    });

    const baseUrl = getBaseUrl(request);

    const resetUrl =
      `${baseUrl}/passwort-zuruecksetzen` +
      `?token=${encodeURIComponent(token)}`;

    const greeting =
      provider.contactName?.trim() ||
      provider.companyName?.trim() ||
      "Auftrago-Anbieter";

    const safeGreeting = escapeHtml(greeting);
    const safeResetUrl = escapeHtml(resetUrl);

    try {
      await sendMail({
        to: provider.email,
        subject: "Auftrago – Passwort zurücksetzen",

        text: `
Hallo ${greeting}

Wir haben eine Anfrage erhalten, das Passwort für dein Auftrago-Konto zurückzusetzen.

Über diesen Link kannst du ein neues Passwort festlegen:

${resetUrl}

Der Link ist ${RESET_TOKEN_DURATION_MINUTES} Minuten gültig und kann nur einmal verwendet werden.

Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren. Dein bisheriges Passwort bleibt unverändert.

Freundliche Grüsse

Auftrago
www.auftrago.ch
        `.trim(),

        html: `
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1"
    />
    <title>Passwort zurücksetzen</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f4f5;
      font-family: Arial, Helvetica, sans-serif;
      color: #18181b;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background: #f4f4f5; padding: 32px 16px;"
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
              max-width: 600px;
              background: #ffffff;
              border-radius: 18px;
              overflow: hidden;
              border: 1px solid #e4e4e7;
            "
          >
            <tr>
              <td
                style="
                  background: #111827;
                  padding: 28px 32px;
                  text-align: center;
                "
              >
                <div
                  style="
                    font-size: 28px;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -0.5px;
                  "
                >
                  Auftrago
                </div>

                <div
                  style="
                    margin-top: 6px;
                    font-size: 14px;
                    color: #d1d5db;
                  "
                >
                  Neue Aufträge. Neue Möglichkeiten.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding: 36px 32px;">
                <h1
                  style="
                    margin: 0 0 18px;
                    font-size: 26px;
                    line-height: 1.25;
                    color: #111827;
                  "
                >
                  Passwort zurücksetzen
                </h1>

                <p
                  style="
                    margin: 0 0 16px;
                    font-size: 16px;
                    line-height: 1.7;
                    color: #3f3f46;
                  "
                >
                  Hallo ${safeGreeting},
                </p>

                <p
                  style="
                    margin: 0 0 24px;
                    font-size: 16px;
                    line-height: 1.7;
                    color: #3f3f46;
                  "
                >
                  Wir haben eine Anfrage erhalten, das Passwort
                  für dein Auftrago-Konto zurückzusetzen.
                </p>

                <table
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="margin: 0 0 26px;"
                >
                  <tr>
                    <td
                      style="
                        background: #111827;
                        border-radius: 10px;
                      "
                    >
                      <a
                        href="${safeResetUrl}"
                        style="
                          display: inline-block;
                          padding: 15px 24px;
                          color: #ffffff;
                          text-decoration: none;
                          font-size: 16px;
                          font-weight: 700;
                        "
                      >
                        Neues Passwort festlegen
                      </a>
                    </td>
                  </tr>
                </table>

                <p
                  style="
                    margin: 0 0 16px;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #71717a;
                  "
                >
                  Der Link ist
                  ${RESET_TOKEN_DURATION_MINUTES} Minuten gültig
                  und kann nur einmal verwendet werden.
                </p>

                <p
                  style="
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.7;
                    color: #71717a;
                  "
                >
                  Falls du diese Anfrage nicht gestellt hast,
                  kannst du diese E-Mail ignorieren. Dein
                  bestehendes Passwort bleibt unverändert.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 22px 32px;
                  background: #fafafa;
                  border-top: 1px solid #e4e4e7;
                  text-align: center;
                "
              >
                <p
                  style="
                    margin: 0;
                    font-size: 13px;
                    line-height: 1.6;
                    color: #71717a;
                  "
                >
                  Auftrago.ch
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
        `.trim(),
      });
    } catch (mailError) {
      /*
       * Token wieder löschen, wenn die E-Mail nicht
       * verschickt werden konnte.
       */
      await prisma.passwordResetToken.deleteMany({
        where: {
          tokenHash,
        },
      });

      console.error(
        "FORGOT PASSWORD SMTP ERROR:",
        mailError
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Die E-Mail konnte momentan nicht versendet werden. Bitte versuche es später erneut.",
        },
        {
          status: 500,
        }
      );
    }

    console.log("PASSWORD RESET MAIL SENT:", {
      providerId: provider.id,
      email: provider.email,
      expiresAt,
    });

    return NextResponse.json(genericResponse);
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          "Beim Versenden der E-Mail ist ein Serverfehler aufgetreten.",
      },
      {
        status: 500,
      }
    );
  }
}