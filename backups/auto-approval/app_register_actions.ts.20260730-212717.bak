"use server";

import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function registerAction() {
  const passwordHash = await bcrypt.hash("AuftragoAdmin2026!", 12);

  const provider = await prisma.provider.upsert({
    where: {
      email: "info@cavara-hauswartung.ch",
    },
    update: {
      companyName: "Auftrago",
      contactName: "Auftrago Admin",
      credits: 999,
      status: "APPROVED",
    },
    create: {
      email: "info@cavara-hauswartung.ch",
      companyName: "Auftrago",
      contactName: "Auftrago Admin",
      password: passwordHash,
      credits: 999,
      status: "APPROVED",
    },
  });

  await createSession({
    id: provider.id,
    email: provider.email,
    name: provider.contactName,
    companyName: provider.companyName,
    contactName: provider.contactName,
    role: "provider",
    credits: provider.credits,
    status: provider.status,
  });

  return {
    ok: true,
  };
}