"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

async function saveActivity(
  providerId: string,
  event: string,
  description: string,
) {
  await prisma.providerActivity.create({
    data: {
      providerId,
      event,
      description,
      page: `/admin/providers/${providerId}`,
    },
  });
}

function getProviderId(formData: FormData) {
  const providerId = String(formData.get("providerId") || "").trim();

  if (!providerId) {
    throw new Error("PROVIDER_ID_MISSING");
  }

  return providerId;
}

function refreshProviderPages(providerId: string) {
  revalidatePath(`/admin/providers/${providerId}`);
  revalidatePath("/admin/providers");
  revalidatePath("/admin");
  revalidatePath("/anbieter");
  revalidatePath("/portal");
  revalidatePath("/portal/leads");
  revalidatePath("/portal/abo");
}

export async function updateSubscriptionExemption(
  formData: FormData,
): Promise<void> {
  const providerId = getProviderId(formData);
  const exempt = String(formData.get("exempt") || "") === "true";

  await prisma.provider.update({
    where: {
      id: providerId,
    },
    data: {
      subscriptionExempt: exempt,
    },
  });

  await saveActivity(
    providerId,
    exempt
      ? "subscription_manual_access_enabled"
      : "subscription_manual_access_disabled",
    exempt
      ? "Manuelle Abo-Freischaltung durch Admin aktiviert"
      : "Manuelle Abo-Freischaltung durch Admin entfernt",
  );

  refreshProviderPages(providerId);
}

export async function updateSubscriptionBlocked(
  formData: FormData,
): Promise<void> {
  const providerId = getProviderId(formData);
  const blocked = String(formData.get("blocked") || "") === "true";

  await prisma.provider.update({
    where: {
      id: providerId,
    },
    data: {
      subscriptionBlocked: blocked,
    },
  });

  await saveActivity(
    providerId,
    blocked
      ? "subscription_access_blocked"
      : "subscription_access_unblocked",
    blocked
      ? "Abo-Zugriff durch Admin gesperrt"
      : "Abo-Zugriff durch Admin wieder freigegeben",
  );

  refreshProviderPages(providerId);
}

export async function updateLeadAccessBlocked(
  formData: FormData,
): Promise<void> {
  const providerId = getProviderId(formData);
  const blocked = String(formData.get("blocked") || "") === "true";

  await prisma.provider.update({
    where: {
      id: providerId,
    },
    data: {
      leadAccessBlocked: blocked,
    },
  });

  await saveActivity(
    providerId,
    blocked ? "lead_access_blocked" : "lead_access_unblocked",
    blocked
      ? "Lead-Ansicht durch Admin gesperrt"
      : "Lead-Ansicht durch Admin wieder freigegeben",
  );

  refreshProviderPages(providerId);
}
