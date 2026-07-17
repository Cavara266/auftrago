import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail/mail";
import { newLeadMailTemplate } from "@/lib/mail/templates/new-lead";

type LeadForNotification = {
  id: string;
  title: string;
  description: string | null;
  region: string;
  category: string;
  price: number;
};

type SendNewLeadNotificationsInput = {
  lead: LeadForNotification;
  estimatedValue: number;
};

const MAX_CONCURRENT_SENDS = 3;

function getAppUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL;

  if (!configuredUrl) {
    return "https://auftrago.ch";
  }

  const url = configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;

  return url.replace(/\/+$/, "");
}

async function runInBatches<T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  batchSize: number,
) {
  for (let index = 0; index < items.length; index += batchSize) {
    const batch = items.slice(index, index + batchSize);
    await Promise.all(batch.map(worker));
  }
}

export async function sendNewLeadNotifications({
  lead,
  estimatedValue,
}: SendNewLeadNotificationsInput) {
  const approvedProviders = await prisma.provider.findMany({
    where: {
      status: "APPROVED",
      email: {
        not: "",
      },
    },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      email: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const uniqueRecipients = Array.from(
    new Map(
      approvedProviders
        .filter((provider) => provider.email.trim())
        .map((provider) => [
          provider.email.trim().toLowerCase(),
          {
            ...provider,
            email: provider.email.trim().toLowerCase(),
          },
        ]),
    ).values(),
  );

  const leadUrl = `${getAppUrl()}/leads/${encodeURIComponent(lead.id)}`;

  let sent = 0;
  let failed = 0;

  await runInBatches(
    uniqueRecipients,
    async (provider) => {
      const template = newLeadMailTemplate({
        companyName: provider.companyName,
        contactName: provider.contactName,
        lead,
        estimatedValue,
        leadUrl,
      });

      try {
        const result = await sendMail({
          to: provider.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });

        sent += 1;

        console.log("NEW LEAD MAIL SENT:", {
          leadId: lead.id,
          providerId: provider.id,
          to: provider.email,
          messageId: result.messageId,
        });
      } catch (error) {
        failed += 1;

        console.error("NEW LEAD MAIL FAILED:", {
          leadId: lead.id,
          providerId: provider.id,
          to: provider.email,
          error,
        });
      }
    },
    MAX_CONCURRENT_SENDS,
  );

  return {
    approvedProviders: uniqueRecipients.length,
    sent,
    failed,
  };
}