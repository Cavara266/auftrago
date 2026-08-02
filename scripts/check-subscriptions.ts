import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const providers = await prisma.provider.findMany({
    select: {
      id: true,
      companyName: true,
      email: true,
      subscriptionExempt: true,
      subscriptionStatus: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log("");
  console.log("============================================");
  console.log("ANBIETER-ABO-STATUS");
  console.log("============================================");

  for (const provider of providers) {
    console.log(
      `${provider.companyName} | ${provider.email} | kostenlos: ${provider.subscriptionExempt} | Status: ${provider.subscriptionStatus}`,
    );
  }

  console.log("");
  console.log(`Anbieter insgesamt: ${providers.length}`);
}

main()
  .catch((error) => {
    console.error("FEHLER:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
