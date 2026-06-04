"use client";

import { useState } from "react";

export default function AnfragePage() {
  const [status, setStatus] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    const form = e.target;

    const data = {
      firma: form.firma.value,
      stadt: form.stadt.value,
      telefon: form.telefon.value,
      email: form.email.value,
      leistung: form.leistung.value,
      objekt: form.objekt.value,
      start: form.start.value,
      haeufigkeit: form.haeufigkeit.value,
      beschreibung: form.beschreibung.value,
    };

    const res = await fetch("/api/anfrage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.success) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="request-page">
      <div className="container">
        <h1>Anfrage senden</h1>

        <form className="request-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input name="firma" placeholder="Firma *" required />
            <input name="stadt" placeholder="Ort *" required />
          </div>

          <div className="form-row">
            <input name="telefon" placeholder="Telefon *" required />
            <input name="email" type="email" placeholder="E-Mail *" required />
          </div>

          <div className="form-row">
            <select name="leistung">
              <option>Hauswartung</option>
              <option>Reinigung</option>
              <option>Gartenpflege</option>
            </select>

            <select name="objekt">
              <option>Mehrfamilienhaus</option>
              <option>Einfamilienhaus</option>
              <option>Büro</option>
            </select>
          </div>

          <div className="form-row">
            <select name="start">
              <option>So bald wie möglich</option>
              <option>Diese Woche</option>
              <option>Nach Vereinbarung</option>
            </select>

            <select name="haeufigkeit">
              <option>Einmalig</option>
              <option>Wöchentlich</option>
              <option>Monatlich</option>
            </select>
          </div>

          <textarea
            name="beschreibung"
            placeholder="Beschreibe deinen Auftrag..."
            required
          />

          <button type="submit">Anfrage senden</button>

          {status === "success" && (
            <p style={{ color: "lightgreen" }}>
              Anfrage erfolgreich gesendet ✅
            </p>
          )}

          {status === "error" && (
            <p style={{ color: "red" }}>
              Fehler beim Senden ❌
            </p>
          )}
        </form>
      </div>
    </main>
  );
}