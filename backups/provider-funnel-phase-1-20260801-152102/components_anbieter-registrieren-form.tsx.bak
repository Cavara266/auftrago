"use client";

import { useState } from "react";

type RegistrationResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export default function AnbieterRegistrierenForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) {
      return;
    }

    setSending(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const password = String(formData.get("password") || "");
    const passwordConfirmation = String(
      formData.get("passwordConfirmation") || ""
    );

    if (password.length < 8) {
      setMessage(
        "❌ Das Passwort muss mindestens 8 Zeichen lang sein."
      );
      setSending(false);
      return;
    }

    if (password !== passwordConfirmation) {
      setMessage("❌ Die eingegebenen Passwörter stimmen nicht überein.");
      setSending(false);
      return;
    }

    const providerPayload = {
      companyName: String(formData.get("firma") || "").trim(),
      contactName: String(
        formData.get("kontaktperson") || ""
      ).trim(),
      phone: String(formData.get("telefon") || "").trim(),
      email: String(formData.get("email") || "")
        .trim()
        .toLowerCase(),
      password,
      website: String(formData.get("website") || "").trim(),
      region: String(formData.get("ort") || "").trim(),
      services: String(formData.get("leistungen") || "").trim(),
      message: String(formData.get("nachricht") || "").trim(),
    };

    try {
      const response = await fetch("/api/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerPayload),
      });

      const result =
        (await response
          .json()
          .catch(() => null)) as RegistrationResponse | null;

      if (!response.ok || result?.ok === false) {
        throw new Error(
          result?.error ||
            result?.message ||
            "Das Anbieterkonto konnte nicht erstellt werden."
        );
      }

      setMessage(
        "✅ Vielen Dank für deine Registrierung. Wir prüfen deine Firma persönlich. Du erhältst eine E-Mail, sobald dein Konto freigegeben wurde."
      );

      form.reset();
    } catch (error) {
      console.error("PROVIDER REGISTRATION ERROR:", error);

      setMessage(
        `❌ Registrierung fehlgeschlagen. ${
          error instanceof Error
            ? error.message
            : "Bitte versuche es erneut."
        }`
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="anbieter-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          name="firma"
          placeholder="Firmenname *"
          autoComplete="organization"
          required
        />

        <input
          name="kontaktperson"
          placeholder="Kontaktperson *"
          autoComplete="name"
          required
        />
      </div>

      <div className="form-row">
        <input
          name="telefon"
          type="tel"
          placeholder="Telefon *"
          autoComplete="tel"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="E-Mail *"
          autoComplete="email"
          required
        />
      </div>

      <div className="form-row">
        <input
          name="website"
          type="url"
          placeholder="Website, z. B. https://firma.ch"
          autoComplete="url"
        />

        <input
          name="ort"
          placeholder="Ort / Region *"
          autoComplete="address-level2"
          required
        />
      </div>

      <textarea
        name="leistungen"
        placeholder="Dienstleistungen * z. B. Hauswartung, Reinigung, Gartenpflege, Umzug"
        required
      />

      <textarea
        name="nachricht"
        placeholder="Nachricht / Einsatzgebiet / zusätzliche Informationen"
      />

      <div className="form-row">
        <input
          name="password"
          type="password"
          placeholder="Passwort *"
          autoComplete="new-password"
          minLength={8}
          required
        />

        <input
          name="passwordConfirmation"
          type="password"
          placeholder="Passwort wiederholen *"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.6,
          opacity: 0.7,
        }}
      >
        Das Passwort muss mindestens 8 Zeichen enthalten. Dein Konto wird
        erst nach der persönlichen Prüfung durch Auftrago freigeschaltet.
      </p>

      <button type="submit" disabled={sending}>
        {sending
          ? "Konto wird erstellt..."
          : "Anbieterkonto erstellen"}
      </button>

      {message ? (
        <p
          className={
            message.startsWith("✅") ? "mega-success" : "mega-error"
          }
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}