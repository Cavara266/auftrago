import { prisma } from "../lib/prisma";

async function main() {

  await prisma.user.create({
    data: {
      email: "demo@auftrago.local",
      password: "demo1234",
      credits: 50
    }
  });

  await prisma.lead.createMany({
    data: [
      {
        title: "Hauswartung",
        category: "Hauswartung",
        city: "Zürich",
        description: "Mehrfamilienhaus sucht Hauswartung",
        contactName: "Max Müller",
        contactPhone: "0791234567",
        contactEmail: "max@example.ch"
      },
      {
        title: "Reinigung",
        category: "Reinigung",
        city: "Aarau",
        description: "Büroreinigung gesucht",
        contactName: "Anna Keller",
        contactPhone: "0781112233",
        contactEmail: "anna@example.ch"
      }
    ]
  });

}

main();