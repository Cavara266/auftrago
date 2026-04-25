"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function registerAction(formData: FormData) {
  const company = String(formData.get("company") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const password = String(formData.get("password") || "");
  const accepted = formData.get("accepted") === "on";

  if (!company || !name || !email || !phone || !region || !category || !password) {
    redirect("/register?error=missing");
  }

  if (!accepted) {
    redirect("/register?error=terms");
  }

  const existing = await prisma.provider.findUnique({
    where: { email },
  });

  if (existing) {
    redirect("/register?error=email-exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const provider = await prisma.provider.create({
    data: {
      email,
      password: hashedPassword,
      companyName: company,
      contactName: name,
      phone,
      region,
      category,
      credits: 0,
    },
  });

  await createSession({
    providerId: provider.id,
    email: provider.email,
    companyName: provider.companyName,
  });

  redirect("/portal");
}