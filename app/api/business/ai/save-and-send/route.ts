import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendMail } from "@/lib/mail/mail";

function createQuoteNumber() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const random = Math.floor(Math.random() * 900 + 100);

  return `OF-${y}-${m}-${d}-${h}${min}${s}-${random}`;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(body.title || "Neue Offerte").trim();
    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const description = String(body.description || "").trim();

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Für den Versand fehlt die Kunden-E-Mail." },
        { status: 400 }
      );
    }

    const positions = Array.isArray(body.positions)
      ? body.positions
      : [];

    if (positions.length === 0) {
      return NextResponse.json(
        { error: "Keine Positionen vorhanden." },
        { status: 400 }
      );
    }

    const items = positions.map((item: any, index: number) => {
      const quantity =
        Number(item.quantity) > 0 ? Number(item.quantity) : 1;

      const price = Math.max(0, Number(item.price || 0));
      const unitPriceCents = Math.round(price * 100);
      const totalCents = Math.round(unitPriceCents * quantity);

      return {
        position: index + 1,
        description: String(
          item.description || `Position ${index + 1}`
        ),
        quantity,
        unit: String(item.unit || "pauschal"),
        unitPriceCents,
        totalCents,
      };
    });

    const subtotalCents = items.reduce(
      (sum: number, item: any) => sum + item.totalCents,
      0
    );

    const discountPercent =
      typeof body.discountPercent === "number"
        ? Math.min(100, Math.max(0, body.discountPercent))
        : 0;

    const vatPercent =
      typeof body.vatPercent === "number"
        ? Math.max(0, body.vatPercent)
        : 8.1;

    const discountCents = Math.round(
      subtotalCents * (discountPercent / 100)
    );

    const taxableCents = Math.max(
      0,
      subtotalCents - discountCents
    );

    const vatCents = Math.round(
      taxableCents * (vatPercent / 100)
    );

    const totalCents = taxableCents + vatCents;

    const validDays =
      Number.isFinite(Number(body.validDays))
        ? Math.max(1, Number(body.validDays))
        : 30;

    const paymentTermsDays =
      Number.isFinite(Number(body.paymentTermsDays))
        ? Math.max(0, Number(body.paymentTermsDays))
        : 14;

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    let customerId: string | null = null;

    const existingCustomer =
      await prisma.businessCustomer.findFirst({
        where: {
          providerId: user.id,
          OR: [
            { email: customerEmail },
            ...(customerName
              ? [{ companyName: customerName }]
              : []),
          ],
        },
        select: {
          id: true,
        },
      });

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const customer =
        await prisma.businessCustomer.create({
          data: {
            providerId: user.id,
            companyName: customerName || null,
            email: customerEmail,
          },
          select: {
            id: true,
          },
        });

      customerId = customer.id;
    }

    const quote = await prisma.businessQuote.create({
      data: {
        providerId: user.id,
        customerId,
        quoteNumber: createQuoteNumber(),
        title,
        status: "DRAFT",
        customerName: customerName || null,
        customerEmail,
        notes: [
          description || "",
          `Zahlungsziel: ${
            paymentTermsDays === 0
              ? "sofort"
              : paymentTermsDays + " Tage"
          }`,
        ]
          .filter(Boolean)
          .join("\n\n"),
        discountPercent,
        vatPercent,
        subtotalCents,
        discountCents,
        vatCents,
        totalCents,
        validUntil,
        items: {
          create: items,
        },
      },
      include: {
        items: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    const origin = new URL(request.url).origin;

    const pdfResponse = await fetch(
      `${origin}/api/business/quotes/${quote.id}/pdf`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    if (!pdfResponse.ok) {
      const detail = await pdfResponse.text();

      console.error("QUOTE PDF ERROR", detail);

      return NextResponse.json(
        {
          error:
            "Offerte gespeichert, aber PDF konnte nicht erstellt werden.",
          quoteId: quote.id,
        },
        { status: 500 }
      );
    }

    const pdfBuffer = Buffer.from(
      await pdfResponse.arrayBuffer()
    );

    const publicQuoteUrl =
      `${origin}/offerte/${quote.id}`;

    const total = new Intl.NumberFormat("de-CH", {
      style: "currency",
      currency: "CHF",
      minimumFractionDigits: 2,
    }).format(totalCents / 100);

    const filename =
      `Offerte-${quote.quoteNumber}`
        .replace(/[^a-zA-Z0-9._-]/g, "-") + ".pdf";

    await sendMail({
      to: customerEmail,
      subject: `Offerte ${quote.quoteNumber} – ${title}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;color:#101828;">
          <div style="background:#071426;padding:28px 32px;border-radius:14px 14px 0 0;">
            <div style="font-size:13px;font-weight:800;color:#38bdf8;letter-spacing:.08em;">
              AUFTRAGO BUSINESS
            </div>
            <div style="font-size:26px;font-weight:900;color:#ffffff;margin-top:5px;">
              Ihre Offerte
            </div>
          </div>

          <div style="padding:30px 32px;border:1px solid #e2e8f0;border-top:0;">
            <p>Guten Tag ${customerName || ""}</p>

            <p>
              Vielen Dank für Ihre Anfrage. Im Anhang erhalten Sie
              unsere Offerte <strong>${quote.quoteNumber}</strong>.
            </p>

            <p>
              <strong>${title}</strong><br/>
              Total: <strong>${total}</strong>
            </p>

            <p>
              Die Offerte ist ${validDays} Tage gültig.
            </p>

            <p>
              Bei Fragen oder Anpassungswünschen stehen wir Ihnen
              gerne zur Verfügung.
            </p>

            <div style="margin:30px 0;">
              <a
                href="${publicQuoteUrl}"
                style="
                  display:inline-block;
                  padding:16px 26px;
                  border-radius:12px;
                  background:linear-gradient(90deg,#0ea5e9,#7c3aed);
                  color:#ffffff;
                  text-decoration:none;
                  font-weight:800;
                  font-size:16px;
                  box-shadow:0 12px 30px rgba(14,165,233,.20);
                "
              >
                Offerte online ansehen & bestätigen →
              </a>
            </div>

            <p style="font-size:13px;color:#667085;">
              Über den sicheren Online-Bereich können Sie die
              Offerte direkt ansehen, annehmen oder ablehnen.
            </p>

            <p>
              Freundliche Grüsse<br/>
              ${user.companyName || user.contactName || "Ihr Dienstleister"}
            </p>
          </div>
        </div>
      `,
      text:
        `Guten Tag ${customerName || ""}\n\n` +
        `Im Anhang erhalten Sie unsere Offerte ${quote.quoteNumber}.\n` +
        `${title}\nTotal: ${total}\n\n` +
        `Offerte online ansehen und bestätigen:\n${publicQuoteUrl}\n\n` +
        `Freundliche Grüsse\n` +
        `${user.companyName || user.contactName || "Ihr Dienstleister"}`,
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    const sentQuote = await prisma.businessQuote.update({
      where: {
        id: quote.id,
      },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      quote: sentQuote,
      message: "Offerte gespeichert und versendet.",
      redirectUrl: `/portal/business/offerten/${quote.id}`,
    });
  } catch (error) {
    console.error("AI SAVE AND SEND ERROR", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Offerte konnte nicht gespeichert und versendet werden.",
      },
      { status: 500 }
    );
  }
}
