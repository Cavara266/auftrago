import Link from "next/link";
import { Metadata } from "next";
import OfferteAnfrageForm from "@/components/offerte-anfrage-form";

export const metadata: Metadata = {
  title: "Kostenlose Offerte anfragen | Regionale Anbieter vergleichen",
  description:
    "Kostenlos und unverbindlich Offerten für Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung, Transport und weitere Dienstleistungen in der Schweiz anfragen.",
  alternates: {
    canonical: "https://www.auftrago.ch/offerte-anfragen",
  },
  openGraph: {
    title: "Kostenlose Offerte anfragen | Auftrago",
    description:
      "Beschreibe deinen Auftrag und vergleiche regionale Anbieter für Reinigung, Umzug, Hauswartung, Gartenpflege und mehr.",
    url: "https://www.auftrago.ch/offerte-anfragen",
    siteName: "Auftrago",
    type: "website",
  },
};

const popularServices = [
  {
    title: "Reinigung",
    text: "Wohnungsreinigung, Büroreinigung, Unterhaltsreinigung und Spezialreinigung.",
    href: "/reinigung-zuerich",
  },
  {
    title: "Umzugsreinigung",
    text: "Endreinigung, Wohnungsabgabe, Küche, Bad, Fenster und Abgabegarantie.",
    href: "/umzugsreinigung-zuerich",
  },
  {
    title: "Hauswartung",
    text: "Liegenschaftsunterhalt, Treppenhausreinigung, Kontrolle und Betreuung.",
    href: "/hauswartung-zuerich",
  },
  {
    title: "Gartenpflege",
    text: "Rasenpflege, Heckenschnitt, Laubarbeiten und saisonaler Gartenunterhalt.",
    href: "/gartenpflege-zuerich",
  },
  {
    title: "Umzug & Transport",
    text: "Privatumzug, Möbeltransport, Kleintransport und Transporthilfe.",
    href: "/umzug-zuerich",
  },
  {
    title: "Entsorgung",
    text: "Räumung, Sperrgut, Keller, Estrich und fachgerechte Entsorgung.",
    href: "/entsorgung-zuerich",
  },
];

const steps = [
  {
    number: "01",
    title: "Anfrage ausfüllen",
    text: "Du beschreibst kurz deinen Auftrag, Ort, Termin und die wichtigsten Details.",
  },
  {
    number: "02",
    title: "Anbieter prüfen",
    text: "Regionale Firmen können einschätzen, ob dein Auftrag zu ihnen passt.",
  },
  {
    number: "03",
    title: "Offerten vergleichen",
    text: "Du vergleichst Rückmeldungen, Preise und Leistungen in Ruhe.",
  },
];

const benefits = [
  "Kostenlose Anfrage senden",
  "Regionale Anbieter erreichen",
  "Zeit bei der Suche sparen",
  "Offerten besser vergleichen",
  "Für Privatkunden und Firmen",
  "Keine Verpflichtung nach der Anfrage",
];

const regions = [
  "Zürich",
  "Aargau",
  "Bern",
  "Basel",
  "Luzern",
  "Zug",
  "St. Gallen",
  "Schaffhausen",
  "Thurgau",
];

const faqs = [
  {
    question: "Ist die Anfrage über Auftrago kostenlos?",
    answer:
      "Ja. Die Anfrage ist kostenlos und unverbindlich. Du entscheidest selbst, ob du ein Angebot annehmen möchtest.",
  },
  {
    question: "Welche Dienstleistungen kann ich anfragen?",
    answer:
      "Du kannst Anfragen für Reinigung, Umzugsreinigung, Hauswartung, Gartenpflege, Umzug, Transport, Entsorgung, Malerarbeiten, Elektriker, Sanitär und weitere Dienstleistungen senden.",
  },
  {
    question: "Wie schnell bekomme ich eine Rückmeldung?",
    answer:
      "Das hängt von Region, Auftrag und Verfügbarkeit der Anbieter ab. Eine genaue Beschreibung erhöht die Chance auf schnelle und passende Rückmeldungen.",
  },
  {
    question: "Muss ich ein Angebot annehmen?",
    answer:
      "Nein. Deine Anfrage ist unverbindlich. Du vergleichst selbst und entscheidest, ob ein Anbieter zu deinem Auftrag passt.",
  },
];

export default function OfferteAnfragenPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="quote-page" id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="quote-hero">
        <div className="container quote-hero-grid">
          <div className="quote-copy">
            <span className="quote-pill">Kostenlos & unverbindlich</span>

            <h1>
              Die passende Firma
              <br />
              für deinen Auftrag.
            </h1>

            <p>
              Beschreibe kurz, was du brauchst. Auftrago hilft dir, regionale
              Anbieter für Reinigung, Umzug, Hauswartung, Gartenpflege,
              Transport oder Entsorgung einfacher zu vergleichen.
            </p>

            <div className="quote-trust">
              {steps.map((step) => (
                <div key={step.number}>
                  <strong>{step.number}</strong>
                  <span>{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          <OfferteAnfrageForm />
        </div>
      </section>

      <section className="quote-section">
        <div className="container quote-section-head">
          <span className="quote-pill">Dienstleistungen</span>
          <h2>Für viele Aufträge geeignet</h2>
          <p>
            Ob einmaliger Auftrag, regelmässige Arbeit oder kurzfristige
            Anfrage: Über Auftrago kannst du passende regionale Anbieter
            einfacher finden.
          </p>
        </div>

        <div className="container quote-service-grid">
          {popularServices.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="quote-service-card"
            >
              <span>{service.title}</span>
              <p>{service.text}</p>
              <strong>Mehr erfahren →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="quote-section quote-dark">
        <div className="container quote-split">
          <div>
            <span className="quote-pill">Ablauf</span>
            <h2>So funktioniert deine Anfrage</h2>
            <p>
              Statt viele Firmen einzeln zu suchen, sendest du eine klare
              Anfrage. Dadurch können Anbieter schneller einschätzen, ob sie für
              deinen Auftrag passen.
            </p>
          </div>

          <div className="quote-step-list">
            {steps.map((step) => (
              <div key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="container quote-split">
          <div>
            <span className="quote-pill">Vorteile</span>
            <h2>Warum über Auftrago anfragen?</h2>
            <p>
              Auftrago macht die Suche nach Dienstleistern einfacher. Du
              beschreibst deinen Auftrag einmal und erhältst eine bessere
              Grundlage für den Vergleich.
            </p>
          </div>

          <div className="quote-benefit-grid">
            {benefits.map((benefit) => (
              <div key={benefit}>
                <span>✓</span>
                <strong>{benefit}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section quote-dark">
        <div className="container quote-section-head">
          <span className="quote-pill">Regionen</span>
          <h2>Offerten in deiner Region anfragen</h2>
          <p>
            Starte deine Anfrage in der Schweiz und finde regionale Anbieter aus
            deiner Umgebung.
          </p>
        </div>

        <div className="container quote-region-grid">
          {regions.map((region) => (
            <Link key={region} href="/offerte-anfragen">
              {region}
            </Link>
          ))}
        </div>
      </section>

      <section className="quote-section">
        <div className="container quote-faq-grid">
          <div>
            <span className="quote-pill">FAQ</span>
            <h2>Häufige Fragen zur Offertenanfrage</h2>
          </div>

          <div className="quote-faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-final">
        <div className="container">
          <span className="quote-pill">Jetzt starten</span>
          <h2>Bereit für deine Offerte?</h2>
          <p>
            Beschreibe deinen Auftrag und finde passende regionale Anbieter.
          </p>
          <a href="#top" className="btn btn-primary">
            Anfrage ausfüllen
          </a>
        </div>
      </section>
    </main>
  );
}