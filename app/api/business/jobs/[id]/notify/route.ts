import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendMail } from "@/lib/mail/mail";

function buildStatusMessage(
  status: string,
  startTime: string | null
) {
  switch (status) {
    case "ON_THE_WAY":
      return startTime
        ? `Guten Tag, wir möchten Sie kurz informieren, dass wir nun auf dem Weg zu Ihnen sind. Wir werden voraussichtlich gegen ${startTime} Uhr bei Ihnen eintreffen. Vielen Dank und bis gleich.`
        : "Guten Tag, wir möchten Sie kurz informieren, dass wir nun auf dem Weg zu Ihnen sind. Vielen Dank und bis gleich.";

    case "ON_SITE":
      return "Guten Tag, wir sind nun bei Ihnen vor Ort angekommen und bereiten die vereinbarten Arbeiten vor.";

    case "IN_PROGRESS":
      return "Guten Tag, wir haben nun mit den vereinbarten Arbeiten begonnen. Wir informieren Sie gerne wieder, sobald die Arbeiten abgeschlossen sind.";

    case "DONE":
      return "Guten Tag, die vereinbarten Arbeiten wurden erfolgreich abgeschlossen. Vielen Dank für Ihren Auftrag und Ihr Vertrauen.";

    default:
      return "";
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const job = await prisma.businessJob.findFirst({
      where: {
        id,
        providerId: user.id,
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Einsatz nicht gefunden." },
        { status: 404 }
      );
    }

    const status =
      typeof body.status === "string"
        ? body.status
        : "";

    const customMessage =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    const message =
      customMessage ||
      buildStatusMessage(
        status,
        job.startTime
      );

    if (!message) {
      return NextResponse.json(
        { error: "Nachricht fehlt." },
        { status: 400 }
      );
    }

    const sendEmail =
      body.sendEmail === true;

    if (sendEmail) {
      if (!job.customerEmail) {
        return NextResponse.json(
          {
            error:
              "Beim Kunden ist keine E-Mail hinterlegt.",
          },
          { status: 400 }
        );
      }

      const providerName =
        user.name ||
        user.email ||
        "Ihr Dienstleister";

      await sendMail({
        to: job.customerEmail,

        subject:
          status === "DONE"
            ? `Arbeiten abgeschlossen – ${job.title}`
            : `Information zu Ihrem Termin – ${job.title}`,

        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;color:#101828;">
            <div style="background:linear-gradient(135deg,#071426,#18204a);padding:30px;border-radius:16px 16px 0 0;">
              <div style="font-size:12px;font-weight:800;color:#38bdf8;letter-spacing:.08em;">
                AUFTRAGO BUSINESS
              </div>

              <div style="font-size:25px;font-weight:900;color:#ffffff;margin-top:6px;">
                Aktuelle Information zu Ihrem Auftrag
              </div>
            </div>

            <div style="padding:30px;border:1px solid #e2e8f0;border-top:0;">
              <p>
                Guten Tag ${job.customerName || ""}
              </p>

              <p style="font-size:16px;line-height:1.75;">
                ${message.replace(/\n/g, "<br/>")}
              </p>

              ${
                job.startTime
                  ? `
                    <div style="margin:24px 0;padding:16px;border-radius:12px;background:#f8fafc;">
                      <div style="font-size:11px;font-weight:800;color:#64748b;">
                        GEPLANTE STARTZEIT
                      </div>
                      <div style="font-size:20px;font-weight:900;margin-top:4px;">
                        ${job.startTime} Uhr
                      </div>
                    </div>
                  `
                  : ""
              }

              <p style="margin-top:28px;">
                Freundliche Grüsse<br/>
                <strong>${providerName}</strong>
              </p>
            </div>
          </div>
        `,

        text:
          `Guten Tag ${job.customerName || ""}\n\n` +
          `${message}\n\n` +
          `Freundliche Grüsse\n` +
          providerName,
      });
    }

    const whatsappUrl =
      job.customerPhone
        ? `https://wa.me/${job.customerPhone.replace(
            /\D/g,
            ""
          )}?text=${encodeURIComponent(message)}`
        : null;

    return NextResponse.json({
      ok: true,
      message,
      sentEmail: sendEmail,
      whatsappUrl,
      customerEmail:
        job.customerEmail,
      customerPhone:
        job.customerPhone,
    });
  } catch (error) {
    console.error(
      "JOB CUSTOMER NOTIFY ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nachricht konnte nicht verarbeitet werden.",
      },
      { status: 500 }
    );
  }
}
