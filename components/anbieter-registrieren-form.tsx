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

const mailResponse = await fetch("/api/anfrage", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: providerPayload.contactName,
    phone: providerPayload.phone,
    email: providerPayload.email,

    salutation: "Anbieter",
    street: "Nicht angegeben",
    postalCode: "Nicht angegeben",
    city: providerPayload.region,
    region: providerPayload.region,

    service: providerPayload.services,
    start: "Nicht angegeben",
    flexibleDate: "Nicht angegeben",
    viewingWanted: "Nicht angegeben",
    phoneAvailability: "Nicht angegeben",

    objectType: "Anbieter-Registrierung",
    propertyType: "Nicht angegeben",
    floor: "Nicht angegeben",
    elevator: "Nicht angegeben",
    parking: "Nicht angegeben",

    rooms: "Nicht angegeben",
    area: "Nicht angegeben",
    windows: "Nicht angegeben",
    windowSize: "Nicht angegeben",
    blinds: "Nicht angegeben",
    shutters: "Nicht angegeben",

    handoverGuarantee: "Nicht angegeben",
    cellar: "Nicht angegeben",
    balcony: "Nicht angegeben",
    carpetCleaning: "Nicht angegeben",

    budget: "Nicht angegeben",
    offersWanted: "Nicht angegeben",
    important: "Anbieter möchte auf Auftrago aufgenommen werden",

    message: `Neue Anbieter-Anfrage

Firma: ${providerPayload.companyName}
Kontaktperson: ${providerPayload.contactName}
Telefon: ${providerPayload.phone}
E-Mail: ${providerPayload.email}
Website: ${providerPayload.website || "Nicht angegeben"}
Ort / Region: ${providerPayload.region}
Leistungen: ${providerPayload.services}

Nachricht:
${providerPayload.message || "Keine Nachricht"}`,
  }),
});

      const mailResult = await mailResponse.json().catch(() => null);

      if (!mailResponse.ok || mailResult?.ok === false) {
        console.warn("Anbieter wurde gespeichert, aber Mail fehlgeschlagen.");
      }

      setMessage(
        "✅ Anfrage erfolgreich gesendet. Wir melden uns persönlich bei dir."
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