// scripts/seed-login.ts
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = "demo@auftrago.local";
  const plain = "demo1234";
  const hash = await bcrypt.hash(plain, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password: hash, credits: 50 },
    create: { email, password: hash, credits: 50 },
  });

  console.log("✅ Seed ok:", email, "/", plain);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });