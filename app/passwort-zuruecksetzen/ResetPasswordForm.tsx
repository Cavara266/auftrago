"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type ResetPasswordResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#eef4ff",
  color: "#111827",
  border: "1px solid #d8e1ee",
  borderRadius: "14px",
  padding: "16px 18px",
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: 1.4,
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  color: "#111827",
  fontSize: "14px",
  fontWeight: 800,
};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading || success) {
      return;
    }

    setError("");

    if (!token) {
      setError(
        "Der Link ist ungültig. Bitte fordere einen neuen Reset-Link an."
      );
      return;
    }

    if (!password || !passwordConfirmation) {
      setError("Bitte fülle beide Passwortfelder aus.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            token,
            password,
            passwordConfirmation,
          }),
        }
      );

      const data =
        (await response.json().catch(() => null)) as
          | ResetPasswordResponse
          | null;

      if (!response.ok || !data?.ok) {
        setError(
          data?.error ||
            "Das Passwort konnte nicht geändert werden."
        );
        return;
      }

      setSuccess(
        data.message ||
          "Dein Passwort wurde erfolgreich geändert."
      );

      setPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      console.error("RESET PASSWORD FORM ERROR:", error);

      setError(
        "Das Passwort konnte momentan nicht geändert werden."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div>
        <div
          aria-live="polite"
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          Der Reset-Link ist ungültig oder unvollständig.
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <Link
            href="/passwort-vergessen"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Neuen Reset-Link anfordern
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <div
          aria-live="polite"
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: "#dcfce7",
            border: "1px solid #86efac",
            color: "#166534",
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          {success}
        </div>

        <Link
          href="/login"
          style={{
            display: "block",
            marginTop: "20px",
            padding: "15px 18px",
            borderRadius: "12px",
            background:
              "linear-gradient(90deg, #4aa8ff 0%, #6c63ff 100%)",
            color: "#ffffff",
            textAlign: "center",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Jetzt einloggen
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: "18px",
        color: "#111827",
      }}
    >
      <div>
        <label htmlFor="password" style={labelStyle}>
          Neues Passwort
        </label>

        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          placeholder="Mindestens 8 Zeichen"
          autoComplete="new-password"
          minLength={8}
          required
          onChange={(event) => setPassword(event.target.value)}
          style={fieldStyle}
        />
      </div>

      <div>
        <label
          htmlFor="passwordConfirmation"
          style={labelStyle}
        >
          Passwort wiederholen
        </label>

        <input
          id="passwordConfirmation"
          name="passwordConfirmation"
          type={showPassword ? "text" : "password"}
          value={passwordConfirmation}
          placeholder="Passwort erneut eingeben"
          autoComplete="new-password"
          minLength={8}
          required
          onChange={(event) =>
            setPasswordConfirmation(event.target.value)
          }
          style={fieldStyle}
        />
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          color: "#374151",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(event) =>
            setShowPassword(event.target.checked)
          }
          style={{
            width: "18px",
            height: "18px",
            accentColor: "#3b82f6",
          }}
        />

        Passwort anzeigen
      </label>

      <div
        style={{
          padding: "14px 16px",
          borderRadius: "12px",
          background: "#f3f4f6",
          border: "1px solid #e5e7eb",
          color: "#4b5563",
          fontSize: "13px",
          lineHeight: 1.7,
        }}
      >
        Das Passwort muss mindestens 8 Zeichen, einen
        Grossbuchstaben, einen Kleinbuchstaben und eine Zahl
        enthalten.
      </div>

      {error ? (
        <div
          aria-live="polite"
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          border: 0,
          borderRadius: "14px",
          padding: "16px 18px",
          background:
            "linear-gradient(90deg, #4aa8ff 0%, #6c63ff 100%)",
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: 900,
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading
          ? "Passwort wird geändert..."
          : "Neues Passwort speichern"}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "2px",
        }}
      >
        <Link
          href="/login"
          style={{
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Zurück zum Login
        </Link>
      </div>
    </form>
  );
}