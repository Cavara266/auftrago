import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function ensureDemoUser() {
  const email = "demo@auftrago.local";
  const password = "demo1234";

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return existingUser;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      companyName: "Auftrago Demo GmbH",
      phone: "079 123 45 67",
      city: "Zürich",
      credits: 50,
    },
    select: {
      id: true,
      email: true,
    },
  });

  return user;
}