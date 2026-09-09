import { redirect } from "next/navigation";

import BusinessTopNav from "@/components/business/BusinessTopNav";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBusinessSubscriptionAccess } from "@/lib/business/subscription-access";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  if (!user) {
    redirect(
      "/login?redirect=/portal/business"
    );
  }

  const provider =
    await prisma.provider.findUnique({
      where: {
        id: user.id,
      },
      select: {
        status: true,

        subscriptionExempt: true,
        subscriptionStatus: true,
        subscriptionCurrentPeriodEnd:
          true,

        businessSubscriptionExempt:
          true,
        businessSubscriptionStatus:
          true,
        businessSubscriptionCurrentPeriodEnd:
          true,
      },
    });

  if (!provider) {
    redirect(
      "/login?error=provider-not-found"
    );
  }

  if (provider.status === "BLOCKED") {
    redirect(
      "/login?error=provider-blocked"
    );
  }

  const access =
    getBusinessSubscriptionAccess(
      provider
    );

  if (!access.hasBusinessAccess) {
    const reason =
      !access.baseSubscriptionActive &&
      !access.businessSubscriptionActive
        ? "both"
        : !access.baseSubscriptionActive
        ? "base"
        : "business";

    redirect(
      `/portal/business-upgrade?reason=${reason}`
    );
  }

  return (
    <>
      <BusinessTopNav />
      {children}
    </>
  );
}
