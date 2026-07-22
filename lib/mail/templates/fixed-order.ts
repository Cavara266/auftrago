type FixedOrderPurchaseMailInput = {
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

function layout({
  preheader,
  title,
  intro,
  content,
  buttonLabel,
  buttonUrl,
  footerText,
}: {
  preheader: string;
  title: string;
  intro: string;
  content: string;
  buttonLabel: string;
  buttonUrl: string;
  footerText: string;
}) {
  return `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>

  <body style="margin:0;background:#070b14;padding:0;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${escapeHtml(preheader)}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#070b14;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;">
            <tr>
              <td style="padding:0 4px 18px 4px;">
                <div style="font-size:24px;font-weight:800;letter-spacing:-0.5px;">
                  Auftrago<span style="color:#fbbf24;">.ch</span>
                </div>
              </td>
            </tr>

            <tr>
              <td style="background:#0d1320;border:1px solid #202838;border-radius:22px;overflow:hidden;">
                <div style="height:5px;background:#fbbf24;"></div>

                <div style="padding:30px 28px 12px 28px;">
                  <div style="font-size:12px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#fbbf24;">
                    Fixauftrag
                  </div>

                  <h1 style="margin:10px 0 0 0;font-size:28px;line-height:1.25;color:#ffffff;">
                    ${escapeHtml(title)}
                  </h1>

                  <p style="margin:16px 0 0 0;font-size:15px;line-height:1.7;color:#aeb8ca;">
                    ${escapeHtml(intro)}
                  </p>
                </div>

                <div style="padding:10px 28px 4px 28px;">
                  ${content}
                </div>

                <div style="padding:24px 28px 30px 28px;">
                  <a href="${escapeHtml(buttonUrl)}"
                     style="display:inline-block;background:#fbbf24;color:#070b14;text-decoration:none;font-size:15px;font-weight:800;padding:14px 22px;border-radius:12px;">
                    ${escapeHtml(buttonLabel)}
                  </a>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 8px 0 8px;font-size:12px;line-height:1.6;color:#697386;">
                ${escapeHtml(footerText)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function row(label: string, value: string) {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid #202838;font-size:13px;color:#7f8ba3;width:42%;vertical-align:top;">
      ${escapeHtml(label)}
    </td>

    <td style="padding:10px 0;border-bottom:1px solid #202838;font-size:13px;font-weight:700;color:#ffffff;text-align:right;vertical-align:top;">
      ${escapeHtml(value)}
    </td>
  </tr>`;
}

export function fixedOrderProviderMail(
  input: FixedOrderPurchaseMailInput
) {
  const executionText = input.flexibleDate
    ? "Termin flexibel"
    : formatDate(input.executionDate);

  const customerPhone =
    input.customerPhone?.trim() || "Nicht hinterlegt";

  const customerEmail =
    input.customerEmail?.trim() || "Nicht hinterlegt";

  const content = `
    <div style="background:#0a0f1a;border:1px solid #202838;border-radius:16px;padding:18px 20px;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#7f8ba3;">
        Auftragsübersicht
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:8px;">
        ${row("Auftrag", input.title)}
        ${row("Kategorie", input.category)}
        ${row("Auftragswert", formatCurrency(input.orderValueCents))}
        ${row("Bezahlte Vermittlungsgebühr", formatCurrency(input.commissionAmountCents))}
        ${row("Ausführung", executionText)}
      </table>
    </div>

    <div style="height:14px;"></div>

    <div style="background:#0a0f1a;border:1px solid #202838;border-radius:16px;padding:18px 20px;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#7f8ba3;">
        Kundendaten
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:8px;">
        ${row("Kunde", input.customerName)}
        ${row("Telefon", customerPhone)}
        ${row("E-Mail", customerEmail)}
        ${row("Adresse", `${input.street}, ${input.postalCode} ${input.city}`)}
      </table>
    </div>`;

  return {
    to: input.providerEmail,
    subject: `Fixauftrag gekauft: ${input.title}`,
    html: layout({
      preheader:
        "Die Zahlung war erfolgreich. Die Kundendaten sind jetzt freigeschaltet.",
      title: "Der Fixauftrag gehört jetzt dir",
      intro: `Hallo ${input.providerCompanyName}, deine Zahlung war erfolgreich. Du kannst den Kunden ab sofort kontaktieren und die Ausführung direkt organisieren.`,
      content,
      buttonLabel: "Kundendaten öffnen",
      buttonUrl: input.customerUrl,
      footerText:
        "Auftrago vermittelt den Auftrag. Ausführung, Terminabstimmung, Rechnungsstellung und Gewährleistung erfolgen direkt zwischen Anbieter und Kunde.",
    }),
  };
}

export function fixedOrderAdminMail(
  input: FixedOrderPurchaseMailInput
) {
  const content = `
    <div style="background:#0a0f1a;border:1px solid #202838;border-radius:16px;padding:18px 20px;">
      <div style="font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#7f8ba3;">
        Verkauf
      </div>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:8px;">
        ${row("Fixauftrag", input.title)}
        ${row("Anbieter", input.providerCompanyName)}
        ${row("Anbieter-E-Mail", input.providerEmail)}
        ${row("Auftragswert", formatCurrency(input.orderValueCents))}
        ${row("Einnahme Auftrago", formatCurrency(input.commissionAmountCents))}
        ${row("Kunde", input.customerName)}
        ${row("Ort", `${input.postalCode} ${input.city}`)}
        ${row("Auftrags-ID", input.fixedOrderId)}
      </table>
    </div>`;

  return {
    subject: `Fixauftrag verkauft: ${input.title}`,
    html: layout({
      preheader:
        "Ein Fixauftrag wurde erfolgreich über Stripe verkauft.",
      title: "Neuer Fixauftrag verkauft",
      intro: `${input.providerCompanyName} hat den Fixauftrag erfolgreich gekauft. Der Status wurde auf verkauft gesetzt und die Kundendaten wurden freigeschaltet.`,
      content,
      buttonLabel: "Im Admin öffnen",
      buttonUrl: input.adminUrl,
      footerText:
        "Diese Nachricht wurde automatisch durch das Auftrago-Zahlungssystem erstellt.",
    }),
  };
}