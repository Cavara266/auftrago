type LeadTemplateInput = {
  companyName: string;
  contactName: string;
  lead: {
    id: string;
    title: string;
    region: string;
    category: string;
    price: number;
  };
  estimatedValue: number;
  leadUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstName(value: string) {
  return value.trim().split(/\s+/)[0] || "";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function newLeadMailTemplate({
  companyName,
  contactName,
  lead,
  estimatedValue,
  leadUrl,
}: LeadTemplateInput) {
  const recipientName = firstName(contactName);
  const greeting = recipientName
    ? `Hallo ${escapeHtml(recipientName)}`
    : "Guten Tag";

  const subject = `🔥 Neue Kundenanfrage: ${lead.title} in ${lead.region}`;

  const text = `${recipientName ? `Hallo ${recipientName}` : "Guten Tag"}

eine neue passende Kundenanfrage ist auf Auftrago eingetroffen.

${lead.title}
Region: ${lead.region}
Kategorie: ${lead.category}
Geschätzter Auftragswert: ${formatMoney(estimatedValue)}
Benötigte Credits: ${lead.price}

Schnelles Reagieren erhöht deine Chance auf den Auftrag.

Auftrag jetzt ansehen:
${leadUrl}

Die Kontaktdaten des Kunden werden erst nach dem Freischalten des Leads angezeigt.

Freundliche Grüsse
Auftrago`;

  const html = `<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#050b16;font-family:Arial,Helvetica,sans-serif;color:#f8fafc;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" style="padding:30px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;">
            <tr>
              <td style="padding:0 4px 18px;font-size:22px;font-weight:900;">
                AUFTRAGO<span style="color:#38bdf8;">.</span>
              </td>
            </tr>

            <tr>
              <td style="border:1px solid #1e293b;border-radius:28px;background:#0f172a;overflow:hidden;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding:34px;">
                      <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:#0c4a6e;color:#bae6fd;font-size:11px;font-weight:800;text-transform:uppercase;">
                        🔥 Neue Kundenanfrage
                      </div>

                      <h1 style="margin:22px 0 0;font-size:32px;line-height:1.15;color:#ffffff;">
                        ${escapeHtml(lead.title)}
                      </h1>

                      <p style="margin:16px 0 0;color:#94a3b8;font-size:15px;line-height:1.7;">
                        ${greeting}, für <strong style="color:#e2e8f0;">${escapeHtml(companyName)}</strong> ist eine neue passende Anfrage eingetroffen.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:0 34px 12px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td width="50%" style="padding:6px 6px 6px 0;">
                            <div style="padding:17px;border:1px solid #1e293b;border-radius:17px;background:#0b1425;">
                              <div style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;">Region</div>
                              <div style="margin-top:8px;color:#ffffff;font-size:17px;font-weight:800;">📍 ${escapeHtml(lead.region)}</div>
                            </div>
                          </td>
                          <td width="50%" style="padding:6px 0 6px 6px;">
                            <div style="padding:17px;border:1px solid #1e293b;border-radius:17px;background:#0b1425;">
                              <div style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;">Kategorie</div>
                              <div style="margin-top:8px;color:#ffffff;font-size:17px;font-weight:800;">${escapeHtml(lead.category)}</div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td width="50%" style="padding:6px 6px 6px 0;">
                            <div style="padding:17px;border:1px solid #1e293b;border-radius:17px;background:#0b1425;">
                              <div style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;">Auftragswert</div>
                              <div style="margin-top:8px;color:#6ee7b7;font-size:20px;font-weight:900;">${formatMoney(estimatedValue)}</div>
                            </div>
                          </td>
                          <td width="50%" style="padding:6px 0 6px 6px;">
                            <div style="padding:17px;border:1px solid #1e293b;border-radius:17px;background:#0b1425;">
                              <div style="color:#64748b;font-size:10px;font-weight:800;text-transform:uppercase;">Leadpreis</div>
                              <div style="margin-top:8px;color:#fde68a;font-size:20px;font-weight:900;">${lead.price} Credits</div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:22px 34px 34px;">
                      <a href="${escapeHtml(leadUrl)}" style="display:block;padding:17px 24px;border-radius:15px;background:#2563eb;color:#ffffff;font-size:15px;font-weight:900;text-align:center;text-decoration:none;">
                        Auftrag jetzt ansehen →
                      </a>

                      <p style="margin:18px 0 0;color:#64748b;font-size:12px;line-height:1.6;text-align:center;">
                        Kundendaten werden erst nach dem Freischalten angezeigt.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 12px;color:#475569;font-size:11px;line-height:1.6;text-align:center;">
                Du erhältst diese Nachricht, weil dein Anbieterprofil auf Auftrago genehmigt ist und zur Anfrage passt.<br />
                © ${new Date().getFullYear()} Auftrago
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    subject,
    text,
    html,
  };
}