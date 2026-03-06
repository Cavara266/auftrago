import { prisma } from "@/lib/db";

export async function getOrCreateDemoUser() {
  const email = "demo@auftrago.local";

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: "Demo User",
        credits: 50,
        role: "CUSTOMER",
      },
    });
  }

  return user;
}