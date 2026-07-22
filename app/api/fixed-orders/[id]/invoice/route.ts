import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: {
    id: string;
  };
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getInvoiceNumber(
  soldAt: Date,
  fixedOrderId: string
) {
  const year = soldAt.getFullYear();
  const month = String(soldAt.getMonth() + 1).padStart(2, "0");
  const shortId = fixedOrderId
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase();

  return `FO-${year}${month}-${shortId}`;
}

function envValue(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

function drawText(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  x: number,
  y: number,
  options: {
    size?: number;
    font: Awaited<ReturnType<PDFDocument["embedFont"]>>;
    color?: ReturnType<typeof rgb>;
    maxWidth?: number;
  }
) {
  page.drawText(text, {
    x,
    y,
    size: options.size ?? 10,
    font: options.font,
    color: options.color ?? rgb(0.15, 0.18, 0.24),
    maxWidth: options.maxWidth,
    lineHeight: (options.size ?? 10) * 1.35,
  });
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const user = await requireUser();

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
      address: true,
      postalCode: true,
      city: true,
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

  const fixedOrder = await prisma.fixedOrder.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      title: true,
      category: true,
      orderValueCents: true,
      commissionPercent: true,
      commissionAmountCents: true,
      status: true,
      buyerId: true,
      soldAt: true,
      stripeCheckoutSessionId: true,
      stripePaymentIntentId: true,
      postalCode: true,
      city: true,
    },
  });

  if (!fixedOrder) {
    return NextResponse.json(
      {
        ok: false,
        error: "Fixauftrag wurde nicht gefunden.",
      },
      {
        status: 404,
      }
    );
  }

  const hasAccess =
    fixedOrder.buyerId === provider.id &&
    (fixedOrder.status === "SOLD" ||
      fixedOrder.status === "COMPLETED");

  if (!hasAccess) {
    return NextResponse.json(
      {
        ok: false,
        error: "Du hast keinen Zugriff auf diese Rechnung.",
      },
      {
        status: 403,
      }
    );
  }

  const soldAt = fixedOrder.soldAt ?? new Date();
  const invoiceNumber = getInvoiceNumber(
    soldAt,
    fixedOrder.id
  );

  const companyName = envValue(
    "INVOICE_COMPANY_NAME",
    "Auftrago.ch"
  );
  const companyAddress = envValue(
    "INVOICE_COMPANY_ADDRESS"
  );
  const companyPostalCode = envValue(
    "INVOICE_COMPANY_POSTAL_CODE"
  );
  const companyCity = envValue(
    "INVOICE_COMPANY_CITY"
  );
  const companyEmail = envValue(
    "INVOICE_COMPANY_EMAIL",
    envValue("ADMIN_EMAIL", "info@auftrago.ch")
  );
  const vatNumber = envValue("INVOICE_VAT_NUMBER");

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]);

  const regularFont = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  );
  const boldFont = await pdfDoc.embedFont(
    StandardFonts.HelveticaBold
  );

  const dark = rgb(0.05, 0.07, 0.11);
  const amber = rgb(0.96, 0.68, 0.1);
  const muted = rgb(0.42, 0.47, 0.56);
  const light = rgb(0.94, 0.95, 0.97);
  const border = rgb(0.84, 0.86, 0.9);

  page.drawRectangle({
    x: 0,
    y: 751.89,
    width: 595.28,
    height: 90,
    color: dark,
  });

  page.drawRectangle({
    x: 0,
    y: 746.89,
    width: 595.28,
    height: 5,
    color: amber,
  });

  drawText(page, companyName, 48, 795, {
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  drawText(page, "Rechnung Vermittlungsgebühr", 48, 772, {
    size: 11,
    font: regularFont,
    color: rgb(0.76, 0.8, 0.87),
  });

  drawText(page, "RECHNUNG", 430, 795, {
    size: 18,
    font: boldFont,
    color: amber,
  });

  let companyY = 720;
  drawText(page, companyName, 48, companyY, {
    size: 10,
    font: boldFont,
  });
  companyY -= 15;

  if (companyAddress) {
    drawText(page, companyAddress, 48, companyY, {
      font: regularFont,
    });
    companyY -= 15;
  }

  const companyLocation = [
    companyPostalCode,
    companyCity,
  ]
    .filter(Boolean)
    .join(" ");

  if (companyLocation) {
    drawText(page, companyLocation, 48, companyY, {
      font: regularFont,
    });
    companyY -= 15;
  }

  drawText(page, companyEmail, 48, companyY, {
    font: regularFont,
  });
  companyY -= 15;

  if (vatNumber) {
    drawText(page, `MWST-Nr.: ${vatNumber}`, 48, companyY, {
      font: regularFont,
    });
  }

  const recipientLines = [
    provider.companyName,
    provider.contactName,
    provider.address,
    [provider.postalCode, provider.city]
      .filter(Boolean)
      .join(" "),
    provider.email,
  ].filter(Boolean) as string[];

  drawText(page, "Rechnung an", 330, 720, {
    size: 9,
    font: boldFont,
    color: muted,
  });

  let recipientY = 700;
  for (const line of recipientLines) {
    drawText(page, line, 330, recipientY, {
      size: 10,
      font:
        recipientY === 700 ? boldFont : regularFont,
      maxWidth: 210,
    });
    recipientY -= 15;
  }

  const metaY = 610;
  page.drawRectangle({
    x: 48,
    y: metaY - 10,
    width: 499,
    height: 72,
    color: light,
    borderColor: border,
    borderWidth: 1,
  });

  const metadata = [
    ["Rechnungsnummer", invoiceNumber],
    ["Rechnungsdatum", formatDate(soldAt)],
    ["Auftrags-ID", fixedOrder.id],
  ];

  metadata.forEach(([label, value], index) => {
    const columnX = 66 + index * 165;

    drawText(page, label, columnX, metaY + 34, {
      size: 8,
      font: boldFont,
      color: muted,
    });

    drawText(page, value, columnX, metaY + 16, {
      size: 9,
      font: regularFont,
      maxWidth: 145,
    });
  });

  const tableTop = 540;
  page.drawRectangle({
    x: 48,
    y: tableTop,
    width: 499,
    height: 34,
    color: dark,
  });

  drawText(page, "Position", 62, tableTop + 11, {
    size: 9,
    font: boldFont,
    color: rgb(1, 1, 1),
  });
  drawText(page, "Beschreibung", 115, tableTop + 11, {
    size: 9,
    font: boldFont,
    color: rgb(1, 1, 1),
  });
  drawText(page, "Betrag", 470, tableTop + 11, {
    size: 9,
    font: boldFont,
    color: rgb(1, 1, 1),
  });

  page.drawRectangle({
    x: 48,
    y: 456,
    width: 499,
    height: 84,
    color: rgb(1, 1, 1),
    borderColor: border,
    borderWidth: 1,
  });

  drawText(page, "1", 68, 510, {
    size: 10,
    font: regularFont,
  });

  drawText(
    page,
    `Vermittlungsgebühr Fixauftrag: ${fixedOrder.title}`,
    115,
    510,
    {
      size: 10,
      font: boldFont,
      maxWidth: 310,
    }
  );

  drawText(
    page,
    `${fixedOrder.category} in ${fixedOrder.postalCode} ${fixedOrder.city} - ${fixedOrder.commissionPercent} % vom Auftragswert ${formatCurrency(
      fixedOrder.orderValueCents
    )}`,
    115,
    482,
    {
      size: 9,
      font: regularFont,
      color: muted,
      maxWidth: 310,
    }
  );

  drawText(
    page,
    formatCurrency(fixedOrder.commissionAmountCents),
    450,
    510,
    {
      size: 10,
      font: boldFont,
    }
  );

  page.drawRectangle({
    x: 330,
    y: 380,
    width: 217,
    height: 62,
    color: light,
    borderColor: border,
    borderWidth: 1,
  });

  drawText(page, "Total", 350, 414, {
    size: 10,
    font: boldFont,
  });

  drawText(
    page,
    formatCurrency(fixedOrder.commissionAmountCents),
    445,
    414,
    {
      size: 13,
      font: boldFont,
      color: dark,
    }
  );

  drawText(page, "Bereits über Stripe bezahlt", 350, 394, {
    size: 8,
    font: boldFont,
    color: rgb(0.1, 0.55, 0.36),
  });

  page.drawRectangle({
    x: 48,
    y: 285,
    width: 499,
    height: 62,
    color: rgb(0.98, 0.96, 0.9),
    borderColor: rgb(0.92, 0.78, 0.36),
    borderWidth: 1,
  });

  drawText(page, "Zahlungshinweis", 64, 324, {
    size: 9,
    font: boldFont,
    color: rgb(0.45, 0.31, 0.05),
  });

  drawText(
    page,
    "Diese Rechnung wurde automatisch nach erfolgreicher Stripe-Zahlung erstellt. Es ist keine weitere Zahlung erforderlich.",
    64,
    302,
    {
      size: 9,
      font: regularFont,
      color: rgb(0.4, 0.34, 0.2),
      maxWidth: 460,
    }
  );

  if (fixedOrder.stripePaymentIntentId) {
    drawText(
      page,
      `Stripe-Referenz: ${fixedOrder.stripePaymentIntentId}`,
      48,
      245,
      {
        size: 8,
        font: regularFont,
        color: muted,
        maxWidth: 499,
      }
    );
  } else if (fixedOrder.stripeCheckoutSessionId) {
    drawText(
      page,
      `Stripe-Session: ${fixedOrder.stripeCheckoutSessionId}`,
      48,
      245,
      {
        size: 8,
        font: regularFont,
        color: muted,
        maxWidth: 499,
      }
    );
  }

  drawText(
    page,
    "Auftrago vermittelt den Auftrag. Ausführung, Terminabstimmung, Rechnungsstellung an den Endkunden und Gewährleistung erfolgen direkt zwischen Anbieter und Kunde.",
    48,
    205,
    {
      size: 8,
      font: regularFont,
      color: muted,
      maxWidth: 499,
    }
  );

  page.drawLine({
    start: { x: 48, y: 90 },
    end: { x: 547, y: 90 },
    thickness: 1,
    color: border,
  });

  drawText(page, companyName, 48, 68, {
    size: 8,
    font: boldFont,
    color: muted,
  });

  drawText(page, companyEmail, 420, 68, {
    size: 8,
    font: regularFont,
    color: muted,
  });

  const pdfBytes = await pdfDoc.save();
  const filename = `Auftrago-Rechnung-${invoiceNumber}.pdf`;

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store, max-age=0",
    },
  });
}