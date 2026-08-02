"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function updateSubscriptionExemption(
  formData: FormData,
): Promise<void> {
  const providerId = String(formData.get("providerId") || "").trim();
  const exempt = String(formData.get("exempt") || "") === "true";

  if (!providerId) {
    throw new Error("PROVIDER_ID_MISSING");
  }

  await prisma.provider.update({
    where: {
      id: providerId,
    },
    data: {
      subscriptionExempt: exempt,
    },
  });

  await prisma.providerActivity.create({
    data: {
      providerId,
      event: exempt
        ? "subscription_manual_access_enabled"
        : "subscription_manual_access_disabled",
      description: exempt
        ? "Manuelle Abo-Freischaltung durch Admin aktiviert"
        : "Manuelle Abo-Freischaltung durch Admin entfernt",
      page: `/admin/providers/${providerId}`,
    },
  });

  revalidatePath(`/admin/providers/${providerId}`);
  revalidatePath("/admin/providers");
  revalidatePath("/portal");
  revalidatePath("/portal/leads");
}
