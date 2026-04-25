"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = useMemo(() => {
    if (!error) return "";
    if (error === "missing") return "Bitte E-Mail und Passwort eingeben.";
    if (error === "invalid") return "E-Mail oder Passwort ist nicht korrekt.";
    return "Login fehlgeschlagen.";
  }, [error]);

  return (
    <form action={loginAction} className="auth-form">
      <div className="auth-field">
        <label>E-Mail</label>
        <input
          type="email"
          name="email"
          placeholder="firma@email.ch"
          autoComplete="email"
          required
        />
      </div>

      <div className="auth-field">
        <label>Passwort</label>
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          autoComplete="current-password"
          required
        />
      </div>

      {errorMessage ? (
        <div className="auth-alert auth-alert-error">{errorMessage}</div>
      ) : null}

      <button type="submit" className="auth-submit">
        Jetzt einloggen
      </button>
    </form>
  );
}