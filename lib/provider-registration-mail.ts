import { sendMail } from "@/lib/mail/mail";

type ProviderRegistrationMailData = {
  providerId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  region: string;
  category: string;
  description?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "https://www.auftrago.ch"
  ).replace(/\/+$/, "");
}

function getAdminRecipient() {
  return (
    process.env.MAIL_TO?.trim() ||
    process.env.CONTACT_EMAIL?.trim() ||
    "info@auftrago.ch"
  );
}

function createEmailShell(content: string) {
  return `
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Auftrago</title>
  </head>

  <body
    style="
      margin:0;
      padding:0;
      background:#050816;
      color:#f8fafc;
      font-family:Arial,Helvetica,sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="background:#050816;padding:32px 12px;"
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="
              max-width:640px;
              overflow:hidden;
              border:1px solid rgba(255,255,255,.10);
              border-radius:24px;
              background:#0b1220;
              box-shadow:0 24px 70px rgba(0,0,0,.34);
            "
          >
            <tr>
              <td
                style="
                  padding:24px 30px;
                  border-bottom:1px solid rgba(255,255,255,.08);
                  background:
                    linear-gradient(
                      135deg,
                      rgba(59,130,246,.18),
                      rgba(139,92,246,.15)
                    );
                "
              >
                <div
                  style="
                    color:#ffffff;
                    font-size:23px;
                    font-weight:900;
                    letter-spacing:-.04em;
                  "
                >
                  Auftrago
                </div>

                <div
                  style="
                    margin-top:5px;
                    color:#93a4bd;
                    font-size:11px;
                    font-weight:700;
                  "
                >
                  Die Schweizer Plattform für regionale Dienstleistungen
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:34px 30px;">
                ${content}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:20px 30px;
                  border-top:1px solid rgba(255,255,255,.08);
                  color:#64748b;
                  font-size:10px;
                  line-height:1.6;
                "
              >
                Auftrago.ch · Schweizer Auftragsplattform<br />
                Diese Nachricht wurde automatisch versendet.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export async function sendProviderWelcomeMail(
  data: ProviderRegistrationMailData,
) {
  const baseUrl = getBaseUrl();

  const safeContactName = escapeHtml(data.contactName);
  const safeCompanyName = escapeHtml(data.companyName);

  const html = createEmailShell(`
    <div
      style="
        display:inline-block;
        padding:7px 11px;
        border-radius:999px;
        background:rgba(34,197,94,.12);
        color:#86efac;
        font-size:10px;
        font-weight:900;
        letter-spacing:.06em;
        text-transform:uppercase;
      "
    >
      Konto erfolgreich erstellt
    </div>

    <h1
      style="
        margin:22px 0 0;
        color:#ffffff;
        font-size:34px;
        line-height:1.08;
        letter-spacing:-.05em;
      "
    >
      Willkommen bei Auftrago,
      ${safeContactName}.
    </h1>

    <p
      style="
        margin:18px 0 0;
        color:#a7b3c6;
        font-size:15px;
        line-height:1.75;
      "
    >
      Das Anbieterkonto für
      <strong style="color:#ffffff;">${safeCompanyName}</strong>
      wurde erfolgreich erstellt und automatisch freigeschaltet.
    </p>

    <div
      style="
        margin-top:25px;
        padding:21px;
        border:1px solid rgba(96,165,250,.18);
        border-radius:17px;
        background:rgba(59,130,246,.07);
      "
    >
      <div
        style="
          color:#7dd3fc;
          font-size:10px;
          font-weight:900;
          text-transform:uppercase;
          letter-spacing:.08em;
        "
      >
        Deine Mitgliedschaft
      </div>

      <div
        style="
          margin-top:9px;
          color:#ffffff;
          font-size:24px;
          font-weight:900;
        "
      >
        14 Tage kostenlos
      </div>

      <div
        style="
          margin-top:6px;
          color:#8290a6;
          font-size:12px;
          line-height:1.6;
        "
      >
        Danach CHF 69.– pro Monat. Credits für einzelne
        Kundenkontakte werden separat gekauft.
      </div>
    </div>

    <div style="margin-top:26px;">
      <a
        href="${baseUrl}/subscription-required"
        style="
          display:inline-block;
          padding:15px 22px;
          border-radius:13px;
          color:#06111b;
          background:linear-gradient(110deg,#42caff,#7287ff,#ad5eff);
          font-size:13px;
          font-weight:900;
          text-decoration:none;
        "
      >
        Mitgliedschaft aktivieren →
      </a>
    </div>

    <div
      style="
        margin-top:29px;
        border-top:1px solid rgba(255,255,255,.08);
        padding-top:24px;
      "
    >
      <div style="color:#ffffff;font-size:13px;font-weight:900;">
        Das erwartet dich im Anbieterportal:
      </div>

      <div
        style="
          margin-top:14px;
          color:#9ca9bb;
          font-size:12px;
          line-height:2;
        "
      >
        ✓ Neue Kundenanfragen aus deinen Regionen<br />
        ✓ Bestätigte Fixaufträge<br />
        ✓ CRM und Kundenverwaltung<br />
        ✓ Credits, Rechnungen und Transaktionen<br />
        ✓ Regionen und Dienstleistungen selbst verwalten
      </div>
    </div>

    <p
      style="
        margin:26px 0 0;
        color:#748197;
        font-size:11px;
        line-height:1.7;
      "
    >
      Dein Login:
      <strong style="color:#cbd5e1;">${escapeHtml(data.email)}</strong>
    </p>
  `);

  const text = [
    `Willkommen bei Auftrago, ${data.contactName}.`,
    "",
    `Das Anbieterkonto für ${data.companyName} wurde erfolgreich erstellt und automatisch freigeschaltet.`,
    "",
    "14 Tage kostenlos",
    "Danach CHF 69.– pro Monat.",
    "Credits für einzelne Kundenkontakte werden separat gekauft.",
    "",
    `Mitgliedschaft aktivieren: ${baseUrl}/subscription-required`,
    "",
    `Login: ${data.email}`,
  ].join("\n");

  return sendMail({
    to: data.email,
    subject:
      "Willkommen bei Auftrago – deine 14-Tage-Testphase",
    html,
    text,
  });
}

export async function sendProviderRegistrationAdminMail(
  data: ProviderRegistrationMailData,
) {
  const baseUrl = getBaseUrl();
  const adminRecipient = getAdminRecipient();

  const html = createEmailShell(`
    <div
      style="
        color:#7dd3fc;
        font-size:10px;
        font-weight:900;
        letter-spacing:.08em;
        text-transform:uppercase;
      "
    >
      Neue Anbieter-Registrierung
    </div>

    <h1
      style="
        margin:17px 0 0;
        color:#ffffff;
        font-size:29px;
        line-height:1.1;
      "
    >
      ${escapeHtml(data.companyName)}
    </h1>

    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        margin-top:25px;
        border:1px solid rgba(255,255,255,.08);
        border-radius:16px;
        background:rgba(255,255,255,.025);
      "
    >
      <tr>
        <td style="padding:18px;color:#7f8da2;font-size:11px;">
          Kontakt
        </td>
        <td
          style="
            padding:18px;
            color:#ffffff;
            font-size:12px;
            font-weight:800;
            text-align:right;
          "
        >
          ${escapeHtml(data.contactName)}
        </td>
      </tr>

      <tr>
        <td style="padding:18px;color:#7f8da2;font-size:11px;">
          E-Mail
        </td>
        <td
          style="
            padding:18px;
            color:#ffffff;
            font-size:12px;
            font-weight:800;
            text-align:right;
          "
        >
          ${escapeHtml(data.email)}
        </td>
      </tr>

      <tr>
        <td style="padding:18px;color:#7f8da2;font-size:11px;">
          Telefon
        </td>
        <td
          style="
            padding:18px;
            color:#ffffff;
            font-size:12px;
            font-weight:800;
            text-align:right;
          "
        >
          ${escapeHtml(data.phone || "Nicht angegeben")}
        </td>
      </tr>

      <tr>
        <td style="padding:18px;color:#7f8da2;font-size:11px;">
          Region
        </td>
        <td
          style="
            padding:18px;
            color:#ffffff;
            font-size:12px;
            font-weight:800;
            text-align:right;
          "
        >
          ${escapeHtml(data.region)}
        </td>
      </tr>

      <tr>
        <td style="padding:18px;color:#7f8da2;font-size:11px;">
          Dienstleistungen
        </td>
        <td
          style="
            padding:18px;
            color:#ffffff;
            font-size:12px;
            font-weight:800;
            text-align:right;
          "
        >
          ${escapeHtml(data.category)}
        </td>
      </tr>

      <tr>
        <td style="padding:18px;color:#7f8da2;font-size:11px;">
          Abo-Status
        </td>
        <td
          style="
            padding:18px;
            color:#fcd34d;
            font-size:12px;
            font-weight:900;
            text-align:right;
          "
        >
          INACTIVE – Checkout gestartet
        </td>
      </tr>
    </table>

    <div style="margin-top:24px;">
      <a
        href="${baseUrl}/admin/providers"
        style="
          display:inline-block;
          padding:14px 20px;
          border-radius:12px;
          color:#06111b;
          background:#7dd3fc;
          font-size:12px;
          font-weight:900;
          text-decoration:none;
        "
      >
        Anbieter im Admin öffnen →
      </a>
    </div>
  `);

  const text = [
    "Neue Anbieter-Registrierung",
    "",
    `Firma: ${data.companyName}`,
    `Kontakt: ${data.contactName}`,
    `E-Mail: ${data.email}`,
    `Telefon: ${data.phone || "Nicht angegeben"}`,
    `Website: ${data.website || "Nicht angegeben"}`,
    `Region: ${data.region}`,
    `Dienstleistungen: ${data.category}`,
    `Nachricht: ${data.description || "Keine"}`,
    `Provider-ID: ${data.providerId}`,
    "",
    `${baseUrl}/admin/providers`,
  ].join("\n");

  return sendMail({
    to: adminRecipient,
    subject:
      `Neue Anbieter-Registrierung: ${data.companyName}`,
    html,
    text,
  });
}
