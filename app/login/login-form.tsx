"use client";

import Link from "next/link";
import { useState } from "react";

type LoginResponse = {
  ok?: boolean;
  error?: string;
};

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label htmlFor="email">E-Mail</label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="info@cavara-hauswartung.ch"
          autoComplete="email"
          required
        />
      </div>

      <div className="auth-field">
        <label htmlFor="password">Passwort</label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Passwort"
          autoComplete="current-password"
          required
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "-4px",
        }}
      >
        <Link
          href="/passwort-vergessen"
          style={{
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Passwort vergessen?
        </Link>
      </div>

      {error ? (
        <p className="auth-error" aria-live="polite">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading}>
        {loading ? "Einloggen..." : "Einloggen"}
      </button>
    </form>
  );
}