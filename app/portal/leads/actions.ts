"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const DEMO_PROVIDER_EMAIL =
  process.env.DEMO_PROVIDER_EMAIL?.trim().toLowerCase() ||
  "info@cavara-hauswartung.ch";

export async function buyLeadAction(formData: FormData) {
  const leadId = String(formData.get("leadId") || "").trim();

  if (!leadId) {
    redirect("/portal/leads?error=invalid-lead");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      email: DEMO_PROVIDER_EMAIL,
    },
  });

  if (!provider) {
    redirect("/portal/leads?error=provider-missing");
  }

  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
  });

  if (!lead) {
    redirect("/portal/leads?error=lead-not-found");
  }

  const existingPurchase = await prisma.leadPurchase.findUnique({
    where: {
      providerId_leadId: {
        providerId: provider.id,
        leadId: lead.id,
      },
    },
  });

  if (existingPurchase) {
    redirect("/portal/meine-leads?message=already-bought");
  }

  if (provider.credits < lead.price) {
    redirect("/portal/leads?error=not-enough-credits");
  }

  await prisma.$transaction(async (tx) => {
    const freshProvider = await tx.provider.findUnique({
      where: {
        id: provider.id,
      },
    });

    if (!freshProvider || freshProvider.credits < lead.price) {
      redirect("/portal/leads?error=not-enough-credits");
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
  });

  redirect("/portal/meine-leads?message=purchased");
}