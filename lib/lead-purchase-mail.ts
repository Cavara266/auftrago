import nodemailer from "nodemailer";

type LeadPurchaseMailData = {
  providerEmail: string;
  providerContactName: string;
  providerCompanyName: string;

  leadId: string;
  leadTitle: string;
  leadCategory: string;
  leadRegion: string;
  leadDescription: string;

  customerName: string;
  customerPhone: string;
  customerEmail: string;

  price: number;
  remainingCredits: number;
};

function getMailConfiguration() {
  const host = process.env.MAIL_HOST || process.env.SMTP_HOST;

  const port = Number(
    process.env.MAIL_PORT ||
      process.env.SMTP_PORT ||
      587
  );

  const user =
    process.env.MAIL_USER ||
    process.env.SMTP_USER;

  const pass =
    process.env.MAIL_PASS ||
    process.env.SMTP_PASS;

  const from =
    process.env.MAIL_FROM ||
    user;

  const replyTo =
    process.env.MAIL_TO ||
    from;

  if (!host || !user || !pass || !from) {
    throw new Error(
      "Mail-Konfiguration fehlt. Prüfe MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS und MAIL_FROM."
    );
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    replyTo,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendLeadPurchaseMail(
  data: LeadPurchaseMailData
) {
  const mailConfiguration = getMailConfiguration();

  const transporter = nodemailer.createTransport({
    host: mailConfiguration.host,
    port: mailConfiguration.port,
    secure: mailConfiguration.port === 465,
    auth: {
      user: mailConfiguration.user,
      pass: mailConfiguration.pass,
    },
  });

  await transporter.verify();

  const leadUrl = `https://auftrago.ch/portal/leads/${encodeURIComponent(
    data.leadId
  )}`;

  const safeProviderName = escapeHtml(
    data.providerContactName
  );

  const safeCompanyName = escapeHtml(
    data.providerCompanyName
  );

  const safeLeadTitle = escapeHtml(
    data.leadTitle
  );

  const safeCategory = escapeHtml(
    data.leadCategory
  );

  const safeRegion = escapeHtml(
    data.leadRegion
  );

  const safeDescription = escapeHtml(
    data.leadDescription
  ).replaceAll("\n", "<br />");

  const safeCustomerName = escapeHtml(
    data.customerName
  );

  const safeCustomerPhone = escapeHtml(
    data.customerPhone
  );

  const safeCustomerEmail = escapeHtml(
    data.customerEmail
  );

  await transporter.sendMail({
    from: mailConfiguration.from,
    to: data.providerEmail,
    replyTo: mailConfiguration.replyTo,

    subject: `Lead freigeschaltet: ${data.leadTitle}`,

    text: `
Guten Tag ${data.providerContactName}

Du hast folgende Kundenanfrage erfolgreich freigeschaltet:

${data.leadTitle}

Kategorie: ${data.leadCategory}
Region: ${data.leadRegion}
Verwendete Credits: ${data.price}
Verbleibendes Guthaben: ${data.remainingCredits} Credits

KUNDENKONTAKT

Name: ${data.customerName}
Telefon: ${data.customerPhone}
E-Mail: ${data.customerEmail}

BESCHREIBUNG

${data.leadDescription}

Lead öffnen:
${leadUrl}

Wir empfehlen, die Kundin oder den Kunden möglichst schnell zu kontaktieren.

Freundliche Grüsse

Auftrago
Die Schweizer Plattform für regionale Dienstleistungen
https://auftrago.ch
    `.trim(),

    html: `
      <div style="margin:0;padding:32px;background:#f3f6fb;font-family:Arial,sans-serif;color:#172033;">
        <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,0.12);">

          <div style="padding:32px;background:linear-gradient(135deg,#071326,#163761);color:#ffffff;">
            <div style="font-size:14px;font-weight:700;letter-spacing:2px;opacity:0.75;">
              AUFTRAGO
            </div>

            <h1 style="margin:16px 0 0;font-size:32px;line-height:1.15;">
              Kundenanfrage freigeschaltet
            </h1>
          </div>

          <div style="padding:32px;">
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">
              Guten Tag ${safeProviderName}
            </p>

            <p style="margin:0 0 22px;font-size:16px;line-height:1.7;">
              Du hast für <strong>${safeCompanyName}</strong>
              erfolgreich eine neue Kundenanfrage freigeschaltet.
            </p>

            <div style="padding:22px;border-radius:18px;background:#f7f9fc;border:1px solid #e8edf5;">
              <div style="font-size:13px;font-weight:700;letter-spacing:1.3px;color:#6b7280;">
                AUFTRAG
              </div>

              <h2 style="margin:10px 0 0;font-size:24px;color:#172033;">
                ${safeLeadTitle}
              </h2>

              <div style="margin-top:16px;font-size:15px;line-height:1.8;color:#4b5563;">
                <div><strong>Kategorie:</strong> ${safeCategory}</div>
                <div><strong>Region:</strong> ${safeRegion}</div>
                <div><strong>Verwendete Credits:</strong> ${data.price}</div>
                <div><strong>Verbleibendes Guthaben:</strong> ${data.remainingCredits} Credits</div>
              </div>
            </div>

            <div style="margin-top:24px;padding:22px;border-radius:18px;background:#ecfdf5;border:1px solid #bbf7d0;">
              <div style="font-size:13px;font-weight:700;letter-spacing:1.3px;color:#047857;">
                KUNDENKONTAKT
              </div>

              <div style="margin-top:14px;font-size:16px;line-height:1.9;color:#172033;">
                <div>
                  <strong>Name:</strong>
                  ${safeCustomerName}
                </div>

                <div>
                  <strong>Telefon:</strong>
                  <a
                    href="tel:${safeCustomerPhone}"
                    style="color:#0369a1;text-decoration:none;font-weight:700;"
                  >
                    ${safeCustomerPhone}
                  </a>
                </div>

                <div>
                  <strong>E-Mail:</strong>
                  <a
                    href="mailto:${safeCustomerEmail}"
                    style="color:#0369a1;text-decoration:none;font-weight:700;"
                  >
                    ${safeCustomerEmail}
                  </a>
                </div>
              </div>
            </div>

            <div style="margin-top:24px;padding:22px;border-radius:18px;background:#f8fafc;border:1px solid #e5e7eb;">
              <div style="font-size:13px;font-weight:700;letter-spacing:1.3px;color:#6b7280;">
                BESCHREIBUNG
              </div>

              <p style="margin:14px 0 0;font-size:15px;line-height:1.8;color:#4b5563;">
                ${safeDescription}
              </p>
            </div>

            <a
              href="${leadUrl}"
              style="display:inline-block;margin-top:26px;padding:15px 26px;border-radius:14px;background:linear-gradient(135deg,#39bdf8,#6366f1);color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;"
            >
              Gekauften Lead öffnen
            </a>

            <div style="margin-top:28px;padding:18px;border-radius:16px;background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;font-size:14px;line-height:1.7;">
              <strong>Tipp:</strong>
              Kontaktiere die Kundin oder den Kunden möglichst schnell.
              Eine schnelle Reaktion erhöht deine Chance auf den Auftrag.
            </div>

            <p style="margin:30px 0 0;font-size:15px;line-height:1.7;color:#5b6578;">
              Freundliche Grüsse<br />
              <strong>Das Auftrago-Team</strong>
            </p>
          </div>
        </div>
      </div>
    `,
  });
}