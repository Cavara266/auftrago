import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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
  starter: {
    credits: 20,
    name: "20 Credits",
  },
  pro: {
    credits: 50,
    name: "50 Credits",
  },
  business: {
    credits: 100,
    name: "100 Credits",
  },
  agency: {
    credits: 250,
    name: "250 Credits",
  },
  enterprise: {
    credits: 500,
    name: "500 Credits",
  },
};

function isValidPackageId(value: unknown): value is PackageId {
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
    event.type === "checkout.session.async_payment_succeeded"
  );
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        ok: false,
        error: "Stripe-Signatur fehlt.",
      },
      {
        status: 400,
      }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET fehlt.");

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook-Konfiguration fehlt.",
      },
      {
        status: 500,
      }
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
    console.error("STRIPE WEBHOOK SIGNATURE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Webhook konnte nicht verifiziert werden.",
      },
      {
        status: 400,
      }
    );
  }

  /*
   * Alle nicht relevanten Stripe-Ereignisse bestätigen wir sofort.
   */
  if (!isPaidCheckoutEvent(event)) {
    return NextResponse.json({
      ok: true,
      received: true,
      ignored: true,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  /*
   * Bei checkout.session.completed kann die Zahlung bei gewissen
   * Zahlungsarten noch ausstehend sein. In diesem Fall warten wir
   * auf checkout.session.async_payment_succeeded.
   */
  if (session.payment_status !== "paid") {
    return NextResponse.json({
      ok: true,
      received: true,
      paymentPending: true,
    });
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

    /*
     * Hier geben wir 500 zurück, damit Stripe den Webhook erneut
     * versucht. Eine bezahlte Bestellung darf nicht still verloren gehen.
     */
    return NextResponse.json(
      {
        ok: false,
        error: "Anbieter-Zuordnung fehlt.",
      },
      {
        status: 500,
      }
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
        error: "Credit-Paket konnte nicht zugeordnet werden.",
      },
      {
        status: 500,
      }
    );
  }

  const selectedPackage = CREDIT_PACKAGES[rawPackageId];
  const credits = selectedPackage.credits;
  const amount = session.amount_total ?? 0;
  const currency = (session.currency || "chf").toLowerCase();

  try {
    const result = await prisma.$transaction(async (tx) => {
      /*
       * Stripe kann denselben Webhook mehrfach zustellen.
       * stripeSessionId ist im Prisma-Schema unique.
       */
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

      const provider = await tx.provider.findUnique({
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

      const purchase = await tx.creditPurchase.create({
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

      const updatedProvider = await tx.provider.update({
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
    });

    console.log("STRIPE CREDIT PURCHASE SUCCESS:", {
      stripeSessionId: session.id,
      providerId,
      packageId: rawPackageId,
      credits,
      amount,
      currency,
      duplicate: result.duplicate,
      newBalance:
        "newBalance" in result ? result.newBalance : undefined,
    });

    return NextResponse.json({
      ok: true,
      received: true,
      duplicate: result.duplicate,
    });
  } catch (error) {
    /*
     * Zusätzlicher Schutz bei zwei exakt gleichzeitig eintreffenden
     * Webhooks. Der Unique-Index verhindert die doppelte Gutschrift.
     */
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
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
        {
          status: 500,
        }
      );
    }

    console.error("STRIPE WEBHOOK DATABASE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Credit-Gutschrift fehlgeschlagen.",
      },
      {
        status: 500,
      }
    );
  }
}