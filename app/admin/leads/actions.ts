"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { sendNewLeadNotifications } from "@/lib/new-lead-notification";

const DEFAULT_MAX_PURCHASES = 4;
const DEFAULT_LEAD_LIFETIME_DAYS = 7;
const EXTENSION_DAYS = 7;

function cleanValue(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function calculateLeadPrice(estimatedValue: number) {
  if (estimatedValue <= 300) {
    return 10;
  }

  if (estimatedValue <= 700) {
    return 20;
  }

  if (estimatedValue <= 1500) {
    return 35;
  }

  if (estimatedValue <= 3000) {
    return 55;
  }

  return 80;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function getDefaultExpiryDate() {
  return addDays(new Date(), DEFAULT_LEAD_LIFETIME_DAYS);
}

function parsePositiveInteger(
  value: FormDataEntryValue | null,
  fallback: number
) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function parseOptionalDate(value: FormDataEntryValue | null) {
  const cleaned = cleanValue(value);

  if (!cleaned) {
    return null;
  }

  const parsed = new Date(cleaned);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

async function getLeadOrRedirect(leadId: string) {
  if (!leadId) {
    redirect("/admin/leads?error=invalid-lead");
  }

  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
  });

  if (!lead) {
    redirect("/admin/leads?error=invalid-lead");
  }

  return lead;
}

export async function createLeadAction(formData: FormData) {
  const title = cleanValue(formData.get("title"));
  const description = cleanValue(formData.get("description"));
  const name = cleanValue(formData.get("name"));
  const email = cleanValue(formData.get("email")).toLowerCase();
  const phone = cleanValue(formData.get("phone"));
  const region = cleanValue(formData.get("region"));
  const category = cleanValue(formData.get("category"));
  const postalCode = cleanValue(formData.get("postalCode"));
  const city = cleanValue(formData.get("city"));

  const estimatedValue = Number(formData.get("estimatedValue") || 0);
  const manualPrice = Number(formData.get("price") || 0);

  const maxPurchases = parsePositiveInteger(
    formData.get("maxPurchases"),
    DEFAULT_MAX_PURCHASES
  );

  const submittedExpiryDate = parseOptionalDate(formData.get("expiresAt"));
  const expiresAt = submittedExpiryDate || getDefaultExpiryDate();

  if (
    !title ||
    !description ||
    !name ||
    !email ||
    !phone ||
    !region ||
    !category
  ) {
    redirect("/admin/leads?error=missing-fields");
  }

  if (!Number.isFinite(estimatedValue) || estimatedValue < 1) {
    redirect("/admin/leads?error=invalid-value");
  }

  const price =
    Number.isFinite(manualPrice) && manualPrice >= 1
      ? Math.round(manualPrice)
      : calculateLeadPrice(estimatedValue);

  if (!Number.isInteger(price) || price < 1) {
    redirect("/admin/leads?error=invalid-price");
  }

  if (expiresAt.getTime() <= Date.now()) {
    redirect("/admin/leads?error=invalid-expiry");
  }

  const lead = await prisma.lead.create({
    data: {
      title,
      description,
      name,
      email,
      phone,
      region,
      category,
      postalCode: postalCode || null,
      city: city || null,
      price,
      maxPurchases,
      expiresAt,
    },
    select: {
      id: true,
      title: true,
      description: true,
      region: true,
      category: true,
      price: true,
    },
  });

  try {
    const result = await sendNewLeadNotifications({
      lead,
      estimatedValue,
    });

    console.log("NEW LEAD NOTIFICATIONS COMPLETED:", {
      leadId: lead.id,
      approvedProviders: result.approvedProviders,
      sent: result.sent,
      failed: result.failed,
    });
  } catch (error) {
    console.error("NEW LEAD NOTIFICATION ERROR:", {
      leadId: lead.id,
      error,
    });
  }

  revalidatePath("/admin/leads");
  revalidatePath("/leads");

  redirect("/admin/leads?message=created");
}

export async function updateLeadAction(formData: FormData) {
  const leadId = cleanValue(formData.get("leadId"));

  await getLeadOrRedirect(leadId);

  const title = cleanValue(formData.get("title"));
  const description = cleanValue(formData.get("description"));
  const name = cleanValue(formData.get("name"));
  const email = cleanValue(formData.get("email")).toLowerCase();
  const phone = cleanValue(formData.get("phone"));
  const region = cleanValue(formData.get("region"));
  const category = cleanValue(formData.get("category"));
  const postalCode = cleanValue(formData.get("postalCode"));
  const city = cleanValue(formData.get("city"));

  const price = Number(formData.get("price") || 0);
  const maxPurchases = Number(formData.get("maxPurchases") || 0);
  const expiresAt = parseOptionalDate(formData.get("expiresAt"));

  if (
    !title ||
    !description ||
    !name ||
    !email ||
    !phone ||
    !region ||
    !category
  ) {
    redirect(`/admin/leads/${leadId}?error=missing-fields`);
  }

  if (!Number.isInteger(price) || price < 1) {
    redirect(`/admin/leads/${leadId}?error=invalid-price`);
  }

  if (!Number.isInteger(maxPurchases) || maxPurchases < 1) {
    redirect(`/admin/leads/${leadId}?error=invalid-max-purchases`);
  }

  if (!expiresAt) {
    redirect(`/admin/leads/${leadId}?error=invalid-expiry`);
  }

  const purchaseCount = await prisma.leadPurchase.count({
    where: {
      leadId,
    },
  });

  if (maxPurchases < purchaseCount) {
    redirect(
      `/admin/leads/${leadId}?error=max-purchases-below-sales`
    );
  }

  await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      title,
      description,
      name,
      email,
      phone,
      region,
      category,
      postalCode: postalCode || null,
      city: city || null,
      price,
      maxPurchases,
      expiresAt,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);

  redirect(`/admin/leads/${leadId}?message=updated`);
}

export async function extendLeadAction(formData: FormData) {
  const leadId = cleanValue(formData.get("leadId"));
  const lead = await getLeadOrRedirect(leadId);

  const now = new Date();

  const currentExpiry =
    lead.expiresAt && lead.expiresAt.getTime() > now.getTime()
      ? lead.expiresAt
      : now;

  const newExpiry = addDays(currentExpiry, EXTENSION_DAYS);

  await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      expiresAt: newExpiry,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);

  redirect("/admin/leads?message=extended");
}

export async function duplicateLeadAction(formData: FormData) {
  const leadId = cleanValue(formData.get("leadId"));
  const sourceLead = await getLeadOrRedirect(leadId);

  const duplicatedLead = await prisma.lead.create({
    data: {
      title: `${sourceLead.title} – Kopie`,
      description: sourceLead.description,
      name: sourceLead.name,
      email: sourceLead.email,
      phone: sourceLead.phone,
      region: sourceLead.region,
      category: sourceLead.category,
      postalCode: sourceLead.postalCode,
      city: sourceLead.city,
      price: sourceLead.price,
      maxPurchases: sourceLead.maxPurchases,
      expiresAt: getDefaultExpiryDate(),
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/leads");

  redirect(
    `/admin/leads/${duplicatedLead.id}?message=duplicated`
  );
}

export async function archiveLeadAction(formData: FormData) {
  const leadId = cleanValue(formData.get("leadId"));

  await getLeadOrRedirect(leadId);

  /*
   * Im aktuellen Schema gibt es noch kein separates Feld "archived".
   * Deshalb wird der Lead durch ein abgelaufenes Ablaufdatum archiviert.
   * Er bleibt im Adminbereich und in der Kaufhistorie erhalten, kann aber
   * von Anbietern nicht mehr freigeschaltet werden.
   */
  await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      expiresAt: new Date(),
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);

  redirect("/admin/leads?message=archived");
}

export async function deleteLeadAction(formData: FormData) {
  const leadId = cleanValue(formData.get("leadId"));
  const lead = await getLeadOrRedirect(leadId);

  const purchaseCount = await prisma.leadPurchase.count({
    where: {
      leadId: lead.id,
    },
  });

  if (purchaseCount > 0) {
    redirect("/admin/leads?error=lead-has-purchases");
  }

  await prisma.lead.delete({
    where: {
      id: lead.id,
    },
  });

  revalidatePath("/admin/leads");
  revalidatePath("/leads");

  redirect("/admin/leads?message=deleted");
}