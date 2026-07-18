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
  /*
   * Jeder freigeschaltete Anbieter mit einer gültigen E-Mail-Adresse
   * erhält jeden neu erstellten Lead.
   *
   * Folgende Einstellungen werden bewusst ignoriert:
   * - receiveLeadEmails
   * - receiveAllLeadEmails
   * - serviceRegions
   * - serviceCategories
   * - serviceCities
   * - servicePostalCodes
   * - region
   * - category
   */
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

  /*
   * Falls mehrere Anbieter-Datensätze dieselbe E-Mail-Adresse
   * verwenden, wird die Nachricht nur einmal an diese Adresse versendet.
   */
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

        console.log("NEW LEAD MAIL SENT", {
          leadId: lead.id,
          providerId: provider.id,
          to: provider.email,
          messageId: mailResult.messageId,
        });
      } catch (error) {
        failed += 1;

        console.error("NEW LEAD MAIL FAILED", {
          leadId: lead.id,
          providerId: provider.id,
          to: provider.email,
          error,
        });
      }
    },
    MAX_CONCURRENT_SENDS
  );

  const result: NotificationResult = {
    approvedProviders: approvedProviders.length,

    /*
     * Diese Werte bleiben für die Kompatibilität mit deiner
     * bestehenden actions.ts bestehen. Da Einstellungen und
     * Matching ignoriert werden, entsprechen sie den Empfängern.
     */
    emailEnabledProviders: uniqueRecipients.length,
    matchingProviders: uniqueRecipients.length,

    sent,
    failed,
  };

  console.log("NEW LEAD NOTIFICATION RESULT", {
    leadId: lead.id,
    ...result,
  });

  return result;
}