// lib/admin.ts
import { redirect } from "next/navigation";
import { requireUser, isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireAdmin() {
  const session = await requireUser();

  // email sicher aus DB holen (falls session nur id hat)
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { email: true, id: true },
  });

  if (!user?.email || !isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  return session;
}