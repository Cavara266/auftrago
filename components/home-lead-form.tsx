"use client";

import { useState } from "react";

const services = [
  { name: "Reinigung", icon: "🧹", text: "Wohnung, Büro, Unterhalt" },
  { name: "Umzugsreinigung", icon: "🏠", text: "Endreinigung & Abgabe" },
  { name: "Fensterreinigung", icon: "🪟", text: "Fenster, Storen, Glas" },
  { name: "Hauswartung", icon: "🏢", text: "Liegenschaften & Unterhalt" },
  { name: "Gartenpflege", icon: "🌿", text: "Rasen, Hecken, Pflege" },
  { name: "Umzug", icon: "📦", text: "Privatumzug & Transport" },
  { name: "Entsorgung", icon: "♻️", text: "Räumung, Keller, Sperrgut" },
  { name: "Andere", icon: "✨", text: "Sonstige Dienstleistung" },
];

export default function HomeLeadForm() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function trackLeadConversion() {
    if (typeof window === "undefined") return;

    const gtag = (window as Window & {
      gtag?: (...args: unknown[]) => void;
    }).gtag;

    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        event_category: "lead",
        event_label: "home_lead_form",
        service,
        region,
      });
    }
  }

  async function handleSubmit() {
    if (!service || !region || !name || !phone) {
      setError("Bitte fülle alle Pflichtfelder aus.");
      return;
    }

    setSending(true);
    setError("");

    const payload = {
      name,
      phone,
      email: email || "Nicht angegeben",
      region,
      service,
      start: "Nach Absprache",
      propertyType: "Nicht angegeben",
      message: description || "Kurzanfrage über Startseite",

      salutation: "Nicht angegeben",
      street: "Nicht angegeben",
      postalCode: region,
      city: region,
      flexibleDate: "Nach Absprache",
      viewingWanted: "Nach Absprache",
      phoneAvailability: "Nach Absprache",
      objectType: "Nicht angegeben",
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
      offersWanted: "3 Angebote",
      important: "Preis, Qualität und schnelle Rückmeldung",
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
        setError("Die Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.");
        return;
      }

      trackLeadConversion();
      setSent(true);
    } catch {
      setError("Es gab ein technisches Problem. Bitte versuche es erneut.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="mega-lead-success">
        <div>✓</div>
        <h3>Anfrage erhalten</h3>
        <p>
          Danke. Deine Anfrage wurde gesendet. Passende Anbieter können sich
          direkt bei dir melden.
        </p>
      </div>
    );
  }

  return (
    <div className="mega-lead">
      <div className="mega-lead-top">
        <span>🔥 Schnellstart</span>
        <strong>Schritt {step} von 4</strong>
      </div>

      <div className="mega-progress">
        <span className={step >= 1 ? "active" : ""}>Projekt</span>
        <span className={step >= 2 ? "active" : ""}>Details</span>
        <span className={step >= 3 ? "active" : ""}>Kontakt</span>
        <span className={step >= 4 ? "active" : ""}>Senden</span>
      </div>

      {step === 1 && (
        <>
          <div className="mega-head">
            <div className="mega-pill">✓ Kostenlos & unverbindlich</div>
            <h3>Welche Dienstleistung brauchst du?</h3>
            <p>
              Wähle eine Kategorie. Danach beschreibst du kurz deinen Auftrag.
            </p>
          </div>

          <div className="mega-services">
            {services.map((item) => (
              <button
                key={item.name}
                type="button"
                className={
                  service === item.name ? "mega-service active" : "mega-service"
                }
                onClick={() => setService(item.name)}
              >
                <b>{item.icon}</b>
                <strong>{item.name}</strong>
                <small>{item.text}</small>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="mega-main-btn"
            disabled={!service}
            onClick={() => setStep(2)}
          >
            Weiter zu den Details →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mega-head">
            <div className="mega-pill">{service}</div>
            <h3>Beschreibe deinen Auftrag</h3>
            <p>
              Gute Angaben erhöhen die Chance auf schnelle und passende
              Rückmeldungen.
            </p>
          </div>

          <textarea
            className="mega-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`z.B. ${service} in Zürich, 3.5 Zimmer Wohnung, Termin nächste Woche, Besonderheiten...`}
          />

          <div className="mega-hints">
            <span>💡 Grösse / Zimmer</span>
            <span>📍 Ort / Region</span>
            <span>📅 Gewünschter Termin</span>
          </div>

          <div className="mega-row">
            <button type="button" className="mega-back" onClick={() => setStep(1)}>
              ← Zurück
            </button>

            <button type="button" className="mega-main-btn" onClick={() => setStep(3)}>
              Weiter →
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="mega-head">
            <div className="mega-pill">📍 Fast geschafft</div>
            <h3>Wohin sollen Anbieter sich melden?</h3>
            <p>
              Deine Angaben werden nur für deine Anfrage und passende Offerten
              verwendet.
            </p>
          </div>

          <div className="mega-fields">
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="PLZ / Ort *"
            />

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vorname / Name *"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefon *"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-Mail optional"
              type="email"
            />
          </div>

          <div className="mega-row">
            <button type="button" className="mega-back" onClick={() => setStep(2)}>
              ← Zurück
            </button>

            <button
              type="button"
              className="mega-main-btn"
              disabled={!region || !name || !phone}
              onClick={() => setStep(4)}
            >
              Anfrage prüfen →
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="mega-head">
            <div className="mega-pill">🚀 Bereit zum Senden</div>
            <h3>Deine Anfrage ist bereit</h3>
            <p>
              Sende deine Anfrage kostenlos und unverbindlich an Auftrago.
            </p>
          </div>

          <div className="mega-summary">
            <div>
              <span>Dienstleistung</span>
              <strong>{service}</strong>
            </div>

            <div>
              <span>Region</span>
              <strong>{region}</strong>
            </div>

            <div>
              <span>Kontakt</span>
              <strong>{name}</strong>
              <p>{phone}</p>
            </div>

            <div>
              <span>Beschreibung</span>
              <p>{description || "Keine zusätzlichen Details angegeben."}</p>
            </div>
          </div>

          {error ? <p className="mega-error">{error}</p> : null}

          <button
            type="button"
            className="mega-submit"
            onClick={handleSubmit}
            disabled={sending}
          >
            {sending ? "Wird gesendet..." : "🚀 Kostenlose Offerten erhalten"}
          </button>

          <button type="button" className="mega-back full" onClick={() => setStep(3)}>
            ← Zurück
          </button>
        </>
      )}

      {error && step !== 4 ? <p className="mega-error">{error}</p> : null}

      <div className="mega-trust">
        <span>✓ Kostenlos</span>
        <span>✓ Unverbindlich</span>
        <span>✓ Regionale Anbieter</span>
      </div>
    </div>
  );
}