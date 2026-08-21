import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail/mail";
import { newLeadMailTemplate } from "@/lib/mail/templates/new-lead";

type LeadForNotification = {
  id: string;
  title: string;
  description: string | null;
  region: string;
  category: string;
  postalCode?: string | null;
  city?: string | null;
  price: number;
};

type SendNewLeadNotificationsInput = {
  lead: LeadForNotification;
  estimatedValue: number;
};

type NotificationResult = {
  approvedProviders: number;
  emailEnabledProviders: number;
  matchingProviders: number;
  sent: number;
  failed: number;
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

  const normalizedUrl =
    configuredUrl.startsWith("http://") ||
    configuredUrl.startsWith("https://")
      ? configuredUrl
      : `https://${configuredUrl}`;

  return normalizedUrl.replace(/\/+$/, "");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function runInBatches<T>(
  items: T[],
  worker: (item: T) => Promise<void>,
  batchSize: number
) {
  for (
    let index = 0;
    index < items.length;
    index += batchSize
  ) {
    const batch = items.slice(index, index + batchSize);

    await Promise.all(batch.map(worker));
  }
}

export async function sendNewLeadNotifications({
  lead,
  estimatedValue,
}: SendNewLeadNotificationsInput): Promise<NotificationResult> {
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
        .filter((provider) => Boolean(provider.email?.trim()))
        .map((provider) => {
          const email = normalizeEmail(provider.email);

          return [
            email,
            {
              ...provider,
              email,
            },
          ];
        })
    ).values()
  );

  const leadUrl = `${getAppUrl()}/leads/${encodeURIComponent(
    lead.id
  )}`;

  let sent = 0;
  let failed = 0;

  const successfulRecipients: string[] = [];
  const failedRecipients: Array<{
    email: string;
    error: string;
  }> = [];

  console.log("NEW LEAD NOTIFICATION STARTED", {
    leadId: lead.id,
    approvedProviders: approvedProviders.length,
    uniqueRecipients: uniqueRecipients.length,
  });

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
        const mailResult = await sendMail({
          to: provider.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });

        sent += 1;
        successfulRecipients.push(provider.email);

        console.log("NEW LEAD MAIL SENT", {
          leadId: lead.id,
          providerId: provider.id,
          companyName: provider.companyName,
          to: provider.email,
          messageId: mailResult.messageId,
          accepted: mailResult.accepted,
          rejected: mailResult.rejected,
        });
      } catch (error) {
        failed += 1;

        const errorMessage =
          error instanceof Error
            ? error.message
            : String(error);

        failedRecipients.push({
          email: provider.email,
          error: errorMessage,
        });

        console.error("NEW LEAD MAIL FAILED", {
          leadId: lead.id,
          providerId: provider.id,
          companyName: provider.companyName,
          to: provider.email,
          error: errorMessage,
        });
      }
    },
    MAX_CONCURRENT_SENDS
  );

  const result: NotificationResult = {
    approvedProviders: approvedProviders.length,
    emailEnabledProviders: uniqueRecipients.length,
    matchingProviders: uniqueRecipients.length,
    sent,
    failed,
  };

  console.log("==========================================");
  console.log("LEAD MAIL SUMMARY");
  console.log("Lead-ID:", lead.id);
  console.log("Titel:", lead.title);
  console.log("Freigeschaltete Anbieter:", approvedProviders.length);
  console.log("Eindeutige Empfänger:", uniqueRecipients.length);
  console.log("");

  console.log(`ERFOLGREICH (${successfulRecipients.length})`);

  successfulRecipients.forEach((email) => {
    console.log("OK:", email);
  });

  console.log("");
  console.log(`FEHLER (${failedRecipients.length})`);

  failedRecipients.forEach((recipient) => {
    console.error(
      "FEHLER:",
      recipient.email,
      "-",
      recipient.error
    );
  });

  console.log("");
  console.log("Gesendet:", sent);
  console.log("Fehlgeschlagen:", failed);
  console.log("==========================================");

  console.log("NEW LEAD NOTIFICATION RESULT", {
    leadId: lead.id,
    ...result,
    successfulRecipients,
    failedRecipients,
  });

  return result;
}