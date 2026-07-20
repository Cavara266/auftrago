"use client";

import Link from "next/link";
import { useState } from "react";

type ForgotPasswordResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    setError("");
    setSuccess("");

    if (!normalizedEmail) {
      setError("Bitte gib deine E-Mail-Adresse ein.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        }
      );

      const data =
        (await response.json().catch(() => null)) as
          | ForgotPasswordResponse
          | null;

      if (!response.ok || !data?.ok) {
        setError(
          data?.error ||
            "Die Anfrage konnte nicht verarbeitet werden."
        );
        return;
      }

      setSuccess(
        data.message ||
          "Falls ein Konto existiert, wurde eine E-Mail versendet."
      );

      setEmail("");
    } catch (error) {
      console.error("FORGOT PASSWORD FORM ERROR:", error);

      setError(
        "Die Anfrage konnte momentan nicht verarbeitet werden."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="auth-field">
        <label htmlFor="email">E-Mail-Adresse</label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          placeholder="info@firma.ch"
          autoComplete="email"
          required
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      {error ? (
        <p className="auth-error" aria-live="polite">
          {error}
        </p>
      ) : null}

      {success ? (
        <div
          aria-live="polite"
          style={{
            padding: "14px 16px",
            borderRadius: "10px",
            background: "rgba(34, 197, 94, 0.12)",
            border: "1px solid rgba(34, 197, 94, 0.35)",
            color: "#166534",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {success}
        </div>
      ) : null}

      <button type="submit" disabled={loading}>
        {loading
          ? "E-Mail wird versendet..."
          : "Reset-Link anfordern"}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "18px",
        }}
      >
        <Link
          href="/login"
          style={{
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Zurück zum Login
        </Link>
      </div>
    </form>
  );
}