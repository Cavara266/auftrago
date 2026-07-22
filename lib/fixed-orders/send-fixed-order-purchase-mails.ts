import { sendMail } from "@/lib/mail/mail";
import {
  fixedOrderAdminMail,
  fixedOrderProviderMail,
} from "@/lib/mail/templates/fixed-order";

type SendFixedOrderPurchaseMailsInput = {
  providerCompanyName: string;
  providerEmail: string;

  fixedOrderId: string;
  title: string;
  category: string;

  customerName: string;
  customerPhone?: string | null;
  customerEmail?: string | null;

  street: string;
  postalCode: string;
  city: string;

  executionDate?: Date | null;
  flexibleDate: boolean;

  orderValueCents: number;
  commissionAmountCents: number;

  customerUrl: string;
  adminUrl: string;
};

type MailResult = {
  providerMailSent: boolean;
  adminMailSent: boolean;
  errors: string[];
};

function getAdminEmail() {
  return (
    process.env.FIXED_ORDER_ADMIN_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    ""
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unbekannter E-Mail-Fehler";
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date?: Date | null) {
  if (!date) {
    return "Noch nicht festgelegt";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function createProviderText(
  input: SendFixedOrderPurchaseMailsInput
) {
  const executionText = input.flexibleDate
    ? "Termin flexibel"
    : formatDate(input.executionDate);

  return [
    `Hallo ${input.providerCompanyName}`,
    "",
    "deine Zahlung war erfolgreich. Der Fixauftrag gehört jetzt dir.",
    "",
    `Auftrag: ${input.title}`,
    `Kategorie: ${input.category}`,
    `Auftragswert: ${formatCurrency(input.orderValueCents)}`,
    `Vermittlungsgebühr: ${formatCurrency(
      input.commissionAmountCents
    )}`,
    `Ausführung: ${executionText}`,
    "",
    "Kundendaten:",
    `Kunde: ${input.customerName}`,
    `Telefon: ${input.customerPhone || "Nicht hinterlegt"}`,
    `E-Mail: ${input.customerEmail || "Nicht hinterlegt"}`,
    `Adresse: ${input.street}, ${input.postalCode} ${input.city}`,
    "",
    `Kundendaten öffnen: ${input.customerUrl}`,
    "",
    "Auftrago vermittelt den Auftrag. Ausführung, Terminabstimmung, Rechnungsstellung und Gewährleistung erfolgen direkt zwischen Anbieter und Kunde.",
  ].join("\n");
}

function createAdminText(
  input: SendFixedOrderPurchaseMailsInput
) {
  return [
    "Ein Fixauftrag wurde erfolgreich verkauft.",
    "",
    `Fixauftrag: ${input.title}`,
    `Anbieter: ${input.providerCompanyName}`,
    `Anbieter-E-Mail: ${input.providerEmail}`,
    `Auftragswert: ${formatCurrency(input.orderValueCents)}`,
    `Einnahme Auftrago: ${formatCurrency(
      input.commissionAmountCents
    )}`,
    `Kunde: ${input.customerName}`,
    `Ort: ${input.postalCode} ${input.city}`,
    `Auftrags-ID: ${input.fixedOrderId}`,
    "",
    `Im Admin öffnen: ${input.adminUrl}`,
  ].join("\n");
}

export async function sendFixedOrderPurchaseMails(
  input: SendFixedOrderPurchaseMailsInput
): Promise<MailResult> {
  const result: MailResult = {
    providerMailSent: false,
    adminMailSent: false,
    errors: [],
  };

  const providerMail = fixedOrderProviderMail(input);

  try {
    await sendMail({
      to: providerMail.to,
      subject: providerMail.subject,
      html: providerMail.html,
      text: createProviderText(input),
    });

    result.providerMailSent = true;
  } catch (error) {
    const message = getErrorMessage(error);

    result.errors.push(
      `Anbieter-E-Mail konnte nicht versendet werden: ${message}`
    );

    console.error(
      "[fixed-order] Anbieter-E-Mail fehlgeschlagen",
      {
        fixedOrderId: input.fixedOrderId,
        providerEmail: input.providerEmail,
        error,
      }
    );
  }

  const adminEmail = getAdminEmail();

  if (!adminEmail) {
    result.errors.push(
      "Admin-E-Mail wurde nicht versendet, weil FIXED_ORDER_ADMIN_EMAIL oder ADMIN_EMAIL fehlt."
    );

    console.warn(
      "[fixed-order] Keine Admin-E-Mail-Adresse konfiguriert",
      {
        fixedOrderId: input.fixedOrderId,
      }
    );

    return result;
  }

  const adminMail = fixedOrderAdminMail(input);

  try {
    await sendMail({
      to: adminEmail,
      subject: adminMail.subject,
      html: adminMail.html,
      text: createAdminText(input),
    });

    result.adminMailSent = true;
  } catch (error) {
    const message = getErrorMessage(error);

    result.errors.push(
      `Admin-E-Mail konnte nicht versendet werden: ${message}`
    );

    console.error(
      "[fixed-order] Admin-E-Mail fehlgeschlagen",
      {
        fixedOrderId: input.fixedOrderId,
        adminEmail,
        error,
      }
    );
  }

  return result;
}