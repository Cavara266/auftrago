"use client";

import { useState } from "react";

type RegistrationResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
  checkoutUrl?: string;
  redirectUrl?: string;
};

export default function AnbieterRegistrierenForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (sending) {
      return;
    }

    setSending(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const password = String(
      formData.get("password") || "",
    );

    const passwordConfirmation = String(
      formData.get("passwordConfirmation") || "",
    );

    if (password.length < 8) {
      setMessage(
        "❌ Das Passwort muss mindestens 8 Zeichen lang sein.",
      );
      setSending(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage(
        "❌ Die eingegebenen Passwörter stimmen nicht überein.",
      );
      setSending(false);
      return;
    }

    const providerPayload = {
      companyName: String(
        formData.get("firma") || "",
      ).trim(),

      contactName: String(
        formData.get("kontaktperson") || "",
      ).trim(),

      phone: String(
        formData.get("telefon") || "",
      ).trim(),

      email: String(
        formData.get("email") || "",
      )
        .trim()
        .toLowerCase(),

      password,

      website: String(
        formData.get("website") || "",
      ).trim(),

      region: String(
        formData.get("ort") || "",
      ).trim(),

      category: String(
        formData.get("leistungen") || "",
      ).trim(),

      description: String(
        formData.get("nachricht") || "",
      ).trim(),
    };

    try {
      const response = await fetch(
        "/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(
            providerPayload,
          ),
        },
      );

      const result =
        (await response
          .json()
          .catch(() => null)) as
          | RegistrationResponse
          | null;

      if (
        !response.ok ||
        result?.ok === false
      ) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Das Anbieterkonto konnte nicht erstellt werden.",
        );
      }

      setMessage(
        "✅ Dein Konto wurde erstellt. Du wirst jetzt zur sicheren Aktivierung weitergeleitet.",
      );

      if (result?.checkoutUrl) {
        window.location.assign(
          result.checkoutUrl,
        );
        return;
      }

      window.location.assign(
        result?.redirectUrl ||
          "/subscription-required",
      );
    } catch (error) {
      console.error(
        "PROVIDER REGISTRATION ERROR:",
        error,
      );

      setMessage(
        `❌ Registrierung fehlgeschlagen. ${
          error instanceof Error
            ? error.message
            : "Bitte versuche es erneut."
        }`,
      );

      setSending(false);
    }
  }

  return (
    <form
      className="anbieter-form"
      onSubmit={handleSubmit}
    >
      <div className="form-row">
        <input
          name="firma"
          placeholder="Firmenname *"
          autoComplete="organization"
          required
          disabled={sending}
        />

        <input
          name="kontaktperson"
          placeholder="Kontaktperson *"
          autoComplete="name"
          required
          disabled={sending}
        />
      </div>

      <div className="form-row">
        <input
          name="telefon"
          type="tel"
          placeholder="Telefon *"
          autoComplete="tel"
          required
          disabled={sending}
        />

        <input
          name="email"
          type="email"
          placeholder="E-Mail *"
          autoComplete="email"
          required
          disabled={sending}
        />
      </div>

      <div className="form-row">
        <input
          name="website"
          type="url"
          placeholder="Website, z. B. https://firma.ch"
          autoComplete="url"
          disabled={sending}
        />

        <input
          name="ort"
          placeholder="Ort / Region *"
          autoComplete="address-level2"
          required
          disabled={sending}
        />
      </div>

      <textarea
        name="leistungen"
        placeholder="Dienstleistungen * z. B. Hauswartung, Reinigung, Gartenpflege, Umzug"
        required
        disabled={sending}
      />

      <textarea
        name="nachricht"
        placeholder="Einsatzgebiet / zusätzliche Informationen"
        disabled={sending}
      />

      <div className="form-row">
        <input
          name="password"
          type="password"
          placeholder="Passwort *"
          autoComplete="new-password"
          minLength={8}
          required
          disabled={sending}
        />

        <input
          name="passwordConfirmation"
          type="password"
          placeholder="Passwort wiederholen *"
          autoComplete="new-password"
          minLength={8}
          required
          disabled={sending}
        />
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          lineHeight: 1.65,
          opacity: 0.7,
        }}
      >
        Dein Konto wird sofort freigeschaltet.
        Anschliessend startest du deine
        14-tägige kostenlose Testphase über
        Stripe.
      </p>

      <button
        type="submit"
        disabled={sending}
      >
        {sending
          ? "Konto wird erstellt..."
          : "14 Tage kostenlos starten"}
      </button>

      {message ? (
        <p
          className={
            message.startsWith("✅")
              ? "mega-success"
              : "mega-error"
          }
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
