import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendMail } from "@/lib/mail/mail";
import { addInvoiceActivity } from "@/lib/business/invoiceActivity";

const money = (cents: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);

const dateCH = (date: Date | null | undefined) =>
  date
    ? new Intl.DateTimeFormat("de-CH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date)
    : "-";

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

    const body = await request.json().catch(() => ({}));
    const level = Number(body.level);

    if (![1, 2].includes(level)) {
      return NextResponse.json(
        { error: "Ungültige Mahnstufe." },
        { status: 400 }
      );
    }

    const invoice = await prisma.businessInvoice.findFirst({
      where: {
        id,
        providerId: user.id,
      },
      include: {
        payments: true,
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
        { error: "Eine bezahlte Rechnung kann nicht gemahnt werden." },
        { status: 400 }
      );
    }

    if (level === 1 && invoice.reminderLevel >= 1) {
      return NextResponse.json(
        { error: "Die 1. Zahlungserinnerung wurde bereits versendet." },
        { status: 400 }
      );
    }

    if (level === 2 && invoice.reminderLevel < 1) {
      return NextResponse.json(
        { error: "Bitte zuerst die 1. Zahlungserinnerung versenden." },
        { status: 400 }
      );
    }

    if (level === 2 && invoice.reminderLevel >= 2) {
      return NextResponse.json(
        { error: "Die 2. Mahnung wurde bereits versendet." },
        { status: 400 }
      );
    }

    const paidAmountCents = invoice.payments.reduce(
      (sum, payment) => sum + payment.amountCents,
      0
    );

    const remainingCents = Math.max(
      0,
      invoice.totalCents - paidAmountCents
    );

    if (remainingCents <= 0) {
      return NextResponse.json(
        { error: "Diese Rechnung hat keinen offenen Betrag mehr." },
        { status: 400 }
      );
    }

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
      const pdfError = await pdfResponse.text();

      console.error("REMINDER PDF ERROR:", pdfError);

      return NextResponse.json(
        { error: "Das Rechnungs-PDF konnte nicht erstellt werden." },
        { status: 500 }
      );
    }

    const pdfBuffer = Buffer.from(
      await pdfResponse.arrayBuffer()
    );

    const filename =
      `Rechnung-${invoice.invoiceNumber}`
        .replace(/[^a-zA-Z0-9._-]/g, "-") + ".pdf";

    const customerName =
      invoice.customerName || "Guten Tag";

    const isFirst = level === 1;

    const subject = isFirst
      ? `Zahlungserinnerung – Rechnung ${invoice.invoiceNumber}`
      : `2. Mahnung – Rechnung ${invoice.invoiceNumber}`;

    const title = isFirst
      ? "Zahlungserinnerung"
      : "2. Mahnung";

    const intro = isFirst
      ? "Wir möchten Sie freundlich daran erinnern, dass die folgende Rechnung noch offen ist."
      : "Trotz unserer ersten Zahlungserinnerung konnten wir für die folgende Rechnung noch keinen vollständigen Zahlungseingang feststellen.";

    const html = `
      <div style="
        font-family:Arial,Helvetica,sans-serif;
        max-width:680px;
        margin:0 auto;
        color:#101828;
      ">
        <div style="
          background:#071426;
          padding:30px;
          border-radius:16px 16px 0 0;
        ">
          <div style="
            color:#38bdf8;
            font-size:13px;
            font-weight:800;
            letter-spacing:.08em;
          ">
            AUFTRAGO BUSINESS
          </div>

          <div style="
            color:#ffffff;
            font-size:28px;
            font-weight:900;
            margin-top:6px;
          ">
            ${title}
          </div>
        </div>

        <div style="
          border:1px solid #e4e7ec;
          border-top:0;
          padding:32px;
          border-radius:0 0 16px 16px;
        ">
          <p>Guten Tag ${customerName}</p>

          <p style="line-height:1.7;">
            ${intro}
          </p>

          <div style="
            margin:26px 0;
            padding:20px;
            background:#f8fafc;
            border-radius:12px;
          ">
            <div style="margin-bottom:8px;">
              <strong>Rechnung:</strong>
              ${invoice.invoiceNumber}
            </div>

            <div style="margin-bottom:8px;">
              <strong>Rechnungsdatum:</strong>
              ${dateCH(invoice.issuedAt)}
            </div>

            <div style="margin-bottom:8px;">
              <strong>Zahlungsziel:</strong>
              ${dateCH(invoice.dueAt)}
            </div>

            <div style="
              margin-top:16px;
              font-size:22px;
              font-weight:900;
            ">
              Offener Betrag: ${money(remainingCents)}
            </div>
          </div>

          <p style="line-height:1.7;">
            Wir bitten Sie, den offenen Betrag zeitnah zu begleichen.
            Sollte die Zahlung zwischenzeitlich erfolgt sein,
            betrachten Sie diese Nachricht bitte als gegenstandslos.
          </p>

          <p style="margin-top:28px;">
            Freundliche Grüsse<br />
            <strong>${user.companyName || user.contactName || "Ihr Dienstleister"}</strong>
          </p>

          <div style="
            margin-top:30px;
            padding-top:18px;
            border-top:1px solid #e4e7ec;
            color:#667085;
            font-size:12px;
          ">
            Erstellt mit Auftrago Business
          </div>
        </div>
      </div>
    `;

    const text = isFirst
      ? `Zahlungserinnerung\n\nGuten Tag ${customerName}\n\nDie Rechnung ${invoice.invoiceNumber} über ${money(remainingCents)} ist noch offen.\n\nZahlungsziel: ${dateCH(invoice.dueAt)}\n\nDie Rechnung finden Sie im Anhang.`
      : `2. Mahnung\n\nGuten Tag ${customerName}\n\nDie Rechnung ${invoice.invoiceNumber} über ${money(remainingCents)} ist weiterhin offen.\n\nZahlungsziel: ${dateCH(invoice.dueAt)}\n\nDie Rechnung finden Sie im Anhang.`;

    await sendMail({
      to: invoice.customerEmail,
      subject,
      html,
      text,
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    const now = new Date();

    const updated =
      await prisma.businessInvoice.update({
        where: {
          id: invoice.id,
        },
        data:
          level === 1
            ? {
                reminderLevel: 1,
                firstReminderAt: now,
                status: "OVERDUE",
              }
            : {
                reminderLevel: 2,
                secondReminderAt: now,
                status: "OVERDUE",
              },
      });

    await addInvoiceActivity(
      updated.id,
      level === 1 ? "REMINDER_1" : "REMINDER_2",
      level === 1
        ? `1. Zahlungserinnerung für ${invoice.invoiceNumber} wurde versendet.`
        : `2. Mahnung für ${invoice.invoiceNumber} wurde versendet.`
    );

    return NextResponse.json({
      ok: true,
      message:
        level === 1
          ? "1. Zahlungserinnerung erfolgreich versendet."
          : "2. Mahnung erfolgreich versendet.",
      invoice: updated,
    });
  } catch (error) {
    console.error("REMINDER ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Mahnung konnte nicht versendet werden.",
      },
      { status: 500 }
    );
  }
}
