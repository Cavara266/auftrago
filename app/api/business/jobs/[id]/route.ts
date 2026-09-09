import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const statuses = [
  "PLANNED",
  "ON_THE_WAY",
  "ON_SITE",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
];

export async function PATCH(
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
      typeof body.status === "string" &&
      statuses.includes(body.status)
        ? body.status
        : job.status;

    const updated = await prisma.businessJob.update({
      where: {
        id: job.id,
      },
      data: {
        status,

        assignedTo:
          body.assignedTo !== undefined
            ? String(body.assignedTo || "").trim() || null
            : job.assignedTo,

        customerEmail:
          body.customerEmail !== undefined
            ? String(body.customerEmail || "").trim() || null
            : job.customerEmail,

        customerPhone:
          body.customerPhone !== undefined
            ? String(body.customerPhone || "").trim() || null
            : job.customerPhone,

        startTime:
          body.startTime !== undefined
            ? String(body.startTime || "") || null
            : job.startTime,

        endTime:
          body.endTime !== undefined
            ? String(body.endTime || "") || null
            : job.endTime,

        location:
          body.location !== undefined
            ? String(body.location || "").trim() || null
            : job.location,

        notes:
          body.notes !== undefined
            ? String(body.notes || "").trim() || null
            : job.notes,
      },
    });

    return NextResponse.json({
      ok: true,
      job: updated,
    });
  } catch (error) {
    console.error("BUSINESS JOB UPDATE ERROR", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Einsatz konnte nicht aktualisiert werden.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.businessJob.delete({
      where: {
        id: job.id,
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error("BUSINESS JOB DELETE ERROR", error);

    return NextResponse.json(
      {
        error: "Einsatz konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}
