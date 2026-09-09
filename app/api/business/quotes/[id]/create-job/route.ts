import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

    const quote =
      await prisma.businessQuote.findFirst({
        where: {
          id,
          providerId: user.id,
        },

        include: {
          customer: true,
          items: true,
        },
      });

    if (!quote) {
      return NextResponse.json(
        { error: "Offerte nicht gefunden." },
        { status: 404 }
      );
    }

    if (quote.status !== "ACCEPTED") {
      return NextResponse.json(
        {
          error:
            "Nur angenommene Offerten können als Einsatz geplant werden.",
        },
        { status: 400 }
      );
    }

    if (!body.scheduledDate) {
      return NextResponse.json(
        { error: "Bitte ein Einsatzdatum auswählen." },
        { status: 400 }
      );
    }

    // Doppelte Einsätze verhindern
    const existingJob =
      await prisma.businessJob.findFirst({
        where: {
          providerId: user.id,
          quoteId: quote.id,
          status: {
            not: "CANCELLED",
          },
        },
      });

    if (existingJob) {
      return NextResponse.json({
        ok: true,
        alreadyExists: true,
        job: existingJob,
      });
    }

    const location =
      String(body.location || "").trim() ||
      quote.customerAddress ||
      quote.customer?.address ||
      null;

    const customerName =
      quote.customerName ||
      (
        quote.customer
          ? [
              quote.customer.firstName,
              quote.customer.lastName,
            ]
              .filter(Boolean)
              .join(" ")
          : ""
      ) ||
      quote.customer?.companyName ||
      null;

    const title =
      quote.title ||
      quote.items?.[0]?.description ||
      `Auftrag ${quote.quoteNumber}`;

    const job =
      await prisma.businessJob.create({
        data: {
          providerId: user.id,

          customerId:
            quote.customerId || null,

          quoteId: quote.id,

          title,

          customerName,

          customerEmail:
            quote.customerEmail ||
            quote.customer?.email ||
            null,

          customerPhone:
            quote.customer?.phone ||
            null,

          location,

          assignedTo:
            typeof body.assignedTo === "string"
              ? body.assignedTo.trim() || null
              : null,

          scheduledDate:
            new Date(body.scheduledDate),

          startTime:
            typeof body.startTime === "string"
              ? body.startTime || null
              : null,

          endTime:
            typeof body.endTime === "string"
              ? body.endTime || null
              : null,

          valueCents:
            quote.totalCents,

          notes:
            typeof body.notes === "string"
              ? body.notes.trim() || null
              : `Erstellt aus Offerte ${quote.quoteNumber}`,

          status: "PLANNED",
        },
      });

    return NextResponse.json({
      ok: true,
      job,
    });
  } catch (error) {
    console.error(
      "QUOTE CREATE JOB ERROR",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Einsatz konnte nicht erstellt werden.",
      },
      { status: 500 }
    );
  }
}
