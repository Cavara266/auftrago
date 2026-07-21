import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mail";

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
      process.env.NEXT_PUBLIC_APP_URL?.trim() ||
      "https://auftrago.ch";

    const mailResults = await Promise.allSettled(
      providers.map(async (provider) => {
        const providerName =
          provider.companyName?.trim() || "Anbieter";

        return sendMail({
          to: provider.email,
          subject: `🔥 Neue Kundenanfrage: ${lead.category} in ${lead.city}`,
          text: `
Hallo ${providerName}

Auf Auftrago ist eine neue Kundenanfrage eingegangen.

Kategorie: ${lead.category}
Ort: ${lead.city}

Anfrage ansehen:
${portalUrl}/portal/leads

Die vollständigen Kontaktdaten sind nach der Freischaltung im Anbieterportal sichtbar.

Freundliche Grüsse
Auftrago
          `.trim(),
          html: `
            <div style="margin:0;padding:30px;background:#f3f4f6;font-family:Arial,sans-serif;">
              <div style="max-width:620px;margin:0 auto;background:#081426;color:#ffffff;padding:32px;border-radius:18px;">
                
                <p style="margin:0 0 10px;color:#7dd3fc;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                  Neue Kundenanfrage
                </p>

                <h1 style="margin:0 0 24px;font-size:27px;line-height:1.3;">
                  ${escapeHtml(lead.category)}
                </h1>

                <p style="font-size:16px;line-height:1.6;">
                  Hallo ${escapeHtml(providerName)}
                </p>

                <p style="font-size:16px;line-height:1.6;">
                  Auf Auftrago ist eine neue Kundenanfrage eingegangen.
                </p>

                <table style="width:100%;margin:25px 0;border-collapse:collapse;color:#ffffff;">
                  <tr>
                    <td style="padding:11px 0;color:#94a3b8;border-bottom:1px solid #223047;">
                      Kategorie
                    </td>
                    <td style="padding:11px 0;text-align:right;font-weight:700;border-bottom:1px solid #223047;">
                      ${escapeHtml(lead.category)}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:11px 0;color:#94a3b8;">
                      Ort
                    </td>
                    <td style="padding:11px 0;text-align:right;font-weight:700;">
                      ${escapeHtml(lead.city)}
                    </td>
                  </tr>
                </table>

                <a
                  href="${portalUrl}/portal/leads"
                  style="display:inline-block;background:#38bdf8;color:#081426;text-decoration:none;font-size:15px;font-weight:700;padding:14px 22px;border-radius:10px;"
                >
                  Anfrage jetzt ansehen
                </a>

                <p style="margin-top:25px;color:#94a3b8;font-size:13px;line-height:1.5;">
                  Die vollständigen Kontaktdaten sind nach der Freischaltung im Anbieterportal sichtbar.
                </p>
              </div>
            </div>
          `,
        });
      })
    );

    const sent = mailResults.filter(
      (result) => result.status === "fulfilled"
    ).length;

    const failedResults = mailResults.filter(
      (result): result is PromiseRejectedResult =>
        result.status === "rejected"
    );

    if (failedResults.length > 0) {
      console.error(
        "ANBIETER MAIL FEHLER:",
        failedResults.map((result) => result.reason)
      );
    }

    console.log("NEW LEAD NOTIFICATIONS COMPLETED:", {
      leadId: lead.id,
      approvedProviders: providers.length,
      sent,
      failed: failedResults.length,
    });

    return NextResponse.json({
      ok: true,
      lead,
      notifications: {
        approvedProviders: providers.length,
        sent,
        failed: failedResults.length,
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

function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}