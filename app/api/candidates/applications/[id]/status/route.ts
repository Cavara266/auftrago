import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCandidateSession } from "@/lib/candidate-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set([
  "SENT",
  "VIEWED",
  "INTERVIEW",
  "OFFER",
  "HIRED",
]);

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

    const body = await request.json();
    const status = String(body.status || "")
      .trim()
      .toUpperCase();

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ungültiger Bewerbungsstatus.",
        },
        { status: 400 },
      );
    }

    const application = await prisma.candidateApplication.findFirst({
      where: {
        id: params.id,
        candidateAccountId: session.user.id,
      },
      select: {
        id: true,
        status: true,
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

    const now = new Date();

    const dateFields =
      status === "VIEWED"
        ? { viewedAt: now }
        : status === "INTERVIEW"
          ? { interviewAt: now }
          : status === "OFFER"
            ? { acceptedAt: now }
            : status === "HIRED"
              ? { acceptedAt: now }
              : {};

    const updated = await prisma.candidateApplication.update({
      where: {
        id: application.id,
      },
      data: {
        status,
        ...dateFields,
      },
    });

    return NextResponse.json({
      ok: true,
      application: updated,
    });
  } catch (error) {
    console.error("TALENT CRM STATUS ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Status konnte nicht aktualisiert werden.",
      },
      { status: 500 },
    );
  }
}
