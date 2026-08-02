import type {
  ReactNode,
} from "react";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import {
  hasSubscriptionAccess,
} from "@/lib/provider-subscription";

import PortalShell from "@/components/portal/portal-shell";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const provider =
    await prisma.provider.findUnique({
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

  if (!provider) {
    redirect("/login");
  }

  if (provider.status === "BLOCKED") {
    redirect(
      "/login?error=provider-blocked",
    );
  }

  if (
    !hasSubscriptionAccess(provider)
  ) {
    redirect(
      "/subscription-required",
    );
  }

  return (
    <PortalShell>
      {children}
    </PortalShell>
  );
}
