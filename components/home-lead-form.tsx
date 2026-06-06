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
      email: String(formData.get("email") || "").trim(),

      salutation: String(formData.get("salutation") || "").trim(),
      street: String(formData.get("street") || "").trim(),
      postalCode: String(formData.get("postalCode") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      region: String(formData.get("region") || "").trim(),

      service: String(formData.get("service") || "").trim(),
      start: String(formData.get("start") || "").trim(),
      flexibleDate: String(formData.get("flexibleDate") || "").trim(),
      viewingWanted: String(formData.get("viewingWanted") || "").trim(),
      phoneAvailability: String(formData.get("phoneAvailability") || "").trim(),

      objectType: String(formData.get("objectType") || "").trim(),
      propertyType: String(formData.get("propertyType") || "").trim(),
      floor: String(formData.get("floor") || "").trim(),
      elevator: String(formData.get("elevator") || "").trim(),
      parking: String(formData.get("parking") || "").trim(),

      rooms: String(formData.get("rooms") || "").trim(),
      area: String(formData.get("area") || "").trim(),
      windows: String(formData.get("windows") || "").trim(),
      windowSize: String(formData.get("windowSize") || "").trim(),
      blinds: String(formData.get("blinds") || "").trim(),
      shutters: String(formData.get("shutters") || "").trim(),

      handoverGuarantee: String(formData.get("handoverGuarantee") || "").trim(),
      cellar: String(formData.get("cellar") || "").trim(),
      balcony: String(formData.get("balcony") || "").trim(),
      carpetCleaning: String(formData.get("carpetCleaning") || "").trim(),

      budget: String(formData.get("budget") || "").trim(),
      offersWanted: String(formData.get("offersWanted") || "").trim(),
      important: String(formData.get("important") || "").trim(),

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
          Danke. Wir prüfen deine Anfrage und leiten sie an passende regionale
          Anbieter weiter.
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
          Je genauer deine Angaben sind, desto schneller können Anbieter eine
          passende Offerte erstellen.
        </p>
      </div>

      <div className="premium-form-section">
        <h4>Kontaktangaben</h4>

        <div className="premium-form-grid">
          <label>
            <span>Anrede</span>
            <select name="salutation" required defaultValue="">
              <option value="" disabled>
                Bitte wählen
              </option>
              <option>Herr</option>
              <option>Frau</option>
              <option>Firma</option>
            </select>
          </label>

          <label>
            <span>Name</span>
            <input name="name" placeholder="Max Muster" required />
          </label>

          <label>
            <span>Telefon</span>
            <input name="phone" placeholder="079 123 45 67" required />
          </label>

          <label>
            <span>Erreichbarkeit</span>
            <select name="phoneAvailability" required defaultValue="">
              <option value="" disabled>
                Bitte wählen
              </option>
              <option>Jederzeit</option>
              <option>Bürozeiten</option>
              <option>Abends</option>
              <option>Nur per E-Mail</option>
            </select>
          </label>

          <label>
            <span>E-Mail</span>
            <input
              name="email"
              type="email"
              placeholder="name@email.ch"
              required
            />
          </label>

          <label>
            <span>Strasse / Nr.</span>
            <input name="street" placeholder="Bahnhofstrasse 1" required />
          </label>

          <label>
            <span>PLZ</span>
            <input name="postalCode" placeholder="8000" required />
          </label>

          <label>
            <span>Ort</span>
            <input name="city" placeholder="Zürich" required />
          </label>

          <label>
            <span>Region / Kanton</span>
            <select name="region" required defaultValue="">
              <option value="" disabled>
                Region auswählen
              </option>
              <option>Zürich</option>
              <option>Aargau</option>
              <option>Bern</option>
              <option>Basel</option>
              <option>Luzern</option>
              <option>Zug</option>
              <option>Solothurn</option>
              <option>St. Gallen</option>
              <option>Schweiz</option>
            </select>
          </label>
        </div>
      </div>

      <div className="premium-form-section">
        <h4>Auftrag</h4>

        <div className="premium-form-grid">
          <label>
            <span>Dienstleistung</span>
            <select name="service" required defaultValue="">
              <option value="" disabled>
                Dienstleistung wählen
              </option>
              <option>Hauswartung</option>
              <option>Reinigung</option>
              <option>Umzugsreinigung</option>
              <option>Fensterreinigung</option>
              <option>Gartenpflege</option>
              <option>Entsorgung</option>
              <option>Transport</option>
              <option>Malerarbeiten</option>
              <option>Sanitär</option>
              <option>Elektriker</option>
            </select>
          </label>

          <label>
            <span>Gewünschter Start / Datum</span>
            <input name="start" type="date" required />
          </label>

          <label>
            <span>Flexibles Datum?</span>
            <select name="flexibleDate" required defaultValue="">
              <option value="" disabled>
                Bitte wählen
              </option>
              <option>Ja</option>
              <option>Nein</option>
            </select>
          </label>

          <label>
            <span>Besichtigung erwünscht?</span>
            <select name="viewingWanted" required defaultValue="">
              <option value="" disabled>
                Bitte wählen
              </option>
              <option>Ja</option>
              <option>Nein</option>
              <option>Nach Absprache</option>
            </select>
          </label>

          <label>
            <span>Objekt</span>
            <select name="objectType" required defaultValue="">
              <option value="" disabled>
                Bitte wählen
              </option>
              <option>Privat</option>
              <option>Gewerbe</option>
              <option>Mehrfamilienhaus</option>
              <option>Büro</option>
              <option>Liegenschaft</option>
            </select>
          </label>

          <label>
            <span>Objektart</span>
            <select name="propertyType" required defaultValue="">
              <option value="" disabled>
                Bitte wählen
              </option>
              <option>Wohnung</option>
              <option>Einfamilienhaus</option>
              <option>Mehrfamilienhaus</option>
              <option>Büro / Praxis</option>
              <option>Ladenlokal</option>
              <option>Baustelle</option>
              <option>Andere</option>
            </select>
          </label>
        </div>
      </div>

      <div className="premium-form-section">
        <h4>Objektdetails</h4>

        <div className="premium-form-grid">
          <label>
            <span>Wohnfläche / Fläche m²</span>
            <input name="area" placeholder="z.B. 75 m²" />
          </label>

          <label>
            <span>Anzahl Zimmer</span>
            <select name="rooms" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>1 Zimmer</option>
              <option>1.5 Zimmer</option>
              <option>2 Zimmer</option>
              <option>2.5 Zimmer</option>
              <option>3 Zimmer</option>
              <option>3.5 Zimmer</option>
              <option>4 Zimmer</option>
              <option>4.5 Zimmer</option>
              <option>5+ Zimmer</option>
            </select>
          </label>

          <label>
            <span>Etage</span>
            <input name="floor" placeholder="z.B. 2. Stock" />
          </label>

          <label>
            <span>Lift vorhanden?</span>
            <select name="elevator" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
            </select>
          </label>

          <label>
            <span>Parkplatz vorhanden?</span>
            <select name="parking" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
              <option>Unklar</option>
            </select>
          </label>

          <label>
            <span>Abgabegarantie gewünscht?</span>
            <select name="handoverGuarantee" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
              <option>Nicht relevant</option>
            </select>
          </label>

          <label>
            <span>Keller vorhanden?</span>
            <select name="cellar" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
            </select>
          </label>

          <label>
            <span>Balkon vorhanden?</span>
            <select name="balcony" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
            </select>
          </label>
        </div>
      </div>

      <div className="premium-form-section">
        <h4>Fenster / Spezialdetails</h4>

        <div className="premium-form-grid">
          <label>
            <span>Anzahl Fenster</span>
            <select name="windows" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>1 - 5</option>
              <option>6 - 10</option>
              <option>11 - 15</option>
              <option>16 - 25</option>
              <option>25+</option>
              <option>Nicht relevant</option>
            </select>
          </label>

          <label>
            <span>Fenstergrösse</span>
            <select name="windowSize" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Klein</option>
              <option>Normal</option>
              <option>Gross</option>
              <option>Bodenhohe Fenster</option>
              <option>Nicht relevant</option>
            </select>
          </label>

          <label>
            <span>Lamellenstoren?</span>
            <select name="blinds" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
              <option>Teilweise</option>
            </select>
          </label>

          <label>
            <span>Fensterläden?</span>
            <select name="shutters" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
              <option>Teilweise</option>
            </select>
          </label>

          <label>
            <span>Teppichreinigung?</span>
            <select name="carpetCleaning" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
              <option>Teilweise</option>
              <option>Nicht relevant</option>
            </select>
          </label>

          <label>
            <span>Budget / Preisvorstellung</span>
            <input name="budget" placeholder="z.B. CHF 500 - 800" />
          </label>

          <label>
            <span>Anzahl gewünschte Angebote</span>
            <select name="offersWanted" defaultValue="3 Angebote">
              <option>1 Angebot</option>
              <option>2 Angebote</option>
              <option>3 Angebote</option>
              <option>4 Angebote</option>
              <option>5 Angebote</option>
            </select>
          </label>

          <label>
            <span>Was ist dir wichtig?</span>
            <select name="important" defaultValue="">
              <option value="">Bitte wählen</option>
              <option>Preis</option>
              <option>Qualität</option>
              <option>Regionalität</option>
              <option>Schnelligkeit</option>
              <option>Preis und Qualität</option>
              <option>Qualität und Regionalität</option>
            </select>
          </label>
        </div>
      </div>

      <label className="premium-textarea">
        <span>Auftrag genau beschreiben</span>
        <textarea
          name="message"
          placeholder="Beschreibe bitte möglichst genau, was gemacht werden soll. Beispiel: Umzugsreinigung 3.5 Zimmer Wohnung, 75 m², 2 Badezimmer, Küche, Fenster, Balkon, Keller, Abgabe am Montag um 10:00 Uhr."
          required
        />
      </label>

      <label className="premium-check">
        <input type="checkbox" required />
        <span>
          Ich stimme zu, dass meine Angaben zur Bearbeitung der Anfrage
          verwendet und an passende Anbieter weitergeleitet werden.
        </span>
      </label>

      {error ? <div className="premium-form-error">{error}</div> : null}

      <button className="premium-submit" type="submit" disabled={loading}>
        {loading ? "Wird gesendet..." : "Kostenlose Anfrage senden →"}
      </button>

      <div className="premium-form-trust">
        <span>✓ Kostenlos</span>
        <span>✓ Unverbindlich</span>
        <span>✓ Präzise Anfrage</span>
      </div>
    </form>
  );
}