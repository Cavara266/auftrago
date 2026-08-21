import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireCandidate } from "@/lib/candidate-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["ACTIVE", "TRIALING"]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const user = await requireCandidate();
    const formData = await request.formData();

    const externalJobId = clean(formData.get("externalJobId"));
    const redirectUrl = clean(formData.get("redirectUrl"));

    if (!externalJobId || !redirectUrl) {
      return NextResponse.redirect(
        new URL("/arbeit-suchen/stellen?error=missing-job", request.url),
        303,
      );
    }

    let safeUrl: URL;

    try {
      safeUrl = new URL(redirectUrl);

      if (!["http:", "https:"].includes(safeUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.redirect(
        new URL("/arbeit-suchen/stellen?error=invalid-url", request.url),
        303,
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingUnlock = await tx.candidateJobUnlock.findUnique({
        where: {
          candidateAccountId_externalJobId: {
            candidateAccountId: user.id,
            externalJobId,
          },
        },
      });

      if (existingUnlock) {
        return {
          ok: true as const,
          redirectUrl: existingUnlock.redirectUrl,
        };
      }

      const account = await tx.candidateAccount.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          status: true,
          subscriptionExempt: true,
          subscriptionStatus: true,
        },
      });

      if (!account || account.status !== "ACTIVE") {
        return {
          ok: false as const,
          reason: "unauthorized" as const,
        };
      }

      const subscriptionStatus =
        account.subscriptionStatus?.toUpperCase() || "INACTIVE";

      const hasActiveSubscription =
        account.subscriptionExempt ||
        ACTIVE_SUBSCRIPTION_STATUSES.has(subscriptionStatus);

      if (!hasActiveSubscription) {
        return {
          ok: false as const,
          reason: "subscription" as const,
        };
      }

      const unlock = await tx.candidateJobUnlock.create({
        data: {
          candidateAccountId: account.id,
          externalJobId,
          redirectUrl: safeUrl.toString(),
          creditsSpent: 0,
        },
      });

      return {
        ok: true as const,
        redirectUrl: unlock.redirectUrl,
      };
    });

    if (!result.ok) {
      if (result.reason === "subscription") {
        return NextResponse.redirect(
          new URL(
            "/arbeit-suchen/abo?error=subscription-required",
            request.url,
          ),
          303,
        );
      }

      return NextResponse.redirect(
        new URL("/arbeit-suchen/login", request.url),
        303,
      );
    }

    return NextResponse.redirect(result.redirectUrl, 303);
  } catch (error) {
    console.error("===== CANDIDATE JOB UNLOCK ERROR =====");
    console.error(error);
    console.error("======================================");

    return NextResponse.redirect(
      new URL("/arbeit-suchen/stellen?error=server", request.url),
      303,
    );
  }
}
