"use server";

import { clearSession } from "@/lib/auth";

export async function loginAction() {
  return {
    ok: false,
    error:
      "Die Demo-Anmeldung wurde deaktiviert. Bitte melde dich mit deiner E-Mail-Adresse und deinem Passwort an.",
  };
}

export async function logoutAction() {
  try {
    await clearSession();

    return {
      ok: true,
    };
  } catch (error) {
    console.error("LOGOUT ACTION ERROR:", error);

    return {
      ok: false,
      error: "Die Abmeldung ist fehlgeschlagen.",
    };
  }
}