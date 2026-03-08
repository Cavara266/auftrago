import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getAdminEmails() {
  const raw = process.env.ADMIN_EMAILS ?? "info@cavara-hauswartung.ch";

  return raw
    .split(",")
    .map((item) => normalizeEmail(item))
    .filter(Boolean);
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const adminEmails = getAdminEmails();
  const userEmail = normalizeEmail(user.email ?? "");

  if (!adminEmails.includes(userEmail)) {
    redirect("/dashboard");
  }

  return user;
}

export async function isAdmin() {
  const user = await requireUser();

  if (!user) {
    return false;
  }

  const adminEmails = getAdminEmails();
  const userEmail = normalizeEmail(user.email ?? "");

  return adminEmails.includes(userEmail);
}