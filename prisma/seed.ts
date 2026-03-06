import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "demo@auftrago.local",
    },
    update: {},
    create: {
      email: "demo@auftrago.local",
      passwordHash,
      companyName: "Auftrago Demo GmbH",
      phone: "079 123 45 67",
      city: "Zürich",
      credits: 50,
    },
  });

  const existingLeadCount = await prisma.lead.count();

  if (existingLeadCount === 0) {
    await prisma.lead.createMany({
      data: [
        {
          title: "Hauswartung Mehrfamilienhaus",
          category: "Hauswartung",
          city: "Zürich",
          description:
            "Wir suchen eine zuverlässige Hauswartung für ein MFH mit 12 Wohnungen.",
          contactName: "Peter Müller",
          contactPhone: "079 123 45 67",
          contactEmail: "peter.mueller@email.ch",
          priceCredits: 4,
        },
        {
          title: "Treppenhaus Reinigung",
          category: "Reinigung",
          city: "Aarau",
          description:
            "Treppenhaus Reinigung 1x pro Woche für ein Gebäude mit 8 Parteien.",
          contactName: "Anna Keller",
          contactPhone: "078 111 22 33",
          contactEmail: "anna@example.ch",
          priceCredits: 3,
        },
        {
          title: "Umzug 4.5 Zimmer Wohnung",
          category: "Umzug",
          city: "Basel",
          description:
            "Gesucht wird ein Umzugsunternehmen für einen Umzug innerhalb von Basel.",
          contactName: "Marco Steiner",
          contactPhone: "076 555 44 22",
          contactEmail: "marco@beispiel.ch",
          priceCredits: 5,
        },
        {
          title: "Entsorgung von Möbeln",
          category: "Entsorgung",
          city: "Bern",
          description:
            "Mehrere alte Möbel und Sperrgut sollen kurzfristig entsorgt werden.",
          contactName: "Sandra Meier",
          contactPhone: "077 888 99 00",
          contactEmail: "sandra@beispiel.ch",
          priceCredits: 4,
        },
      ],
    });
  }

  console.log("Seed erfolgreich erstellt.", {
    userId: user.id,
    email: user.email,
  });
}

main()
  .catch((e) => {
    console.error("SEED ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });