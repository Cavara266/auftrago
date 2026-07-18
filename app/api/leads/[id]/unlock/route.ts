import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { sendLeadPurchaseMail } from "@/lib/lead-purchase-mail";
import { trackProviderActivity } from "@/lib/provider-activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_LEAD_LIFETIME_DAYS = 7;
const DEFAULT_MAX_PURCHASES = 4;
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

  lead: {
    id: string;
    title: string;
    category: string;
    region: string;
    description: string;
    name: string;
    phone: string;
    email: string;
    price: number;
    maxPurchases: number;
    expiresAt: Date;
  };

  credits: number;
  purchaseCount: number;
  remainingSlots: number;

  providerEmail: string;
  providerContactName: string;
  providerCompanyName: string;
};

function getClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || undefined;
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined
  );
}

function getEffectiveExpiryDate({
  createdAt,
  expiresAt,
}: {
  createdAt: Date;
  expiresAt: Date | null;
}) {
  if (expiresAt) {
    return expiresAt;
  }

  return new Date(
    createdAt.getTime() +
      DEFAULT_LEAD_LIFETIME_DAYS * 24 * 60 * 60 * 1000
  );
}

function getEffectiveMaxPurchases(maxPurchases: number) {
  if (
    !Number.isInteger(maxPurchases) ||
    maxPurchases <= 0
  ) {
    return DEFAULT_MAX_PURCHASES;
  }

  return maxPurchases;
}

async function purchaseLead(
  providerId: string,
  leadId: string
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

          const lead = await tx.lead.findUnique({
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
              maxPurchases: true,
              expiresAt: true,
              createdAt: true,
            },
          });

          if (!lead) {
            throw new Error("LEAD_NOT_FOUND");
          }

          if (
            !Number.isInteger(lead.price) ||
            lead.price <= 0
          ) {
            throw new Error("INVALID_LEAD_PRICE");
          }

          const effectiveExpiryDate =
            getEffectiveExpiryDate({
              createdAt: lead.createdAt,
              expiresAt: lead.expiresAt,
            });

          if (
            effectiveExpiryDate.getTime() <= Date.now()
          ) {
            throw new Error("LEAD_EXPIRED");
          }

          const maxPurchases =
            getEffectiveMaxPurchases(
              lead.maxPurchases
            );

          const existingPurchase =
            await tx.leadPurchase.findUnique({
              where: {
                providerId_leadId: {
                  providerId: provider.id,
                  leadId: lead.id,
                },
              },
              select: {
                id: true,
              },
            });

          if (existingPurchase) {
            throw new Error("ALREADY_UNLOCKED");
          }

          const purchaseCount =
            await tx.leadPurchase.count({
              where: {
                leadId: lead.id,
              },
            });

          if (purchaseCount >= maxPurchases) {
            throw new Error("LEAD_SOLD_OUT");
          }

          const updatedProvider =
            await tx.provider.updateMany({
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

          const purchase =
            await tx.leadPurchase.create({
              data: {
                providerId: provider.id,
                leadId: lead.id,
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

          const newPurchaseCount =
            purchaseCount + 1;

          return {
            purchase,

            lead: {
              id: lead.id,
              title: lead.title,
              category: lead.category,
              region: lead.region,
              description: lead.description,
              name: lead.name,
              phone: lead.phone,
              email: lead.email,
              price: lead.price,
              maxPurchases,
              expiresAt: effectiveExpiryDate,
            },

            credits:
              providerAfterPurchase?.credits ?? 0,

            purchaseCount: newPurchaseCount,

            remainingSlots: Math.max(
              0,
              maxPurchases - newPurchaseCount
            ),

            providerEmail: provider.email,

            providerContactName:
              provider.contactName,

            providerCompanyName:
              provider.companyName,
          };
        },
        {
          isolationLevel:
            Prisma.TransactionIsolationLevel
              .Serializable,
        }
      );
    } catch (error) {
      const isRetryableTransactionError =
        error instanceof
          Prisma.PrismaClientKnownRequestError &&
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
  request: Request,
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

    const leadId = String(
      params.id || ""
    ).trim();

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

    const result = await purchaseLead(
      user.id,
      leadId
    );

    const ipAddress = getClientIp(request);

    const userAgent =
      request.headers.get("user-agent") ||
      undefined;

    try {
      await trackProviderActivity({
        providerId: user.id,
        event: "LEAD_PURCHASED",
        description:
          "Anbieter hat einen Lead erfolgreich freigeschaltet",
        page: `/leads/${result.lead.id}`,
        leadId: result.lead.id,
        metadata: {
          leadTitle: result.lead.title,
          category: result.lead.category,
          region: result.lead.region,
          creditsSpent: result.lead.price,
          remainingCredits: result.credits,
          purchaseId: result.purchase.id,
          purchaseCount: result.purchaseCount,
          remainingSlots: result.remainingSlots,
          maxProviders:
            result.lead.maxPurchases,
          expiresAt:
            result.lead.expiresAt.toISOString(),
        },
        ipAddress,
        userAgent,
      });
    } catch (activityError) {
      console.error(
        "LEAD PURCHASE ACTIVITY ERROR:",
        activityError
      );
    }

    try {
      console.log(
        "LEAD PURCHASE MAIL START:",
        {
          to: result.providerEmail,
          leadId: result.lead.id,
        }
      );

      await sendLeadPurchaseMail({
        providerEmail:
          result.providerEmail,

        providerContactName:
          result.providerContactName,

        providerCompanyName:
          result.providerCompanyName,

        leadId: result.lead.id,
        leadTitle: result.lead.title,
        leadCategory: result.lead.category,
        leadRegion: result.lead.region,

        leadDescription:
          result.lead.description,

        customerName:
          result.lead.name,

        customerPhone:
          result.lead.phone,

        customerEmail:
          result.lead.email,

        price: result.lead.price,

        remainingCredits:
          result.credits,
      });

      console.log(
        "LEAD PURCHASE MAIL SENT:",
        {
          to: result.providerEmail,
          leadId: result.lead.id,
        }
      );
    } catch (mailError) {
      console.error(
        "LEAD PURCHASE MAIL ERROR:",
        mailError
      );
    }

    return NextResponse.json({
      ok: true,
      unlocked: true,

      leadId: result.lead.id,

      credits: result.credits,

      purchase: result.purchase,

      purchaseCount:
        result.purchaseCount,

      maxPurchases:
        result.lead.maxPurchases,

      remainingSlots:
        result.remainingSlots,

      expiresAt:
        result.lead.expiresAt.toISOString(),

      soldOut:
        result.remainingSlots === 0,

      message: `${result.lead.title} wurde erfolgreich freigeschaltet.`,
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
      error.message === "LEAD_EXPIRED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "LEAD_EXPIRED",
          expired: true,
          message:
            "Diese Kundenanfrage ist bereits abgelaufen und kann nicht mehr freigeschaltet werden.",
        },
        {
          status: 410,
        }
      );
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
          remainingSlots: 0,
          message:
            "Diese Kundenanfrage wurde bereits vollständig vergeben.",
        },
        {
          status: 409,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message ===
        "NOT_ENOUGH_CREDITS"
    ) {
      const currentUser =
        await requireUser();

      const currentProvider =
        currentUser
          ? await prisma.provider.findUnique({
              where: {
                id: currentUser.id,
              },
              select: {
                credits: true,
              },
            })
          : null;

      return NextResponse.json(
        {
          ok: false,
          error: "NOT_ENOUGH_CREDITS",
          message:
            "Du hast nicht genügend Credits für diese Kundenanfrage.",
          credits:
            currentProvider?.credits ?? 0,
        },
        {
          status: 400,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "LEAD_NOT_FOUND"
    ) {
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

    if (
      error instanceof Error &&
      error.message ===
        "INVALID_LEAD_PRICE"
    ) {
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

    if (
      error instanceof Error &&
      error.message ===
        "PROVIDER_NOT_FOUND"
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
      error.message ===
        "PROVIDER_NOT_APPROVED"
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

    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
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
      error.message === "TRANSACTION_FAILED"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "TRANSACTION_FAILED",
          message:
            "Der Kauf konnte aufgrund einer gleichzeitigen Anfrage nicht abgeschlossen werden. Bitte versuche es erneut.",
        },
        {
          status: 409,
        }
      );
    }

    console.error(
      "LEAD UNLOCK ERROR:",
      error
    );

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