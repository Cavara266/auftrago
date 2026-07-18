import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail/mail";
import { newLeadMailTemplate } from "@/lib/mail/templates/new-lead";
import { matchLeadToProvider } from "@/lib/provider-lead-matching";

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
    const batch = items.slice(
      index,
      index + batchSize
    );

    await Promise.all(
      batch.map(worker)
    );
  }
}

export async function sendNewLeadNotifications({
  lead,
  estimatedValue,
}: SendNewLeadNotificationsInput): Promise<NotificationResult> {
  const approvedProviders =
    await prisma.provider.findMany({
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

        region: true,
        category: true,

        serviceRegions: true,
        serviceCategories: true,
        serviceCities: true,
        servicePostalCodes: true,

        receiveLeadEmails: true,
        receiveAllLeadEmails: true,
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

  const providersWithEmailEnabled =
    approvedProviders.filter(
      (provider) =>
        provider.receiveLeadEmails
    );

  const matchingProviders =
    providersWithEmailEnabled.filter(
      (provider) => {
        const match =
          matchLeadToProvider(
            provider,
            lead
          );

        if (!match.matches) {
          console.log(
            "NEW LEAD PROVIDER SKIPPED",
            {
              leadId: lead.id,
              providerId:
                provider.id,

              categoryMatch:
                match.categoryMatch,

              locationMatch:
                match.locationMatch,

              regionMatch:
                match.regionMatch,

              cityMatch:
                match.cityMatch,

              postalCodeMatch:
                match.postalCodeMatch,

              reasons:
                match.reasons,
            }
          );
        }

        return match.matches;
      }
    );

  /*
   * Mehrere Provider-Datensätze können theoretisch dieselbe
   * E-Mail-Adresse enthalten. Deshalb werden Empfänger hier
   * nochmals dedupliziert.
   */
  const uniqueRecipients =
    Array.from(
      new Map(
        matchingProviders
          .filter((provider) =>
            Boolean(
              provider.email.trim()
            )
          )
          .map((provider) => {
            const email =
              normalizeEmail(
                provider.email
              );

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

  await runInBatches(
    uniqueRecipients,

    async (provider) => {
      const match =
        matchLeadToProvider(
          provider,
          lead
        );

      const template =
        newLeadMailTemplate({
          companyName:
            provider.companyName,

          contactName:
            provider.contactName,

          lead,
          estimatedValue,
          leadUrl,
        });

      try {
        const result =
          await sendMail({
            to: provider.email,
            subject:
              template.subject,
            html: template.html,
            text: template.text,
          });

        sent += 1;

        console.log(
          "NEW LEAD MAIL SENT",
          {
            leadId: lead.id,
            providerId:
              provider.id,

            to:
              provider.email,

            messageId:
              result.messageId,

            matchScore:
              match.score,

            matchReasons:
              match.reasons,
          }
        );
      } catch (error) {
        failed += 1;

        console.error(
          "NEW LEAD MAIL FAILED",
          {
            leadId: lead.id,
            providerId:
              provider.id,

            to:
              provider.email,

            matchScore:
              match.score,

            error,
          }
        );
      }
    },

    MAX_CONCURRENT_SENDS
  );

  const result: NotificationResult = {
    approvedProviders:
      approvedProviders.length,

    emailEnabledProviders:
      providersWithEmailEnabled.length,

    matchingProviders:
      uniqueRecipients.length,

    sent,
    failed,
  };

  console.log(
    "NEW LEAD NOTIFICATION RESULT",
    {
      leadId: lead.id,
      ...result,
    }
  );

  return result;
}