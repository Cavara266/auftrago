"use client";

import { useState } from "react";

const categories = [
  "Hauswartung",
  "Büroreinigung",
  "Treppenhausreinigung",
  "Umzugsreinigung",
  "Gartenpflege",
  "Umzug",
  "Transport",
  "Entsorgung",
];

const objectTypes = [
  "Mehrfamilienhaus",
  "Einfamilienhaus",
  "Wohnung",
  "Büro / Gewerbe",
  "Verwaltung / Liegenschaft",
  "Andere",
];

const startOptions = [
  "So bald wie möglich",
  "Diese Woche",
  "Nächste Woche",
  "Diesen Monat",
  "Nach Vereinbarung",
];

const frequencyOptions = [
  "Einmalig",
  "Wöchentlich",
  "Alle 2 Wochen",
  "Monatlich",
  "Nach Vereinbarung",
];

export default function HomeLeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const [description, setDescription] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      city: String(formData.get("city") || ""),
      category: String(formData.get("category") || ""),
      objectType: String(formData.get("objectType") || ""),
      start: String(formData.get("start") || ""),
      frequency: String(formData.get("frequency") || ""),
      description: String(formData.get("description") || ""),
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
        throw new Error("Request failed");
      }

      setStatus("success");
      form.reset();
      setDescription("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="form-kicker">Live Anfrage</div>

      <h2>In 60 Sekunden zur passenden Offerte.</h2>

      <p>
        Beschreibe kurz deinen Auftrag. Wir verbinden dich mit passenden
        Anbietern aus deiner Region.
      </p>

      <div className="form-fields">
        <label className="field full">
          <span>Vorname / Name</span>
          <input name="name" type="text" required placeholder="Max Muster" />
        </label>

        <div className="form-row">
          <label className="field">
            <span>Telefon</span>
            <input name="phone" type="tel" required placeholder="079 123 45 67" />
          </label>

          <label className="field">
            <span>Ort / Region</span>
            <input name="city" type="text" required placeholder="Zürich" />
          </label>
        </div>

        <label className="field full">
          <span>E-Mail Adresse</span>
          <input
            name="email"
            type="email"
            required
            placeholder="name@email.ch"
          />
        </label>

        <div className="form-row">
          <label className="field dark">
            <span>Welche Dienstleistung?</span>
            <select name="category" required defaultValue="Hauswartung">
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field dark">
            <span>Welches Objekt?</span>
            <select name="objectType" required defaultValue="Mehrfamilienhaus">
              {objectTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label className="field dark">
            <span>Gewünschter Start</span>
            <select name="start" required defaultValue="So bald wie möglich">
              {startOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="field dark">
            <span>Einsatzhäufigkeit</span>
            <select name="frequency" required defaultValue="Nach Vereinbarung">
              {frequencyOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field textarea dark full">
          <span>Beschreibe deinen Auftrag</span>
          <textarea
            name="description"
            required
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Zum Beispiel: Wir suchen eine regelmässige Treppenhausreinigung für ein 6-Familienhaus inkl. Eingangsbereich und Keller."
          />
          <em>{description.length}/500</em>
        </label>

        <label className="consent">
          <input type="checkbox" required />
          <span>
            Ich stimme zu, dass meine Angaben zur Bearbeitung der Anfrage
            verwendet werden.
          </span>
        </label>

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Wird gesendet..." : "Anfrage starten"}
        </button>

        {status === "success" && (
          <div className="form-success">Anfrage erfolgreich gesendet.</div>
        )}

        {status === "error" && (
          <div className="form-error">
            Anfrage konnte nicht gesendet werden.
          </div>
        )}

        <div className="form-benefits">
          <div>
            <strong>Schnelle Antworten</strong>
            <span>Erste Rückmeldungen innerhalb kurzer Zeit</span>
          </div>

          <div>
            <strong>Unverbindlich</strong>
            <span>Kostenlos und ohne Verpflichtung</span>
          </div>

          <div>
            <strong>Sicher</strong>
            <span>Deine Daten bleiben vertraulich</span>
          </div>
        </div>
      </div>
    </form>
  );
}