import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getCandidateSession } from "@/lib/candidate-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
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

    const account = await prisma.candidateAccount.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        status: true,
        subscriptionStatus: true,
        subscriptionExempt: true,
      },
    });

    if (!account || account.status !== "ACTIVE") {
      return NextResponse.json(
        {
          ok: false,
          error: "Konto nicht aktiv.",
        },
        { status: 403 },
      );
    }

    const subscriptionStatus =
      account.subscriptionStatus?.toUpperCase() || "INACTIVE";

    const hasActiveSubscription =
      account.subscriptionExempt ||
      ["ACTIVE", "TRIALING"].includes(subscriptionStatus);

    if (!hasActiveSubscription) {
      return NextResponse.json(
        {
          ok: false,
          error: "Für Bewerbungen ist ein aktives Talent-Abo erforderlich.",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const externalJobId = String(body.externalJobId || "").trim();
    const jobTitle = String(body.jobTitle || "").trim();
    const companyName = String(body.companyName || "").trim();
    const jobLocation = String(body.jobLocation || "").trim();
    const jobUrl = String(body.jobUrl || "").trim();
    const jobSource = String(body.jobSource || "external").trim();
    const coverLetter = String(body.coverLetter || "").trim();

    if (!externalJobId || !jobTitle) {
      return NextResponse.json(
        {
          ok: false,
          error: "Stelle konnte nicht eindeutig erkannt werden.",
        },
        { status: 400 },
      );
    }

    const existing = await prisma.candidateApplication.findUnique({
      where: {
        candidateAccountId_externalJobId: {
          candidateAccountId: account.id,
          externalJobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({
        ok: true,
        duplicate: true,
        application: existing,
      });
    }

    const application = await prisma.candidateApplication.create({
      data: {
        candidateAccountId: account.id,
        externalJobId,
        jobTitle,
        companyName: companyName || null,
        jobLocation: jobLocation || null,
        jobUrl: jobUrl || null,
        jobSource,
        coverLetter: coverLetter || null,
        status: "SENT",
      },
    });

    return NextResponse.json({
      ok: true,
      duplicate: false,
      application,
    });
  } catch (error) {
    console.error("CANDIDATE APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Bewerbung konnte nicht gespeichert werden.",
      },
      { status: 500 },
    );
  }
}
