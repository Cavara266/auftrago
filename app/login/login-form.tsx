"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./login.module.css";

type LoginResponse = {
  ok?: boolean;
  error?: string;
};

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();

    const password = String(
      formData.get("password") || ""
    );

    if (!email || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data =
        (await response.json().catch(() => null)) as
          | LoginResponse
          | null;

      if (!response.ok || !data?.ok) {
        setError(
          data?.error ||
            "E-Mail oder Passwort ist falsch."
        );
        return;
      }

      window.location.href = "/portal";
    } catch (error) {
      console.error("LOGIN FORM ERROR:", error);

      setError(
        "Login konnte nicht durchgeführt werden."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
      noValidate
    >
      <div className={styles.field}>
        <label htmlFor="email">
          E-Mail-Adresse
        </label>

        <div className={styles.inputWrap}>
          <span
            className={styles.inputIcon}
            aria-hidden="true"
          >
            ✉
          </span>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@firma.ch"
            autoComplete="email"
            inputMode="email"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.fieldHead}>
          <label htmlFor="password">
            Passwort
          </label>

          <Link href="/passwort-vergessen">
            Passwort vergessen?
          </Link>
        </div>

        <div className={styles.inputWrap}>
          <span
            className={styles.inputIcon}
            aria-hidden="true"
          >
            ●
          </span>

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Dein Passwort"
            autoComplete="current-password"
            required
            disabled={loading}
          />

          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() =>
              setShowPassword((current) => !current)
            }
            disabled={loading}
            aria-label={
              showPassword
                ? "Passwort ausblenden"
                : "Passwort anzeigen"
            }
            aria-pressed={showPassword}
          >
            {showPassword
              ? "Ausblenden"
              : "Anzeigen"}
          </button>
        </div>
      </div>

      {error ? (
        <div
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true">!</span>
          <p>{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        className={styles.loginButton}
        disabled={loading}
      >
        <span>
          {loading
            ? "Anmeldung läuft..."
            : "Jetzt einloggen"}
        </span>

        <b aria-hidden="true">
          {loading ? "···" : "→"}
        </b>
      </button>
    </form>
  );
}