"use server";

import { createSession } from "@/lib/auth";

export async function registerAction() {
  await createSession({
    id: "demo-user",
    email: "info@cavara-hauswartung.ch",
    name: "Auftrago Admin",
    role: "admin",
    credits: 999,
  });

  return {
    ok: true,
  };
}