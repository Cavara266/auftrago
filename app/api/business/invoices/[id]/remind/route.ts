import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendMail } from "@/lib/mail/mail";

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

    const invoice = await prisma.businessInvoice.findFirst({
      where: {
        id,
        providerId: user.id,
      },
      include: {
        items: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden." },
        { status: 404 }
      );
    }

    if (!invoice.customerEmail) {
      return NextResponse.json(
        { error: "Beim Kunden ist keine E-Mail-Adresse hinterlegt." },
        { status: 400 }
      );
    }

    if (invoice.status === "PAID") {
      return NextResponse.json(
        { error: "Diese Rechnung ist bereits bezahlt." },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.findUnique({
      where: { id: user.id },
      select: {
        companyName: true,
        contactName: true,
      },
    });

    const origin = new URL(request.url).origin;

    const pdfResponse = await fetch(
      `${origin}/api/business/invoices/${invoice.id}/pdf`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    if (!pdfResponse.ok) {
      const message = await pdfResponse.text();
      console.error("REMINDER PDF ERROR", message);

      return NextResponse.json(
        { error: "Das Rechnungs-PDF konnte nicht erstellt werden." },
        { status: 500 }
      );
    }

    const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

    const filename =
      `Rechnung-${invoice.invoiceNumber}`
        .replace(/[^a-zA-Z0-9._-]/g, "-") + ".pdf";

    const total = new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
      minimumFractionDigits: 2,
    }).format(invoice.totalCents / 100);

    const dueDate = invoice.dueAt
      ? new Intl.DateTimeFormat("de-CH", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(invoice.dueAt)
      : "bereits überschritten";

    const customerName = invoice.customerName || "Guten Tag";

    const company =
      provider?.companyName ||
      provider?.contactName ||
      "Ihr Dienstleister";

    await sendMail({
      to: invoice.customerEmail,
      subject: `Zahlungserinnerung – Rechnung ${invoice.invoiceNumber}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#101828;">
          <div style="background:#071426;padding:28px 32px;border-radius:14px 14px 0 0;">
            <div style="font-size:13px;font-weight:700;color:#a78bfa;letter-spacing:.08em;">
              AUFTRAGO BUSINESS
            </div>
            <div style="font-size:26px;font-weight:800;color:#ffffff;margin-top:5px;">
              Zahlungserinnerung
            </div>
          </div>

          <div style="padding:32px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 14px 14px;">
            <p style="font-size:16px;">${customerName}</p>

            <p style="font-size:15px;line-height:1.7;">
              Bei der Durchsicht unserer offenen Rechnungen haben wir festgestellt,
              dass die folgende Rechnung noch als offen geführt wird.
            </p>

            <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:24px 0;">
              <div style="margin-bottom:8px;">
                <strong>Rechnung:</strong> ${invoice.invoiceNumber}
              </div>
              <div style="margin-bottom:8px;">
                <strong>Betrag:</strong> ${total}
              </div>
              <div>
                <strong>Ursprüngliches Zahlungsziel:</strong> ${dueDate}
              </div>
            </div>

            <p style="font-size:15px;line-height:1.7;">
              Wir bitten Sie, den offenen Betrag zeitnah zu begleichen.
              Sollte die Zahlung inzwischen erfolgt sein, betrachten Sie diese
              Nachricht bitte als gegenstandslos.
            </p>

            <p style="font-size:15px;line-height:1.7;">
              Die entsprechende Rechnung finden Sie nochmals als PDF im Anhang.
            </p>

            <p style="font-size:15px;line-height:1.7;margin-top:28px;">
              Freundliche Grüsse<br>
              <strong>${company}</strong>
            </p>

            <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb;font-size:12px;color:#667085;">
              Diese Zahlungserinnerung wurde mit Auftrago Business erstellt.
            </div>
          </div>
        </div>
      `,
      text:
        `${customerName}\n\n` +
        `Bei der Durchsicht unserer offenen Rechnungen haben wir festgestellt, ` +
        `dass die Rechnung ${invoice.invoiceNumber} über ${total} noch offen ist.\n\n` +
        `Ursprüngliches Zahlungsziel: ${dueDate}\n\n` +
        `Wir bitten Sie, den offenen Betrag zeitnah zu begleichen. ` +
        `Sollte die Zahlung inzwischen erfolgt sein, betrachten Sie diese Nachricht bitte als gegenstandslos.\n\n` +
        `Die Rechnung finden Sie nochmals im Anhang.\n\n` +
        `Freundliche Grüsse\n${company}`,
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    const updated = await prisma.businessInvoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        status: "OVERDUE",
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Zahlungserinnerung erfolgreich versendet.",
      invoice: updated,
    });
  } catch (error) {
    console.error("INVOICE REMINDER ERROR", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Zahlungserinnerung konnte nicht versendet werden.",
      },
      { status: 500 }
    );
  }
}
