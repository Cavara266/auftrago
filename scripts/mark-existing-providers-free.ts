import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const totalProviders = await prisma.provider.count();

  const result = await prisma.provider.updateMany({
    where: {
      subscriptionExempt: false,
    },
    data: {
      subscriptionExempt: true,
    },
  });

  console.log("");
  console.log("============================================");
  console.log("BESTEHENDE ANBIETER AKTUALISIERT");
  console.log("============================================");
  console.log(`Anbieter insgesamt: ${totalProviders}`);
  console.log(`Kostenlos freigeschaltet: ${result.count}`);
  console.log("");
}

main()
  .catch((error) => {
    console.error("FEHLER:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
