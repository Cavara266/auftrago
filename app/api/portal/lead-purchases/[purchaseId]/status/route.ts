import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const allowedStatuses = [
  "OPEN",
  "CONTACTED",
  "APPOINTMENT_SET",
  "OFFER_SENT",
  "WON",
  "LOST",
  "NO_OFFER",
] as const;

type LeadStatus =
  (typeof allowedStatuses)[number];

function isLeadStatus(
  value: unknown
): value is LeadStatus {
  return (
    typeof value === "string" &&
    allowedStatuses.includes(
      value as LeadStatus
    )
  );
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      purchaseId: string;
    }>;
  }
) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nicht angemeldet.",
        },
        {
          status: 401,
        }
      );
    }

    const { purchaseId } =
      await context.params;

    if (!purchaseId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead-ID fehlt.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();
    const nextStatus = body?.status;

    if (!isLeadStatus(nextStatus)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Ungültiger Lead-Status.",
        },
        {
          status: 400,
        }
      );
    }

    const purchase =
      await prisma.leadPurchase.findFirst({
        where: {
          id: purchaseId,
          providerId: user.id,
        },
        select: {
          id: true,
          status: true,
        },
      });

    if (!purchase) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Der Lead wurde nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedPurchase =
      await prisma.leadPurchase.update({
        where: {
          id: purchase.id,
        },
        data: {
          status: nextStatus,
        },
        select: {
          id: true,
          status: true,
        },
      });

    revalidatePath(
      "/portal/meine-leads"
    );

    revalidatePath(
      `/portal/meine-leads/${purchaseId}`
    );

    return NextResponse.json({
      ok: true,
      status: updatedPurchase.status,
    });
  } catch (error) {
    console.error(
      "LEAD STATUS UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Status konnte nicht gespeichert werden.",
      },
      {
        status: 500,
      }
    );
  }
}
