"use client";

import { useMemo, useState } from "react";

type ServiceKey =
  | "umzugsreinigung"
  | "hauswartung"
  | "umzug"
  | "gartenpflege"
  | "fensterreinigung"
  | "entsorgung";

type ServiceConfig = {
  name: string;
  icon: string;
  description: string;
  unitLabel: string;
  unitPrice: number;
  basePrice: number;
  minPrice: number;
};

const services: Record<ServiceKey, ServiceConfig> = {
  umzugsreinigung: {
    name: "Umzugsreinigung",
    icon: "🏠",
    description: "Endreinigung mit Richtpreis für Wohnungen und Häuser.",
    unitLabel: "Zimmer",
    unitPrice: 140,
    basePrice: 390,
    minPrice: 550,
  },
  hauswartung: {
    name: "Hauswartung",
    icon: "🏢",
    description: "Regelmässige Betreuung von Liegenschaften und Objekten.",
    unitLabel: "Objekte",
    unitPrice: 220,
    basePrice: 280,
    minPrice: 350,
  },
  umzug: {
    name: "Umzug",
    icon: "🚚",
    description: "Privatumzug, Firmenumzug oder Transport mit Helfern.",
    unitLabel: "Zimmer",
    unitPrice: 240,
    basePrice: 520,
    minPrice: 700,
  },
  gartenpflege: {
    name: "Gartenpflege",
    icon: "🌿",
    description: "Rasen, Hecken, Pflegearbeiten und saisonale Gartenarbeiten.",
    unitLabel: "Stunden",
    unitPrice: 85,
    basePrice: 120,
    minPrice: 150,
  },
  fensterreinigung: {
    name: "Fensterreinigung",
    icon: "🪟",
    description: "Fenster, Glasflächen, Rahmen und grössere Glasreinigungen.",
    unitLabel: "Fenster",
    unitPrice: 14,
    basePrice: 110,
    minPrice: 120,
  },
  entsorgung: {
    name: "Entsorgung",
    icon: "♻️",
    description: "Entsorgung, Räumung, Sperrgut und Kellerentrümpelung.",
    unitLabel: "m³",
    unitPrice: 75,
    basePrice: 190,
    minPrice: 250,
  },
};

function formatPrice(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export default function PreisrechnerPage() {
  const [service, setService] = useState<ServiceKey>("umzugsreinigung");
  const [units, setUnits] = useState(3);
  const [area, setArea] = useState(80);
  const [bathrooms, setBathrooms] = useState(1);
  const [floor, setFloor] = useState(1);
  const [distance, setDistance] = useState(10);

  const [express, setExpress] = useState(false);
  const [difficultAccess, setDifficultAccess] = useState(false);
  const [premium, setPremium] = useState(true);
  const [lift, setLift] = useState(true);
  const [balcony, setBalcony] = useState(false);
  const [cellar, setCellar] = useState(false);

  const selected = services[service];

  const calculation = useMemo(() => {
    let total = selected.basePrice + units * selected.unitPrice;

    if (service === "umzugsreinigung") {
      total += area * 3.2;
      total += bathrooms * 90;
      if (balcony) total += 80;
      if (cellar) total += 90;
      if (premium) total += 160;
    }

    if (service === "umzug") {
      total += floor * 80;
      total += distance * 4;
      if (!lift) total += 180;
      if (difficultAccess) total += 140;
    }

    if (service === "hauswartung") {
      total += area * 1.2;
      if (premium) total += 180;
    }

    if (service === "gartenpflege") {
      total += area * 0.8;
      if (difficultAccess) total += 90;
    }

    if (service === "fensterreinigung") {
      if (difficultAccess) total += 120;
      if (premium) total += 70;
    }

    if (service === "entsorgung") {
      if (difficultAccess) total += 120;
      if (cellar) total += 100;
    }

    if (express) total += 190;
    if (difficultAccess) total += 90;

    const finalPrice = Math.max(total, selected.minPrice);
    const low = Math.round(finalPrice / 10) * 10;
    const high = Math.round((finalPrice * 1.28) / 10) * 10;

    return { low, high };
  }, [
    selected,
    service,
    units,
    area,
    bathrooms,
    floor,
    distance,
    express,
    difficultAccess,
    premium,
    lift,
    balcony,
    cellar,
  ]);

  const offerUrl = `/offerte-anfragen?dienstleistung=${encodeURIComponent(
    selected.name
  )}&preis_von=${calculation.low}&preis_bis=${
    calculation.high
  }&menge=${units}&einheit=${encodeURIComponent(
    selected.unitLabel
  )}&flaeche=${area}`;

  return (
    <main className="calculator-page">
      <style jsx global>{`
        .calculator-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(16, 185, 129, 0.24), transparent 34%),
            linear-gradient(135deg, #07110d 0%, #020403 100%);
          color: white;
          padding: 70px 20px;
          font-family: Arial, sans-serif;
        }

        .calculator-container {
          max-width: 1220px;
          margin: 0 auto;
        }

        .calculator-hero {
          text-align: center;
          margin-bottom: 48px;
        }

        .calculator-eyebrow {
          display: inline-flex;
          border: 1px solid rgba(110, 231, 183, 0.35);
          background: rgba(16, 185, 129, 0.1);
          color: #6ee7b7;
          border-radius: 999px;
          padding: 12px 22px;
          font-weight: 900;
          letter-spacing: 0.18em;
          margin-bottom: 24px;
        }

        .calculator-title {
          font-size: clamp(42px, 7vw, 84px);
          line-height: 0.95;
          letter-spacing: -4px;
          margin: 0 0 22px;
          color: white;
        }

        .calculator-subtitle {
          max-width: 820px;
          margin: 0 auto;
          color: #d1d5db;
          font-size: clamp(18px, 2.4vw, 24px);
          line-height: 1.55;
        }

        .calculator-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 32px;
          align-items: start;
        }

        .calculator-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 32px;
          padding: 32px;
          backdrop-filter: blur(18px);
        }

        .calculator-card h2 {
          font-size: 34px;
          margin: 0 0 24px;
          color: white;
        }

        .calculator-field {
          margin-bottom: 22px;
        }

        .calculator-field label {
          display: block;
          font-weight: 800;
          margin-bottom: 10px;
          color: white;
        }

        .calculator-field select,
        .calculator-field input {
          width: 100%;
          padding: 17px 18px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.96);
          color: #052e16;
          font-size: 17px;
          font-weight: 800;
          outline: none;
        }

        .calculator-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .calculator-info {
          margin: 22px 0;
          padding: 20px;
          border-radius: 22px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(110, 231, 183, 0.2);
          color: #d1fae5;
        }

        .calculator-checkboxes {
          display: grid;
          gap: 14px;
          margin-top: 10px;
        }

        .calculator-checkbox {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 16px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          cursor: pointer;
          font-weight: 800;
          color: white;
        }

        .calculator-checkbox input {
          width: 22px;
          height: 22px;
        }

        .calculator-result {
          background: linear-gradient(160deg, #ecfdf5, #ffffff);
          color: #052e16;
          border-radius: 34px;
          padding: 38px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.36);
          position: sticky;
          top: 24px;
        }

        .calculator-result-label {
          color: #047857;
          font-weight: 900;
          font-size: 22px;
          margin: 0 0 10px;
        }

        .calculator-line {
          width: 44px;
          height: 4px;
          border-radius: 999px;
          background: #10b981;
          margin-bottom: 26px;
        }

        .calculator-price {
          font-size: clamp(46px, 6vw, 72px);
          line-height: 1;
          letter-spacing: -3px;
          margin: 0 0 18px;
          color: #064e3b;
          font-weight: 950;
        }

        .calculator-result-text {
          color: #475569;
          font-size: 18px;
          line-height: 1.55;
          margin-bottom: 28px;
        }

        .calculator-summary {
          padding: 22px;
          border-radius: 22px;
          background: #f0fdf4;
          margin-bottom: 30px;
          color: #064e3b;
        }

        .calculator-summary p {
          margin: 8px 0;
          font-size: 16px;
        }

        .calculator-feature-list {
          display: grid;
          margin-bottom: 30px;
          border-top: 1px solid #dbe4de;
        }

        .calculator-feature {
          display: flex;
          gap: 18px;
          align-items: flex-start;
          padding: 18px 0;
          border-bottom: 1px solid #dbe4de;
        }

        .calculator-feature-icon {
          width: 54px;
          height: 54px;
          border-radius: 18px;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          flex-shrink: 0;
        }

        .calculator-feature-title {
          font-size: 20px;
          font-weight: 950;
          color: #052e16;
          margin-bottom: 4px;
        }

        .calculator-feature-text {
          color: #64748b;
          font-size: 16px;
          line-height: 1.45;
        }

        .calculator-button {
          display: block;
          width: 100%;
          padding: 20px 24px;
          border-radius: 999px;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          text-align: center;
          font-size: 19px;
          font-weight: 950;
          text-decoration: none;
        }

        .calculator-note {
          margin-top: 18px;
          font-size: 15px;
          color: #64748b;
          text-align: center;
        }

        @media (max-width: 900px) {
          .calculator-page {
            padding: 42px 14px;
          }

          .calculator-grid {
            grid-template-columns: 1fr;
          }

          .calculator-card,
          .calculator-result {
            padding: 24px;
            border-radius: 26px;
          }

          .calculator-result {
            position: static;
          }

          .calculator-two {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="calculator-container">
        <section className="calculator-hero">
          <p className="calculator-eyebrow">AUFTRAGO PREISRECHNER</p>
          <h1 className="calculator-title">Preis sofort online berechnen</h1>
          <p className="calculator-subtitle">
            Wähle deine Dienstleistung, gib die wichtigsten Angaben ein und
            erhalte sofort eine realistische Preisspanne für deine Anfrage.
          </p>
        </section>

        <div className="calculator-grid">
          <section className="calculator-card">
            <h2>Angaben eingeben</h2>

            <div className="calculator-field">
              <label>Dienstleistung</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as ServiceKey)}
              >
                {Object.entries(services).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.icon} {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="calculator-info">
              <strong>
                {selected.icon} {selected.name}
              </strong>
              <p style={{ marginBottom: 0 }}>{selected.description}</p>
            </div>

            <div className="calculator-two">
              <div className="calculator-field">
                <label>Anzahl {selected.unitLabel}</label>
                <input
                  type="number"
                  min="1"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                />
              </div>

              <div className="calculator-field">
                <label>Fläche ca. m²</label>
                <input
                  type="number"
                  min="1"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                />
              </div>
            </div>

            {(service === "umzugsreinigung" || service === "umzug") && (
              <div className="calculator-two">
                <div className="calculator-field">
                  <label>Badezimmer</label>
                  <input
                    type="number"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                  />
                </div>

                <div className="calculator-field">
                  <label>Stockwerk</label>
                  <input
                    type="number"
                    min="0"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {service === "umzug" && (
              <div className="calculator-field">
                <label>Distanz ca. km</label>
                <input
                  type="number"
                  min="1"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                />
              </div>
            )}

            <div className="calculator-checkboxes">
              <CheckBox label="Express-Termin gewünscht" checked={express} onChange={setExpress} />
              <CheckBox label="Zufahrt / Parkplatz erschwert" checked={difficultAccess} onChange={setDifficultAccess} />
              <CheckBox label="Lift vorhanden" checked={lift} onChange={setLift} />
              <CheckBox label="Balkon / Terrasse vorhanden" checked={balcony} onChange={setBalcony} />
              <CheckBox label="Keller / Nebenräume vorhanden" checked={cellar} onChange={setCellar} />
              <CheckBox label="Premium / Garantie-Service" checked={premium} onChange={setPremium} />
            </div>
          </section>

          <section className="calculator-result">
            <p className="calculator-result-label">Ihr Richtpreis</p>
            <div className="calculator-line" />

            <h2 className="calculator-price">
              CHF {formatPrice(calculation.low)} – {formatPrice(calculation.high)}
            </h2>

            <p className="calculator-result-text">
              Richtpreis für {selected.name}. Der genaue Preis wird nach Prüfung
              der Anfrage durch passende Anbieter bestätigt.
            </p>

            <div className="calculator-summary">
              <p><strong>Dienstleistung:</strong> {selected.name}</p>
              <p><strong>Menge:</strong> {units} {selected.unitLabel}</p>
              <p><strong>Fläche:</strong> ca. {area} m²</p>
              <p><strong>Premium:</strong> {premium ? "Ja" : "Nein"}</p>
            </div>

            <div className="calculator-feature-list">
              <FeatureItem icon="🛡️" title="Unverbindlich & kostenlos" text="Ihre Anfrage ist kostenlos und verpflichtet zu nichts." />
              <FeatureItem icon="⭐" title="Geprüfte Qualität" text="Wir arbeiten nur mit geprüften und zuverlässigen Anbietern." />
              <FeatureItem icon="📊" title="Marktbasierte Preisschätzung" text="Die Empfehlung basiert auf ähnlichen Aufträgen und Erfahrungswerten." />
              <FeatureItem icon="📨" title="Offerten von passenden Anbietern" text="Ihre Anfrage wird an qualifizierte Anbieter weitergeleitet." />
            </div>

            <a className="calculator-button" href={offerUrl}>
              Offerte über Kontaktformular anfragen
            </a>

            <p className="calculator-note">
              🔒 Ihre Daten werden sicher und vertraulich behandelt.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function CheckBox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="calculator-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}

function FeatureItem({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="calculator-feature">
      <div className="calculator-feature-icon">{icon}</div>
      <div>
        <div className="calculator-feature-title">{title}</div>
        <div className="calculator-feature-text">{text}</div>
      </div>
    </div>
  );
}