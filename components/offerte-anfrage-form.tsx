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
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),

      salutation: String(fd.get("salutation") || "Nicht angegeben").trim(),
      street: String(fd.get("street") || "Nicht angegeben").trim(),
      postalCode: String(fd.get("postalCode") || "Nicht angegeben").trim(),
      city: String(fd.get("city") || "").trim(),
      region: String(fd.get("region") || "").trim(),

      service: String(fd.get("service") || "").trim(),
      start: String(fd.get("start") || "Nach Absprache").trim(),
      flexibleDate: String(fd.get("flexibleDate") || "Nach Absprache").trim(),
      viewingWanted: String(fd.get("viewingWanted") || "Nach Absprache").trim(),
      phoneAvailability: String(
        fd.get("phoneAvailability") || "Nach Absprache"
      ).trim(),

      objectType: String(fd.get("objectType") || "Nicht angegeben").trim(),
      propertyType: String(fd.get("propertyType") || "Nicht angegeben").trim(),
      floor: String(fd.get("floor") || "Nicht angegeben").trim(),
      elevator: String(fd.get("elevator") || "Nicht angegeben").trim(),
      parking: String(fd.get("parking") || "Nicht angegeben").trim(),

      rooms: String(fd.get("rooms") || "Nicht angegeben").trim(),
      area: String(fd.get("area") || "Nicht angegeben").trim(),
      windows: String(fd.get("windows") || "Nicht angegeben").trim(),
      windowSize: String(fd.get("windowSize") || "Nicht angegeben").trim(),
      blinds: String(fd.get("blinds") || "Nicht angegeben").trim(),
      shutters: String(fd.get("shutters") || "Nicht angegeben").trim(),

      handoverGuarantee: String(
        fd.get("handoverGuarantee") || "Nicht angegeben"
      ).trim(),
      cellar: String(fd.get("cellar") || "Nicht angegeben").trim(),
      balcony: String(fd.get("balcony") || "Nicht angegeben").trim(),
      carpetCleaning: String(
        fd.get("carpetCleaning") || "Nicht angegeben"
      ).trim(),

      budget: String(fd.get("budget") || "Nicht angegeben").trim(),
      offersWanted: String(fd.get("offersWanted") || "3 Angebote").trim(),
      important: String(fd.get("important") || "Preis und Qualität").trim(),

      message: String(fd.get("message") || "").trim(),
    };

    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => null);

      if (!res.ok || !result?.ok) {
        setError(
          result?.error ||
            result?.warning ||
            "Die Anfrage konnte nicht gesendet werden."
        );
        return;
      }

      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          send_to: "G-7YJE35KZCX",
          event_category: "lead",
          event_label: payload.service,
          service: payload.service,
          region: payload.region,
          value: 1,
        });

        console.log("GA4 generate_lead sent", {
          service: payload.service,
          region: payload.region,
        });
      }

      setSent(true);
      form.reset();
    } catch (err) {
      console.error(err);
      setError("Technischer Fehler. Bitte versuche es nochmals.");
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
            Deine Anfrage wurde erfolgreich übermittelt. Wir melden uns so
            schnell wie möglich.
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
        <input name="viewingWanted" placeholder="Besichtigung? Ja / Nein" />
      </div>

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