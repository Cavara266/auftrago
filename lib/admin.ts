import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

const ADMIN_EMAILS = [
  "demo@auftrago.local",
  "info@cavara-hauswartung.ch",
];

export function isAdminEmail(email: string) {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function requireAdmin() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  return user;
}