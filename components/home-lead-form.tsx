"use client";

import { useState } from "react";

export default function HomeLeadForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      region: String(formData.get("region") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      service: String(formData.get("service") || "").trim(),
      start: String(formData.get("start") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    try {
      const response = await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setError("Die Anfrage konnte nicht gesendet werden.");
        return;
      }

      setSent(true);
    } catch {
      setError("Serverfehler. Bitte später erneut versuchen.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="premium-form-success">
        <div>✓</div>
        <h3>Anfrage erhalten</h3>
        <p>
          Danke. Wir prüfen deine Anfrage und melden uns schnellstmöglich bei dir.
        </p>
      </div>
    );
  }

  return (
    <form className="premium-lead-form" onSubmit={handleSubmit}>
      <div className="premium-form-head">
        <span>Live Anfrage</span>
        <h3>Passende Offerte finden</h3>
        <p>
          Beschreibe deinen Auftrag kurz. Wir verbinden dich kostenlos mit
          passenden regionalen Anbietern.
        </p>
      </div>

      <div className="premium-form-grid">
        <label>
          <span>Name</span>
          <input name="name" placeholder="Max Muster" required />
        </label>

        <label>
          <span>Telefon</span>
          <input name="phone" placeholder="079 123 45 67" required />
        </label>

        <label>
          <span>Ort / Region</span>
          <input name="region" placeholder="Zürich" required />
        </label>

        <label>
          <span>E-Mail</span>
          <input name="email" type="email" placeholder="name@email.ch" required />
        </label>

        <label>
          <span>Dienstleistung</span>
          <select name="service" required defaultValue="Hauswartung">
            <option>Hauswartung</option>
            <option>Reinigung</option>
            <option>Umzugsreinigung</option>
            <option>Gartenpflege</option>
            <option>Entsorgung</option>
            <option>Transport</option>
          </select>
        </label>

        <label>
          <span>Start</span>
          <select name="start" required defaultValue="So bald wie möglich">
            <option>So bald wie möglich</option>
            <option>Diese Woche</option>
            <option>Diesen Monat</option>
            <option>Nach Vereinbarung</option>
          </select>
        </label>
      </div>

      <label className="premium-textarea">
        <span>Auftrag beschreiben</span>
        <textarea
          name="message"
          placeholder="z.B. Treppenhausreinigung für ein Mehrfamilienhaus in Zürich."
          required
        />
      </label>

      <label className="premium-check">
        <input type="checkbox" required />
        <span>
          Ich stimme zu, dass meine Angaben zur Bearbeitung der Anfrage verwendet
          werden.
        </span>
      </label>

      {error ? <div className="premium-form-error">{error}</div> : null}

      <button className="premium-submit" type="submit" disabled={loading}>
        {loading ? "Wird gesendet..." : "Anfrage starten →"}
      </button>

      <div className="premium-form-trust">
        <span>✓ Kostenlos</span>
        <span>✓ Unverbindlich</span>
        <span>✓ Regional</span>
      </div>
    </form>
  );
}