import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

async function main() {
  const email = "demo@auftrago.local";
  const password = "demo1234";
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hash,
      credits: 50,
      companyName: "Auftrago Demo GmbH",
      phone: "079 123 45 67",
      city: "Zürich",
    },
    create: {
      email,
      passwordHash: hash,
      credits: 50,
      companyName: "Auftrago Demo GmbH",
      phone: "079 123 45 67",
      city: "Zürich",
    },
  });

  console.log("Demo login user seeded:", email);
}

main()
  .catch((error) => {
    console.error("SEED LOGIN ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });