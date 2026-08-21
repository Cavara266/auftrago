import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCandidateSession } from "@/lib/candidate-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCandidateSession();

    if (!session) {
      return NextResponse.json(
        {
          ok: false,
          loggedIn: false,
          message: "Keine Candidate-Session gefunden.",
        },
        { status: 401 },
      );
    }

    const account = await prisma.candidateAccount.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        candidateProfile: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          ok: false,
          loggedIn: true,
          sessionUser: session.user,
          message: "CandidateAccount zur aktuellen Session nicht gefunden.",
        },
        { status: 404 },
      );
    }

    const subscriptionStatus =
      account.subscriptionStatus?.toUpperCase() || "INACTIVE";

    const hasActiveSubscription =
      account.subscriptionExempt ||
      ["ACTIVE", "TRIALING"].includes(subscriptionStatus);

    return NextResponse.json({
      ok: true,
      loggedIn: true,

      session: {
        userId: session.user.id,
        email: session.user.email,
        status: session.user.status,
      },

      account: {
        id: account.id,
        email: account.candidateProfile?.email ?? null,
        status: account.status,
        subscriptionExempt: account.subscriptionExempt,
        subscriptionStatus: account.subscriptionStatus,
      },

      result: {
        hasActiveSubscription,
        applicationAllowed:
          account.status === "ACTIVE" && hasActiveSubscription,
      },
    });
  } catch (error) {
    console.error("CANDIDATE DEBUG ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
