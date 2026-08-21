import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCandidateSession } from "@/lib/candidate-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function dateOrNull(value: unknown) {
  if (!value || typeof value !== "string") return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getCandidateSession();

    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nicht angemeldet.",
        },
        { status: 401 },
      );
    }

    const application = await prisma.candidateApplication.findFirst({
      where: {
        id: params.id,
        candidateAccountId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        {
          ok: false,
          error: "Bewerbung nicht gefunden.",
        },
        { status: 404 },
      );
    }

    const body = await request.json();

    const updated = await prisma.candidateApplication.update({
      where: {
        id: application.id,
      },
      data: {
        contactPerson:
          typeof body.contactPerson === "string"
            ? body.contactPerson.trim() || null
            : undefined,

        contactEmail:
          typeof body.contactEmail === "string"
            ? body.contactEmail.trim() || null
            : undefined,

        contactPhone:
          typeof body.contactPhone === "string"
            ? body.contactPhone.trim() || null
            : undefined,

        candidateNote:
          typeof body.candidateNote === "string"
            ? body.candidateNote.trim() || null
            : undefined,

        internalNote:
          typeof body.internalNote === "string"
            ? body.internalNote.trim() || null
            : undefined,

        followUpAt:
          body.followUpAt !== undefined
            ? dateOrNull(body.followUpAt)
            : undefined,

        reminderAt:
          body.reminderAt !== undefined
            ? dateOrNull(body.reminderAt)
            : undefined,

        lastContactAt: body.markContacted === true ? new Date() : undefined,
      },
    });

    return NextResponse.json({
      ok: true,
      application: updated,
    });
  } catch (error) {
    console.error("TALENT CRM PATCH ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "CRM-Daten konnten nicht gespeichert werden.",
      },
      { status: 500 },
    );
  }
}
