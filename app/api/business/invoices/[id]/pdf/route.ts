import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const chf = (cents: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);

const dateCH = (date: Date | null | undefined) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

function safeText(value: string | null | undefined) {
  return (value || "").replace(/\r?\n/g, " ").trim();
}

export async function GET(
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

    const provider = await prisma.provider.findUnique({
      where: {
        id: user.id,
      },
      select: {
        companyName: true,
        contactName: true,
        email: true,
        phone: true,
        address: true,
        postalCode: true,
        city: true,
        website: true,
      },
    });

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([595.28, 841.89]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const dark = rgb(0.035, 0.07, 0.13);
    const purple = rgb(0.49, 0.23, 0.93);
    const blue = rgb(0.05, 0.65, 0.95);
    const gray = rgb(0.40, 0.44, 0.52);
    const light = rgb(0.94, 0.95, 0.97);
    const white = rgb(1, 1, 1);

    page.drawRectangle({
      x: 0,
      y: 755,
      width: 595.28,
      height: 86.89,
      color: dark,
    });

    page.drawRectangle({
      x: 42,
      y: 775,
      width: 7,
      height: 40,
      color: purple,
    });

    page.drawText("AUFTRAGO BUSINESS", {
      x: 64,
      y: 800,
      size: 10,
      font: bold,
      color: blue,
    });

    page.drawText("RECHNUNG", {
      x: 64,
      y: 776,
      size: 22,
      font: bold,
      color: white,
    });

    page.drawText(safeText(invoice.invoiceNumber), {
      x: 400,
      y: 790,
      size: 10,
      font: bold,
      color: white,
    });

    page.drawText(`Datum: ${dateCH(invoice.issuedAt)}`, {
      x: 400,
      y: 772,
      size: 9,
      font,
      color: light,
    });

    let y = 710;

    page.drawText("RECHNUNGSSTELLER", {
      x: 42,
      y,
      size: 9,
      font: bold,
      color: purple,
    });

    page.drawText("RECHNUNG AN", {
      x: 320,
      y,
      size: 9,
      font: bold,
      color: purple,
    });

    y -= 22;

    const providerLines = [
      provider?.companyName,
      provider?.contactName,
      provider?.address,
      [provider?.postalCode, provider?.city].filter(Boolean).join(" "),
      provider?.email,
      provider?.phone,
      provider?.website,
    ].filter(Boolean) as string[];

    let providerY = y;

    for (const line of providerLines) {
      page.drawText(safeText(line), {
        x: 42,
        y: providerY,
        size: 10,
        font,
        color: dark,
      });
      providerY -= 16;
    }

    const customerLines = [
      invoice.customerName,
      invoice.customerAddress,
      invoice.customerEmail,
    ].filter(Boolean) as string[];

    let customerY = y;

    for (const line of customerLines) {
      page.drawText(safeText(line), {
        x: 320,
        y: customerY,
        size: 10,
        font,
        color: dark,
      });
      customerY -= 16;
    }

    y = Math.min(providerY, customerY) - 35;

    page.drawText(safeText(invoice.title), {
      x: 42,
      y,
      size: 18,
      font: bold,
      color: dark,
    });

    y -= 32;

    page.drawRectangle({
      x: 42,
      y: y - 5,
      width: 511,
      height: 28,
      color: dark,
    });

    page.drawText("Pos.", {
      x: 52,
      y: y + 5,
      size: 9,
      font: bold,
      color: white,
    });

    page.drawText("Beschreibung", {
      x: 90,
      y: y + 5,
      size: 9,
      font: bold,
      color: white,
    });

    page.drawText("Menge", {
      x: 355,
      y: y + 5,
      size: 9,
      font: bold,
      color: white,
    });

    page.drawText("Betrag", {
      x: 475,
      y: y + 5,
      size: 9,
      font: bold,
      color: white,
    });

    y -= 34;

    for (const item of invoice.items) {
      if (y < 230) break;

      page.drawText(`${item.position}.`, {
        x: 52,
        y,
        size: 9,
        font,
        color: gray,
      });

      const description = safeText(item.description);
      const shortDescription =
        description.length > 52
          ? description.slice(0, 49) + "..."
          : description;

      page.drawText(shortDescription, {
        x: 90,
        y,
        size: 9,
        font: bold,
        color: dark,
      });

      page.drawText(`${item.quantity} ${safeText(item.unit)}`, {
        x: 355,
        y,
        size: 9,
        font,
        color: dark,
      });

      page.drawText(chf(item.totalCents), {
        x: 465,
        y,
        size: 9,
        font: bold,
        color: dark,
      });

      y -= 28;

      page.drawLine({
        start: { x: 42, y: y + 10 },
        end: { x: 553, y: y + 10 },
        thickness: 0.5,
        color: light,
      });
    }

    y -= 15;

    const summaryX = 350;

    page.drawText("Zwischensumme", {
      x: summaryX,
      y,
      size: 10,
      font,
      color: gray,
    });

    page.drawText(chf(invoice.subtotalCents), {
      x: 465,
      y,
      size: 10,
      font: bold,
      color: dark,
    });

    y -= 22;

    if (invoice.discountCents > 0) {
      page.drawText("Rabatt", {
        x: summaryX,
        y,
        size: 10,
        font,
        color: gray,
      });

      page.drawText(`-${chf(invoice.discountCents)}`, {
        x: 465,
        y,
        size: 10,
        font: bold,
        color: dark,
      });

      y -= 22;
    }

    page.drawText("MWST", {
      x: summaryX,
      y,
      size: 10,
      font,
      color: gray,
    });

    page.drawText(chf(invoice.vatCents), {
      x: 465,
      y,
      size: 10,
      font: bold,
      color: dark,
    });

    y -= 34;

    page.drawRectangle({
      x: 340,
      y: y - 10,
      width: 213,
      height: 44,
      color: dark,
    });

    page.drawText("TOTAL", {
      x: 355,
      y: y + 6,
      size: 10,
      font: bold,
      color: white,
    });

    page.drawText(chf(invoice.totalCents), {
      x: 445,
      y: y + 4,
      size: 14,
      font: bold,
      color: blue,
    });

    y -= 55;

    page.drawText(`Zahlungsziel: ${dateCH(invoice.dueAt)}`, {
      x: 340,
      y,
      size: 9,
      font: bold,
      color: dark,
    });

    if (invoice.notes) {
      page.drawText("Bemerkungen", {
        x: 42,
        y: 165,
        size: 9,
        font: bold,
        color: purple,
      });

      const notes = safeText(invoice.notes);
      const shortNotes =
        notes.length > 110 ? notes.slice(0, 107) + "..." : notes;

      page.drawText(shortNotes, {
        x: 42,
        y: 145,
        size: 9,
        font,
        color: gray,
        maxWidth: 500,
      });
    }

    page.drawLine({
      start: { x: 42, y: 70 },
      end: { x: 553, y: 70 },
      thickness: 0.7,
      color: light,
    });

    page.drawText("Erstellt mit Auftrago Business", {
      x: 42,
      y: 48,
      size: 8,
      font: bold,
      color: gray,
    });

    page.drawText("auftrago.ch", {
      x: 475,
      y: 48,
      size: 8,
      font: bold,
      color: purple,
    });

    const pdfBytes = await pdfDoc.save();

    const filename =
      `Rechnung-${invoice.invoiceNumber}`
        .replace(/[^a-zA-Z0-9._-]/g, "-") + ".pdf";

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("INVOICE PDF ERROR", error);

    return NextResponse.json(
      { error: "PDF konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
