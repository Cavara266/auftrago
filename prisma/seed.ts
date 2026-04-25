import { prisma } from "../lib/db";

async function main() {
  await prisma.provider.createMany({
    data: [
      {
        companyName: "CleanPro Zürich",
        contactName: "CleanPro Team",
        email: "cleanpro@example.ch",
        phone: "+41 44 000 00 00",
        website: "https://cleanpro-zuerich.ch",
        region: "Zürich",
        services: "Reinigung, Büroreinigung, Umzugsreinigung",
        status: "active",
      },
      {
        companyName: "Hauswartung Aargau",
        contactName: "Aargau Team",
        email: "aargau@example.ch",
        phone: "+41 62 000 00 00",
        website: "https://hauswartung-aargau.ch",
        region: "Aargau",
        services: "Hauswartung, Treppenhausreinigung, Gartenpflege",
        status: "active",
      },
      {
        companyName: "Umzug Express Schweiz",
        contactName: "Express Team",
        email: "umzug@example.ch",
        phone: "+41 79 000 00 00",
        website: "https://umzug-express.ch",
        region: "Schweiz",
        services: "Umzug, Transport, Entsorgung",
        status: "active",
      },
    ] as any,
    skipDuplicates: true,
  });

  console.log("Seed abgeschlossen.");
}

main()
  .catch((error) => {
    console.error("Seed Fehler:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });