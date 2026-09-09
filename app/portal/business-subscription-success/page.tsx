import { redirect } from "next/navigation";
import Stripe from "stripe";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  searchParams?: Promise<{
    session_id?: string;
  }>;
};

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || ""
);

function stripeDate(
  seconds?: number | null
) {
  return seconds
    ? new Date(seconds * 1000)
    : null;
}

export default async function BusinessSubscriptionSuccess({
  searchParams,
}: Props) {
  const params: {
    session_id?: string;
  } = await Promise.resolve(
    searchParams ?? {}
  );

  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (
    !params.session_id ||
    !process.env.STRIPE_SECRET_KEY
  ) {
    redirect(
      "/portal/business-upgrade?reason=business"
    );
  }

  const session =
    await stripe.checkout.sessions.retrieve(
      params.session_id
    );

  if (
    session.metadata?.subscriptionType !==
      "BUSINESS" ||
    session.metadata?.providerId !== user.id
  ) {
    redirect(
      "/portal/business-upgrade?reason=business"
    );
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    redirect(
      "/portal/business-upgrade?reason=business"
    );
  }

  const subscription: any =
    await stripe.subscriptions.retrieve(
      subscriptionId
    );

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id;

  const status =
    String(
      subscription.status || "INACTIVE"
    ).toUpperCase();

  await prisma.provider.update({
    where: {
      id: user.id,
    },
    data: {
      businessStripeCustomerId:
        customerId || null,

      businessStripeSubscriptionId:
        subscription.id,

      businessSubscriptionStatus:
        status,

      businessSubscriptionStartedAt:
        new Date(),

      businessSubscriptionCurrentPeriodEnd:
        stripeDate(
          subscription.current_period_end
        ),

      businessSubscriptionCancelAtPeriodEnd:
        Boolean(
          subscription.cancel_at_period_end
        ),

      businessSubscriptionCancelledAt:
        subscription.canceled_at
          ? stripeDate(
              subscription.canceled_at
            )
          : null,
    },
  });

  if (
    ["ACTIVE", "TRIALING"].includes(status)
  ) {
    redirect(
      "/portal/business?business=activated"
    );
  }

  redirect(
    "/portal/business-upgrade?reason=business"
  );
}
