"use client";

import { useMemo, useState } from "react";

type ServiceKey =
  | "umzugsreinigung"
  | "grundreinigung"
  | "baureinigung"
  | "fensterreinigung"
  | "unterhaltsreinigung"
  | "hauswartung"
  | "gartenpflege"
  | "umzug"
  | "entsorgung";

type PaymentOption = "deposit" | "full";

const services: Record<
  ServiceKey,
  {
    name: string;
    icon: string;
    description: string;
    basePrice: number;
    sqmPrice: number;
    minPrice: number;
  }
> = {
  umzugsreinigung: {
    name: "Umzugsreinigung",
    icon: "🏠",
    description: "Endreinigung mit Abgabegarantie.",
    basePrice: 390,
    sqmPrice: 4.2,
    minPrice: 590,
  },
  grundreinigung: {
    name: "Grundreinigung",
    icon: "✨",
    description: "Intensive Reinigung für Wohnung, Haus oder Gewerbe.",
    basePrice: 280,
    sqmPrice: 3.6,
    minPrice: 390,
  },
  baureinigung: {
    name: "Baureinigung",
    icon: "🏗️",
    description: "Grob-, Zwischen- und Bauendreinigung.",
    basePrice: 520,
    sqmPrice: 5.8,
    minPrice: 750,
  },
  fensterreinigung: {
    name: "Fensterreinigung",
    icon: "🪟",
    description: "Fenster, Rahmen, Glasflächen und Storen.",
    basePrice: 160,
    sqmPrice: 1.4,
    minPrice: 180,
  },
  unterhaltsreinigung: {
    name: "Unterhaltsreinigung",
    icon: "🧽",
    description: "Regelmässige Reinigung für Privat und Gewerbe.",
    basePrice: 120,
    sqmPrice: 1.8,
    minPrice: 150,
  },
  hauswartung: {
    name: "Hauswartung",
    icon: "🏢",
    description: "Betreuung von Liegenschaften und Objekten.",
    basePrice: 280,
    sqmPrice: 1.5,
    minPrice: 350,
  },
  gartenpflege: {
    name: "Gartenpflege",
    icon: "🌿",
    description: "Rasen, Hecken, Pflege und saisonale Arbeiten.",
    basePrice: 160,
    sqmPrice: 1.2,
    minPrice: 180,
  },
  umzug: {
    name: "Umzug",
    icon: "🚚",
    description: "Privatumzug, Transport und Helfer.",
    basePrice: 520,
    sqmPrice: 2.8,
    minPrice: 690,
  },
  entsorgung: {
    name: "Entsorgung",
    icon: "♻️",
    description: "Räumung, Entsorgung und Sperrgut.",
    basePrice: 240,
    sqmPrice: 2.2,
    minPrice: 290,
  },
};

function formatPrice(value: number) {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export default function PreisrechnerPage() {
  const [service, setService] = useState<ServiceKey>("umzugsreinigung");
  const [objectType, setObjectType] = useState("Wohnung");
  const [rooms, setRooms] = useState(3.5);
  const [area, setArea] = useState(80);
  const [bathrooms, setBathrooms] = useState(1);
  const [floor, setFloor] = useState(1);
  const [lift, setLift] = useState(true);

  const [balcony, setBalcony] = useState(false);
  const [cellar, setCellar] = useState(false);
  const [attic, setAttic] = useState(false);
  const [garage, setGarage] = useState(false);
  const [storen, setStoren] = useState(false);
  const [lamellen, setLamellen] = useState(false);
  const [oven, setOven] = useState(true);
  const [hood, setHood] = useState(true);
  const [fridge, setFridge] = useState(false);
  const [washer, setWasher] = useState(false);
  const [dryer, setDryer] = useState(false);
  const [carpet, setCarpet] = useState(false);
  const [heavyDirt, setHeavyDirt] = useState(false);
  const [constructionDirt, setConstructionDirt] = useState(false);
  const [mold, setMold] = useState(false);
  const [express, setExpress] = useState(false);

  const [photos, setPhotos] = useState<File[]>([]);
  const [aiDone, setAiDone] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("08:00");
  const [payment, setPayment] = useState<PaymentOption>("deposit");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedReview, setAcceptedReview] = useState(false);

  const selected = services[service];

 const calculation = useMemo(() => {
  const safeArea = Math.max(Number(area) || 0, 1);
  const safeRooms = Math.max(Number(rooms) || 0, 1);
  const safeBathrooms = Math.max(Number(bathrooms) || 0, 0);
  const safeFloor = Math.max(Number(floor) || 0, 0);

  let total = 0;

  if (service === "umzugsreinigung") {
    total = 420 + safeArea * 5.2 + safeRooms * 95 + safeBathrooms * 120;
  }

  if (service === "grundreinigung") {
    total = 280 + safeArea * 4.6 + safeRooms * 70 + safeBathrooms * 90;
  }

  if (service === "baureinigung") {
    total = 650 + safeArea * 7.5 + safeRooms * 90 + safeBathrooms * 110;
  }

  if (service === "fensterreinigung") {
    total = 180 + safeArea * 2.8;
  }

  if (service === "unterhaltsreinigung") {
    total = 120 + safeArea * 1.8;
  }

  if (service === "hauswartung") {
    total = 280 + safeArea * 1.6;
  }

  if (service === "gartenpflege") {
    total = 180 + safeArea * 1.4;
  }

  if (service === "umzug") {
    total = 520 + safeRooms * 220 + safeArea * 2.2 + safeFloor * 90;
  }

  if (service === "entsorgung") {
    total = 290 + safeArea * 4.2 + safeRooms * 130;
  }

  if (safeFloor > 0 && !lift) total += safeFloor * 90;
  if (balcony) total += 80;
  if (cellar) total += 120;
  if (attic) total += 120;
  if (garage) total += 150;
  if (storen) total += 160;
  if (lamellen) total += 220;
  if (oven) total += 45;
  if (hood) total += 45;
  if (fridge) total += 45;
  if (washer) total += 40;
  if (dryer) total += 40;
  if (carpet) total += 180;
  if (heavyDirt) total += 220;
  if (constructionDirt) total += 320;
  if (mold) total += 280;
  if (express) total += 220;

  const totalPrice = Math.max(total, selected.minPrice);
  const roundedTotal = Math.round(totalPrice / 10) * 10;
  const fullPaymentPrice = Math.round((roundedTotal * 0.9) / 10) * 10;
  const depositPrice = Math.round((roundedTotal * 0.5) / 10) * 10;

  return {
    totalPrice: roundedTotal,
    fullPaymentPrice,
    depositPrice,
  };
}, [
  selected,
  service,
  area,
  rooms,
  bathrooms,
  floor,
  lift,
  balcony,
  cellar,
  attic,
  garage,
  storen,
  lamellen,
  oven,
  hood,
  fridge,
  washer,
  dryer,
  carpet,
  heavyDirt,
  constructionDirt,
  mold,
  express,
]); 

  const amountToday =
    payment === "full" ? calculation.fullPaymentPrice : calculation.depositPrice;

  const canCheckout =
    date &&
    firstName &&
    lastName &&
    email &&
    phone &&
    street &&
    zip &&
    city &&
    acceptedTerms &&
    acceptedReview;

  function handlePhotos(files: FileList | null) {
    if (!files) return;
    const uploaded = Array.from(files);
    setPhotos(uploaded);
    setAiDone(false);

    setTimeout(() => {
      setAiDone(true);
    }, 1300);
  }

  function startCheckout() {
    if (!canCheckout) return;

    const params = new URLSearchParams({
      service: selected.name,
      total: String(calculation.totalPrice),
      amount_today: String(amountToday),
      payment,
      date,
      time,
      objectType,
      rooms: String(rooms),
      area: String(area),
      firstName,
      lastName,
      email,
      phone,
      street,
      zip,
      city,
      notes,
    });

    window.location.href = `/api/stripe/booking-checkout?${params.toString()}`;
  }

  return (
    <main className="page">
      <style jsx global>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 12% 6%, rgba(52, 211, 153, 0.22), transparent 32%),
            radial-gradient(circle at 85% 10%, rgba(234, 179, 8, 0.1), transparent 25%),
            linear-gradient(135deg, #020806 0%, #06110d 50%, #020403 100%);
          color: #fff;
          padding: 28px 18px 44px;
          font-family: Arial, sans-serif;
        }

        .wrap {
          max-width: 1320px;
          margin: 0 auto;
        }

        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 32px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          font-weight: 950;
          letter-spacing: 0.08em;
          font-size: 24px;
        }

        .brand-mark {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          display: grid;
          place-items: center;
          box-shadow: 0 0 34px rgba(34, 197, 94, 0.36);
        }

        .brand small {
          display: block;
          color: #cbd5e1;
          font-size: 11px;
          letter-spacing: 0.22em;
          margin-top: 3px;
        }

        .trustbar {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .trust-pill {
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(255,255,255,.055);
          color: #e5e7eb;
          border-radius: 16px;
          padding: 12px 16px;
          font-weight: 850;
          display: flex;
          align-items: center;
          gap: 10px;
          backdrop-filter: blur(12px);
        }

        .hero {
          text-align: center;
          margin: 16px 0 34px;
        }

        .eyebrow {
          display: inline-flex;
          border: 1px solid rgba(110, 231, 183, 0.35);
          background: rgba(16, 185, 129, 0.1);
          color: #6ee7b7;
          border-radius: 999px;
          padding: 10px 20px;
          font-weight: 950;
          letter-spacing: 0.16em;
          margin-bottom: 18px;
        }

        .title {
          font-size: clamp(42px, 6vw, 78px);
          line-height: 0.95;
          letter-spacing: -3px;
          margin: 0 0 18px;
        }

        .subtitle {
          max-width: 860px;
          margin: 0 auto;
          color: #cbd5e1;
          font-size: 20px;
          line-height: 1.55;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          align-items: start;
        }

        .panel,
        .result {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background:
            linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.035));
          border-radius: 28px;
          padding: 26px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
          backdrop-filter: blur(18px);
        }

        .step {
          margin-bottom: 16px;
          padding: 22px;
          border-radius: 22px;
          background: rgba(255,255,255,.035);
          border: 1px solid rgba(255,255,255,.08);
        }

        .step-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .step-no {
          width: 34px;
          height: 34px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #10b981, #047857);
          color: white;
          font-weight: 950;
          box-shadow: 0 0 24px rgba(16,185,129,.35);
        }

        .step h2,
        .step h3 {
          margin: 0;
          font-size: 22px;
        }

        .step-desc {
          color: #94a3b8;
          font-size: 14px;
          margin-top: 4px;
        }

        .service-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .service-card {
          min-height: 118px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(2, 8, 6, 0.5);
          color: white;
          border-radius: 18px;
          padding: 15px;
          cursor: pointer;
          text-align: left;
          transition: 0.2s ease;
        }

        .service-card:hover,
        .service-card.active {
          border-color: rgba(52, 211, 153, 0.8);
          background: rgba(16, 185, 129, 0.13);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.12);
        }

        .service-icon {
          font-size: 26px;
          display: block;
          margin-bottom: 10px;
        }

        .service-card strong {
          display: block;
          font-size: 15px;
          margin-bottom: 5px;
        }

        .service-card span:last-child {
          color: #94a3b8;
          font-size: 12px;
          line-height: 1.35;
        }

        .two,
        .three {
          display: grid;
          gap: 14px;
        }

        .two {
          grid-template-columns: 1fr 1fr;
        }

        .three {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .field {
          margin-bottom: 14px;
        }

        .field label {
          display: block;
          color: #cbd5e1;
          font-weight: 850;
          margin-bottom: 8px;
          font-size: 13px;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(0,0,0,.26);
          color: white;
          padding: 14px 15px;
          border-radius: 13px;
          font-size: 15px;
          outline: none;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: rgba(52,211,153,.75);
          box-shadow: 0 0 0 3px rgba(52,211,153,.12);
        }

        .field textarea {
          min-height: 96px;
          resize: vertical;
        }

        .extras-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .check {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 13px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(0,0,0,.23);
          color: #e5e7eb;
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
        }

        .check input {
          width: 18px;
          height: 18px;
          accent-color: #22c55e;
        }

        .upload-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          gap: 16px;
        }

        .upload-box {
          border: 1.8px dashed rgba(110,231,183,.35);
          background: rgba(16,185,129,.06);
          border-radius: 18px;
          padding: 25px;
          text-align: center;
          color: #cbd5e1;
        }

        .upload-box strong {
          display: block;
          color: white;
          margin-bottom: 6px;
        }

        .upload-box input {
          margin-top: 14px;
          max-width: 100%;
        }

        .ai-box {
          border-radius: 18px;
          padding: 18px;
          background: rgba(0,0,0,.22);
          border: 1px solid rgba(255,255,255,.09);
          color: #bbf7d0;
          line-height: 1.65;
          font-size: 14px;
        }

        .badge {
          display: inline-flex;
          color: #bbf7d0;
          background: rgba(34,197,94,.18);
          border: 1px solid rgba(34,197,94,.35);
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          margin-bottom: 10px;
        }

        .result {
          position: sticky;
          top: 20px;
          background:
            radial-gradient(circle at 70% 0%, rgba(34,197,94,.25), transparent 34%),
            linear-gradient(180deg, rgba(6,78,59,.66), rgba(2,8,6,.88));
          border-color: rgba(52,211,153,.35);
          box-shadow:
            0 30px 100px rgba(0,0,0,.42),
            0 0 50px rgba(16,185,129,.12);
        }

        .result-label {
          color: #d1fae5;
          font-weight: 900;
          font-size: 18px;
          margin-bottom: 12px;
        }

        .price {
          font-size: clamp(50px, 5.8vw, 74px);
          font-weight: 950;
          letter-spacing: -3px;
          color: #bbf7d0;
          margin: 0 0 18px;
          line-height: 0.95;
          text-shadow: 0 0 28px rgba(52,211,153,.24);
        }

        .result-text {
          color: #cbd5e1;
          line-height: 1.55;
          margin-bottom: 22px;
        }

        .summary {
          background: rgba(0,0,0,.25);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 20px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .summary-title {
          font-size: 13px;
          letter-spacing: .08em;
          color: #d1fae5;
          font-weight: 950;
          margin-bottom: 10px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,.08);
          color: #cbd5e1;
        }

        .row:last-child {
          border-bottom: 0;
        }

        .row strong {
          color: white;
          text-align: right;
        }

        .payment {
          display: block;
          padding: 20px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(0,0,0,.25);
          cursor: pointer;
          margin-bottom: 14px;
          transition: 0.2s ease;
        }

        .payment.active {
          border-color: rgba(52,211,153,.9);
          background: rgba(16,185,129,.13);
          box-shadow: 0 0 32px rgba(16,185,129,.12);
        }

        .payment input {
          accent-color: #22c55e;
          margin-right: 10px;
          width: 18px;
          height: 18px;
        }

        .payment strong {
          display: inline-block;
          font-size: 19px;
          color: white;
          margin-bottom: 8px;
        }

        .payment p {
          color: #cbd5e1;
          margin: 2px 0;
          line-height: 1.4;
        }

        .green {
          color: #4ade80;
          font-weight: 950;
        }

        .total {
          background: rgba(34,197,94,.08);
          border-radius: 18px;
          padding: 16px;
          margin: 16px 0;
          border: 1px solid rgba(34,197,94,.18);
        }

        .terms {
          display: flex;
          gap: 10px;
          padding: 13px;
          border-radius: 14px;
          background: rgba(255,255,255,.075);
          border: 1px solid rgba(255,255,255,.08);
          margin-bottom: 10px;
          color: #e5e7eb;
          font-size: 13px;
          line-height: 1.45;
          cursor: pointer;
        }

        .terms input {
          width: 18px;
          height: 18px;
          accent-color: #22c55e;
          flex-shrink: 0;
        }

        .button {
          width: 100%;
          border: 0;
          border-radius: 18px;
          padding: 20px;
          font-size: 18px;
          font-weight: 950;
          color: #052e16;
          background: linear-gradient(135deg, #86efac, #22c55e);
          box-shadow: 0 18px 45px rgba(34,197,94,.25);
          cursor: pointer;
          margin-top: 16px;
        }

        .button:disabled {
          opacity: .45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .note {
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.55;
          margin-top: 16px;
          text-align: center;
        }

        .bottom-trust {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 24px;
        }

        .trust-card {
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.045);
          border-radius: 18px;
          padding: 18px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .trust-card span {
          color: #facc15;
          font-size: 24px;
        }

        .trust-card strong {
          display: block;
          margin-bottom: 4px;
        }

        .trust-card p {
          margin: 0;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.4;
        }

        @media (max-width: 980px) {
          .topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .grid,
          .two,
          .three,
          .upload-grid,
          .bottom-trust {
            grid-template-columns: 1fr;
          }

          .service-grid,
          .extras-grid {
            grid-template-columns: 1fr 1fr;
          }

          .result {
            position: static;
          }
        }

        @media (max-width: 560px) {
          .service-grid,
          .extras-grid {
            grid-template-columns: 1fr;
          }

          .panel,
          .result,
          .step {
            padding: 18px;
          }
        }
      `}</style>

      <div className="wrap">
        <div className="topbar">
          <div className="brand">
            <div className="brand-mark">🔥</div>
            <div>
              AUFTRAGO
              <small>PREISRECHNER</small>
            </div>
          </div>

          <div className="trustbar">
            <div className="trust-pill">🛡️ 100% Abgabegarantie</div>
            <div className="trust-pill">🏷️ Transparente Preise</div>
            <div className="trust-pill">🔒 Sichere Zahlung</div>
          </div>
        </div>

        <section className="hero">
          <div className="eyebrow">ONLINE BUCHUNG</div>
          <h1 className="title">Preis berechnen & Termin reservieren</h1>
          <p className="subtitle">
            Dienstleistung auswählen, Angaben erfassen, Termin reservieren und sicher
            online bezahlen. Jede Buchung wird vor der definitiven Bestätigung geprüft.
          </p>
        </section>

        <div className="grid">
          <section className="panel">
            <div className="step">
              <div className="step-head">
                <div className="step-no">1</div>
                <div>
                  <h2>Dienstleistung wählen</h2>
                  <div className="step-desc">Wählen Sie die gewünschte Dienstleistung.</div>
                </div>
              </div>

              <div className="service-grid">
                {Object.entries(services).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    className={`service-card ${service === key ? "active" : ""}`}
                    onClick={() => setService(key as ServiceKey)}
                  >
                    <span className="service-icon">{item.icon}</span>
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">2</div>
                <div>
                  <h3>Objektangaben</h3>
                  <div className="step-desc">Grunddaten für eine realistische Preisberechnung.</div>
                </div>
              </div>

              <div className="three">
                <div className="field">
                  <label>Objektart</label>
                  <select value={objectType} onChange={(e) => setObjectType(e.target.value)}>
                    <option>Wohnung</option>
                    <option>Haus</option>
                    <option>Büro</option>
                    <option>Gewerbe</option>
                    <option>Neubau</option>
                  </select>
                </div>

                <div className="field">
                  <label>Zimmer</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>Fläche m²</label>
                  <input
                    type="number"
                    min="1"
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="three">
                <div className="field">
                  <label>Badezimmer / Nasszellen</label>
                  <input
                    type="number"
                    min="0"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                  />
                </div>

                <div className="field">
                  <label>Stockwerk</label>
                  <input
                    type="number"
                    min="0"
                    value={floor}
                    onChange={(e) => setFloor(Number(e.target.value))}
                  />
                </div>

                <CheckBox label="Lift vorhanden" checked={lift} onChange={setLift} />
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">3</div>
                <div>
                  <h3>Extras auswählen</h3>
                  <div className="step-desc">Alle Zusatzarbeiten direkt erfassen.</div>
                </div>
              </div>

              <div className="extras-grid">
                <CheckBox label="Balkon / Terrasse" checked={balcony} onChange={setBalcony} />
                <CheckBox label="Keller" checked={cellar} onChange={setCellar} />
                <CheckBox label="Estrich" checked={attic} onChange={setAttic} />
                <CheckBox label="Garage" checked={garage} onChange={setGarage} />
                <CheckBox label="Storen" checked={storen} onChange={setStoren} />
                <CheckBox label="Lamellenstoren" checked={lamellen} onChange={setLamellen} />
                <CheckBox label="Backofen" checked={oven} onChange={setOven} />
                <CheckBox label="Dampfabzug" checked={hood} onChange={setHood} />
                <CheckBox label="Kühlschrank" checked={fridge} onChange={setFridge} />
                <CheckBox label="Waschmaschine" checked={washer} onChange={setWasher} />
                <CheckBox label="Tumbler" checked={dryer} onChange={setDryer} />
                <CheckBox label="Teppichreinigung" checked={carpet} onChange={setCarpet} />
                <CheckBox label="Starke Verschmutzung" checked={heavyDirt} onChange={setHeavyDirt} />
                <CheckBox label="Bauverschmutzung" checked={constructionDirt} onChange={setConstructionDirt} />
                <CheckBox label="Schimmel / Spezial" checked={mold} onChange={setMold} />
                <CheckBox label="Express-Termin" checked={express} onChange={setExpress} />
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">4</div>
                <div>
                  <h3>Fotos hochladen</h3>
                  <div className="step-desc">Optional, aber empfohlen für eine schnelle Prüfung.</div>
                </div>
              </div>

              <div className="upload-grid">
                <div className="upload-box">
                  <strong>Fotos hier hochladen</strong>
                  <p>Wohnung, Küche, Badezimmer, Fenster oder Storen.</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotos(e.target.files)}
                  />
                </div>

                <div className="ai-box">
                  <div className="badge">KI-Prüfung</div>
                  {!photos.length && (
                    <>
                      ✅ Preisvalidierung
                      <br />
                      ✅ Schnellere Bearbeitung
                      <br />
                      ✅ Weniger Rückfragen
                    </>
                  )}
                  {photos.length > 0 && !aiDone && <strong>KI analysiert Ihre Fotos...</strong>}
                  {photos.length > 0 && aiDone && (
                    <>
                      <strong>Analyse abgeschlossen</strong>
                      <br />
                      ✅ {photos.length} Foto(s) erhalten
                      <br />
                      ✅ Prüfung durch Auftrago/Cavara
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">5</div>
                <div>
                  <h3>Kundendaten</h3>
                  <div className="step-desc">Für die Buchungsbestätigung und Rückfragen.</div>
                </div>
              </div>

              <div className="three">
                <div className="field">
                  <label>Vorname</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="field">
                  <label>Nachname</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="field">
                  <label>E-Mail</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>Telefon</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="field">
                <label>Adresse</label>
                <input value={street} onChange={(e) => setStreet(e.target.value)} />
              </div>

              <div className="three">
                <div className="field">
                  <label>PLZ</label>
                  <input value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>

                <div className="field">
                  <label>Ort</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>

                <div className="field">
                  <label>Bemerkungen</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="step">
              <div className="step-head">
                <div className="step-no">6</div>
                <div>
                  <h3>Termin auswählen</h3>
                  <div className="step-desc">Der Termin wird nach Zahlung reserviert.</div>
                </div>
              </div>

              <div className="two">
                <div className="field">
                  <label>Wunschdatum</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div className="field">
                  <label>Uhrzeit</label>
                  <select value={time} onChange={(e) => setTime(e.target.value)}>
                    <option>08:00</option>
                    <option>09:00</option>
                    <option>10:00</option>
                    <option>13:00</option>
                    <option>14:00</option>
                    <option>15:00</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <aside className="result">
            <div className="result-label">Ihr provisorischer Buchungspreis</div>

            <h2 className="price">CHF {formatPrice(calculation.totalPrice)}</h2>

            <p className="result-text">
              Dieser Preis basiert auf Ihren Angaben. Nach der Buchung prüfen wir alles nochmals.
              Falls etwas nicht passt, melden wir uns vor der definitiven Bestätigung.
            </p>

            <div className="summary">
              <div className="summary-title">ÜBERSICHT</div>
              <div className="row">
                <span>Dienstleistung</span>
                <strong>{selected.name}</strong>
              </div>
              <div className="row">
                <span>Objekt</span>
                <strong>{objectType}</strong>
              </div>
              <div className="row">
                <span>Zimmer</span>
                <strong>{rooms}</strong>
              </div>
              <div className="row">
                <span>Fläche</span>
                <strong>{area} m²</strong>
              </div>
              <div className="row">
                <span>Kunde</span>
                <strong>{firstName || lastName ? `${firstName} ${lastName}` : "Noch offen"}</strong>
              </div>
              <div className="row">
                <span>Ort</span>
                <strong>{zip || city ? `${zip} ${city}` : "Noch offen"}</strong>
              </div>
              <div className="row">
                <span>Termin</span>
                <strong>{date ? `${date}, ${time}` : "Noch nicht gewählt"}</strong>
              </div>
            </div>

            <label
              className={`payment ${payment === "deposit" ? "active" : ""}`}
              onClick={() => setPayment("deposit")}
            >
              <input
                type="radio"
                checked={payment === "deposit"}
                onChange={() => setPayment("deposit")}
              />
              <strong>50 % Anzahlung</strong>
              <p>Heute bezahlen: CHF {formatPrice(calculation.depositPrice)}</p>
              <p>Restzahlung am Reinigungstag.</p>
            </label>

            <label
              className={`payment ${payment === "full" ? "active" : ""}`}
              onClick={() => setPayment("full")}
            >
              <input
                type="radio"
                checked={payment === "full"}
                onChange={() => setPayment("full")}
              />
              <strong>100 % Sofortzahlung</strong>
              <p className="green">10 % Rabatt sichern</p>
              <p>Heute bezahlen: CHF {formatPrice(calculation.fullPaymentPrice)}</p>
            </label>

            <div className="total">
              <div className="row">
                <span>Total</span>
                <strong>CHF {formatPrice(calculation.totalPrice)}</strong>
              </div>
              <div className="row">
                <span>Heute bezahlen</span>
                <strong>CHF {formatPrice(amountToday)}</strong>
              </div>
              {payment === "deposit" && (
                <div className="row">
                  <span>Restzahlung am Reinigungstag</span>
                  <strong>
                    CHF {formatPrice(calculation.totalPrice - calculation.depositPrice)}
                  </strong>
                </div>
              )}
            </div>

            <label className="terms">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              Ich akzeptiere die AGB und Zahlungsbedingungen.
            </label>

            <label className="terms">
              <input
                type="checkbox"
                checked={acceptedReview}
                onChange={(e) => setAcceptedReview(e.target.checked)}
              />
              Ich bin damit einverstanden, dass Auftrago meine Buchung nach Eingang nochmals prüft und den endgültigen Preis sowie den Termin vor der Bestätigung freigibt.
            </label>

            <button className="button" disabled={!canCheckout} onClick={startCheckout}>
              🔒 Jetzt Termin reservieren & bezahlen
            </button>

            <p className="note">
              Sichere Zahlung via Stripe. Ohne Ihre Zustimmung entstehen keine Zusatzkosten.
            </p>
          </aside>
        </div>

        <div className="bottom-trust">
          <div className="trust-card">
            <span>🛡️</span>
            <div>
              <strong>100% Abgabegarantie</strong>
              <p>Ideal für Umzugsreinigungen und Übergaben.</p>
            </div>
          </div>

          <div className="trust-card">
            <span>👥</span>
            <div>
              <strong>Geprüfte Anbieter</strong>
              <p>Aufträge werden professionell geprüft und bearbeitet.</p>
            </div>
          </div>

          <div className="trust-card">
            <span>📅</span>
            <div>
              <strong>Schnelle Terminvergabe</strong>
              <p>Reservierung direkt online möglich.</p>
            </div>
          </div>

          <div className="trust-card">
            <span>🔒</span>
            <div>
              <strong>Sichere Zahlung</strong>
              <p>Bezahlung über Stripe mit Anzahlung oder Sofortzahlung.</p>
            </div>
          </div>
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
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}