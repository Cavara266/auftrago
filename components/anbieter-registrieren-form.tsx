"use client";

import { useState } from "react";

export default function AnbieterRegistrierenForm() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setMessage("");

    const fd = new FormData(e.currentTarget);

    const providerPayload = {
      companyName: String(fd.get("firma") || ""),
      contactName: String(fd.get("kontaktperson") || ""),
      phone: String(fd.get("telefon") || ""),
      email: String(fd.get("email") || ""),
      website: String(fd.get("website") || ""),
      region: String(fd.get("ort") || ""),
      services: String(fd.get("leistungen") || ""),
    };

    try {
      const saveProvider = await fetch("/api/providers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(providerPayload),
      });

      if (!saveProvider.ok) {
        throw new Error("Provider konnte nicht gespeichert werden");
      }

      const mailPayload = {
        typ: "Anbieter-Anfrage",
        firma: providerPayload.companyName,
        kontaktperson: providerPayload.contactName,
        telefon: providerPayload.phone,
        email: providerPayload.email,
        website: providerPayload.website,
        ort: providerPayload.region,
        leistungen: providerPayload.services,
        nachricht: String(fd.get("nachricht") || ""),
      };

      await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mailPayload),
      });

      setMessage("✅ Anfrage erfolgreich gesendet. Wir melden uns persönlich bei dir.");
      e.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setMessage("❌ Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.");
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

      {message && <p className="mega-error">{message}</p>}
    </form>
  );
}