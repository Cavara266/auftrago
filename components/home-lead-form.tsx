"use client";

import { useMemo, useState } from "react";

import { parseLead, type ParsedLead } from "@/lib/lead-ai";
import {
  getPopularServices,
  getServiceByTitle,
  searchServices,
  services,
  type Service,
} from "@/lib/services";

type FormValues = Record<string, string>;

function createInitialValues(service: Service | null): FormValues {
  if (!service) {
    return {};
  }

  return service.questions.reduce<FormValues>((values, question) => {
    values[question.key] = "";
    return values;
  }, {});
}

export default function HomeLeadForm() {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] =
    useState<Service | null>(null);
  const [description, setDescription] = useState("");
  const [formValues, setFormValues] = useState<FormValues>({});
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [parsedLead, setParsedLead] = useState<ParsedLead | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const displayedServices = useMemo(() => {
    if (searchTerm.trim()) {
      return searchServices(searchTerm).slice(0, 12);
    }

    return getPopularServices(12);
  }, [searchTerm]);

  function selectService(service: Service) {
    setSelectedService(service);
    setSearchTerm(service.title);
    setFormValues(createInitialValues(service));
    setError("");
  }

  function updateFormValue(key: string, value: string) {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
    setError("");
  }

  function analyseDescription(value: string) {
    setDescription(value);

    if (value.trim().length < 8) {
      setParsedLead(null);
      return;
    }

    const parsed = parseLead(value);
    setParsedLead(parsed);

    if (parsed.service) {
      const detectedService = getServiceByTitle(parsed.service);

      if (detectedService) {
        setSelectedService(detectedService);
        setSearchTerm(detectedService.title);
        setFormValues((current) => ({
          ...createInitialValues(detectedService),
          ...current,
          ...(parsed.rooms ? { rooms: parsed.rooms } : {}),
          ...(parsed.area ? { area: parsed.area } : {}),
          ...(parsed.date ? { start: parsed.date } : {}),
          ...(typeof parsed.lift === "boolean"
            ? { elevator: parsed.lift ? "Ja" : "Nein" }
            : {}),
          ...(typeof parsed.balcony === "boolean"
            ? { balcony: parsed.balcony ? "Ja" : "Nein" }
            : {}),
          ...(typeof parsed.cellar === "boolean"
            ? { cellar: parsed.cellar ? "Ja" : "Nein" }
            : {}),
          ...(typeof parsed.handoverGuarantee === "boolean"
            ? {
                handoverGuarantee: parsed.handoverGuarantee
                  ? "Ja"
                  : "Nein",
              }
            : {}),
        }));
      }
    }

    if (parsed.postalCodes[0] && !postalCode) {
      setPostalCode(parsed.postalCodes[0]);
    }
  }

  function validateDynamicFields() {
    if (!selectedService) {
      setError("Bitte wähle eine Dienstleistung aus.");
      return false;
    }

    const missingField = selectedService.questions.find(
      (question) =>
        question.required &&
        question.key !== "message" &&
        !formValues[question.key]?.trim()
    );

    if (missingField) {
      setError(`Bitte fülle „${missingField.label}“ aus.`);
      return false;
    }

    return true;
  }

  function trackLeadConversion() {
    if (typeof window === "undefined" || !selectedService) {
      return;
    }

    const trackingWindow = window as Window & {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: Record<string, unknown>[];
    };

    trackingWindow.gtag?.("event", "generate_lead", {
      event_category: "lead",
      event_label: "home_ai_lead_form",
      service: selectedService.title,
      service_slug: selectedService.slug,
      category: selectedService.category,
      value: selectedService.leadPrice,
      currency: "CHF",
    });

    trackingWindow.dataLayer?.push({
      event: "auftrago_generate_lead",
      service: selectedService.title,
      serviceSlug: selectedService.slug,
      serviceCategory: selectedService.category,
    });
  }

  async function handleSubmit() {
    if (
      !selectedService ||
      !postalCode.trim() ||
      !city.trim() ||
      !name.trim() ||
      !phone.trim()
    ) {
      setError("Bitte überprüfe alle Pflichtfelder.");
      return;
    }

    if (!privacyAccepted) {
      setError("Bitte akzeptiere die Datenschutzbestimmungen.");
      return;
    }

    setSending(true);
    setError("");

    const dynamicDetails = selectedService.questions
      .filter((question) => question.key !== "message")
      .map((question) => {
        const value = formValues[question.key]?.trim();

        return value ? `${question.label}: ${value}` : null;
      })
      .filter(Boolean)
      .join("\n");

    const payload = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || "Nicht angegeben",
      region: `${postalCode.trim()} ${city.trim()}`,
      postalCode: postalCode.trim(),
      city: city.trim(),
      service: selectedService.title,
      start: formValues.start || "Nach Absprache",
      propertyType: formValues.propertyType || "Nicht angegeben",
      objectType: formValues.objectType || "Nicht angegeben",
      message: [
        description.trim() || "Kurzanfrage über Startseite",
        dynamicDetails ? `\nZUSÄTZLICHE ANGABEN\n${dynamicDetails}` : "",
      ]
        .filter(Boolean)
        .join("\n"),

      salutation: "Nicht angegeben",
      street: "Nicht angegeben",
      flexibleDate: "Nach Absprache",
      viewingWanted: "Nach Absprache",
      phoneAvailability: "Nach Absprache",
      floor: formValues.floor || "Nicht angegeben",
      elevator: formValues.elevator || "Nicht angegeben",
      parking: formValues.parking || "Nicht angegeben",
      rooms: formValues.rooms || "Nicht angegeben",
      area: formValues.area || "Nicht angegeben",
      windows: formValues.windows || "Nicht angegeben",
      windowSize: formValues.windowSize || "Nicht angegeben",
      blinds: formValues.blinds || "Nicht angegeben",
      shutters: formValues.shutters || "Nicht angegeben",
      handoverGuarantee:
        formValues.handoverGuarantee || "Nicht angegeben",
      cellar: formValues.cellar || "Nicht angegeben",
      balcony: formValues.balcony || "Nicht angegeben",
      carpetCleaning: formValues.carpetCleaning || "Nicht angegeben",
      budget: formValues.budget || "Nicht angegeben",
      offersWanted: formValues.offersWanted || "Bis zu 4 Angebote",
      important: "Preis, Qualität und schnelle Rückmeldung",
    };

    try {
      const response = await fetch("/api/anfrage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setError(
          data?.error ||
            "Die Anfrage konnte nicht gesendet werden. Bitte versuche es erneut."
        );
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
      <div className="mega-lead mega-lead-success">
        <div className="mega-success-icon">✓</div>
        <div className="mega-pill">Anfrage erfolgreich gesendet</div>
        <h3>Danke, {name.split(" ")[0]}!</h3>
        <p>
          Deine Anfrage für <strong>{selectedService?.title}</strong> wurde
          erfolgreich übermittelt.
        </p>
      </div>
    );
  }

  return (
    <div className="mega-lead">
      <div className="mega-lead-top">
        <span>🤖 Intelligente Auftragserfassung</span>
        <strong>Schritt {step} von 4</strong>
      </div>

      <div className="mega-progress">
        <span className={step >= 1 ? "active" : ""}>Auftrag</span>
        <span className={step >= 2 ? "active" : ""}>Details</span>
        <span className={step >= 3 ? "active" : ""}>Kontakt</span>
        <span className={step >= 4 ? "active" : ""}>Senden</span>
      </div>

      {step === 1 && (
        <>
          <div className="mega-head">
            <div className="mega-pill">✓ Kostenlos & unverbindlich</div>
            <h3>Beschreibe deinen Auftrag</h3>
            <p>
              Unsere Auftragserkennung liest wichtige Angaben automatisch aus
              deinem Text.
            </p>
          </div>

          <textarea
            className="mega-textarea"
            value={description}
            onChange={(event) => analyseDescription(event.target.value)}
            placeholder="z. B. Ich ziehe am 31.08. von 5400 Baden nach 5000 Aarau. 4.5 Zimmer, Lift vorhanden und Keller."
          />

          {parsedLead && (
            <div className="mega-ai-preview">
              <div className="mega-ai-preview-head">
                <span>🤖</span>
                <div>
                  <strong>Auftrago hat erkannt</strong>
                  <small>Bitte prüfe die Angaben.</small>
                </div>
              </div>

              <div className="mega-ai-tags">
                {parsedLead.service && <span>🛠️ {parsedLead.service}</span>}
                {parsedLead.rooms && <span>🏠 {parsedLead.rooms} Zimmer</span>}
                {parsedLead.area && <span>📐 {parsedLead.area} m²</span>}
                {parsedLead.date && <span>📅 {parsedLead.date}</span>}
                {parsedLead.postalCodes.map((code) => (
                  <span key={code}>📍 {code}</span>
                ))}
                {parsedLead.lift === true && <span>🛗 Lift</span>}
                {parsedLead.balcony === true && <span>🌤️ Balkon</span>}
                {parsedLead.cellar === true && <span>📦 Keller</span>}
                {parsedLead.handoverGuarantee === true && (
                  <span>✅ Abgabegarantie</span>
                )}
              </div>
            </div>
          )}

          <div className="mega-service-search">
            <input
              type="search"
              value={searchTerm}
              placeholder="Dienstleistung suchen"
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setSelectedService(null);
              }}
            />
          </div>

          <div className="mega-services">
            {displayedServices.map((service) => (
              <button
                key={service.slug}
                type="button"
                className={
                  selectedService?.slug === service.slug
                    ? "mega-service active"
                    : "mega-service"
                }
                onClick={() => selectService(service)}
              >
                <b>{service.icon}</b>
                <strong>{service.title}</strong>
                <small>{service.short}</small>
              </button>
            ))}
          </div>

          {error && <p className="mega-error">{error}</p>}

          <button
            type="button"
            className="mega-main-btn"
            disabled={!selectedService || !description.trim()}
            onClick={() => {
              if (!selectedService) {
                setError("Bitte wähle eine Dienstleistung aus.");
                return;
              }

              setError("");
              setStep(2);
            }}
          >
            Angaben prüfen →
          </button>
        </>
      )}

      {step === 2 && selectedService && (
        <>
          <div className="mega-head">
            <div className="mega-pill">
              {selectedService.icon} {selectedService.title}
            </div>
            <h3>Ergänze die Auftragsdetails</h3>
            <p>Erkannte Angaben wurden bereits vorausgefüllt.</p>
          </div>

          <div className="mega-dynamic-fields">
            {selectedService.questions
              .filter((question) => question.key !== "message")
              .map((question) => (
                <label key={question.key} className="mega-field">
                  <span>
                    {question.label}
                    {question.required ? " *" : ""}
                  </span>

                  {question.type === "select" ? (
                    <select
                      value={formValues[question.key] || ""}
                      onChange={(event) =>
                        updateFormValue(question.key, event.target.value)
                      }
                    >
                      <option value="">Bitte auswählen</option>
                      {question.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={question.type === "number" ? "number" : question.type}
                      value={formValues[question.key] || ""}
                      placeholder={question.placeholder}
                      onChange={(event) =>
                        updateFormValue(question.key, event.target.value)
                      }
                    />
                  )}
                </label>
              ))}
          </div>

          {error && <p className="mega-error">{error}</p>}

          <div className="mega-row">
            <button
              type="button"
              className="mega-back"
              onClick={() => setStep(1)}
            >
              ← Zurück
            </button>

            <button
              type="button"
              className="mega-main-btn"
              onClick={() => {
                if (!validateDynamicFields()) {
                  return;
                }

                setStep(3);
              }}
            >
              Weiter zum Kontakt →
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="mega-head">
            <div className="mega-pill">📍 Fast geschafft</div>
            <h3>Kontaktdaten und Region</h3>
          </div>

          <div className="mega-fields">
            <input
              value={postalCode}
              placeholder="PLZ *"
              onChange={(event) => setPostalCode(event.target.value)}
            />
            <input
              value={city}
              placeholder="Ort *"
              onChange={(event) => setCity(event.target.value)}
            />
            <input
              value={name}
              placeholder="Vorname und Name *"
              onChange={(event) => setName(event.target.value)}
            />
            <input
              value={phone}
              type="tel"
              placeholder="Telefonnummer *"
              onChange={(event) => setPhone(event.target.value)}
            />
            <input
              value={email}
              type="email"
              placeholder="E-Mail optional"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <label className="mega-privacy">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
            />
            <span>
              Ich akzeptiere die Datenschutzbestimmungen und die Weiterleitung
              meiner Anfrage an passende Anbieter.
            </span>
          </label>

          {error && <p className="mega-error">{error}</p>}

          <div className="mega-row">
            <button
              type="button"
              className="mega-back"
              onClick={() => setStep(2)}
            >
              ← Zurück
            </button>

            <button
              type="button"
              className="mega-main-btn"
              onClick={() => {
                if (!postalCode || !city || !name || !phone) {
                  setError("Bitte fülle alle Pflichtfelder aus.");
                  return;
                }

                if (!privacyAccepted) {
                  setError("Bitte akzeptiere die Datenschutzbestimmungen.");
                  return;
                }

                setError("");
                setStep(4);
              }}
            >
              Anfrage prüfen →
            </button>
          </div>
        </>
      )}

      {step === 4 && selectedService && (
        <>
          <div className="mega-head">
            <div className="mega-pill">🚀 Bereit zum Senden</div>
            <h3>Deine Anfrage ist bereit</h3>
          </div>

          <div className="mega-summary">
            <div>
              <span>Dienstleistung</span>
              <strong>
                {selectedService.icon} {selectedService.title}
              </strong>
            </div>
            <div>
              <span>Region</span>
              <strong>
                {postalCode} {city}
              </strong>
            </div>
            <div>
              <span>Kontakt</span>
              <strong>{name}</strong>
              <p>{phone}</p>
            </div>
            <div>
              <span>Beschreibung</span>
              <p>{description}</p>
            </div>
          </div>

          {error && <p className="mega-error">{error}</p>}

          <button
            type="button"
            className="mega-submit"
            disabled={sending}
            onClick={handleSubmit}
          >
            {sending
              ? "Anfrage wird gesendet..."
              : "🚀 Kostenlose Offerten erhalten"}
          </button>

          <button
            type="button"
            className="mega-back full"
            onClick={() => setStep(3)}
          >
            ← Angaben bearbeiten
          </button>
        </>
      )}

      <div className="mega-trust">
        <span>✓ Kostenlos</span>
        <span>✓ Unverbindlich</span>
        <span>✓ Regionale Anbieter</span>
        <span>✓ Datenschutz</span>
      </div>
    </div>
  );
}