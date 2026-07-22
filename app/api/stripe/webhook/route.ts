import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendFixedOrderPurchaseMails } from "@/lib/fixed-orders/send-fixed-order-purchase-mails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PackageId =
  | "starter"
  | "pro"
  | "business"
  | "agency"
  | "enterprise";

type CreditPackage = {
  credits: number;
  name: string;
};

const CREDIT_PACKAGES: Record<PackageId, CreditPackage> = {
  starter: { credits: 20, name: "20 Credits" },
  pro: { credits: 50, name: "50 Credits" },
  business: { credits: 100, name: "100 Credits" },
  agency: { credits: 250, name: "250 Credits" },
  enterprise: { credits: 500, name: "500 Credits" },
};

function isValidPackageId(
  value: unknown
): value is PackageId {
  return (
    value === "starter" ||
    value === "pro" ||
    value === "business" ||
    value === "agency" ||
    value === "enterprise"
  );
}

function isPaidCheckoutEvent(event: Stripe.Event) {
  return (
    event.type === "checkout.session.completed" ||
    event.type ===
      "checkout.session.async_payment_succeeded"
  );
}

function getPaymentIntentId(
  session: Stripe.Checkout.Session
) {
  if (typeof session.payment_intent === "string") {
    return session.payment_intent;
  }

  return session.payment_intent?.id ?? null;
}

function getBaseUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "";

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL?.trim()) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }

  return "http://localhost:3000";
}

function createInvoiceNumber(
  fixedOrderId: string,
  date = new Date()
) {
  const year = date.getFullYear();

  return `RE-${year}-${fixedOrderId.toUpperCase()}`;
}

async function processFixedOrderPayment(
  session: Stripe.Checkout.Session
) {
  const providerId =
    session.metadata?.providerId?.trim() ||
    session.client_reference_id?.trim() ||
    "";

  const fixedOrderId =
    session.metadata?.fixedOrderId?.trim() || "";

  if (!providerId || !fixedOrderId) {
    throw new Error("FIXED_ORDER_METADATA_MISSING");
  }

  const paymentIntentId = getPaymentIntentId(session);
  const paidAt = new Date();

  const result = await prisma.$transaction(
    async (tx) => {
      const fixedOrder =
        await tx.fixedOrder.findUnique({
          where: {
            id: fixedOrderId,
          },
          select: {
            id: true,
            title: true,
            category: true,
            customerFirstName: true,
            customerLastName: true,
            customerPhone: true,
            customerEmail: true,
            street: true,
            postalCode: true,
            city: true,
            executionDate: true,
            flexibleDate: true,
            orderValueCents: true,
            commissionAmountCents: true,
            status: true,
            buyerId: true,
            stripeCheckoutSessionId: true,
            stripePaymentIntentId: true,
          },
        });

      if (!fixedOrder) {
        throw new Error("FIXED_ORDER_NOT_FOUND");
      }

      const provider = await tx.provider.findUnique({
        where: {
          id: providerId,
        },
        select: {
          id: true,
          companyName: true,
          email: true,
        },
      });

      if (!provider) {
        throw new Error("PROVIDER_NOT_FOUND");
      }

      const isDuplicate =
        fixedOrder.status === "SOLD" &&
        fixedOrder.buyerId === providerId &&
        fixedOrder.stripeCheckoutSessionId ===
          session.id;

      if (
        !isDuplicate &&
        (fixedOrder.status !== "RESERVED" ||
          fixedOrder.buyerId !== providerId ||
          fixedOrder.stripeCheckoutSessionId !==
            session.id)
      ) {
        throw new Error(
          "FIXED_ORDER_RESERVATION_MISMATCH"
        );
      }

      if (!isDuplicate) {
        const updated =
          await tx.fixedOrder.updateMany({
            where: {
              id: fixedOrderId,
              status: "RESERVED",
              buyerId: providerId,
              stripeCheckoutSessionId: session.id,
            },
            data: {
              status: "SOLD",
              soldAt: paidAt,
              completedAt: null,
              cancelledAt: null,
              stripePaymentIntentId: paymentIntentId,
            },
          });

        if (updated.count !== 1) {
          throw new Error("FIXED_ORDER_UPDATE_FAILED");
        }
      }

      const invoice = await tx.invoice.upsert({
        where: {
          fixedOrderId,
        },
        update: {
          providerId,
          stripePaymentIntentId:
            paymentIntentId ||
            fixedOrder.stripePaymentIntentId,
          amountCents:
            fixedOrder.commissionAmountCents,
          status: "PAID",
        },
        create: {
          invoiceNumber: createInvoiceNumber(
            fixedOrderId,
            paidAt
          ),
          providerId,
          fixedOrderId,
          stripePaymentIntentId:
            paymentIntentId ||
            fixedOrder.stripePaymentIntentId,
          amountCents:
            fixedOrder.commissionAmountCents,
          status: "PAID",
        },
        select: {
          id: true,
          invoiceNumber: true,
        },
      });

      return {
        duplicate: isDuplicate,
        fixedOrder,
        provider,
        invoice,
      };
    }
  );

  console.log(
    "STRIPE FIXED ORDER PURCHASE SUCCESS:",
    {
      stripeSessionId: session.id,
      paymentIntentId,
      providerId,
      fixedOrderId,
      invoiceId: result.invoice.id,
      invoiceNumber: result.invoice.invoiceNumber,
      amount: session.amount_total ?? 0,
      currency:
        session.currency?.toLowerCase() || "chf",
      duplicate: result.duplicate,
    }
  );

  if (!result.duplicate) {
    const baseUrl = getBaseUrl();

    const customerName = [
      result.fixedOrder.customerFirstName,
      result.fixedOrder.customerLastName,
    ]
      .filter(Boolean)
      .join(" ");

    const mailResult =
      await sendFixedOrderPurchaseMails({
        providerCompanyName:
          result.provider.companyName,
        providerEmail: result.provider.email,

        fixedOrderId: result.fixedOrder.id,
        title: result.fixedOrder.title,
        category: result.fixedOrder.category,

        customerName,
        customerPhone:
          result.fixedOrder.customerPhone,
        customerEmail:
          result.fixedOrder.customerEmail,

        street: result.fixedOrder.street,
        postalCode:
          result.fixedOrder.postalCode,
        city: result.fixedOrder.city,

        executionDate:
          result.fixedOrder.executionDate,
        flexibleDate:
          result.fixedOrder.flexibleDate,

        orderValueCents:
          result.fixedOrder.orderValueCents,
        commissionAmountCents:
          result.fixedOrder.commissionAmountCents,

        customerUrl: `${baseUrl}/portal/fixed-orders/${result.fixedOrder.id}/customer`,
        adminUrl: `${baseUrl}/admin/fixed-orders/${result.fixedOrder.id}`,
      });

    console.log(
      "FIXED ORDER PURCHASE MAIL RESULT:",
      {
        fixedOrderId: result.fixedOrder.id,
        invoiceNumber:
          result.invoice.invoiceNumber,
        providerMailSent:
          mailResult.providerMailSent,
        adminMailSent: mailResult.adminMailSent,
        errors: mailResult.errors,
      }
    );
  }

  return {
    duplicate: result.duplicate,
    fixedOrderId: result.fixedOrder.id,
    invoiceId: result.invoice.id,
    invoiceNumber: result.invoice.invoiceNumber,
  };
}

async function releaseExpiredFixedOrderReservation(
  session: Stripe.Checkout.Session
) {
  if (session.metadata?.type !== "fixed-order") {
    return {
      released: false,
      ignored: true,
    };
  }

  const providerId =
    session.metadata?.providerId?.trim() ||
    session.client_reference_id?.trim() ||
    "";

  const fixedOrderId =
    session.metadata?.fixedOrderId?.trim() || "";

  if (!providerId || !fixedOrderId) {
    console.error(
      "STRIPE FIXED ORDER EXPIRED METADATA MISSING:",
      {
        stripeSessionId: session.id,
        providerId,
        fixedOrderId,
      }
    );

    return {
      released: false,
      ignored: false,
    };
  }

  const released =
    await prisma.fixedOrder.updateMany({
      where: {
        id: fixedOrderId,
        status: "RESERVED",
        buyerId: providerId,
        stripeCheckoutSessionId: session.id,
      },
      data: {
        status: "OPEN",
        buyerId: null,
        reservedAt: null,
        completedAt: null,
        cancelledAt: null,
        stripeCheckoutSessionId: null,
        stripePaymentIntentId: null,
      },
    });

  console.log(
    "STRIPE FIXED ORDER RESERVATION EXPIRED:",
    {
      stripeSessionId: session.id,
      providerId,
      fixedOrderId,
      released: released.count === 1,
    }
  );

  return {
    released: released.count === 1,
    ignored: false,
  };
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get(
    "stripe-signature"
  );

  if (!signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "Stripe-Signatur fehlt.",
      },
      { status: 400 }
    );
  }

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET fehlt.");

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook-Konfiguration fehlt.",
      },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "STRIPE WEBHOOK SIGNATURE ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Webhook konnte nicht verifiziert werden.",
      },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.expired") {
    const expiredSession =
      event.data.object as Stripe.Checkout.Session;

    try {
      const result =
        await releaseExpiredFixedOrderReservation(
          expiredSession
        );

      return NextResponse.json({
        ok: true,
        received: true,
        expired: true,
        released: result.released,
        ignored: result.ignored,
      });
    } catch (error) {
      console.error(
        "STRIPE FIXED ORDER EXPIRATION ERROR:",
        {
          stripeSessionId: expiredSession.id,
          error,
        }
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Die abgelaufene Reservierung konnte nicht freigegeben werden.",
        },
        { status: 500 }
      );
    }
  }

  if (!isPaidCheckoutEvent(event)) {
    return NextResponse.json({
      ok: true,
      received: true,
      ignored: true,
    });
  }

  const session =
    event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({
      ok: true,
      received: true,
      paymentPending: true,
    });
  }

  if (session.metadata?.type === "fixed-order") {
    try {
      const result =
        await processFixedOrderPayment(session);

      return NextResponse.json({
        ok: true,
        received: true,
        fixedOrder: true,
        duplicate: result.duplicate,
        invoiceId: result.invoiceId,
        invoiceNumber: result.invoiceNumber,
      });
    } catch (error) {
      console.error(
        "STRIPE FIXED ORDER WEBHOOK ERROR:",
        {
          stripeSessionId: session.id,
          error,
        }
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Fixauftrag konnte nicht freigeschaltet werden.",
        },
        { status: 500 }
      );
    }
  }

  const providerId =
    session.metadata?.providerId?.trim() ||
    session.client_reference_id?.trim() ||
    "";

  const rawPackageId =
    session.metadata?.packageId?.trim() ||
    session.metadata?.planId?.trim() ||
    "";

  if (!providerId) {
    console.error(
      "STRIPE WEBHOOK ERROR: providerId fehlt.",
      session.id
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Anbieter-Zuordnung fehlt.",
      },
      { status: 500 }
    );
  }

  if (!isValidPackageId(rawPackageId)) {
    console.error(
      "STRIPE WEBHOOK ERROR: Ungültiges Credit-Paket.",
      {
        stripeSessionId: session.id,
        packageId: rawPackageId,
      }
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Credit-Paket konnte nicht zugeordnet werden.",
      },
      { status: 500 }
    );
  }

  const selectedPackage =
    CREDIT_PACKAGES[rawPackageId];

  const credits = selectedPackage.credits;
  const amount = session.amount_total ?? 0;
  const currency = (
    session.currency || "chf"
  ).toLowerCase();

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const existingPurchase =
          await tx.creditPurchase.findUnique({
            where: {
              stripeSessionId: session.id,
            },
            select: {
              id: true,
              providerId: true,
              credits: true,
            },
          });

        if (existingPurchase) {
          return {
            duplicate: true,
            purchaseId: existingPurchase.id,
            credits: existingPurchase.credits,
          };
        }

        const provider =
          await tx.provider.findUnique({
            where: {
              id: providerId,
            },
            select: {
              id: true,
              email: true,
              status: true,
            },
          });

        if (!provider) {
          throw new Error("PROVIDER_NOT_FOUND");
        }

        const purchase =
          await tx.creditPurchase.create({
            data: {
              providerId,
              stripeSessionId: session.id,
              packageId: rawPackageId,
              credits,
              amount,
              currency,
              status: "paid",
            },
            select: {
              id: true,
            },
          });

        const updatedProvider =
          await tx.provider.update({
            where: {
              id: providerId,
            },
            data: {
              credits: {
                increment: credits,
              },
            },
            select: {
              credits: true,
            },
          });

        return {
          duplicate: false,
          purchaseId: purchase.id,
          credits,
          newBalance: updatedProvider.credits,
        };
      }
    );

    console.log(
      "STRIPE CREDIT PURCHASE SUCCESS:",
      {
        stripeSessionId: session.id,
        providerId,
        packageId: rawPackageId,
        credits,
        amount,
        currency,
        duplicate: result.duplicate,
        newBalance:
          "newBalance" in result
            ? result.newBalance
            : undefined,
      }
    );

    return NextResponse.json({
      ok: true,
      received: true,
      duplicate: result.duplicate,
    });
  } catch (error) {
    if (
      error instanceof
        Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({
        ok: true,
        received: true,
        duplicate: true,
      });
    }

    if (
      error instanceof Error &&
      error.message === "PROVIDER_NOT_FOUND"
    ) {
      console.error(
        "STRIPE WEBHOOK ERROR: Anbieter wurde nicht gefunden.",
        {
          providerId,
          stripeSessionId: session.id,
        }
      );

      return NextResponse.json(
        {
          ok: false,
          error: "Anbieter wurde nicht gefunden.",
        },
        { status: 500 }
      );
    }

    console.error(
      "STRIPE WEBHOOK DATABASE ERROR:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Credit-Gutschrift fehlgeschlagen.",
      },
      { status: 500 }
    );
  }
}