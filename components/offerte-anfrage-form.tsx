"use client";

import { useState } from "react";

const services = [
  "Reinigung",
  "Umzugsreinigung",
  "Hauswartung",
  "Fensterreinigung",
  "Gartenpflege",
  "Umzug",
  "Transport",
  "Entsorgung",
  "Malerarbeiten",
  "Elektriker",
  "Sanitär",
];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function OfferteAnfrageForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSending(true);
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),

      salutation: String(fd.get("salutation") || ""),
      street: String(fd.get("street") || ""),
      postalCode: String(fd.get("postalCode") || ""),
      city: String(fd.get("city") || ""),
      region: String(fd.get("region") || ""),

      service: String(fd.get("service") || ""),
      start: String(fd.get("start") || ""),
      flexibleDate: String(fd.get("flexibleDate") || "Nach Absprache"),
      viewingWanted: String(fd.get("viewingWanted") || "Nach Absprache"),
      phoneAvailability: String(fd.get("phoneAvailability") || "Nach Absprache"),

      objectType: String(fd.get("objectType") || ""),
      propertyType: String(fd.get("propertyType") || ""),
      floor: String(fd.get("floor") || "Nicht angegeben"),
      elevator: String(fd.get("elevator") || "Nicht angegeben"),
      parking: String(fd.get("parking") || "Nicht angegeben"),

      rooms: String(fd.get("rooms") || "Nicht angegeben"),
      area: String(fd.get("area") || "Nicht angegeben"),
      windows: String(fd.get("windows") || "Nicht angegeben"),
      windowSize: String(fd.get("windowSize") || "Nicht angegeben"),
      blinds: String(fd.get("blinds") || "Nicht angegeben"),
      shutters: String(fd.get("shutters") || "Nicht angegeben"),

      handoverGuarantee: String(fd.get("handoverGuarantee") || "Nicht angegeben"),
      cellar: String(fd.get("cellar") || "Nicht angegeben"),
      balcony: String(fd.get("balcony") || "Nicht angegeben"),
      carpetCleaning: String(fd.get("carpetCleaning") || "Nicht angegeben"),

      budget: String(fd.get("budget") || "Nicht angegeben"),
      offersWanted: String(fd.get("offersWanted") || "3 Angebote"),
      important: String(fd.get("important") || "Preis und Qualität"),

      message: String(fd.get("message") || ""),
    };

    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Die Anfrage konnte nicht gesendet werden.");
        return;
      }

      window.gtag?.("event", "generate_lead", {
        event_category: "lead",
        event_label: payload.service,
        value: 1,
      });

      setSent(true);
      form.reset();
    } catch {
      setError("Es gab ein technisches Problem. Bitte versuche es erneut.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="quote-form">
        <div className="quote-form-head">
          <span>✅ Anfrage gesendet</span>
          <h2>Danke für deine Anfrage</h2>
          <p>
            Deine Anfrage wurde erfolgreich übermittelt. Passende Anbieter
            können sich bei dir melden.
          </p>
        </div>

        <small>✓ Anfrage gespeichert · ✓ Conversion erfasst</small>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="quote-form-head">
        <span>Jetzt starten</span>
        <h2>Kostenlose Anfrage</h2>
        <p>Alle Angaben helfen den Anbietern, schneller zu reagieren.</p>
      </div>

      <select name="salutation" required defaultValue="">
        <option value="" disabled>
          Anrede wählen *
        </option>
        <option value="Frau">Frau</option>
        <option value="Herr">Herr</option>
        <option value="Firma">Firma</option>
      </select>

      <div className="quote-form-row">
        <input name="name" placeholder="Vorname / Name *" required />
        <input name="email" type="email" placeholder="E-Mail *" required />
      </div>

      <div className="quote-form-row">
        <input name="phone" placeholder="Telefon *" required />
        <input name="phoneAvailability" placeholder="Erreichbarkeit" />
      </div>

      <div className="quote-form-row">
        <input name="street" placeholder="Strasse / Adresse *" required />
        <input name="postalCode" placeholder="PLZ *" required />
      </div>

      <div className="quote-form-row">
        <input name="city" placeholder="Ort *" required />
        <input name="region" placeholder="Region / Kanton *" required />
      </div>

      <select name="service" required defaultValue="">
        <option value="" disabled>
          Dienstleistung wählen *
        </option>
        {services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>

      <div className="quote-form-row">
        <input name="start" placeholder="Gewünschter Termin / Start *" required />
        <input name="flexibleDate" placeholder="Flexibles Datum? Ja / Nein" />
      </div>

      <div className="quote-form-row">
        <input
          name="objectType"
          placeholder="Objekt z.B. Wohnung, Haus, Büro *"
          required
        />
        <input
          name="propertyType"
          placeholder="Objektart z.B. Privat / Gewerbe *"
          required
        />
      </div>

      <div className="quote-form-row">
        <input name="rooms" placeholder="Zimmer optional" />
        <input name="area" placeholder="Fläche m² optional" />
      </div>

      <div className="quote-form-row">
        <input name="floor" placeholder="Etage optional" />
        <input name="elevator" placeholder="Lift vorhanden? Ja / Nein" />
      </div>

      <div className="quote-form-row">
        <input name="parking" placeholder="Parkplatz vorhanden? Ja / Nein" />
        <input name="viewingWanted" placeholder="Besichtigung erwünscht? Ja / Nein" />
      </div>

      <div className="quote-form-row">
        <input name="windows" placeholder="Anzahl Fenster optional" />
        <input name="windowSize" placeholder="Fenstergrösse optional" />
      </div>

      <div className="quote-form-row">
        <input name="blinds" placeholder="Lamellenstoren? Ja / Nein" />
        <input name="shutters" placeholder="Fensterläden? Ja / Nein" />
      </div>

      <div className="quote-form-row">
        <input name="handoverGuarantee" placeholder="Abgabegarantie? Ja / Nein" />
        <input name="carpetCleaning" placeholder="Teppichreinigung? Ja / Nein" />
      </div>

      <div className="quote-form-row">
        <input name="cellar" placeholder="Keller? Ja / Nein" />
        <input name="balcony" placeholder="Balkon? Ja / Nein" />
      </div>

      <div className="quote-form-row">
        <input name="budget" placeholder="Budget optional" />
        <input name="offersWanted" placeholder="Gewünschte Angebote z.B. 3" />
      </div>

      <input
        name="important"
        placeholder="Was ist dir wichtig? Preis, Qualität, schnell..."
      />

      <textarea
        name="message"
        placeholder="Beschreibe deinen Auftrag: Grösse, Termin, Besonderheiten..."
        required
      />

      {error ? <p className="mega-error">{error}</p> : null}

      <button type="submit" disabled={sending}>
        {sending ? "Wird gesendet..." : "Anfrage kostenlos senden"}
      </button>

      <small>✓ Kostenlos · ✓ Unverbindlich · ✓ Regionale Anbieter</small>
    </form>
  );
}