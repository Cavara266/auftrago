import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { sendLeadPurchaseMail } from "@/lib/lead-purchase-mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_PROVIDERS_PER_LEAD = 4;
const MAX_TRANSACTION_ATTEMPTS = 3;

type RouteContext = {
  params: {
    id: string;
  };
};

type PurchaseResult = {
  purchase: {
    id: string;
    price: number;
    createdAt: Date;
  };
  credits: number;
  purchaseCount: number;
  remainingSlots: number;
  providerEmail: string;
  providerContactName: string;
  providerCompanyName: string;
};

async function purchaseLead(
  providerId: string,
  leadId: string,
  leadPrice: number
): Promise<PurchaseResult> {
  for (
    let attempt = 1;
    attempt <= MAX_TRANSACTION_ATTEMPTS;
    attempt += 1
  ) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const provider = await tx.provider.findUnique({
            where: {
              id: providerId,
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

          const existingPurchase =
            await tx.leadPurchase.findUnique({
              where: {
                providerId_leadId: {
                  providerId: provider.id,
                  leadId,
                },
              },
              select: {
                id: true,
              },
            });

          if (existingPurchase) {
            throw new Error("ALREADY_UNLOCKED");
          }

          const purchaseCount = await tx.leadPurchase.count({
            where: {
              leadId,
            },
          });

          if (purchaseCount >= MAX_PROVIDERS_PER_LEAD) {
            throw new Error("LEAD_SOLD_OUT");
          }

          const updatedProvider =
            await tx.provider.updateMany({
              where: {
                id: provider.id,
                status: "APPROVED",
                credits: {
                  gte: leadPrice,
                },
              },
              data: {
                credits: {
                  decrement: leadPrice,
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
              price: leadPrice,
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

          const newPurchaseCount = purchaseCount + 1;

          return {
            purchase,
            credits: providerAfterPurchase?.credits ?? 0,
            purchaseCount: newPurchaseCount,
            remainingSlots: Math.max(
              0,
              MAX_PROVIDERS_PER_LEAD - newPurchaseCount
            ),
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
    } catch (error) {
      const isRetryableTransactionError =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";

      if (
        isRetryableTransactionError &&
        attempt < MAX_TRANSACTION_ATTEMPTS
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("TRANSACTION_FAILED");
}

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
          error: "NOT_AUTHENTICATED",
          message: "Du bist nicht eingeloggt.",
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
          error: "PROVIDER_NOT_APPROVED",
          message:
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
          error: "INVALID_LEAD_ID",
          message: "Die Lead-ID fehlt.",
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
          error: "LEAD_NOT_FOUND",
          message:
            "Die Kundenanfrage wurde nicht gefunden.",
        },
        {
          status: 404,
        }
      );
    }

    if (!Number.isInteger(lead.price) || lead.price <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "INVALID_LEAD_PRICE",
          message:
            "Für diese Anfrage wurde kein gültiger Preis festgelegt.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await purchaseLead(
      user.id,
      lead.id,
      lead.price
    );

    try {
      console.log("LEAD PURCHASE MAIL START:", {
        to: result.providerEmail,
        leadId: lead.id,
      });

      await sendLeadPurchaseMail({
        providerEmail: result.providerEmail,
        providerContactName:
          result.providerContactName,
        providerCompanyName:
          result.providerCompanyName,

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
        leadId: lead.id,
      });
    } catch (mailError) {
      /*
       * Der Lead-Kauf bleibt erfolgreich, auch wenn der
       * E-Mail-Versand vorübergehend fehlschlägt.
       */
      console.error(
        "LEAD PURCHASE MAIL ERROR:",
        mailError
      );
    }

    return NextResponse.json({
      ok: true,
      unlocked: true,
      leadId: lead.id,
      credits: result.credits,
      purchase: result.purchase,
      purchaseCount: result.purchaseCount,
      maxPurchases: MAX_PROVIDERS_PER_LEAD,
      remainingSlots: result.remainingSlots,
      soldOut: result.remainingSlots === 0,
      message: `${lead.title} wurde erfolgreich freigeschaltet.`,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "ALREADY_UNLOCKED"
    ) {
      return NextResponse.json({
        ok: true,
        alreadyUnlocked: true,
        message:
          "Diese Kundenanfrage wurde von dir bereits freigeschaltet.",
      });
    }

    if (
      error instanceof Error &&
      error.message === "LEAD_SOLD_OUT"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "LEAD_SOLD_OUT",
          soldOut: true,
          maxPurchases: MAX_PROVIDERS_PER_LEAD,
          remainingSlots: 0,
          message:
            "Diese Kundenanfrage wurde bereits an vier Anbieter vergeben.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "NOT_ENOUGH_CREDITS"
    ) {
      const currentProvider =
        await prisma.provider.findUnique({
          where: {
            id: (await requireUser())?.id || "",
          },
          select: {
            credits: true,
          },
        });

      return NextResponse.json(
        {
          ok: false,
          error: "NOT_ENOUGH_CREDITS",
          message:
            "Du hast nicht genügend Credits für diese Kundenanfrage.",
          credits: currentProvider?.credits ?? 0,
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
          message:
            "Das Anbieterkonto wurde nicht gefunden.",
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
          message:
            "Dein Anbieterkonto ist nicht freigeschaltet.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * Derselbe Anbieter kann denselben Lead aufgrund des
     * Unique-Indexes nicht zweimal kaufen.
     */
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({
        ok: true,
        alreadyUnlocked: true,
        message:
          "Diese Kundenanfrage wurde von dir bereits freigeschaltet.",
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