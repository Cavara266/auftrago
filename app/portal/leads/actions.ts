"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { sendLeadPurchaseMail } from "@/lib/lead-purchase-mail";

type PurchasedResult = {
  status: "purchased";
  leadId: string;
  providerEmail: string;
  providerContactName: string;
  providerCompanyName: string;
  remainingCredits: number;
  lead: {
    title: string;
    category: string;
    region: string;
    description: string;
    name: string;
    phone: string;
    email: string;
    price: number;
  };
};

type FailedPurchaseResult = {
  status:
    | "provider-missing"
    | "provider-not-approved"
    | "lead-not-found"
    | "already-bought"
    | "not-enough-credits";
  leadId?: string;
};

type PurchaseResult = PurchasedResult | FailedPurchaseResult;

export async function buyLeadAction(
  formData: FormData
): Promise<void> {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status !== "APPROVED") {
    redirect("/login?error=provider-not-approved");
  }

  const leadId = String(formData.get("leadId") || "").trim();

  if (!leadId) {
    redirect("/portal/leads?error=invalid-lead");
  }

  let result: PurchaseResult;

  try {
    result = await prisma.$transaction(
      async (tx): Promise<PurchaseResult> => {
        const provider = await tx.provider.findUnique({
          where: {
            id: user.id,
          },
          select: {
            id: true,
            email: true,
            contactName: true,
            companyName: true,
            credits: true,
            status: true,
          },
        });

        if (!provider) {
          return {
            status: "provider-missing",
          };
        }

        if (provider.status !== "APPROVED") {
          return {
            status: "provider-not-approved",
          };
        }

        const lead = await tx.lead.findUnique({
          where: {
            id: leadId,
          },
          select: {
            id: true,
            title: true,
            category: true,
            region: true,
            description: true,
            name: true,
            phone: true,
            email: true,
            price: true,
          },
        });

        if (!lead) {
          return {
            status: "lead-not-found",
          };
        }

        const existingPurchase =
          await tx.leadPurchase.findUnique({
            where: {
              providerId_leadId: {
                providerId: provider.id,
                leadId: lead.id,
              },
            },
            select: {
              id: true,
            },
          });

        if (existingPurchase) {
          return {
            status: "already-bought",
            leadId: lead.id,
          };
        }

        const creditUpdate = await tx.provider.updateMany({
          where: {
            id: provider.id,
            status: "APPROVED",
            credits: {
              gte: lead.price,
            },
          },
          data: {
            credits: {
              decrement: lead.price,
            },
          },
        });

        if (creditUpdate.count !== 1) {
          return {
            status: "not-enough-credits",
            leadId: lead.id,
          };
        }

        await tx.leadPurchase.create({
          data: {
            providerId: provider.id,
            leadId: lead.id,
            price: lead.price,
            status: "OPEN",
          },
        });

        const updatedProvider =
          await tx.provider.findUnique({
            where: {
              id: provider.id,
            },
            select: {
              credits: true,
            },
          });

        return {
          status: "purchased",
          leadId: lead.id,
          providerEmail: provider.email,
          providerContactName: provider.contactName,
          providerCompanyName: provider.companyName,
          remainingCredits: updatedProvider?.credits ?? 0,
          lead: {
            title: lead.title,
            category: lead.category,
            region: lead.region,
            description: lead.description,
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            price: lead.price,
          },
        };
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.Serializable,
      }
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect(
        `/portal/leads/${encodeURIComponent(
          leadId
        )}?message=already-bought`
      );
    }

    console.error("BUY LEAD ACTION ERROR:", error);

    redirect("/portal/leads?error=purchase-failed");
  }

  if (result.status === "provider-missing") {
    redirect("/login");
  }

  if (result.status === "provider-not-approved") {
    redirect("/login?error=provider-not-approved");
  }

  if (result.status === "lead-not-found") {
    redirect("/portal/leads?error=lead-not-found");
  }

  if (result.status === "already-bought") {
    redirect(
      `/portal/leads/${encodeURIComponent(
        result.leadId || leadId
      )}?message=already-bought`
    );
  }

  if (result.status === "not-enough-credits") {
    redirect(
      `/portal/guthaben?error=not-enough-credits&leadId=${encodeURIComponent(
        result.leadId || leadId
      )}`
    );
  }

  if (result.status !== "purchased") {
    console.error("UNEXPECTED PURCHASE RESULT:", result);

    redirect("/portal/leads?error=purchase-failed");
  }

  try {
    await sendLeadPurchaseMail({
      providerEmail: result.providerEmail,
      providerContactName: result.providerContactName,
      providerCompanyName: result.providerCompanyName,

      leadId: result.leadId,
      leadTitle: result.lead.title,
      leadCategory: result.lead.category,
      leadRegion: result.lead.region,
      leadDescription: result.lead.description,

      customerName: result.lead.name,
      customerPhone: result.lead.phone,
      customerEmail: result.lead.email,

      price: result.lead.price,
      remainingCredits: result.remainingCredits,
    });
  } catch (error) {
    /*
     * Der Kauf bleibt erfolgreich, auch wenn die E-Mail
     * vorübergehend nicht gesendet werden kann.
     */
    console.error("LEAD PURCHASE MAIL ERROR:", error);
  }

  revalidatePath("/portal");
  revalidatePath("/portal/leads");
  revalidatePath("/portal/meine-leads");
  revalidatePath("/portal/guthaben");
  revalidatePath("/portal/transaktionen");
  revalidatePath(`/portal/leads/${result.leadId}`);

  redirect(
    `/portal/leads/${encodeURIComponent(
      result.leadId
    )}?message=purchased`
  );
}