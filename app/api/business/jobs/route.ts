import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

    const title = String(body.title || "").trim();

    if (!title) {
      return NextResponse.json(
        { error: "Titel fehlt." },
        { status: 400 }
      );
    }

    if (!body.scheduledDate) {
      return NextResponse.json(
        { error: "Datum fehlt." },
        { status: 400 }
      );
    }

    const valueCents =
      Number.isFinite(Number(body.value))
        ? Math.max(
            0,
            Math.round(Number(body.value) * 100)
          )
        : 0;

    const job = await prisma.businessJob.create({
      data: {
        providerId: user.id,

        title,

        customerName:
          typeof body.customerName === "string"
            ? body.customerName.trim() || null
            : null,

        customerEmail:
          typeof body.customerEmail === "string"
            ? body.customerEmail.trim() || null
            : null,

        customerPhone:
          typeof body.customerPhone === "string"
            ? body.customerPhone.trim() || null
            : null,

        location:
          typeof body.location === "string"
            ? body.location.trim() || null
            : null,

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

        valueCents,

        notes:
          typeof body.notes === "string"
            ? body.notes.trim() || null
            : null,

        status: "PLANNED",
      },
    });

    return NextResponse.json({
      ok: true,
      job,
    });
  } catch (error) {
    console.error("BUSINESS JOB CREATE ERROR", error);

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
