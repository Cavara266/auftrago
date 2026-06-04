"use client";

import { useState } from "react";

export default function HomeLeadForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="premium-form-success">
        <div>✓</div>
        <h3>Anfrage erhalten</h3>
        <p>Danke. Wir prüfen deine Anfrage und melden uns schnellstmöglich bei dir.</p>
      </div>
    );
  }

  return (
    <form
      className="premium-lead-form"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="premium-form-head">
        <span>Live Anfrage</span>
        <h3>Passende Offerte finden</h3>
        <p>
          Beschreibe deinen Auftrag kurz. Wir verbinden dich kostenlos mit passenden regionalen Anbietern.
        </p>
      </div>

      <div className="premium-form-grid">
        <label>
          <span>Name</span>
          <input placeholder="Max Muster" required />
        </label>

        <label>
          <span>Telefon</span>
          <input placeholder="079 123 45 67" required />
        </label>

        <label>
          <span>Ort / Region</span>
          <input placeholder="Zürich" required />
        </label>

        <label>
          <span>E-Mail</span>
          <input type="email" placeholder="name@email.ch" required />
        </label>

        <label>
          <span>Dienstleistung</span>
          <select required>
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
          <select required>
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
          placeholder="z.B. Treppenhausreinigung für ein Mehrfamilienhaus in Zürich. Bitte mit Häufigkeit, Objektgrösse und gewünschtem Start."
          required
        />
      </label>

      <label className="premium-check">
        <input type="checkbox" required />
        <span>Ich stimme zu, dass meine Angaben zur Bearbeitung der Anfrage verwendet werden.</span>
      </label>

      <button className="premium-submit" type="submit">
        Anfrage starten →
      </button>

      <div className="premium-form-trust">
        <span>✓ Kostenlos</span>
        <span>✓ Unverbindlich</span>
        <span>✓ Regional</span>
      </div>
    </form>
  );
}