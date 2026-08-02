"use client";

import { useEffect, useState } from "react";

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

type TrackingData = {
  landingPage: string;
  currentPage: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  gclid: string;
  fbclid: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function getTrackingData(): TrackingData {
  if (typeof window === "undefined") {
    return {
      landingPage: "",
      currentPage: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      gclid: "",
      fbclid: "",
    };
  }

  const url = new URL(window.location.href);
  const params = url.searchParams;

  const existingLandingPage = sessionStorage.getItem("auftrago_landing_page");
  const landingPage = existingLandingPage || window.location.href;

  if (!existingLandingPage) {
    sessionStorage.setItem("auftrago_landing_page", landingPage);
  }

  const tracking: TrackingData = {
    landingPage,
    currentPage: window.location.href,
    utmSource:
      params.get("utm_source") ||
      sessionStorage.getItem("auftrago_utm_source") ||
      "",
    utmMedium:
      params.get("utm_medium") ||
      sessionStorage.getItem("auftrago_utm_medium") ||
      "",
    utmCampaign:
      params.get("utm_campaign") ||
      sessionStorage.getItem("auftrago_utm_campaign") ||
      "",
    utmTerm:
      params.get("utm_term") ||
      sessionStorage.getItem("auftrago_utm_term") ||
      "",
    utmContent:
      params.get("utm_content") ||
      sessionStorage.getItem("auftrago_utm_content") ||
      "",
    gclid:
      params.get("gclid") || sessionStorage.getItem("auftrago_gclid") || "",
    fbclid:
      params.get("fbclid") || sessionStorage.getItem("auftrago_fbclid") || "",
  };

  sessionStorage.setItem("auftrago_utm_source", tracking.utmSource);
  sessionStorage.setItem("auftrago_utm_medium", tracking.utmMedium);
  sessionStorage.setItem("auftrago_utm_campaign", tracking.utmCampaign);
  sessionStorage.setItem("auftrago_utm_term", tracking.utmTerm);
  sessionStorage.setItem("auftrago_utm_content", tracking.utmContent);
  sessionStorage.setItem("auftrago_gclid", tracking.gclid);
  sessionStorage.setItem("auftrago_fbclid", tracking.fbclid);

  return tracking;
}

export default function OfferteAnfrageForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState<TrackingData>({
    landingPage: "",
    currentPage: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
    gclid: "",
    fbclid: "",
  });

  useEffect(() => {
    setTracking(getTrackingData());
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSending(true);
    setError("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const latestTracking = getTrackingData();

    const postalCode = String(fd.get("postalCode") || "").trim();
    const city = String(fd.get("city") || "").trim();
    const service = String(fd.get("service") || "").trim();

    const payload = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      email: String(fd.get("email") || "").trim(),

      salutation: "Nicht angegeben",
      street: "Nicht angegeben",
      postalCode,
      city,
      region: city || postalCode || "Nicht angegeben",

      service,
      start: String(fd.get("start") || "Nach Absprache").trim(),
      flexibleDate: "Nach Absprache",
      viewingWanted: "Nach Absprache",
      phoneAvailability: "Nach Absprache",

      objectType: String(fd.get("objectType") || "Nicht angegeben").trim(),
      propertyType: "Nicht angegeben",
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

      message: String(fd.get("message") || "").trim(),

      landingPage: latestTracking.landingPage,
      currentPage: latestTracking.currentPage,
      utmSource: latestTracking.utmSource,
      utmMedium: latestTracking.utmMedium,
      utmCampaign: latestTracking.utmCampaign,
      utmTerm: latestTracking.utmTerm,
      utmContent: latestTracking.utmContent,
      gclid: latestTracking.gclid,
      fbclid: latestTracking.fbclid,
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
          city: payload.city,
          landing_page: payload.landingPage,
          current_page: payload.currentPage,
          utm_source: payload.utmSource,
          utm_medium: payload.utmMedium,
          utm_campaign: payload.utmCampaign,
          value: 1,
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
            Deine Anfrage wurde erfolgreich übermittelt. Passende Anbieter
            können sich direkt bei dir melden.
          </p>

          <div className="quote-mini-trust">
            <span>✓ Anfrage gespeichert</span>
            <span>✓ Kostenlos</span>
            <span>✓ Unverbindlich</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="quote-form-head">
        <span>🚀 Kostenlos & unverbindlich</span>

        <h2>Kostenlose Offerten erhalten</h2>

        <p>
          Beschreibe deinen Auftrag in weniger als 60 Sekunden und erhalte
          passende Angebote von regionalen Anbietern.
        </p>

        <div className="quote-mini-trust">
          <span>✓ Kostenlos</span>
          <span>✓ Unverbindlich</span>
          <span>✓ Regionale Anbieter</span>
        </div>
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
        <input name="postalCode" placeholder="PLZ *" required />
        <input name="city" placeholder="Ort *" required />
      </div>

      <div className="quote-form-row">
        <input
          name="objectType"
          placeholder="Objekt z.B. Wohnung, Haus, Büro"
        />
        <input name="start" placeholder="Gewünschter Termin" />
      </div>

      <textarea
        name="message"
        placeholder="Beschreibe kurz deinen Auftrag: Was soll gemacht werden? Wie gross ist das Objekt? Gibt es Besonderheiten?"
        required
      />

      <div className="quote-form-row">
        <input name="name" placeholder="Vorname / Name *" required />
        <input name="phone" placeholder="Telefon *" required />
      </div>

      <input name="email" type="email" placeholder="E-Mail *" required />

      <input type="hidden" name="landingPage" value={tracking.landingPage} />
      <input type="hidden" name="currentPage" value={tracking.currentPage} />
      <input type="hidden" name="utmSource" value={tracking.utmSource} />
      <input type="hidden" name="utmMedium" value={tracking.utmMedium} />
      <input type="hidden" name="utmCampaign" value={tracking.utmCampaign} />
      <input type="hidden" name="utmTerm" value={tracking.utmTerm} />
      <input type="hidden" name="utmContent" value={tracking.utmContent} />
      <input type="hidden" name="gclid" value={tracking.gclid} />
      <input type="hidden" name="fbclid" value={tracking.fbclid} />

      {error ? <p className="mega-error">{error}</p> : null}

      <div className="quote-security-box">
        🔒 Deine Daten werden nur zur Vermittlung passender Anbieter verwendet.
      </div>

      <button type="submit" disabled={sending}>
        {sending ? "Wird gesendet..." : "Jetzt kostenlose Offerten erhalten"}
      </button>

      <small>
        ✓ Kostenlos & unverbindlich
        <br />
        ✓ Regionale Anbieter aus deiner Nähe
        <br />
        ✓ Rückmeldung oft innerhalb von 24 Stunden
      </small>
    </form>
  );
}