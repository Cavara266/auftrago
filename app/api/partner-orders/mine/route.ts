import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await requireUser();

    if (!user?.id) {
      return NextResponse.json(
        { ok: false, error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const orders = await prisma.partnerOrder.findMany({
      where: {
        ownerProviderId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        title: true,
        category: true,
        description: true,

        postalCode: true,
        city: true,
        region: true,

        scheduledAt: true,
        flexibleDate: true,

        partnerAmountCents: true,
        commissionCents: true,

        status: true,
        selectedProviderId: true,

        commissionPaidAt: true,
        contactsUnlockedAt: true,

        createdAt: true,

        selectedProvider: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            email: true,
            phone: true,
            logoUrl: true,
          },
        },

        applications: {
          orderBy: {
            createdAt: "asc",
          },

          select: {
            id: true,
            message: true,
            status: true,
            createdAt: true,

            provider: {
              select: {
                id: true,
                companyName: true,
                contactName: true,
                region: true,
                city: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      ok: true,

      orders: orders.map((order) => ({
        ...order,

        partnerAmountCHF:
          order.partnerAmountCents / 100,

        commissionCHF:
          (order.commissionCents ?? 0) / 100,

        applicationCount:
          order.applications.length,
      })),
    });
  } catch (error) {
    console.error(
      "PARTNER ORDERS MINE ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Eigene Aufträge konnten nicht geladen werden.",
      },
      { status: 500 }
    );
  }
}
