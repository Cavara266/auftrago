import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendMail } from "@/lib/mail/mail";
import { addInvoiceActivity } from "@/lib/business/invoiceActivity";

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
      console.error("PDF GENERATION FAILED", message);

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
      : null;

    const customerName = invoice.customerName || "Guten Tag";

    await sendMail({
      to: invoice.customerEmail,
      subject: `Rechnung ${invoice.invoiceNumber}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#101828;">
          <div style="background:#071426;padding:28px 32px;border-radius:14px 14px 0 0;">
            <div style="font-size:13px;font-weight:700;color:#18b9ff;letter-spacing:.08em;">
              AUFTRAGO BUSINESS
            </div>
            <div style="font-size:26px;font-weight:800;color:#ffffff;margin-top:5px;">
              Ihre Rechnung
            </div>
          </div>

          <div style="padding:32px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 14px 14px;">
            <p style="font-size:16px;margin-top:0;">
              ${customerName}
            </p>

            <p style="font-size:15px;line-height:1.7;color:#475467;">
              Im Anhang erhalten Sie die Rechnung
              <strong>${invoice.invoiceNumber}</strong>
              über <strong>${total}</strong>.
            </p>

            ${
              dueDate
                ? `<p style="font-size:15px;line-height:1.7;color:#475467;">
                    Zahlungsziel: <strong>${dueDate}</strong>
                   </p>`
                : ""
            }

            <p style="font-size:15px;line-height:1.7;color:#475467;">
              Das vollständige Rechnungsdokument finden Sie als PDF im Anhang dieser E-Mail.
            </p>

            <p style="font-size:15px;line-height:1.7;margin-top:28px;">
              Freundliche Grüsse
            </p>

            <p style="font-size:15px;font-weight:700;">
              ${user.companyName || user.contactName || "Ihr Dienstleister"}
            </p>

            <div style="margin-top:30px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#98a2b3;">
              Rechnung erstellt und versendet mit Auftrago Business
            </div>
          </div>
        </div>
      `,
      text:
        `${customerName}\n\n` +
        `Im Anhang erhalten Sie die Rechnung ${invoice.invoiceNumber} über ${total}.` +
        (dueDate ? `\nZahlungsziel: ${dueDate}.` : "") +
        `\n\nFreundliche Grüsse\n` +
        `${user.companyName || user.contactName || "Ihr Dienstleister"}`,
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
        status: invoice.status === "DRAFT" ? "SENT" : invoice.status,
      },
    });

    await addInvoiceActivity(
      invoice.id,
      "SENT",
      `Rechnung ${invoice.invoiceNumber} wurde per E-Mail versendet.`
    );

    return NextResponse.json({
      ok: true,
      message: "Rechnung erfolgreich versendet.",
      invoice: updated,
    });
  } catch (error) {
    console.error("INVOICE SEND ERROR", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Rechnung konnte nicht versendet werden.",
      },
      { status: 500 }
    );
  }
}
