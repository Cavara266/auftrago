"use client";

import Link from "next/link";
import {
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import {
  saveGeneratedLandingPage,
} from "./actions";

import { generateSeoLandingContent } from "./generate-actions";

type City = {
  id: string;
  name: string;
  slug: string;
  canton: string;
  neighboringCities: string[];
};

type Service = {
  id: string;
  name: string;
  shortName: string | null;
  slug: string;
  description: string | null;
  priceMinCents: number | null;
  priceMaxCents: number | null;
  priceUnit: string | null;
  benefits: string[];
};

type ExistingPage = {
  id: string;
  cityId: string;
  serviceId: string;
  headline: string | null;
  introduction: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  customPriceMinCents: number | null;
  customPriceMaxCents: number | null;
  status: string;
};

type FormState = {
  seoTitle: string;
  seoDescription: string;
  headline: string;
  introduction: string;
  content: string;
  canonicalUrl: string;
  priceMin: string;
  priceMax: string;
};

function formatPrice(
  cents: number | null
) {
  if (cents === null) {
    return "";
  }

  return String(
    Math.round(cents / 100)
  );
}

function createDefaultState(): FormState {
  return {
    seoTitle: "",
    seoDescription: "",
    headline: "",
    introduction: "",
    content: "",
    canonicalUrl: "",
    priceMin: "",
    priceMax: "",
  };
}

function createSeoText(
  city: City,
  service: Service
): FormState {
  const serviceName =
    service.shortName?.trim() ||
    service.name;

  const priceMin =
    service.priceMinCents !== null
      ? Math.round(
          service.priceMinCents / 100
        )
      : null;

  const priceMax =
    service.priceMaxCents !== null
      ? Math.round(
          service.priceMaxCents / 100
        )
      : null;

  const priceText =
    priceMin !== null &&
    priceMax !== null
      ? `Die Preise liegen je nach Umfang, Ausführung und Anbieter häufig zwischen CHF ${priceMin.toLocaleString(
          "de-CH"
        )} und CHF ${priceMax.toLocaleString(
          "de-CH"
        )}${service.priceUnit ? ` ${service.priceUnit}` : ""}.`
      : "Die Kosten hängen vom Umfang, vom Ausführungstermin und von den gewünschten Leistungen ab.";

  const benefits =
    service.benefits.length > 0
      ? service.benefits
          .slice(0, 5)
          .map(
            (benefit) =>
              `- ${benefit}`
          )
          .join("\n")
      : [
          "- Mehrere passende Anbieter vergleichen",
          "- Unverbindliche Anfragen erstellen",
          "- Regionale Fachbetriebe finden",
          "- Zeit bei der Anbietersuche sparen",
        ].join("\n");

  const neighboringText =
    city.neighboringCities.length > 0
      ? `Neben ${city.name} können je nach Verfügbarkeit auch Anbieter aus ${city.neighboringCities
          .slice(0, 4)
          .join(", ")} berücksichtigt werden.`
      : `Auftrago vermittelt passende Anbieter aus ${city.name}, dem Kanton ${city.canton} und der näheren Umgebung.`;

  const description =
    service.description?.trim() ||
    `${serviceName} umfasst unterschiedliche Arbeiten, die individuell auf das Objekt und den gewünschten Leistungsumfang abgestimmt werden.`;

  const seoTitle =
    `${serviceName} in ${city.name} | Anbieter vergleichen`;

  const seoDescription =
    `${serviceName} in ${city.name}: Passende Anbieter finden, Preise vergleichen und unverbindlich eine Anfrage über Auftrago.ch erstellen.`;

  const headline =
    `${serviceName} in ${city.name}`;

  const introduction =
    `Du suchst einen zuverlässigen Anbieter für ${serviceName} in ${city.name}? Über Auftrago.ch kannst du deine Anfrage kostenlos erfassen und passende Unternehmen aus der Region vergleichen.`;

  const content = `## ${serviceName} in ${city.name} einfach finden

${description}

Auftrago.ch unterstützt dich dabei, geeignete Fachbetriebe in ${city.name} zu finden. Du beschreibst den gewünschten Auftrag, ergänzt die wichtigsten Angaben und erhältst passende Rückmeldungen von interessierten Anbietern.

## Welche Leistungen sind möglich?

Der genaue Leistungsumfang hängt von der gewählten Dienstleistung und deinem Auftrag ab. Typische Vorteile einer Anfrage über Auftrago.ch sind:

${benefits}

## Was kostet ${serviceName} in ${city.name}?

${priceText}

Für einen möglichst genauen Preis solltest du den Auftrag detailliert beschreiben. Hilfreich sind Angaben zur Objektgrösse, zur gewünschten Ausführung, zum Termin, zur Zugänglichkeit und zu möglichen Zusatzarbeiten.

## Anbieter aus ${city.name} und Umgebung

${neighboringText}

Regionale Anbieter kennen häufig die örtlichen Gegebenheiten und können Termine sowie Anfahrtswege effizienter planen.

## So funktioniert Auftrago.ch

1. Dienstleistung auswählen.
2. Auftrag und Anforderungen beschreiben.
3. Kontaktdaten und gewünschten Termin angeben.
4. Anfrage absenden.
5. Rückmeldungen und Angebote vergleichen.
6. Passenden Anbieter auswählen.

## Worauf solltest du beim Vergleich achten?

Vergleiche nicht nur den Preis. Prüfe ebenfalls den enthaltenen Leistungsumfang, mögliche Zusatzkosten, die Verfügbarkeit, die Kommunikation und die Erfahrung des Anbieters.

Ein günstiges Angebot ist nicht automatisch das beste Angebot. Entscheidend ist, dass der vereinbarte Leistungsumfang verständlich festgehalten wird.

## Jetzt Anfrage erstellen

Erstelle jetzt deine Anfrage für ${serviceName} in ${city.name}. Mit vollständigen Angaben können Anbieter den Auftrag besser einschätzen und dir schneller eine passende Rückmeldung senden.`;

  return {
    seoTitle:
      seoTitle.length > 70
        ? `${serviceName} ${city.name} | Auftrago.ch`
        : seoTitle,

    seoDescription:
      seoDescription.length > 180
        ? `${serviceName} in ${city.name}: Anbieter finden, Preise vergleichen und kostenlos eine Anfrage über Auftrago.ch erstellen.`
        : seoDescription,

    headline,
    introduction,
    content,
    canonicalUrl:
      `https://www.auftrago.ch/dienstleistung/${service.slug}/${city.slug}`,
    priceMin:
      priceMin !== null
        ? String(priceMin)
        : "",
    priceMax:
      priceMax !== null
        ? String(priceMax)
        : "",
  };
}

export default function GeneratorForm({
  cities,
  services,
  existingPages,
}: {
  cities: City[];
  services: Service[];
  existingPages: ExistingPage[];
}) {
  const router = useRouter();

  const [cityId, setCityId] =
    useState("");

  const [serviceId, setServiceId] =
    useState("");

  const [form, setForm] =
    useState<FormState>(
      createDefaultState()
    );

  const [message, setMessage] =
    useState("");

  const [generating, setGenerating] =
    useState(false);

  const [savedPath, setSavedPath] =
    useState("");

  const [pending, startTransition] =
    useTransition();

  const selectedCity = useMemo(
    () =>
      cities.find(
        (city) => city.id === cityId
      ) ?? null,
    [cities, cityId]
  );

  const selectedService = useMemo(
    () =>
      services.find(
        (service) =>
          service.id === serviceId
      ) ?? null,
    [services, serviceId]
  );

  const existingPage = useMemo(
    () =>
      existingPages.find(
        (page) =>
          page.cityId === cityId &&
          page.serviceId === serviceId
      ) ?? null,
    [
      existingPages,
      cityId,
      serviceId,
    ]
  );

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function loadExistingPage() {
    if (!existingPage) {
      return;
    }

    setForm({
      seoTitle:
        existingPage.seoTitle ?? "",
      seoDescription:
        existingPage.seoDescription ??
        "",
      headline:
        existingPage.headline ?? "",
      introduction:
        existingPage.introduction ?? "",
      content:
        existingPage.content ?? "",
      canonicalUrl:
        existingPage.canonicalUrl ?? "",
      priceMin: formatPrice(
        existingPage.customPriceMinCents
      ),
      priceMax: formatPrice(
        existingPage.customPriceMaxCents
      ),
    });

    setMessage(
      "Bestehende Landingpage wurde in den Generator geladen."
    );
  }

  async function generateContent() {
    if (
      !selectedCity ||
      !selectedService
    ) {
      setMessage(
        "Bitte zuerst eine Stadt und eine Dienstleistung auswählen."
      );
      return;
    }

    setGenerating(true);
    setMessage("");
    setSavedPath("");

    try {
      const generated =
        await generateSeoLandingContent({
          cityId: selectedCity.id,
          serviceId: selectedService.id,
        });

      setForm({
        seoTitle: generated.seoTitle,
        seoDescription:
          generated.seoDescription,
        headline: generated.headline,
        introduction:
          generated.introduction,
        content: [
          generated.content.trim(),
          "",
          "## Häufige Fragen",
          "",
          ...generated.faqs.flatMap(
            (faq) => [
              `### ${faq.question.trim()}`,
              "",
              faq.answer.trim(),
              "",
            ]
          ),
        ]
          .join("\n")
          .trim(),
        canonicalUrl:
          generated.canonicalUrl,
        priceMin: generated.priceMin,
        priceMax: generated.priceMax,
      });

      setMessage(
        existingPage
          ? "Neue KI-Inhalte wurden erstellt. Die bestehende Landingpage wird erst beim Speichern überschrieben."
          : "Die KI-Inhalte wurden erfolgreich erstellt. Bitte prüfe sie vor dem Veröffentlichen."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Die KI-Inhalte konnten nicht generiert werden."
      );
    } finally {
      setGenerating(false);
    }
  }

  function parsePrice(
    value: string
  ) {
    const normalized = value
      .replace(/[^\d.,-]/g, "")
      .replace(",", ".");

    if (!normalized) {
      return null;
    }

    const amount = Number(normalized);

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      return null;
    }

    return Math.round(amount * 100);
  }

  function save(publish: boolean) {
    if (!cityId || !serviceId) {
      setMessage(
        "Bitte zuerst eine Stadt und eine Dienstleistung auswählen."
      );
      return;
    }

    setMessage("");
    setSavedPath("");

    startTransition(async () => {
      try {
        const result =
          await saveGeneratedLandingPage({
            cityId,
            serviceId,
            seoTitle:
              form.seoTitle,
            seoDescription:
              form.seoDescription,
            headline:
              form.headline,
            introduction:
              form.introduction,
            content:
              form.content,
            canonicalUrl:
              form.canonicalUrl,
            customPriceMinCents:
              parsePrice(
                form.priceMin
              ),
            customPriceMaxCents:
              parsePrice(
                form.priceMax
              ),
            publish,
          });

        setMessage(result.message);
        setSavedPath(
          result.publicPath
        );

        router.refresh();
      } catch (error) {
        console.error(error);

        setMessage(
          error instanceof Error
            ? error.message
            : "Die Landingpage konnte nicht gespeichert werden."
        );
      }
    });
  }

  const titleLength =
    form.seoTitle.length;

  const descriptionLength =
    form.seoDescription.length;

  const wordCount = form.content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="generator-layout">
      <section className="generator-panel">
        <div className="panel-heading">
          <div>
            <span>Konfiguration</span>
            <h2>Landingpage erstellen</h2>
          </div>

          {existingPage ? (
            <span className="existing-badge">
              Bestehende Seite
            </span>
          ) : (
            <span className="new-badge">
              Neue Seite
            </span>
          )}
        </div>

        <div className="selection-grid">
          <label>
            <span>Stadt</span>

            <select
              value={cityId}
              onChange={(event) => {
                setCityId(
                  event.target.value
                );
                setMessage("");
                setSavedPath("");
              }}
            >
              <option value="">
                Stadt auswählen
              </option>

              {cities.map((city) => (
                <option
                  key={city.id}
                  value={city.id}
                >
                  {city.name} ({city.canton})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Dienstleistung</span>

            <select
              value={serviceId}
              onChange={(event) => {
                setServiceId(
                  event.target.value
                );
                setMessage("");
                setSavedPath("");
              }}
            >
              <option value="">
                Dienstleistung auswählen
              </option>

              {services.map(
                (service) => (
                  <option
                    key={service.id}
                    value={service.id}
                  >
                    {service.name}
                  </option>
                )
              )}
            </select>
          </label>
        </div>

        <div className="generator-actions">
          <button
            type="button"
            className="generate-button"
            onClick={
              generateContent
            }
            disabled={
              !cityId ||
              !serviceId ||
              pending ||
              generating
            }
          >
            {generating
              ? "KI erstellt Inhalte..."
              : "Mit KI generieren"}
          </button>

          {existingPage ? (
            <button
              type="button"
              className="secondary-button"
              onClick={
                loadExistingPage
              }
              disabled={pending || generating}
            >
              Bestehende Inhalte laden
            </button>
          ) : null}
        </div>

        <div className="form-grid">
          <label className="full-width">
            <span>
              SEO-Titel
              <small
                className={
                  titleLength > 70
                    ? "invalid"
                    : ""
                }
              >
                {titleLength}/70
              </small>
            </span>

            <input
              value={form.seoTitle}
              onChange={(event) =>
                updateField(
                  "seoTitle",
                  event.target.value
                )
              }
              placeholder="SEO-Titel"
            />
          </label>

          <label className="full-width">
            <span>
              Meta-Beschreibung
              <small
                className={
                  descriptionLength >
                  180
                    ? "invalid"
                    : ""
                }
              >
                {descriptionLength}/180
              </small>
            </span>

            <textarea
              rows={3}
              value={
                form.seoDescription
              }
              onChange={(event) =>
                updateField(
                  "seoDescription",
                  event.target.value
                )
              }
              placeholder="Meta-Beschreibung"
            />
          </label>

          <label className="full-width">
            <span>H1-Überschrift</span>

            <input
              value={form.headline}
              onChange={(event) =>
                updateField(
                  "headline",
                  event.target.value
                )
              }
              placeholder="Hauptüberschrift"
            />
          </label>

          <label className="full-width">
            <span>Einleitung</span>

            <textarea
              rows={5}
              value={
                form.introduction
              }
              onChange={(event) =>
                updateField(
                  "introduction",
                  event.target.value
                )
              }
              placeholder="Einleitung"
            />
          </label>

          <label>
            <span>
              Mindestpreis in CHF
            </span>

            <input
              inputMode="decimal"
              value={form.priceMin}
              onChange={(event) =>
                updateField(
                  "priceMin",
                  event.target.value
                )
              }
              placeholder="z. B. 350"
            />
          </label>

          <label>
            <span>
              Höchstpreis in CHF
            </span>

            <input
              inputMode="decimal"
              value={form.priceMax}
              onChange={(event) =>
                updateField(
                  "priceMax",
                  event.target.value
                )
              }
              placeholder="z. B. 900"
            />
          </label>

          <label className="full-width">
            <span>
              Canonical URL
            </span>

            <input
              value={
                form.canonicalUrl
              }
              onChange={(event) =>
                updateField(
                  "canonicalUrl",
                  event.target.value
                )
              }
              placeholder="https://www.auftrago.ch/..."
            />
          </label>

          <label className="full-width">
            <span>
              Haupttext
              <small>
                {wordCount} Wörter
              </small>
            </span>

            <textarea
              className="content-editor"
              value={form.content}
              onChange={(event) =>
                updateField(
                  "content",
                  event.target.value
                )
              }
              placeholder="SEO-Haupttext"
            />
          </label>
        </div>

        {message ? (
          <div className="message">
            <span>{message}</span>

            {savedPath ? (
              <Link
                href={savedPath}
                target="_blank"
              >
                Seite öffnen
              </Link>
            ) : null}
          </div>
        ) : null}

        <div className="save-actions">
          <button
            type="button"
            className="draft-button"
            onClick={() =>
              save(false)
            }
            disabled={pending || generating}
          >
            {pending
              ? "Wird gespeichert..."
              : "Als Entwurf speichern"}
          </button>

          <button
            type="button"
            className="publish-button"
            onClick={() =>
              save(true)
            }
            disabled={pending || generating}
          >
            {pending
              ? "Wird gespeichert..."
              : "Speichern & veröffentlichen"}
          </button>
        </div>
      </section>

      <aside className="preview-panel">
        <div className="panel-heading">
          <div>
            <span>Vorschau</span>
            <h2>Google & Landingpage</h2>
          </div>
        </div>

        <div className="google-preview">
          <span>
            www.auftrago.ch
          </span>

          <strong>
            {form.seoTitle ||
              "SEO-Titel erscheint hier"}
          </strong>

          <p>
            {form.seoDescription ||
              "Die Meta-Beschreibung erscheint hier und zeigt Google-Nutzern eine kurze Vorschau der Landingpage."}
          </p>
        </div>

        <div className="page-preview">
          <span className="preview-kicker">
            Auftrago.ch
          </span>

          <h1>
            {form.headline ||
              "Hauptüberschrift"}
          </h1>

          <p className="preview-intro">
            {form.introduction ||
              "Die Einleitung der Landingpage erscheint hier."}
          </p>

          <div className="preview-price">
            <span>
              Geschätzter Preisbereich
            </span>

            <strong>
              {form.priceMin ||
              form.priceMax
                ? `CHF ${
                    form.priceMin ||
                    "–"
                  } bis CHF ${
                    form.priceMax ||
                    "–"
                  }`
                : "Preis auf Anfrage"}
            </strong>
          </div>

          <div className="preview-content">
            {(form.content ||
              "Der generierte Haupttext erscheint hier.")
              .split("\n")
              .slice(0, 12)
              .map((line, index) => {
                if (
                  line.startsWith(
                    "## "
                  )
                ) {
                  return (
                    <h2 key={index}>
                      {line.replace(
                        "## ",
                        ""
                      )}
                    </h2>
                  );
                }

                if (
                  /^\d+\./.test(line)
                ) {
                  return (
                    <p
                      key={index}
                      className="preview-list"
                    >
                      {line}
                    </p>
                  );
                }

                if (
                  line.startsWith("- ")
                ) {
                  return (
                    <p
                      key={index}
                      className="preview-list"
                    >
                      •{" "}
                      {line.replace(
                        "- ",
                        ""
                      )}
                    </p>
                  );
                }

                if (!line.trim()) {
                  return null;
                }

                return (
                  <p key={index}>
                    {line}
                  </p>
                );
              })}
          </div>
        </div>
      </aside>

      <style jsx>{`
        .generator-layout {
          display: grid;
          grid-template-columns:
            minmax(0, 1.25fr)
            minmax(360px, 0.75fr);
          gap: 18px;
        }

        .generator-panel,
        .preview-panel {
          padding: 24px;
          border: 1px solid
            rgba(148, 163, 184, 0.13);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.98)
            );
        }

        .preview-panel {
          align-self: start;
          position: sticky;
          top: 18px;
        }

        .panel-heading {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .panel-heading span {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .panel-heading h2 {
          margin: 6px 0 0;
          font-size: 22px;
        }

        .existing-badge,
        .new-badge {
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .existing-badge {
          background:
            rgba(245, 158, 11, 0.12);
          color: #fde68a;
        }

        .new-badge {
          background:
            rgba(34, 197, 94, 0.12);
          color: #86efac;
        }

        .selection-grid,
        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 13px;
        }

        .form-grid {
          margin-top: 20px;
        }

        label > span {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 10px;
          margin-bottom: 7px;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        label small {
          color: #64748b;
          font-size: 8px;
        }

        label small.invalid {
          color: #fca5a5;
        }

        input,
        select,
        textarea {
          width: 100%;
          border: 1px solid
            rgba(148, 163, 184, 0.17);
          border-radius: 11px;
          outline: 0;
          background: #101625;
          color: #ffffff;
          font: inherit;
        }

        input,
        select {
          min-height: 45px;
          padding: 0 12px;
        }

        textarea {
          padding: 12px;
          line-height: 1.6;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color:
            rgba(59, 130, 246, 0.65);
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .content-editor {
          min-height: 540px;
          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;
          font-size: 12px;
        }

        .generator-actions,
        .save-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        button {
          min-height: 45px;
          padding: 0 16px;
          border: 0;
          border-radius: 11px;
          cursor: pointer;
          color: #ffffff;
          font-size: 9px;
          font-weight: 900;
        }

        button:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }

        .generate-button {
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #2563eb
            );
        }

        .secondary-button,
        .draft-button {
          border: 1px solid
            rgba(148, 163, 184, 0.16);
          background:
            rgba(255, 255, 255, 0.04);
        }

        .publish-button {
          background:
            linear-gradient(
              135deg,
              #059669,
              #2563eb
            );
        }

        .message {
          display: flex;
          align-items: center;
          justify-content:
            space-between;
          gap: 15px;
          margin-top: 16px;
          padding: 13px 15px;
          border: 1px solid
            rgba(59, 130, 246, 0.2);
          border-radius: 13px;
          background:
            rgba(37, 99, 235, 0.08);
          color: #bfdbfe;
          font-size: 10px;
          font-weight: 800;
        }

        .message a {
          color: #ffffff;
          font-size: 9px;
          white-space: nowrap;
        }

        .google-preview {
          padding: 18px;
          border-radius: 15px;
          background: #ffffff;
        }

        .google-preview > span {
          color: #202124;
          font-size: 11px;
        }

        .google-preview strong {
          display: block;
          margin-top: 7px;
          color: #1a0dab;
          font-family: Arial, sans-serif;
          font-size: 19px;
          font-weight: 400;
          line-height: 1.25;
        }

        .google-preview p {
          margin: 7px 0 0;
          color: #4d5156;
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.45;
        }

        .page-preview {
          margin-top: 15px;
          padding: 22px;
          border: 1px solid
            rgba(148, 163, 184, 0.12);
          border-radius: 17px;
          background:
            rgba(255, 255, 255, 0.025);
        }

        .preview-kicker {
          color: #60a5fa;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .page-preview h1 {
          margin: 9px 0 0;
          font-size: 30px;
          line-height: 1.08;
        }

        .preview-intro {
          margin: 13px 0 0;
          color: #cbd5e1;
          font-size: 11px;
          line-height: 1.65;
        }

        .preview-price {
          margin-top: 17px;
          padding: 14px;
          border-radius: 12px;
          background:
            rgba(37, 99, 235, 0.08);
        }

        .preview-price span {
          display: block;
          color: #93c5fd;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .preview-price strong {
          display: block;
          margin-top: 6px;
          font-size: 15px;
        }

        .preview-content {
          margin-top: 20px;
        }

        .preview-content h2 {
          margin: 20px 0 8px;
          font-size: 17px;
        }

        .preview-content p {
          margin: 8px 0 0;
          color: #94a3b8;
          font-size: 10px;
          line-height: 1.65;
        }

        .preview-content
          .preview-list {
          color: #cbd5e1;
        }

        @media (max-width: 1050px) {
          .generator-layout {
            grid-template-columns: 1fr;
          }

          .preview-panel {
            position: static;
          }
        }

        @media (max-width: 650px) {
          .generator-panel,
          .preview-panel {
            padding: 19px;
            border-radius: 20px;
          }

          .selection-grid,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .full-width {
            grid-column: auto;
          }

          .save-actions button,
          .generator-actions button {
            width: 100%;
          }

          .message {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
