"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, clearSession } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const provider = await prisma.provider.findUnique({
    where: { email },
  });

  if (!provider) {
    redirect("/login?error=invalid");
  }

  const isValid = await bcrypt.compare(password, provider.password);

  if (!isValid) {
    redirect("/login?error=invalid");
  }

  await createSession({
    providerId: provider.id,
    email: provider.email,
    companyName: provider.companyName,
  });

  redirect("/portal");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}