import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const lead = await prisma.lead.create({
      data: {
        name: String(body.name ?? "").trim(),
        email: String(body.email ?? "").trim().toLowerCase(),
        phone: String(body.phone ?? "").trim(),
        city: String(body.city ?? "").trim(),
        category: String(body.service ?? body.category ?? "").trim(),
        description: String(body.description ?? "").trim(),
      },
    });

    // Alle freigeschalteten Anbieter mit gültiger E-Mail suchen
    const providers = await prisma.provider.findMany({
      where: {
        status: "APPROVED",
        email: {
          not: "",
        },
      },
      select: {
        id: true,
        email: true,
        companyName: true,
      },
    });

    const portalUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://auftrago.ch";

    const mailResults = await Promise.allSettled(
      providers.map((provider) =>
        resend.emails.send({
          from: "Auftrago <info@auftrago.ch>",
          to: provider.email,
          subject: `Neue Auftrago-Anfrage: ${lead.category} in ${lead.city}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#f7f8fb;">
              <div style="background:#081426;color:#ffffff;padding:30px;border-radius:18px;">
                <p style="color:#7dd3fc;font-size:13px;font-weight:bold;text-transform:uppercase;">
                  Neue Kundenanfrage
                </p>

                <h1 style="font-size:26px;margin:10px 0 20px;">
                  ${escapeHtml(lead.category)}
                </h1>

                <p style="font-size:16px;line-height:1.6;">
                  Hallo ${escapeHtml(provider.companyName ?? "Anbieter")}
                </p>

                <p style="font-size:16px;line-height:1.6;">
                  Auf Auftrago ist eine neue Anfrage in Ihrer Region eingegangen.
                </p>

                <table style="width:100%;margin:24px 0;color:#ffffff;">
                  <tr>
                    <td style="padding:8px 0;color:#94a3b8;">Kategorie</td>
                    <td style="padding:8px 0;text-align:right;font-weight:bold;">
                      ${escapeHtml(lead.category)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#94a3b8;">Ort</td>
                    <td style="padding:8px 0;text-align:right;font-weight:bold;">
                      ${escapeHtml(lead.city)}
                    </td>
                  </tr>
                </table>

                <a
                  href="${portalUrl}/portal/leads"
                  style="display:inline-block;background:#38bdf8;color:#081426;text-decoration:none;font-weight:bold;padding:14px 22px;border-radius:10px;"
                >
                  Anfrage jetzt ansehen
                </a>

                <p style="margin-top:24px;color:#94a3b8;font-size:13px;">
                  Die vollständigen Kontaktdaten sind nach der Freischaltung im Anbieterportal sichtbar.
                </p>
              </div>
            </div>
          `,
        })
      )
    );

    const sent = mailResults.filter(
      (result) => result.status === "fulfilled"
    ).length;

    const failed = mailResults.filter(
      (result) => result.status === "rejected"
    );

    if (failed.length > 0) {
      console.error("ANBIETER MAIL FEHLER:", failed);
    }

    console.log(
      `Lead ${lead.id}: ${sent} von ${providers.length} Anbieter-Mails verarbeitet.`
    );

    return NextResponse.json({
      ok: true,
      lead,
      notifications: {
        providersFound: providers.length,
        emailsProcessed: sent,
        emailsFailed: failed.length,
      },
    });
  } catch (error) {
    console.error("LEAD CREATE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Lead konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}