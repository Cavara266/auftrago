import nodemailer from "nodemailer";

type ProviderApprovalMailData = {
  companyName: string;
  contactName: string;
  email: string;
};

function getMailConfiguration() {
  const host = process.env.MAIL_HOST || process.env.SMTP_HOST;
  const port = Number(
    process.env.MAIL_PORT || process.env.SMTP_PORT || 587
  );
  const user = process.env.MAIL_USER || process.env.SMTP_USER;
  const pass = process.env.MAIL_PASS || process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM || user;
  const replyTo = process.env.MAIL_TO || from;

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

export async function sendProviderApprovalMail(
  provider: ProviderApprovalMailData
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

  const loginUrl = "https://auftrago.ch/login";

  await transporter.sendMail({
    from: mailConfiguration.from,
    to: provider.email,
    replyTo: mailConfiguration.replyTo,
    subject: "Dein Auftrago-Konto wurde freigeschaltet",

    text: `
Guten Tag ${provider.contactName}

Dein Anbieterkonto für ${provider.companyName} wurde erfolgreich geprüft und freigeschaltet.

Du kannst dich ab sofort bei Auftrago anmelden:

${loginUrl}

Nach der Anmeldung kannst du:

- Credits kaufen
- passende Kundenanfragen prüfen
- Kontakte freischalten
- neue Aufträge gewinnen

Wir freuen uns, dich als Anbieter bei Auftrago begrüssen zu dürfen.

Freundliche Grüsse

Auftrago
Die Schweizer Plattform für regionale Dienstleistungen
https://auftrago.ch
    `.trim(),

    html: `
      <div style="margin:0;padding:32px;background:#f3f6fb;font-family:Arial,sans-serif;color:#172033;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,0.12);">
          <div style="padding:32px;background:linear-gradient(135deg,#071326,#163761);color:#ffffff;">
            <div style="font-size:14px;font-weight:700;letter-spacing:2px;opacity:0.75;">
              AUFTRAGO
            </div>

            <h1 style="margin:16px 0 0;font-size:32px;line-height:1.15;">
              Dein Konto wurde freigeschaltet
            </h1>
          </div>

          <div style="padding:32px;">
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">
              Guten Tag ${provider.contactName}
            </p>

            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;">
              Dein Anbieterkonto für <strong>${provider.companyName}</strong>
              wurde erfolgreich geprüft und freigeschaltet.
            </p>

            <p style="margin:0 0 24px;font-size:16px;line-height:1.7;">
              Du kannst dich ab sofort anmelden, Credits kaufen und passende
              Kundenanfragen freischalten.
            </p>

            <a
              href="${loginUrl}"
              style="display:inline-block;padding:15px 26px;border-radius:14px;background:linear-gradient(135deg,#39bdf8,#6366f1);color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;"
            >
              Jetzt bei Auftrago anmelden
            </a>

            <div style="margin-top:28px;padding:20px;border-radius:16px;background:#f7f9fc;">
              <strong>Nach der Anmeldung kannst du:</strong>

              <ul style="margin:14px 0 0;padding-left:22px;line-height:1.8;">
                <li>Credits kaufen</li>
                <li>passende Kundenanfragen prüfen</li>
                <li>Kontaktdaten freischalten</li>
                <li>neue Aufträge gewinnen</li>
              </ul>
            </div>

            <p style="margin:28px 0 0;font-size:15px;line-height:1.7;color:#5b6578;">
              Freundliche Grüsse<br />
              <strong>Das Auftrago-Team</strong>
            </p>
          </div>
        </div>
      </div>
    `,
  });
}