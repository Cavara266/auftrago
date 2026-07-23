"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail/mail";

export type CreateFixedOrderState = {
  error?: string;
};

function getRequiredText(
  formData: FormData,
  field: string
) {
  const value = formData.get(field);

  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    throw new Error(
      `Das Feld "${field}" ist erforderlich.`
    );
  }

  return value.trim();
}

function getOptionalText(
  formData: FormData,
  field: string
) {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const cleanedValue = value.trim();

  return cleanedValue || null;
}

function parseMoneyToCents(value: string) {
  const normalizedValue = value
    .trim()
    .replace(/\s/g, "")
    .replace(/CHF/gi, "")
    .replace(/['’]/g, "")
    .replace(",", ".");

  const amount = Number(normalizedValue);

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error(
      "Bitte gib einen gültigen Auftragswert ein."
    );
  }

  return Math.round(amount * 100);
}

function parseExecutionDate(
  value: string | null
) {
  if (!value) {
    return null;
  }

  const date = new Date(
    `${value}T12:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Das Ausführungsdatum ist ungültig."
    );
  }

  return date;
}

function formatCurrency(
  amountInCents: number
) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Termin flexibel";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getBaseUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function normalise(value: string | null) {
  return value?.trim().toLowerCase() || "";
}

function providerMatchesFixedOrder({
  providerRegion,
  providerCategory,
  orderRegion,
  orderCategory,
}: {
  providerRegion: string | null;
  providerCategory: string | null;
  orderRegion: string | null;
  orderCategory: string;
}) {
  const normalizedProviderRegion =
    normalise(providerRegion);

  const normalizedProviderCategory =
    normalise(providerCategory);

  const normalizedOrderRegion =
    normalise(orderRegion);

  const normalizedOrderCategory =
    normalise(orderCategory);

  const regionMatches =
    Boolean(normalizedProviderRegion) &&
    Boolean(normalizedOrderRegion) &&
    normalizedProviderRegion ===
      normalizedOrderRegion;

  const categoryMatches =
    Boolean(normalizedProviderCategory) &&
    Boolean(normalizedOrderCategory) &&
    (
      normalizedProviderCategory ===
        normalizedOrderCategory ||
      normalizedOrderCategory.includes(
        normalizedProviderCategory
      ) ||
      normalizedProviderCategory.includes(
        normalizedOrderCategory
      )
    );

  return regionMatches || categoryMatches;
}

function buildFixedOrderMail({
  companyName,
  title,
  category,
  region,
  postalCode,
  city,
  executionDate,
  flexibleDate,
  orderValueCents,
  commissionAmountCents,
  fixedOrderUrl,
}: {
  companyName: string;
  title: string;
  category: string;
  region: string | null;
  postalCode: string;
  city: string;
  executionDate: Date | null;
  flexibleDate: boolean;
  orderValueCents: number;
  commissionAmountCents: number;
  fixedOrderUrl: string;
}) {
  const executionText = flexibleDate
    ? "Termin flexibel"
    : formatDate(executionDate);

  const location = [
    postalCode,
    city,
    region,
  ]
    .filter(Boolean)
    .join(" · ");

  const safeCompanyName =
    escapeHtml(companyName);

  const safeTitle = escapeHtml(title);
  const safeCategory = escapeHtml(category);
  const safeLocation = escapeHtml(location);

  const subject =
    `🔥 Neuer Fixauftrag: ${title}`;

  const text = [
    `Hallo ${companyName}`,
    "",
    "Ein neuer bestätigter Fixauftrag ist auf Auftrago verfügbar.",
    "",
    `Auftrag: ${title}`,
    `Kategorie: ${category}`,
    `Ort: ${location}`,
    `Ausführung: ${executionText}`,
    `Auftragswert: ${formatCurrency(orderValueCents)}`,
    `Übernahmepreis: ${formatCurrency(
      commissionAmountCents
    )}`,
    "",
    "Der Auftrag wird nur einmal vergeben.",
    "",
    `Jetzt ansehen: ${fixedOrderUrl}`,
    "",
    "Freundliche Grüsse",
    "Auftrago",
  ].join("\n");

  const html = `
    <!doctype html>
    <html lang="de">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>

      <body
        style="
          margin:0;
          padding:0;
          background:#070b14;
          color:#ffffff;
          font-family:Arial,Helvetica,sans-serif;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background:#070b14;padding:32px 14px;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width:620px;
                  background:#0d1524;
                  border:1px solid #273247;
                  border-radius:22px;
                  overflow:hidden;
                "
              >
                <tr>
                  <td
                    style="
                      height:6px;
                      background:#fbbf24;
                    "
                  ></td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <div
                      style="
                        display:inline-block;
                        padding:7px 12px;
                        border-radius:999px;
                        background:#3a2c0c;
                        color:#fcd34d;
                        font-size:12px;
                        font-weight:700;
                        letter-spacing:1px;
                      "
                    >
                      🔥 BESTÄTIGTER FIXAUFTRAG
                    </div>

                    <h1
                      style="
                        margin:22px 0 8px;
                        font-size:28px;
                        line-height:1.25;
                        color:#ffffff;
                      "
                    >
                      Neuer Auftrag verfügbar
                    </h1>

                    <p
                      style="
                        margin:0;
                        color:#aeb8ca;
                        font-size:15px;
                        line-height:1.7;
                      "
                    >
                      Hallo ${safeCompanyName}, ein neuer
                      bestätigter Auftrag ist auf Auftrago
                      verfügbar. Der Auftrag wird nur einmal
                      vergeben.
                    </p>

                    <div
                      style="
                        margin-top:26px;
                        padding:22px;
                        border-radius:18px;
                        background:#111c2e;
                        border:1px solid #2a364b;
                      "
                    >
                      <div
                        style="
                          color:#fcd34d;
                          font-size:12px;
                          font-weight:700;
                          text-transform:uppercase;
                          letter-spacing:1px;
                        "
                      >
                        ${safeCategory}
                      </div>

                      <h2
                        style="
                          margin:8px 0 20px;
                          color:#ffffff;
                          font-size:21px;
                          line-height:1.35;
                        "
                      >
                        ${safeTitle}
                      </h2>

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>
                          <td
                            style="
                              padding:9px 0;
                              color:#8290a6;
                              font-size:14px;
                            "
                          >
                            Ort
                          </td>

                          <td
                            align="right"
                            style="
                              padding:9px 0;
                              color:#ffffff;
                              font-size:14px;
                              font-weight:700;
                            "
                          >
                            ${safeLocation}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding:9px 0;
                              color:#8290a6;
                              font-size:14px;
                            "
                          >
                            Ausführung
                          </td>

                          <td
                            align="right"
                            style="
                              padding:9px 0;
                              color:#ffffff;
                              font-size:14px;
                              font-weight:700;
                            "
                          >
                            ${escapeHtml(executionText)}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding:9px 0;
                              color:#8290a6;
                              font-size:14px;
                            "
                          >
                            Auftragswert
                          </td>

                          <td
                            align="right"
                            style="
                              padding:9px 0;
                              color:#86efac;
                              font-size:16px;
                              font-weight:700;
                            "
                          >
                            ${formatCurrency(
                              orderValueCents
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding:9px 0;
                              color:#8290a6;
                              font-size:14px;
                            "
                          >
                            Übernahmepreis
                          </td>

                          <td
                            align="right"
                            style="
                              padding:9px 0;
                              color:#fcd34d;
                              font-size:16px;
                              font-weight:700;
                            "
                          >
                            ${formatCurrency(
                              commissionAmountCents
                            )}
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div
                      style="
                        margin-top:28px;
                        text-align:center;
                      "
                    >
                      <a
                        href="${fixedOrderUrl}"
                        style="
                          display:inline-block;
                          padding:15px 25px;
                          border-radius:12px;
                          background:#fbbf24;
                          color:#111827;
                          text-decoration:none;
                          font-size:15px;
                          font-weight:800;
                        "
                      >
                        Fixauftrag jetzt ansehen
                      </a>
                    </div>

                    <p
                      style="
                        margin:22px 0 0;
                        color:#758197;
                        font-size:12px;
                        line-height:1.6;
                        text-align:center;
                      "
                    >
                      Die vollständigen Kundendaten werden
                      erst nach erfolgreicher Übernahme
                      freigeschaltet.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding:20px 32px;
                      background:#09101c;
                      color:#69758a;
                      font-size:11px;
                      text-align:center;
                    "
                  >
                    Auftrago · Neue Aufträge für starke Firmen
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return {
    subject,
    text,
    html,
  };
}

async function notifyProvidersAboutFixedOrder({
  fixedOrderId,
  title,
  category,
  region,
  postalCode,
  city,
  executionDate,
  flexibleDate,
  orderValueCents,
  commissionAmountCents,
}: {
  fixedOrderId: string;
  title: string;
  category: string;
  region: string | null;
  postalCode: string;
  city: string;
  executionDate: Date | null;
  flexibleDate: boolean;
  orderValueCents: number;
  commissionAmountCents: number;
}) {
  const providers =
    await prisma.provider.findMany({
      where: {
        status: "APPROVED",
        email: {
          not: "",
        },
        receiveLeadEmails: true,
      },

      select: {
        id: true,
        companyName: true,
        email: true,
        region: true,
        category: true,
        receiveAllLeadEmails: true,
      },
    });

  const recipients = providers.filter(
    (provider) => {
      if (provider.receiveAllLeadEmails) {
        return true;
      }

      return providerMatchesFixedOrder({
        providerRegion: provider.region,
        providerCategory:
          provider.category,
        orderRegion: region,
        orderCategory: category,
      });
    }
  );

  if (recipients.length === 0) {
    console.warn(
      "FIXED ORDER MAIL: Keine passenden Empfänger gefunden.",
      {
        fixedOrderId,
        category,
        region,
      }
    );

    return {
      sent: 0,
      failed: 0,
    };
  }

  const baseUrl = getBaseUrl();

  const fixedOrderUrl =
    `${baseUrl}/portal/fixed-orders/${fixedOrderId}`;

  const results = await Promise.allSettled(
    recipients.map(async (provider) => {
      const mail = buildFixedOrderMail({
        companyName:
          provider.companyName,
        title,
        category,
        region,
        postalCode,
        city,
        executionDate,
        flexibleDate,
        orderValueCents,
        commissionAmountCents,
        fixedOrderUrl,
      });

      return sendMail({
        to: provider.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    })
  );

  let sent = 0;
  let failed = 0;

  results.forEach((result, index) => {
    const provider = recipients[index];

    if (result.status === "fulfilled") {
      sent += 1;

      console.log(
        "FIXED ORDER MAIL SENT",
        {
          fixedOrderId,
          providerId: provider.id,
          email: provider.email,
        }
      );

      return;
    }

    failed += 1;

    console.error(
      "FIXED ORDER MAIL FAILED",
      {
        fixedOrderId,
        providerId: provider.id,
        email: provider.email,
        error: result.reason,
      }
    );
  });

  console.log(
    "FIXED ORDER MAIL SUMMARY",
    {
      fixedOrderId,
      recipients: recipients.length,
      sent,
      failed,
    }
  );

  return {
    sent,
    failed,
  };
}

export async function createFixedOrder(
  _previousState: CreateFixedOrderState,
  formData: FormData
): Promise<CreateFixedOrderState> {
  let createdFixedOrderId: string | null =
    null;

  try {
    const title = getRequiredText(
      formData,
      "title"
    );

    const category = getRequiredText(
      formData,
      "category"
    );

    const description = getOptionalText(
      formData,
      "description"
    );

    const region = getOptionalText(
      formData,
      "region"
    );

    const customerFirstName =
      getRequiredText(
        formData,
        "customerFirstName"
      );

    const customerLastName =
      getRequiredText(
        formData,
        "customerLastName"
      );

    const customerPhone =
      getRequiredText(
        formData,
        "customerPhone"
      );

    const customerEmail =
      getOptionalText(
        formData,
        "customerEmail"
      );

    const street = getRequiredText(
      formData,
      "street"
    );

    const postalCode =
      getRequiredText(
        formData,
        "postalCode"
      );

    const city = getRequiredText(
      formData,
      "city"
    );

    const orderValueInput =
      getRequiredText(
        formData,
        "orderValue"
      );

    const orderValueCents =
      parseMoneyToCents(
        orderValueInput
      );

    const commissionPercent = 25;

    const commissionAmountCents =
      Math.round(
        orderValueCents *
          (commissionPercent / 100)
      );

    const flexibleDate =
      formData.get("flexibleDate") ===
      "on";

    const executionDateInput =
      getOptionalText(
        formData,
        "executionDate"
      );

    const executionDate = flexibleDate
      ? null
      : parseExecutionDate(
          executionDateInput
        );

    if (
      !flexibleDate &&
      !executionDate
    ) {
      throw new Error(
        "Bitte gib ein Ausführungsdatum ein oder markiere den Termin als flexibel."
      );
    }

    const customerConfirmed =
      formData.get(
        "customerConfirmed"
      ) === "on";

    const termsConfirmed =
      formData.get(
        "termsConfirmed"
      ) === "on";

    if (!customerConfirmed) {
      throw new Error(
        "Bitte bestätige, dass der Kunde den Auftrag verbindlich zugesagt hat."
      );
    }

    if (!termsConfirmed) {
      throw new Error(
        "Bitte bestätige die Prüfung der Auftragsangaben."
      );
    }

    const fixedOrder =
      await prisma.fixedOrder.create({
        data: {
          title,
          description,
          category,
          region,

          customerFirstName,
          customerLastName,
          customerEmail,
          customerPhone,

          street,
          postalCode,
          city,

          executionDate,
          flexibleDate,

          orderValueCents,
          commissionPercent,
          commissionAmountCents,

          status: "OPEN",
        },

        select: {
          id: true,
          title: true,
          category: true,
          region: true,
          postalCode: true,
          city: true,
          executionDate: true,
          flexibleDate: true,
          orderValueCents: true,
          commissionAmountCents: true,
        },
      });

    createdFixedOrderId =
      fixedOrder.id;

    try {
      await notifyProvidersAboutFixedOrder({
        fixedOrderId: fixedOrder.id,
        title: fixedOrder.title,
        category: fixedOrder.category,
        region: fixedOrder.region,
        postalCode:
          fixedOrder.postalCode,
        city: fixedOrder.city,
        executionDate:
          fixedOrder.executionDate,
        flexibleDate:
          fixedOrder.flexibleDate,
        orderValueCents:
          fixedOrder.orderValueCents,
        commissionAmountCents:
          fixedOrder.commissionAmountCents,
      });
    } catch (mailError) {
      /*
       * Der Fixauftrag bleibt gespeichert, auch wenn
       * ein SMTP-Problem auftritt. Der Mailfehler wird
       * in den Logs vollständig angezeigt.
       */
      console.error(
        "FIXED ORDER NOTIFICATION PROCESS FAILED",
        {
          fixedOrderId:
            fixedOrder.id,
          error: mailError,
        }
      );
    }
  } catch (error) {
    console.error(
      "CREATE FIXED ORDER FAILED",
      error
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : "Der Fixauftrag konnte nicht erstellt werden.",
    };
  }

  revalidatePath("/admin");
  revalidatePath(
    "/admin/fixed-orders"
  );

  revalidatePath("/portal");
  revalidatePath("/portal/leads");
  revalidatePath(
    "/portal/fixed-orders"
  );

  if (createdFixedOrderId) {
    revalidatePath(
      `/admin/fixed-orders/${createdFixedOrderId}`
    );

    revalidatePath(
      `/portal/fixed-orders/${createdFixedOrderId}`
    );
  }

  redirect(
    "/admin/fixed-orders?message=created"
  );
}