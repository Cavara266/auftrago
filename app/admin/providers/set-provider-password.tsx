"use client";

import { useState } from "react";

type SetProviderPasswordProps = {
  providerId: string;
};

type ApiResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export default function SetProviderPassword({
  providerId,
}: SetProviderPasswordProps) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setMessage(null);
    setSuccess(false);

    if (password.length < 8) {
      setMessage(
        "Das Passwort muss mindestens 8 Zeichen lang sein."
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage("Die beiden Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/providers/${encodeURIComponent(
          providerId
        )}/set-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            password,
          }),
        }
      );

      const data =
        (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Das Passwort konnte nicht gespeichert werden."
        );
      }

      setSuccess(true);
      setMessage("Passwort wurde erfolgreich gespeichert.");
      setPassword("");
      setPasswordConfirmation("");
    } catch (error) {
      console.error("SET PROVIDER PASSWORD ERROR:", error);

      setSuccess(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "Das Passwort konnte nicht gespeichert werden."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 22,
        paddingTop: 20,
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          marginBottom: 14,
          fontSize: 15,
          fontWeight: 800,
          color: "#ffffff",
        }}
      >
        🔐 Anbieter-Passwort setzen
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        <input
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Neues Passwort"
          minLength={8}
          autoComplete="new-password"
          required
        />

        <input
          type="password"
          value={passwordConfirmation}
          onChange={(event) =>
            setPasswordConfirmation(event.target.value)
          }
          placeholder="Passwort wiederholen"
          minLength={8}
          autoComplete="new-password"
          required
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{
            width: "100%",
          }}
        >
          {loading
            ? "Passwort wird gespeichert..."
            : "🔐 Passwort speichern"}
        </button>

        {message ? (
          <div
            aria-live="polite"
            style={{
              padding: "12px 14px",
              borderRadius: 14,
              background: success
                ? "rgba(34,197,94,0.12)"
                : "rgba(239,68,68,0.12)",
              border: success
                ? "1px solid rgba(34,197,94,0.24)"
                : "1px solid rgba(239,68,68,0.24)",
              color: success ? "#bbf7d0" : "#fecaca",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        ) : null}
      </div>
    </form>
  );
}