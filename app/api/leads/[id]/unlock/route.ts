import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { sendLeadPurchaseMail } from "@/lib/lead-purchase-mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: {
    id: string;
  };
};

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nicht eingeloggt.",
        },
        {
          status: 401,
        }
      );
    }

    if (user.status !== "APPROVED") {
      return NextResponse.json(
        {
          ok: false,
          error:
            user.status === "PENDING"
              ? "Dein Anbieterkonto wird noch geprüft."
              : "Dein Anbieterkonto ist gesperrt.",
        },
        {
          status: 403,
        }
      );
    }

    const leadId = String(params.id || "").trim();

    if (!leadId) {
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

    const lead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      select: {
        id: true,
        title: true,
        category: true,
        region: true,
        description: true,
        name: true,
        phone: true,
        email: true,
        price: true,
      },
    });

    if (!lead) {
      return NextResponse.json(
        {
          ok: false,
          error: "Die Kundenanfrage wurde nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    if (lead.price <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Für diese Anfrage wurde kein gültiger Preis festgelegt.",
        },
        {
          status: 400,
        }
      );
    }

    const existingPurchase =
      await prisma.leadPurchase.findUnique({
        where: {
          providerId_leadId: {
            providerId: user.id,
            leadId,
          },
        },
        select: {
          id: true,
        },
      });

    if (existingPurchase) {
      return NextResponse.json({
        ok: true,
        alreadyUnlocked: true,
        message:
          "Diese Kundenanfrage wurde bereits freigeschaltet.",
      });
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const provider = await tx.provider.findUnique({
          where: {
            id: user.id,
          },
          select: {
            id: true,
            email: true,
            contactName: true,
            companyName: true,
            credits: true,
            status: true,
          },
        });

        if (!provider) {
          throw new Error("PROVIDER_NOT_FOUND");
        }

        if (provider.status !== "APPROVED") {
          throw new Error("PROVIDER_NOT_APPROVED");
        }

        const updatedProvider = await tx.provider.updateMany({
          where: {
            id: provider.id,
            status: "APPROVED",
            credits: {
              gte: lead.price,
            },
          },
          data: {
            credits: {
              decrement: lead.price,
            },
          },
        });

        if (updatedProvider.count !== 1) {
          throw new Error("NOT_ENOUGH_CREDITS");
        }

        const purchase = await tx.leadPurchase.create({
          data: {
            providerId: provider.id,
            leadId,
            price: lead.price,
            status: "OPEN",
          },
          select: {
            id: true,
            price: true,
            createdAt: true,
          },
        });

        const providerAfterPurchase =
          await tx.provider.findUnique({
            where: {
              id: provider.id,
            },
            select: {
              credits: true,
            },
          });

        return {
          purchase,
          credits: providerAfterPurchase?.credits ?? 0,
          providerEmail: provider.email,
          providerContactName: provider.contactName,
          providerCompanyName: provider.companyName,
        };
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    try {
      console.log("LEAD PURCHASE MAIL START:", {
        to: result.providerEmail,
        leadId,
      });

      await sendLeadPurchaseMail({
        providerEmail: result.providerEmail,
        providerContactName: result.providerContactName,
        providerCompanyName: result.providerCompanyName,

        leadId: lead.id,
        leadTitle: lead.title,
        leadCategory: lead.category,
        leadRegion: lead.region,
        leadDescription: lead.description,

        customerName: lead.name,
        customerPhone: lead.phone,
        customerEmail: lead.email,

        price: lead.price,
        remainingCredits: result.credits,
      });

      console.log("LEAD PURCHASE MAIL SENT:", {
        to: result.providerEmail,
        leadId,
      });
    } catch (mailError) {
      console.error(
        "LEAD PURCHASE MAIL ERROR:",
        mailError
      );
    }

    return NextResponse.json({
      ok: true,
      unlocked: true,
      leadId,
      credits: result.credits,
      purchase: result.purchase,
      message: `${lead.title} wurde erfolgreich freigeschaltet.`,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "NOT_ENOUGH_CREDITS"
    ) {
      const currentUser = await requireUser();

      return NextResponse.json(
        {
          ok: false,
          error: "NOT_ENOUGH_CREDITS",
          message: "Du hast nicht genügend Credits.",
          credits: currentUser?.credits ?? 0,
        },
        {
          status: 400,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "PROVIDER_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "PROVIDER_NOT_FOUND",
          message: "Anbieterkonto wurde nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "PROVIDER_NOT_APPROVED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "PROVIDER_NOT_APPROVED",
          message: "Dein Anbieterkonto ist nicht freigeschaltet.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({
        ok: true,
        alreadyUnlocked: true,
        message:
          "Diese Kundenanfrage wurde bereits freigeschaltet.",
      });
    }

    console.error("LEAD UNLOCK ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "SERVER_ERROR",
        message:
          "Die Kundenanfrage konnte nicht freigeschaltet werden.",
      },
      {
        status: 500,
      }
    );
  }
}