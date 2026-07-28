import { prisma } from "../lib/prisma";
import { sendMail } from "../lib/mail/mail";
import { matchLeadToProvider } from "../lib/provider-lead-matching";

function exists(name: string) {
  return Boolean(process.env[name]?.trim());
}

async function main() {
  console.log("\n=== LIVE ENVIRONMENT ===");

  const variables = [
    "DATABASE_URL",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_SECURE",
    "MAIL_FROM",
    "MAIL_TO",
    "MAIL_REPLY_TO",
    "RESEND_API_KEY",
    "CONTACT_EMAIL",
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SITE_URL",
  ];

  for (const variable of variables) {
    console.log(
      `${exists(variable) ? "✓" : "✗"} ${variable}`
    );
  }

  console.log("\n=== NEUSTER LEAD ===");

  const lead = await prisma.lead.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!lead) {
    throw new Error("In der Live-Datenbank wurde kein Lead gefunden.");
  }

  console.log({
    id: lead.id,
    title: lead.title,
    category: lead.category,
    region: lead.region,
    city: lead.city,
    postalCode: lead.postalCode,
    createdAt: lead.createdAt,
  });

  console.log("\n=== ANBIETER ===");

  const providers = await prisma.provider.findMany({
    where: {
      status: "APPROVED",
    },
    select: {
      id: true,
      companyName: true,
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
  });

  console.log(`Freigegebene Anbieter: ${providers.length}`);

  const emailEnabled = providers.filter(
    (provider) =>
      provider.receiveLeadEmails ||
      provider.receiveAllLeadEmails
  );

  console.log(
    `E-Mail-Benachrichtigung aktiv: ${emailEnabled.length}`
  );

  const matching = emailEnabled
    .map((provider) => ({
      provider,
      result: matchLeadToProvider(provider, lead),
    }))
    .filter(({ result }) => result.matches);

  console.log(`Passende Anbieter: ${matching.length}`);

  for (const item of matching.slice(0, 20)) {
    console.log({
      company: item.provider.companyName,
      email: item.provider.email,
      score: item.result.score,
      reasons: item.result.reasons,
    });
  }

  console.log("\n=== SMTP TEST ===");

  const recipient =
    process.env.MAIL_TO?.trim() ||
    process.env.CONTACT_EMAIL?.trim();

  if (!recipient) {
    throw new Error(
      "MAIL_TO und CONTACT_EMAIL fehlen. Kein Testempfänger vorhanden."
    );
  }

  const result = await sendMail({
    to: recipient,
    subject: "Auftrago Live-Mail-Test",
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px">
        <h2>Auftrago Mail-Test erfolgreich</h2>
        <p>Die SMTP-Verbindung der Live-Umgebung funktioniert.</p>
        <p>Neuester Lead: <strong>${lead.title}</strong></p>
        <p>Lead-ID: ${lead.id}</p>
      </div>
    `,
    text: [
      "Auftrago Mail-Test erfolgreich",
      `Neuester Lead: ${lead.title}`,
      `Lead-ID: ${lead.id}`,
    ].join("\n"),
  });

  console.log("✓ SMTP-Mail akzeptiert");
  console.log(result);
}

main()
  .catch((error) => {
    console.error("\n✗ DIAGNOSE FEHLGESCHLAGEN");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
