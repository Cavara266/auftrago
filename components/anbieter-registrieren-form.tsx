"use client";

import { useState } from "react";

export default function AnbieterRegistrierenForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSending(true);
    setMessage("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const providerPayload = {
      companyName: String(fd.get("firma") || "").trim(),
      contactName: String(fd.get("kontaktperson") || "").trim(),
      phone: String(fd.get("telefon") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      website: String(fd.get("website") || "").trim(),
      region: String(fd.get("ort") || "").trim(),
      services: String(fd.get("leistungen") || "").trim(),
      message: String(fd.get("nachricht") || "").trim(),
    };

    try {
      const saveProvider = await fetch("/api/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerPayload),
      });

      const providerResult = await saveProvider.json().catch(() => null);

      if (!saveProvider.ok || providerResult?.ok === false) {
        throw new Error(
          providerResult?.error ||
            providerResult?.message ||
            "Anbieter konnte nicht gespeichert werden."
        );
      }

      setMessage(
        "✅ Anbieter-Anfrage erfolgreich gesendet. Wir prüfen deine Angaben und melden uns persönlich bei dir."
      );

      form.reset();
    } catch (error) {
      console.error(error);

      setMessage(
        `❌ Anfrage konnte nicht gesendet werden. ${
          error instanceof Error ? error.message : "Bitte versuche es erneut."
        }`
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="anbieter-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input name="firma" placeholder="Firmenname *" required />
        <input name="kontaktperson" placeholder="Kontaktperson *" required />
      </div>

      <div className="form-row">
        <input name="telefon" placeholder="Telefon *" required />
        <input name="email" type="email" placeholder="E-Mail *" required />
      </div>

      <div className="form-row">
        <input name="website" placeholder="Website" />
        <input name="ort" placeholder="Ort / Region *" required />
      </div>

      <textarea
        name="leistungen"
        placeholder="Dienstleistungen * z.B. Hauswartung, Reinigung, Gartenpflege, Umzug"
        required
      />

      <textarea
        name="nachricht"
        placeholder="Nachricht / Einsatzgebiet / zusätzliche Informationen"
      />

      <button type="submit" disabled={sending}>
        {sending ? "Wird gesendet..." : "Anbieter-Anfrage senden"}
      </button>

      {message && (
        <p className={message.startsWith("✅") ? "mega-success" : "mega-error"}>
          {message}
        </p>
      )}
    </form>
  );
}