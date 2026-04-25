"use server";

import { createSession, clearSession } from "@/lib/auth";

export async function loginAction() {
  await createSession({
    id: "demo-user",
    email: "info@cavara-hauswartung.ch",
    name: "Auftrago Admin",
    role: "admin",
    credits: 999, // ✅ WICHTIG
  });

  return {
    ok: true,
  };
}

export async function logoutAction() {
  await clearSession();

  return {
    ok: true,
  };
}