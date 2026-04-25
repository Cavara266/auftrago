"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    number: "01",
    title: "Firma anlegen",
    text: "Registriere dein Unternehmen mit Region, Kategorien und deinen wichtigsten Leistungen.",
  },
  {
    number: "02",
    title: "Anfrage prüfen",
    text: "Wir prüfen deine Angaben und schauen, ob dein Angebot zu Auftrago passt.",
  },
  {
    number: "03",
    title: "Freischaltung erhalten",
    text: "Wenn alles passt, kontaktieren wir dich und erklären dir die nächsten Schritte.",
  },
];

const benefits = [
  {
    icon: "📍",
    title: "Regionale Kundenanfragen",
    text: "Du erhältst Anfragen aus deinem Einsatzgebiet.",
  },
  {
    icon: "💸",
    title: "Keine teure Werbung nötig",
    text: "Weniger Streuverlust als klassische Werbung.",
  },
  {
    icon: "🎯",
    title: "Passende Leads",
    text: "Anfragen nach Kategorie, Region und Bedarf.",
  },
  {
    icon: "🧹",
    title: "Ideal für lokale Services",
    text: "Für Reinigung, Hauswartung, Umzug und mehr.",
  },
  {
    icon: "✅",
    title: "Volle Kontrolle",
    text: "Du entscheidest später, welche Leads interessant sind.",
  },
  {
    icon: "⭐",
    title: "Professioneller Auftritt",
    text: "Deine Firma wirkt seriös und hochwertig.",
  },
];

const categories = [
  { icon: "🏢", title: "Hauswartung" },
  { icon: "🧼", title: "Büroreinigung" },
  { icon: "🪜", title: "Treppenhausreinigung" },
  { icon: "✨", title: "Umzugsreinigung" },
  { icon: "🌿", title: "Gartenpflege" },
  { icon: "📦", title: "Umzug" },
  { icon: "🚚", title: "Transport" },
  { icon: "♻️", title: "Entsorgung" },
];

export default function AnbieterPage() {
  const [form, setForm] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    website: "",
    region: "",
    services: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/anbieter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Anfrage konnte nicht gesendet werden.");
      }

      setSuccess(
        "✅ Deine Anbieter-Anfrage wurde erfolgreich gesendet. Wir melden uns bei dir."
      );

      setForm({
        company: "",
        contact: "",
        email: "",
        phone: "",
        website: "",
        region: "",
        services: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "❌ Anbieter-Anfrage konnte nicht gesendet werden."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="provider-page-hero">
        <div className="container provider-page-hero-grid">
          <div className="provider-page-copy">
            <span className="eyebrow">Für Anbieter</span>

            <h1>
              Registriere deine Firma.
              <br />
              Gewinne passende Leads.
            </h1>

            <p>
              Werde Teil des Auftrago-Netzwerks und erhalte neue Anfragen von
              Kunden, die aktiv nach regionalen Dienstleistern suchen. Deine
              Anfrage wird zuerst geprüft und direkt an uns gesendet.
            </p>

            <div className="hero-actions">
              <a href="#anbieter-formular" className="btn btn-primary">
                Anbieter-Anfrage senden
              </a>

              <Link href="/preise" className="btn btn-secondary">
                Preise ansehen
              </Link>
            </div>
          </div>

          <div className="provider-dashboard-card">
            <div className="provider-dashboard-top">
              <span>Lead-System</span>
              <strong>Manuelle Prüfung</strong>
            </div>

            <h2>Mehr Anfragen. Weniger Streuverlust.</h2>

            <div className="provider-dashboard-list">
              <div>
                <span>01</span>
                <strong>Region passend</strong>
                <p>Anfragen aus deinem Gebiet.</p>
              </div>

              <div>
                <span>02</span>
                <strong>Kategorie passend</strong>
                <p>Nur Leads, die zu deinen Leistungen passen.</p>
              </div>

              <div>
                <span>03</span>
                <strong>Kontrolliert starten</strong>
                <p>Du wirst nicht automatisch freigeschaltet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="provider-metrics">
        <div className="container provider-metrics-grid">
          <article>
            <span>📍</span>
            <strong>Regional</strong>
            <p>Anfragen aus deiner Umgebung.</p>
          </article>

          <article>
            <span>⚡</span>
            <strong>Schnell</strong>
            <p>Neue Leads ohne lange Akquise.</p>
          </article>

          <article>
            <span>🎯</span>
            <strong>Passend</strong>
            <p>Leads nach Kategorie und Bedarf.</p>
          </article>

          <article>
            <span>💼</span>
            <strong>Professionell</strong>
            <p>Seriöser Auftritt für dein Unternehmen.</p>
          </article>
        </div>
      </section>

      <section className="section provider-steps-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">So funktioniert es</span>

            <h2>
              Vom Anbieterprofil
              <br />
              zur echten Anfrage.
            </h2>
          </div>

          <div className="provider-step-grid">
            {steps.map((step) => (
              <article className="provider-step-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section provider-benefits-premium">
        <div className="container provider-benefits-premium-grid">
          <div>
            <span className="eyebrow">Warum Anbieter mitmachen</span>

            <h2>
              Mehr relevante Leads.
              <br />
              Weniger Aufwand.
            </h2>

            <p>
              Auftrago ist für Dienstleister gebaut, die nicht einfach mehr
              Sichtbarkeit wollen, sondern bessere, klarere und regionale
              Anfragen.
            </p>
          </div>

          <div className="provider-benefit-cards">
            {benefits.map((benefit) => (
              <article key={benefit.title}>
                <span>{benefit.icon}</span>

                <div>
                  <strong>{benefit.title}</strong>
                  <p>{benefit.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section provider-category-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Kategorien</span>

            <h2>
              Für starke lokale
              <br />
              Dienstleistungen.
            </h2>
          </div>

          <div className="provider-category-grid">
            {categories.map((category) => (
              <article key={category.title}>
                <span>{category.icon}</span>
                <strong>{category.title}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="anbieter-formular"
        className="section provider-register-section"
      >
        <div className="container provider-register-grid">
          <div>
            <span className="eyebrow">Anbieter-Anfrage</span>

            <h2>
              Firma eintragen.
              <br />
              Anfrage senden.
            </h2>

            <p>
              Sende uns deine Firmendaten. Wir prüfen deine Anfrage manuell und
              melden uns bei dir, sobald dein Anbieterprofil bereit ist.
            </p>
          </div>

          <form className="provider-register-form" onSubmit={submitForm}>
            <label>
              <span>Firmenname *</span>
              <input
                name="company"
                value={form.company}
                onChange={updateField}
                placeholder="z. B. Cavara Reinigung GmbH"
                required
              />
            </label>

            <label>
              <span>Ansprechpartner *</span>
              <input
                name="contact"
                value={form.contact}
                onChange={updateField}
                placeholder="Vorname / Name"
                required
              />
            </label>

            <div className="provider-form-row">
              <label>
                <span>E-Mail *</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="name@email.ch"
                  required
                />
              </label>

              <label>
                <span>Telefon *</span>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="+41 ..."
                  required
                />
              </label>
            </div>

            <label>
              <span>Website</span>
              <input
                name="website"
                value={form.website}
                onChange={updateField}
                placeholder="https://deinefirma.ch"
              />
            </label>

            <label>
              <span>Region *</span>
              <input
                name="region"
                value={form.region}
                onChange={updateField}
                placeholder="z. B. Zürich, Aargau, Baden"
                required
              />
            </label>

            <label>
              <span>Dienstleistungen *</span>
              <textarea
                name="services"
                value={form.services}
                onChange={updateField}
                placeholder="Welche Leistungen bietet deine Firma an? Zum Beispiel: Hauswartung, Büroreinigung, Gartenpflege..."
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Wird gesendet..." : "Anbieter-Anfrage senden"}
            </button>

            {success && <p className="form-success">{success}</p>}
            {error && <p className="form-error">{error}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}