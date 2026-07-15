import nodemailer from "nodemailer";

type ProviderApprovalMailData = {
  companyName: string;
  contactName: string;
  email: string;
};

type MailConfiguration = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  replyTo: string;
};

function parseBoolean(value: string | undefined) {
  return String(value || "")
    .trim()
    .toLowerCase() === "true";
}

function escapeHtml(value: string) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMailConfiguration(): MailConfiguration {
  const host = String(
    process.env.MAIL_HOST ||
      process.env.SMTP_HOST ||
      ""
  ).trim();

  const port = Number(
    process.env.MAIL_PORT ||
      process.env.SMTP_PORT ||
      587
  );

  const secure =
    process.env.MAIL_SECURE !== undefined
      ? parseBoolean(process.env.MAIL_SECURE)
      : process.env.SMTP_SECURE !== undefined
        ? parseBoolean(process.env.SMTP_SECURE)
        : port === 465;

  const user = String(
    process.env.MAIL_USER ||
      process.env.SMTP_USER ||
      ""
  ).trim();

  const pass = String(
    process.env.MAIL_PASS ||
      process.env.SMTP_PASS ||
      ""
  ).trim();

  const from = String(
    process.env.MAIL_FROM ||
      `Auftrago <${user}>`
  ).trim();

  const replyTo = String(
    process.env.MAIL_REPLY_TO ||
      process.env.MAIL_TO ||
      user
  ).trim();

  if (!host) {
    throw new Error("MAIL_HOST beziehungsweise SMTP_HOST fehlt.");
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("MAIL_PORT beziehungsweise SMTP_PORT ist ungültig.");
  }

  if (!user) {
    throw new Error("MAIL_USER beziehungsweise SMTP_USER fehlt.");
  }

  if (!pass) {
    throw new Error("MAIL_PASS beziehungsweise SMTP_PASS fehlt.");
  }

  if (!from) {
    throw new Error("MAIL_FROM fehlt.");
  }

  if (!replyTo) {
    throw new Error("MAIL_REPLY_TO beziehungsweise MAIL_TO fehlt.");
  }

  return {
    host,
    port,
    secure,
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

  const recipientEmail = String(provider.email || "")
    .trim()
    .toLowerCase();

  if (!recipientEmail) {
    throw new Error(
      "Die E-Mail-Adresse des Anbieters fehlt."
    );
  }

  const safeContactName = escapeHtml(
    provider.contactName
  );

  const safeCompanyName = escapeHtml(
    provider.companyName
  );

  const loginUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim()
      ? `${process.env.NEXT_PUBLIC_SITE_URL
          .trim()
          .replace(/\/$/, "")}/login`
      : "https://auftrago.ch/login";

  console.log("PROVIDER APPROVAL MAIL CONFIG:", {
    host: mailConfiguration.host,
    port: mailConfiguration.port,
    secure: mailConfiguration.secure,
    user: mailConfiguration.user,
    from: mailConfiguration.from,
    replyTo: mailConfiguration.replyTo,
    to: recipientEmail,
  });

  const transporter = nodemailer.createTransport({
    host: mailConfiguration.host,
    port: mailConfiguration.port,
    secure: mailConfiguration.secure,

    auth: {
      user: mailConfiguration.user,
      pass: mailConfiguration.pass,
    },

    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,

    tls: {
      minVersion: "TLSv1.2",
    },
  });

  try {
    console.log(
      "PROVIDER APPROVAL SMTP VERIFY START:",
      recipientEmail
    );

    await transporter.verify();

    console.log(
      "PROVIDER APPROVAL SMTP VERIFY SUCCESS:",
      recipientEmail
    );
  } catch (error) {
    console.error(
      "PROVIDER APPROVAL SMTP VERIFY ERROR:",
      error
    );

    throw error;
  }

  try {
    console.log(
      "PROVIDER APPROVAL MAIL SEND START:",
      recipientEmail
    );

    const result = await transporter.sendMail({
      from: mailConfiguration.from,
      to: recipientEmail,
      replyTo: mailConfiguration.replyTo,

      subject:
        "Dein Auftrago-Konto wurde freigeschaltet",

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

Das Auftrago-Team
Die Schweizer Plattform für regionale Dienstleistungen
https://auftrago.ch
      `.trim(),

      html: `
        <!doctype html>
        <html lang="de">
          <head>
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <title>
              Dein Auftrago-Konto wurde freigeschaltet
            </title>
          </head>

          <body
            style="
              margin:0;
              padding:0;
              background:#f3f6fb;
              font-family:Arial,Helvetica,sans-serif;
              color:#172033;
            "
          >
            <div
              style="
                margin:0;
                padding:32px 16px;
                background:#f3f6fb;
              "
            >
              <div
                style="
                  max-width:620px;
                  margin:0 auto;
                  background:#ffffff;
                  border-radius:24px;
                  overflow:hidden;
                  box-shadow:0 20px 60px rgba(15,23,42,0.12);
                "
              >
                <div
                  style="
                    padding:32px;
                    background:linear-gradient(
                      135deg,
                      #071326,
                      #163761
                    );
                    color:#ffffff;
                  "
                >
                  <div
                    style="
                      font-size:14px;
                      font-weight:700;
                      letter-spacing:2px;
                      opacity:0.78;
                    "
                  >
                    AUFTRAGO
                  </div>

                  <h1
                    style="
                      margin:16px 0 0;
                      font-size:32px;
                      line-height:1.15;
                    "
                  >
                    Dein Konto wurde freigeschaltet
                  </h1>
                </div>

                <div style="padding:32px;">
                  <p
                    style="
                      margin:0 0 18px;
                      font-size:16px;
                      line-height:1.7;
                    "
                  >
                    Guten Tag ${safeContactName}
                  </p>

                  <p
                    style="
                      margin:0 0 18px;
                      font-size:16px;
                      line-height:1.7;
                    "
                  >
                    Dein Anbieterkonto für
                    <strong>${safeCompanyName}</strong>
                    wurde erfolgreich geprüft und
                    freigeschaltet.
                  </p>

                  <p
                    style="
                      margin:0 0 24px;
                      font-size:16px;
                      line-height:1.7;
                    "
                  >
                    Du kannst dich ab sofort anmelden,
                    Credits kaufen und passende
                    Kundenanfragen freischalten.
                  </p>

                  <a
                    href="${loginUrl}"
                    style="
                      display:inline-block;
                      padding:15px 26px;
                      border-radius:14px;
                      background:linear-gradient(
                        135deg,
                        #39bdf8,
                        #6366f1
                      );
                      color:#ffffff;
                      text-decoration:none;
                      font-weight:700;
                      font-size:16px;
                    "
                  >
                    Jetzt bei Auftrago anmelden
                  </a>

                  <div
                    style="
                      margin-top:28px;
                      padding:20px;
                      border-radius:16px;
                      background:#f7f9fc;
                      border:1px solid #e6ebf2;
                    "
                  >
                    <strong>
                      Nach der Anmeldung kannst du:
                    </strong>

                    <ul
                      style="
                        margin:14px 0 0;
                        padding-left:22px;
                        line-height:1.8;
                      "
                    >
                      <li>Credits kaufen</li>
                      <li>
                        passende Kundenanfragen prüfen
                      </li>
                      <li>
                        Kontaktdaten freischalten
                      </li>
                      <li>neue Aufträge gewinnen</li>
                    </ul>
                  </div>

                  <div
                    style="
                      margin-top:24px;
                      padding:18px;
                      border-radius:16px;
                      background:#fff7ed;
                      border:1px solid #fed7aa;
                      color:#9a3412;
                      font-size:14px;
                      line-height:1.7;
                    "
                  >
                    <strong>Tipp:</strong>
                    Prüfe regelmässig die neuen
                    Kundenanfragen. Schnelle Anbieter
                    haben häufig die besten Chancen auf
                    einen Auftrag.
                  </div>

                  <p
                    style="
                      margin:28px 0 0;
                      font-size:15px;
                      line-height:1.7;
                      color:#5b6578;
                    "
                  >
                    Freundliche Grüsse<br />
                    <strong>Das Auftrago-Team</strong>
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("PROVIDER APPROVAL MAIL SENT:", {
      to: recipientEmail,
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    });

    return {
      ok: true,
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
    };
  } catch (error) {
    console.error(
      "PROVIDER APPROVAL MAIL SEND ERROR:",
      {
        to: recipientEmail,
        error,
      }
    );

    throw error;
  }
}