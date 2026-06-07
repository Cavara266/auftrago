"use client";

import { useState } from "react";

const services = [
  { name: "Reinigung", icon: "🧹", text: "Wohnung, Büro, Endreinigung" },
  { name: "Umzugsreinigung", icon: "🏠", text: "Mit oder ohne Abgabegarantie" },
  { name: "Fensterreinigung", icon: "🪟", text: "Fenster, Storen, Glasflächen" },
  { name: "Hauswartung", icon: "🏢", text: "Liegenschaften & Unterhalt" },
  { name: "Gartenpflege", icon: "🌿", text: "Rasen, Hecken, Pflege" },
  { name: "Entsorgung", icon: "♻️", text: "Räumung, Keller, Sperrgut" },
  { name: "Transport", icon: "🚚", text: "Umzug, Lieferung, Möbel" },
  { name: "Andere", icon: "✨", text: "Sonstige Dienstleistung" },
];

export default function HomeLeadForm() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    const payload = {
      name,
      phone,
      email: "Nicht angegeben",
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
      important: "Preis und Qualität",
    };

    await fetch("/api/anfrage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setSent(true);
  }

  if (sent) {
    return (
      <div className="mega-lead-success">
        <div>✓</div>
        <h3>Anfrage erhalten</h3>
        <p>Danke. Wir melden uns schnellstmöglich mit passenden Anbietern.</p>
      </div>
    );
  }

  return (
    <div className="mega-lead">
      <div className="mega-lead-top">
        <span>🔥 Beliebte Anfrage</span>
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
            <h3>Was möchtest du machen lassen?</h3>
            <p>Wähle eine Dienstleistung und starte deine Anfrage in wenigen Sekunden.</p>
          </div>

          <div className="mega-services">
            {services.map((item) => (
              <button
                key={item.name}
                type="button"
                className={service === item.name ? "mega-service active" : "mega-service"}
                onClick={() => setService(item.name)}
              >
                <b>{item.icon}</b>
                <strong>{item.name}</strong>
                <small>{item.text}</small>
              </button>
            ))}
          </div>

          <button
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
            <p>Je genauer deine Angaben sind, desto bessere Offerten erhältst du.</p>
          </div>

          <textarea
            className="mega-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`z.B. ${service} in Zürich, 3.5 Zimmer Wohnung, Termin nächste Woche...`}
          />

          <div className="mega-hints">
            <span>💡 Grösse / Zimmer</span>
            <span>📍 Ort / Region</span>
            <span>📅 Gewünschter Termin</span>
          </div>

          <div className="mega-row">
            <button className="mega-back" onClick={() => setStep(1)}>
              ← Zurück
            </button>
            <button className="mega-main-btn" onClick={() => setStep(3)}>
              Weiter →
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="mega-head">
            <div className="mega-pill">📍 Fast geschafft</div>
            <h3>Wo sollen Anbieter sich melden?</h3>
            <p>Deine Angaben werden nur für passende Offerten verwendet.</p>
          </div>

          <div className="mega-fields">
            <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="PLZ / Ort" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vorname / Name" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon" />
          </div>

          <div className="mega-row">
            <button className="mega-back" onClick={() => setStep(2)}>
              ← Zurück
            </button>
            <button
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
            <p>Jetzt kostenlos passende Offerten von regionalen Anbietern erhalten.</p>
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
              <span>Beschreibung</span>
              <p>{description || "Keine zusätzlichen Details angegeben."}</p>
            </div>
          </div>

          <button className="mega-submit" onClick={handleSubmit}>
            🚀 Kostenlose Offerten erhalten
          </button>

          <button className="mega-back full" onClick={() => setStep(3)}>
            ← Zurück
          </button>
        </>
      )}

      <div className="mega-trust">
        <span>✓ Kostenlos</span>
        <span>✓ Unverbindlich</span>
        <span>✓ Regionale Anbieter</span>
      </div>
    </div>
  );
}