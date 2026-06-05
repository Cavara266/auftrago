"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function buyLeadAction(formData: FormData) {
  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const leadId = String(formData.get("leadId") || "").trim();

  if (!leadId) {
    redirect("/portal/leads?error=invalid-lead");
  }

  const result = await prisma.$transaction(async (tx) => {
    const provider = await tx.provider.findUnique({
      where: {
        id: providerId,
      },
    });

    if (!provider) {
      return "provider-missing";
    }

    const lead = await tx.lead.findUnique({
      where: {
        id: leadId,
      },
    });

    if (!lead) {
      return "lead-not-found";
    }

    const existingPurchase = await tx.leadPurchase.findUnique({
      where: {
        providerId_leadId: {
          providerId: provider.id,
          leadId: lead.id,
        },
      },
    });

    if (existingPurchase) {
      return "already-bought";
    }

    if (provider.credits < lead.price) {
      return "not-enough-credits";
    }

    await tx.provider.update({
      where: {
        id: provider.id,
      },
      data: {
        credits: {
          decrement: lead.price,
        },
      },
    });

    await tx.leadPurchase.create({
      data: {
        providerId: provider.id,
        leadId: lead.id,
        price: lead.price,
      },
    });

    return "purchased";
  });

  if (result === "provider-missing") {
    redirect("/login");
  }

  if (result === "lead-not-found") {
    redirect("/portal/leads?error=lead-not-found");
  }

  if (result === "already-bought") {
    redirect("/portal/meine-leads?message=already-bought");
  }

  if (result === "not-enough-credits") {
    redirect("/portal/leads?error=not-enough-credits");
  }

  redirect("/portal/meine-leads?message=purchased");
}