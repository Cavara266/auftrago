"use client";

import { useState } from "react";

export default function AnbieterRegistrierenPage() {
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const payload = {
      typ: "Anbieter-Anfrage",
      firma: String(fd.get("firma") || ""),
      kontaktperson: String(fd.get("kontaktperson") || ""),
      telefon: String(fd.get("telefon") || ""),
      email: String(fd.get("email") || ""),
      website: String(fd.get("website") || ""),
      ort: String(fd.get("ort") || ""),
      leistungen: String(fd.get("leistungen") || ""),
      nachricht: String(fd.get("nachricht") || ""),
    };

    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success || data.ok) {
        setMessage("✅ Anfrage erfolgreich gesendet.");
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage("❌ Anfrage konnte nicht gesendet werden.");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Anfrage konnte nicht gesendet werden.");
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="container">
          <span className="eyebrow">Anbieter-Anfrage</span>

          <h1>Firma eintragen.</h1>

          <p>
            Sende uns deine Firmendaten. Wir prüfen deine Anfrage und melden uns
            persönlich bei dir.
          </p>

          <form className="anbieter-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                name="firma"
                placeholder="Firmenname *"
                required
              />
              <input
                name="kontaktperson"
                placeholder="Kontaktperson *"
                required
              />
            </div>

            <div className="form-row">
              <input
                name="telefon"
                placeholder="Telefon *"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="E-Mail *"
                required
              />
            </div>

            <div className="form-row">
              <input
                name="website"
                placeholder="Website"
              />
              <input
                name="ort"
                placeholder="Ort / Region *"
                required
              />
            </div>

            <textarea
              name="leistungen"
              placeholder="Dienstleistungen * z.B. Hauswartung, Reinigung, Gartenpflege"
              required
            />

            <textarea
              name="nachricht"
              placeholder="Nachricht / zusätzliche Informationen"
            />

            <button type="submit">
              Anbieter-Anfrage senden
            </button>
          </form>

          {message && (
            <p style={{ marginTop: "20px" }}>
              {message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}