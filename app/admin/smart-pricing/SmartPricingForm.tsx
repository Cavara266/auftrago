"use client";

import { useMemo, useState, useTransition } from "react";
import { saveSmartPricingSettings } from "./actions";

type SmartPricingSettings = {
  id: string;
  enabled: boolean;
  firstAfterDays: number;
  firstDiscountPercent: number;
  secondAfterDays: number;
  secondDiscountPercent: number;
  thirdAfterDays: number;
  thirdDiscountPercent: number;
  minimumPrice: number;
  resetAfterPurchase: boolean;
  label: string;
  showCountdown: boolean;
};

type SmartPricingFormProps = {
  initialSettings: SmartPricingSettings;
};

type SaveMessage = {
  type: "success" | "error";
  text: string;
} | null;

const EXAMPLE_ORIGINAL_PRICE = 40;

function clampNumber(
  value: number,
  minimum: number,
  maximum: number,
): number {
  if (!Number.isFinite(value)) {
    return minimum;
  }

  return Math.min(Math.max(Math.round(value), minimum), maximum);
}

function calculatePreviewPrice(
  originalPrice: number,
  discountPercent: number,
  minimumPrice: number,
): number {
  const discountedPrice = Math.round(
    originalPrice * (1 - discountPercent / 100),
  );

  return Math.max(minimumPrice, discountedPrice);
}

function formatCredits(value: number): string {
  return `${value} Credit${value === 1 ? "" : "s"}`;
}

export default function SmartPricingForm({
  initialSettings,
}: SmartPricingFormProps) {
  const [settings, setSettings] =
    useState<SmartPricingSettings>(initialSettings);

  const [message, setMessage] = useState<SaveMessage>(null);
  const [isPending, startTransition] = useTransition();

  const preview = useMemo(() => {
    const firstPrice = calculatePreviewPrice(
      EXAMPLE_ORIGINAL_PRICE,
      settings.firstDiscountPercent,
      settings.minimumPrice,
    );

    const secondPrice = calculatePreviewPrice(
      EXAMPLE_ORIGINAL_PRICE,
      settings.secondDiscountPercent,
      settings.minimumPrice,
    );

    const thirdPrice = calculatePreviewPrice(
      EXAMPLE_ORIGINAL_PRICE,
      settings.thirdDiscountPercent,
      settings.minimumPrice,
    );

    return {
      originalPrice: EXAMPLE_ORIGINAL_PRICE,
      firstPrice,
      secondPrice,
      thirdPrice,
      firstSaving: EXAMPLE_ORIGINAL_PRICE - firstPrice,
      secondSaving: EXAMPLE_ORIGINAL_PRICE - secondPrice,
      thirdSaving: EXAMPLE_ORIGINAL_PRICE - thirdPrice,
    };
  }, [
    settings.firstDiscountPercent,
    settings.secondDiscountPercent,
    settings.thirdDiscountPercent,
    settings.minimumPrice,
  ]);

  function updateSetting<Key extends keyof SmartPricingSettings>(
    key: Key,
    value: SmartPricingSettings[Key],
  ) {
    setMessage(null);

    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  }

  function handleNumberChange(
    key:
      | "firstAfterDays"
      | "firstDiscountPercent"
      | "secondAfterDays"
      | "secondDiscountPercent"
      | "thirdAfterDays"
      | "thirdDiscountPercent"
      | "minimumPrice",
    rawValue: string,
    minimum: number,
    maximum: number,
  ) {
    const parsedValue = Number(rawValue);

    updateSetting(
      key,
      clampNumber(parsedValue, minimum, maximum),
    );
  }

  function validateSettings(): string | null {
    if (!settings.label.trim()) {
      return "Bitte gib einen Namen für das Smart-Deal-Badge ein.";
    }

    if (settings.label.trim().length > 40) {
      return "Der Badge-Name darf höchstens 40 Zeichen lang sein.";
    }

    if (settings.firstAfterDays < 1) {
      return "Die erste Rabattstufe muss frühestens nach einem Tag beginnen.";
    }

    if (settings.secondAfterDays <= settings.firstAfterDays) {
      return "Die zweite Rabattstufe muss nach der ersten Rabattstufe beginnen.";
    }

    if (settings.thirdAfterDays <= settings.secondAfterDays) {
      return "Die dritte Rabattstufe muss nach der zweiten Rabattstufe beginnen.";
    }

    if (
      settings.secondDiscountPercent <= settings.firstDiscountPercent
    ) {
      return "Der Rabatt der zweiten Stufe muss höher als der erste Rabatt sein.";
    }

    if (
      settings.thirdDiscountPercent <= settings.secondDiscountPercent
    ) {
      return "Der Rabatt der dritten Stufe muss höher als der zweite Rabatt sein.";
    }

    if (settings.minimumPrice < 1) {
      return "Der Mindestpreis muss mindestens 1 Credit betragen.";
    }

    return null;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const validationError = validateSettings();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      return;
    }

    startTransition(async () => {
      try {
        const result = await saveSmartPricingSettings({
          id: settings.id,
          enabled: settings.enabled,
          firstAfterDays: settings.firstAfterDays,
          firstDiscountPercent: settings.firstDiscountPercent,
          secondAfterDays: settings.secondAfterDays,
          secondDiscountPercent: settings.secondDiscountPercent,
          thirdAfterDays: settings.thirdAfterDays,
          thirdDiscountPercent: settings.thirdDiscountPercent,
          minimumPrice: settings.minimumPrice,
          resetAfterPurchase: settings.resetAfterPurchase,
          label: settings.label.trim(),
          showCountdown: settings.showCountdown,
        });

        if (!result.success) {
          setMessage({
            type: "error",
            text:
              result.message ||
              "Die Einstellungen konnten nicht gespeichert werden.",
          });

          return;
        }

        setSettings((currentSettings) => ({
          ...currentSettings,
          label: currentSettings.label.trim(),
        }));

        setMessage({
          type: "success",
          text:
            result.message ||
            "Die Smart-Pricing-Einstellungen wurden gespeichert.",
        });
      } catch (error) {
        console.error("Smart Pricing konnte nicht gespeichert werden:", error);

        setMessage({
          type: "error",
          text: "Beim Speichern ist ein unerwarteter Fehler aufgetreten.",
        });
      }
    });
  }

  function resetToRecommendedSettings() {
    setSettings((currentSettings) => ({
      ...currentSettings,
      enabled: true,
      firstAfterDays: 3,
      firstDiscountPercent: 15,
      secondAfterDays: 5,
      secondDiscountPercent: 30,
      thirdAfterDays: 7,
      thirdDiscountPercent: 50,
      minimumPrice: 10,
      resetAfterPurchase: true,
      label: "Smart Deal",
      showCountdown: true,
    }));

    setMessage({
      type: "success",
      text: "Die empfohlenen Werte wurden eingesetzt. Bitte noch speichern.",
    });
  }

  return (
    <form className="smart-pricing-form" onSubmit={handleSubmit}>
      <div className="smart-pricing-main-grid">
        <div className="smart-pricing-settings-column">
          <section className="smart-pricing-panel smart-pricing-master-panel">
            <div className="smart-pricing-panel-heading">
              <div>
                <span className="smart-pricing-panel-eyebrow">
                  Hauptsteuerung
                </span>

                <h2>Smart Pricing verwalten</h2>

                <p>
                  Aktiviere oder pausiere die automatische Reduktion älterer
                  Leads.
                </p>
              </div>

              <label className="smart-pricing-switch">
                <input
                  type="checkbox"
                  checked={settings.enabled}
                  onChange={(event) =>
                    updateSetting("enabled", event.target.checked)
                  }
                />

                <span className="smart-pricing-switch-track">
                  <span className="smart-pricing-switch-thumb" />
                </span>

                <span className="smart-pricing-switch-copy">
                  <strong>
                    {settings.enabled ? "Aktiviert" : "Pausiert"}
                  </strong>

                  <small>
                    {settings.enabled
                      ? "Rabatte werden automatisch angewendet."
                      : "Alle Leads behalten ihren Originalpreis."}
                  </small>
                </span>
              </label>
            </div>

            <div
              className={`smart-pricing-master-state ${
                settings.enabled ? "is-active" : "is-paused"
              }`}
            >
              <span className="smart-pricing-master-state-icon">
                {settings.enabled ? "✓" : "Ⅱ"}
              </span>

              <div>
                <strong>
                  {settings.enabled
                    ? "Preisautomatisierung läuft"
                    : "Preisautomatisierung ist pausiert"}
                </strong>

                <span>
                  {settings.enabled
                    ? "Verfügbare Leads werden anhand ihres Alters automatisch günstiger."
                    : "Die Einstellungen bleiben gespeichert und können jederzeit wieder aktiviert werden."}
                </span>
              </div>
            </div>
          </section>

          <section className="smart-pricing-panel">
            <div className="smart-pricing-panel-heading">
              <div>
                <span className="smart-pricing-panel-eyebrow">
                  Preisentwicklung
                </span>

                <h2>Rabattstufen</h2>

                <p>
                  Lege fest, nach wie vielen Tagen ein Lead günstiger wird.
                </p>
              </div>

              <button
                type="button"
                className="smart-pricing-secondary-button"
                onClick={resetToRecommendedSettings}
                disabled={isPending}
              >
                Empfohlene Werte
              </button>
            </div>

            <div className="smart-pricing-levels">
              <article className="smart-pricing-level smart-pricing-level-one">
                <div className="smart-pricing-level-header">
                  <div className="smart-pricing-level-number">1</div>

                  <div>
                    <span>Erste Stufe</span>
                    <strong>Smart Deal</strong>
                  </div>

                  <div className="smart-pricing-level-badge">
                    −{settings.firstDiscountPercent} %
                  </div>
                </div>

                <div className="smart-pricing-field-grid">
                  <label className="smart-pricing-field">
                    <span>Start nach Tagen</span>

                    <div className="smart-pricing-input-shell">
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={settings.firstAfterDays}
                        onChange={(event) =>
                          handleNumberChange(
                            "firstAfterDays",
                            event.target.value,
                            1,
                            365,
                          )
                        }
                      />

                      <small>Tage</small>
                    </div>
                  </label>

                  <label className="smart-pricing-field">
                    <span>Rabatt</span>

                    <div className="smart-pricing-input-shell">
                      <input
                        type="number"
                        min={1}
                        max={95}
                        value={settings.firstDiscountPercent}
                        onChange={(event) =>
                          handleNumberChange(
                            "firstDiscountPercent",
                            event.target.value,
                            1,
                            95,
                          )
                        }
                      />

                      <small>%</small>
                    </div>
                  </label>
                </div>

                <div className="smart-pricing-level-result">
                  <span>Beispielpreis</span>

                  <div>
                    <del>{preview.originalPrice}</del>
                    <strong>{preview.firstPrice} Credits</strong>
                  </div>
                </div>
              </article>

              <article className="smart-pricing-level smart-pricing-level-two">
                <div className="smart-pricing-level-header">
                  <div className="smart-pricing-level-number">2</div>

                  <div>
                    <span>Zweite Stufe</span>
                    <strong>Top Deal</strong>
                  </div>

                  <div className="smart-pricing-level-badge">
                    −{settings.secondDiscountPercent} %
                  </div>
                </div>

                <div className="smart-pricing-field-grid">
                  <label className="smart-pricing-field">
                    <span>Start nach Tagen</span>

                    <div className="smart-pricing-input-shell">
                      <input
                        type="number"
                        min={2}
                        max={365}
                        value={settings.secondAfterDays}
                        onChange={(event) =>
                          handleNumberChange(
                            "secondAfterDays",
                            event.target.value,
                            2,
                            365,
                          )
                        }
                      />

                      <small>Tage</small>
                    </div>
                  </label>

                  <label className="smart-pricing-field">
                    <span>Rabatt</span>

                    <div className="smart-pricing-input-shell">
                      <input
                        type="number"
                        min={1}
                        max={95}
                        value={settings.secondDiscountPercent}
                        onChange={(event) =>
                          handleNumberChange(
                            "secondDiscountPercent",
                            event.target.value,
                            1,
                            95,
                          )
                        }
                      />

                      <small>%</small>
                    </div>
                  </label>
                </div>

                <div className="smart-pricing-level-result">
                  <span>Beispielpreis</span>

                  <div>
                    <del>{preview.originalPrice}</del>
                    <strong>{preview.secondPrice} Credits</strong>
                  </div>
                </div>
              </article>

              <article className="smart-pricing-level smart-pricing-level-three">
                <div className="smart-pricing-level-header">
                  <div className="smart-pricing-level-number">3</div>

                  <div>
                    <span>Dritte Stufe</span>
                    <strong>Letzte Chance</strong>
                  </div>

                  <div className="smart-pricing-level-badge">
                    −{settings.thirdDiscountPercent} %
                  </div>
                </div>

                <div className="smart-pricing-field-grid">
                  <label className="smart-pricing-field">
                    <span>Start nach Tagen</span>

                    <div className="smart-pricing-input-shell">
                      <input
                        type="number"
                        min={3}
                        max={365}
                        value={settings.thirdAfterDays}
                        onChange={(event) =>
                          handleNumberChange(
                            "thirdAfterDays",
                            event.target.value,
                            3,
                            365,
                          )
                        }
                      />

                      <small>Tage</small>
                    </div>
                  </label>

                  <label className="smart-pricing-field">
                    <span>Rabatt</span>

                    <div className="smart-pricing-input-shell">
                      <input
                        type="number"
                        min={1}
                        max={95}
                        value={settings.thirdDiscountPercent}
                        onChange={(event) =>
                          handleNumberChange(
                            "thirdDiscountPercent",
                            event.target.value,
                            1,
                            95,
                          )
                        }
                      />

                      <small>%</small>
                    </div>
                  </label>
                </div>

                <div className="smart-pricing-level-result">
                  <span>Beispielpreis</span>

                  <div>
                    <del>{preview.originalPrice}</del>
                    <strong>{preview.thirdPrice} Credits</strong>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="smart-pricing-panel">
            <div className="smart-pricing-panel-heading">
              <div>
                <span className="smart-pricing-panel-eyebrow">
                  Zusätzliche Einstellungen
                </span>

                <h2>Darstellung und Schutz</h2>

                <p>
                  Bestimme Mindestpreis, Badge und sichtbare Informationen.
                </p>
              </div>
            </div>

            <div className="smart-pricing-options-grid">
              <label className="smart-pricing-field">
                <span>Mindestpreis pro Lead</span>

                <div className="smart-pricing-input-shell">
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={settings.minimumPrice}
                    onChange={(event) =>
                      handleNumberChange(
                        "minimumPrice",
                        event.target.value,
                        1,
                        10000,
                      )
                    }
                  />

                  <small>Credits</small>
                </div>

                <em>
                  Kein Rabatt kann den Preis unter diesen Wert reduzieren.
                </em>
              </label>

              <label className="smart-pricing-field">
                <span>Name des Rabatt-Badges</span>

                <div className="smart-pricing-input-shell">
                  <input
                    type="text"
                    maxLength={40}
                    value={settings.label}
                    onChange={(event) =>
                      updateSetting("label", event.target.value)
                    }
                    placeholder="Smart Deal"
                  />
                </div>

                <em>
                  Dieser Name kann auf rabattierten Lead-Karten erscheinen.
                </em>
              </label>
            </div>

            <div className="smart-pricing-toggle-list">
              <label className="smart-pricing-option">
                <input
                  type="checkbox"
                  checked={settings.showCountdown}
                  onChange={(event) =>
                    updateSetting("showCountdown", event.target.checked)
                  }
                />

                <span className="smart-pricing-option-check">✓</span>

                <span className="smart-pricing-option-copy">
                  <strong>Countdown anzeigen</strong>

                  <small>
                    Anbieter sehen, wann die nächste Rabattstufe erreicht wird.
                  </small>
                </span>
              </label>

              <label className="smart-pricing-option">
                <input
                  type="checkbox"
                  checked={settings.resetAfterPurchase}
                  onChange={(event) =>
                    updateSetting(
                      "resetAfterPurchase",
                      event.target.checked,
                    )
                  }
                />

                <span className="smart-pricing-option-check">✓</span>

                <span className="smart-pricing-option-copy">
                  <strong>Rabatt nach einem Kauf zurücksetzen</strong>

                  <small>
                    Nach einer Freischaltung beginnt die Rabattzeit für andere
                    Anbieter erneut.
                  </small>
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="smart-pricing-preview-column">
          <section className="smart-pricing-panel smart-pricing-preview-panel">
            <div className="smart-pricing-preview-heading">
              <div>
                <span className="smart-pricing-panel-eyebrow">
                  Live-Vorschau
                </span>

                <h2>Preisverlauf</h2>
              </div>

              <span
                className={`smart-pricing-preview-status ${
                  settings.enabled ? "is-active" : "is-paused"
                }`}
              >
                {settings.enabled ? "Aktiv" : "Pausiert"}
              </span>
            </div>

            <div className="smart-pricing-demo-card">
              <div className="smart-pricing-demo-top">
                <div>
                  <span className="smart-pricing-demo-category">
                    Umzugsreinigung
                  </span>

                  <strong>4.5-Zimmer-Wohnung in Zürich</strong>
                </div>

                {settings.enabled ? (
                  <span className="smart-pricing-demo-badge">
                    🔥 {settings.label.trim() || "Smart Deal"}
                  </span>
                ) : null}
              </div>

              <div className="smart-pricing-demo-details">
                <span>📍 Zürich</span>
                <span>📅 Flexibles Datum</span>
                <span>✓ Abgabegarantie</span>
              </div>

              <div className="smart-pricing-demo-price">
                <div>
                  <span>Aktueller Preis</span>

                  {settings.enabled ? (
                    <>
                      <del>{preview.originalPrice} Credits</del>
                      <strong>{preview.firstPrice} Credits</strong>
                    </>
                  ) : (
                    <strong>{preview.originalPrice} Credits</strong>
                  )}
                </div>

                <button type="button" tabIndex={-1}>
                  Lead freischalten
                </button>
              </div>

              {settings.enabled && settings.showCountdown ? (
                <div className="smart-pricing-demo-countdown">
                  <span>⏳</span>

                  <div>
                    <strong>Nächster Rabatt vorbereitet</strong>
                    <small>
                      Der Preis sinkt automatisch nach Erreichen der nächsten
                      Stufe.
                    </small>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="smart-pricing-timeline">
              <article className="smart-pricing-timeline-item is-original">
                <div className="smart-pricing-timeline-marker" />

                <div className="smart-pricing-timeline-copy">
                  <span>Tag 0</span>
                  <strong>Originalpreis</strong>
                  <small>Neuer Lead ohne Rabatt</small>
                </div>

                <div className="smart-pricing-timeline-price">
                  {formatCredits(preview.originalPrice)}
                </div>
              </article>

              <article className="smart-pricing-timeline-item is-first">
                <div className="smart-pricing-timeline-marker" />

                <div className="smart-pricing-timeline-copy">
                  <span>Ab Tag {settings.firstAfterDays}</span>
                  <strong>
                    −{settings.firstDiscountPercent} % Rabatt
                  </strong>
                  <small>
                    Ersparnis {formatCredits(preview.firstSaving)}
                  </small>
                </div>

                <div className="smart-pricing-timeline-price">
                  {formatCredits(preview.firstPrice)}
                </div>
              </article>

              <article className="smart-pricing-timeline-item is-second">
                <div className="smart-pricing-timeline-marker" />

                <div className="smart-pricing-timeline-copy">
                  <span>Ab Tag {settings.secondAfterDays}</span>
                  <strong>
                    −{settings.secondDiscountPercent} % Rabatt
                  </strong>
                  <small>
                    Ersparnis {formatCredits(preview.secondSaving)}
                  </small>
                </div>

                <div className="smart-pricing-timeline-price">
                  {formatCredits(preview.secondPrice)}
                </div>
              </article>

              <article className="smart-pricing-timeline-item is-third">
                <div className="smart-pricing-timeline-marker" />

                <div className="smart-pricing-timeline-copy">
                  <span>Ab Tag {settings.thirdAfterDays}</span>
                  <strong>
                    −{settings.thirdDiscountPercent} % Rabatt
                  </strong>
                  <small>
                    Ersparnis {formatCredits(preview.thirdSaving)}
                  </small>
                </div>

                <div className="smart-pricing-timeline-price">
                  {formatCredits(preview.thirdPrice)}
                </div>
              </article>
            </div>

            <div className="smart-pricing-preview-note">
              <span>ⓘ</span>

              <p>
                Die Vorschau verwendet einen Beispielpreis von{" "}
                <strong>{preview.originalPrice} Credits</strong>. Der echte
                Preis wird bei jedem Lead individuell berechnet.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <div className="smart-pricing-save-bar">
        <div className="smart-pricing-save-copy">
          {message ? (
            <div
              className={`smart-pricing-message ${
                message.type === "success"
                  ? "is-success"
                  : "is-error"
              }`}
              role="status"
            >
              <span>{message.type === "success" ? "✓" : "!"}</span>
              {message.text}
            </div>
          ) : (
            <>
              <strong>Smart-Pricing-Einstellungen</strong>
              <span>
                Änderungen werden erst nach dem Speichern übernommen.
              </span>
            </>
          )}
        </div>

        <button
          type="submit"
          className="smart-pricing-save-button"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="smart-pricing-spinner" />
              Wird gespeichert …
            </>
          ) : (
            <>
              <span>✓</span>
              Einstellungen speichern
            </>
          )}
        </button>
      </div>

      <style>{`
        .smart-pricing-form {
          padding-bottom: 110px;
        }

        .smart-pricing-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.45fr) minmax(340px, .75fr);
          align-items: start;
          gap: 20px;
          margin-top: 20px;
        }

        .smart-pricing-settings-column {
          display: grid;
          gap: 20px;
        }

        .smart-pricing-preview-column {
          position: sticky;
          top: 20px;
        }

        .smart-pricing-panel {
          padding: 25px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 24px;
          background:
            linear-gradient(145deg, rgba(14,29,51,.88), rgba(8,19,37,.85));
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.035),
            0 22px 55px rgba(0,0,0,.16);
        }

        .smart-pricing-master-panel {
          background:
            radial-gradient(circle at 100% 0%, rgba(34,197,94,.08), transparent 40%),
            linear-gradient(145deg, rgba(14,29,51,.9), rgba(8,19,37,.87));
        }

        .smart-pricing-panel-heading,
        .smart-pricing-preview-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .smart-pricing-panel-eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #7dd3fc;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .smart-pricing-panel h2 {
          margin: 0;
          color: white;
          font-size: 22px;
          line-height: 1.15;
          font-weight: 950;
          letter-spacing: -.035em;
        }

        .smart-pricing-panel-heading p {
          max-width: 610px;
          margin: 8px 0 0;
          color: rgba(226,232,240,.48);
          font-size: 13px;
          line-height: 1.6;
        }

        .smart-pricing-switch {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 245px;
          padding: 13px 15px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 17px;
          background: rgba(2,8,20,.32);
          cursor: pointer;
        }

        .smart-pricing-switch input,
        .smart-pricing-option input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .smart-pricing-switch-track {
          position: relative;
          flex: 0 0 auto;
          width: 48px;
          height: 27px;
          border-radius: 999px;
          background: rgba(148,163,184,.22);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.06);
          transition: .2s ease;
        }

        .smart-pricing-switch-thumb {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 19px;
          height: 19px;
          border-radius: 999px;
          background: #cbd5e1;
          box-shadow: 0 3px 10px rgba(0,0,0,.32);
          transition: .2s ease;
        }

        .smart-pricing-switch input:checked + .smart-pricing-switch-track {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          box-shadow: 0 0 22px rgba(34,197,94,.2);
        }

        .smart-pricing-switch
          input:checked
          + .smart-pricing-switch-track
          .smart-pricing-switch-thumb {
          left: 25px;
          background: white;
        }

        .smart-pricing-switch-copy strong,
        .smart-pricing-switch-copy small {
          display: block;
        }

        .smart-pricing-switch-copy strong {
          color: white;
          font-size: 13px;
          font-weight: 900;
        }

        .smart-pricing-switch-copy small {
          margin-top: 3px;
          color: rgba(226,232,240,.4);
          font-size: 10px;
          line-height: 1.35;
        }

        .smart-pricing-master-state {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 21px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 17px;
          background: rgba(2,8,20,.25);
        }

        .smart-pricing-master-state.is-active {
          border-color: rgba(34,197,94,.17);
          background: rgba(22,101,52,.09);
        }

        .smart-pricing-master-state.is-paused {
          border-color: rgba(248,113,113,.15);
          background: rgba(127,29,29,.08);
        }

        .smart-pricing-master-state-icon {
          flex: 0 0 auto;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #bbf7d0;
          background: rgba(34,197,94,.11);
          font-weight: 950;
        }

        .smart-pricing-master-state.is-paused
          .smart-pricing-master-state-icon {
          color: #fecaca;
          background: rgba(239,68,68,.1);
        }

        .smart-pricing-master-state strong,
        .smart-pricing-master-state div span {
          display: block;
        }

        .smart-pricing-master-state strong {
          color: #f8fafc;
          font-size: 13px;
          font-weight: 900;
        }

        .smart-pricing-master-state div span {
          margin-top: 4px;
          color: rgba(226,232,240,.43);
          font-size: 11px;
          line-height: 1.45;
        }

        .smart-pricing-secondary-button {
          flex: 0 0 auto;
          padding: 10px 13px;
          border: 1px solid rgba(125,211,252,.16);
          border-radius: 12px;
          color: #bae6fd;
          background: rgba(14,165,233,.07);
          font: inherit;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
          transition: .18s ease;
        }

        .smart-pricing-secondary-button:hover:not(:disabled) {
          border-color: rgba(125,211,252,.3);
          background: rgba(14,165,233,.12);
          transform: translateY(-1px);
        }

        .smart-pricing-secondary-button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .smart-pricing-levels {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 21px;
        }

        .smart-pricing-level {
          overflow: hidden;
          padding: 17px;
          border: 1px solid rgba(255,255,255,.075);
          border-radius: 19px;
          background: rgba(2,8,20,.27);
        }

        .smart-pricing-level-one {
          background:
            radial-gradient(circle at 100% 0%, rgba(14,165,233,.08), transparent 45%),
            rgba(2,8,20,.27);
        }

        .smart-pricing-level-two {
          background:
            radial-gradient(circle at 100% 0%, rgba(99,102,241,.1), transparent 45%),
            rgba(2,8,20,.27);
        }

        .smart-pricing-level-three {
          background:
            radial-gradient(circle at 100% 0%, rgba(249,115,22,.1), transparent 45%),
            rgba(2,8,20,.27);
        }

        .smart-pricing-level-header {
          display: grid;
          grid-template-columns: 36px minmax(0, 1fr) auto;
          align-items: center;
          gap: 10px;
        }

        .smart-pricing-level-number {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: #bae6fd;
          background: rgba(14,165,233,.09);
          font-size: 13px;
          font-weight: 950;
        }

        .smart-pricing-level-two .smart-pricing-level-number {
          color: #c7d2fe;
          background: rgba(99,102,241,.1);
        }

        .smart-pricing-level-three .smart-pricing-level-number {
          color: #fed7aa;
          background: rgba(249,115,22,.1);
        }

        .smart-pricing-level-header div:nth-child(2) span,
        .smart-pricing-level-header div:nth-child(2) strong {
          display: block;
        }

        .smart-pricing-level-header div:nth-child(2) span {
          color: rgba(226,232,240,.38);
          font-size: 9px;
          font-weight: 850;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .smart-pricing-level-header div:nth-child(2) strong {
          margin-top: 2px;
          color: white;
          font-size: 13px;
          font-weight: 900;
        }

        .smart-pricing-level-badge {
          padding: 6px 8px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 999px;
          color: #bae6fd;
          background: rgba(255,255,255,.035);
          font-size: 10px;
          font-weight: 900;
        }

        .smart-pricing-level-two .smart-pricing-level-badge {
          color: #c7d2fe;
        }

        .smart-pricing-level-three .smart-pricing-level-badge {
          color: #fed7aa;
        }

        .smart-pricing-field-grid,
        .smart-pricing-options-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .smart-pricing-field-grid {
          margin-top: 17px;
        }

        .smart-pricing-options-grid {
          margin-top: 21px;
        }

        .smart-pricing-field {
          display: block;
          min-width: 0;
        }

        .smart-pricing-field > span {
          display: block;
          margin-bottom: 7px;
          color: rgba(226,232,240,.56);
          font-size: 10px;
          font-weight: 850;
        }

        .smart-pricing-input-shell {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 0 12px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 13px;
          background: rgba(2,8,20,.42);
          transition: .16s ease;
        }

        .smart-pricing-input-shell:focus-within {
          border-color: rgba(56,189,248,.36);
          box-shadow: 0 0 0 3px rgba(14,165,233,.07);
        }

        .smart-pricing-input-shell input {
          min-width: 0;
          width: 100%;
          padding: 11px 0;
          border: 0;
          outline: 0;
          color: white;
          background: transparent;
          font: inherit;
          font-size: 13px;
          font-weight: 850;
        }

        .smart-pricing-input-shell input::placeholder {
          color: rgba(226,232,240,.25);
        }

        .smart-pricing-input-shell input[type="number"] {
          appearance: textfield;
          -moz-appearance: textfield;
        }

        .smart-pricing-input-shell
          input[type="number"]::-webkit-inner-spin-button,
        .smart-pricing-input-shell
          input[type="number"]::-webkit-outer-spin-button {
          margin: 0;
          appearance: none;
          -webkit-appearance: none;
        }

        .smart-pricing-input-shell small {
          flex: 0 0 auto;
          color: rgba(226,232,240,.34);
          font-size: 9px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .smart-pricing-field em {
          display: block;
          margin-top: 7px;
          color: rgba(226,232,240,.3);
          font-size: 9px;
          font-style: normal;
          line-height: 1.45;
        }

        .smart-pricing-level-result {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          padding-top: 13px;
          border-top: 1px solid rgba(255,255,255,.06);
        }

        .smart-pricing-level-result > span {
          color: rgba(226,232,240,.36);
          font-size: 9px;
          font-weight: 800;
        }

        .smart-pricing-level-result > div {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .smart-pricing-level-result del {
          color: rgba(226,232,240,.3);
          font-size: 10px;
        }

        .smart-pricing-level-result strong {
          color: white;
          font-size: 11px;
          font-weight: 900;
        }

        .smart-pricing-toggle-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .smart-pricing-option {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 11px;
          padding: 15px;
          border: 1px solid rgba(255,255,255,.075);
          border-radius: 16px;
          background: rgba(2,8,20,.28);
          cursor: pointer;
          transition: .16s ease;
        }

        .smart-pricing-option:hover {
          border-color: rgba(125,211,252,.18);
          background: rgba(14,165,233,.04);
        }

        .smart-pricing-option-check {
          flex: 0 0 auto;
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 8px;
          color: transparent;
          background: rgba(255,255,255,.03);
          font-size: 11px;
          font-weight: 950;
          transition: .16s ease;
        }

        .smart-pricing-option
          input:checked
          + .smart-pricing-option-check {
          border-color: rgba(34,197,94,.32);
          color: white;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          box-shadow: 0 7px 20px rgba(34,197,94,.14);
        }

        .smart-pricing-option-copy strong,
        .smart-pricing-option-copy small {
          display: block;
        }

        .smart-pricing-option-copy strong {
          color: white;
          font-size: 12px;
          font-weight: 900;
        }

        .smart-pricing-option-copy small {
          margin-top: 4px;
          color: rgba(226,232,240,.37);
          font-size: 10px;
          line-height: 1.45;
        }

        .smart-pricing-preview-panel {
          padding: 21px;
        }

        .smart-pricing-preview-status {
          flex: 0 0 auto;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .smart-pricing-preview-status.is-active {
          color: #bbf7d0;
          background: rgba(34,197,94,.1);
          border: 1px solid rgba(34,197,94,.16);
        }

        .smart-pricing-preview-status.is-paused {
          color: #fecaca;
          background: rgba(239,68,68,.08);
          border: 1px solid rgba(239,68,68,.14);
        }

        .smart-pricing-demo-card {
          margin-top: 19px;
          padding: 17px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 19px;
          background:
            radial-gradient(circle at 100% 0%, rgba(14,165,233,.08), transparent 42%),
            rgba(2,8,20,.36);
        }

        .smart-pricing-demo-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .smart-pricing-demo-category {
          display: block;
          margin-bottom: 5px;
          color: #7dd3fc;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .07em;
          text-transform: uppercase;
        }

        .smart-pricing-demo-top strong {
          display: block;
          color: white;
          font-size: 13px;
          line-height: 1.35;
          font-weight: 900;
        }

        .smart-pricing-demo-badge {
          flex: 0 0 auto;
          max-width: 145px;
          overflow: hidden;
          padding: 6px 8px;
          border: 1px solid rgba(249,115,22,.18);
          border-radius: 999px;
          color: #fed7aa;
          background: rgba(249,115,22,.08);
          font-size: 8px;
          font-weight: 900;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .smart-pricing-demo-details {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 14px;
        }

        .smart-pricing-demo-details span {
          padding: 6px 8px;
          border-radius: 9px;
          color: rgba(226,232,240,.47);
          background: rgba(255,255,255,.035);
          font-size: 8px;
          font-weight: 750;
        }

        .smart-pricing-demo-price {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 13px;
          margin-top: 17px;
          padding-top: 15px;
          border-top: 1px solid rgba(255,255,255,.06);
        }

        .smart-pricing-demo-price div > span,
        .smart-pricing-demo-price del,
        .smart-pricing-demo-price strong {
          display: block;
        }

        .smart-pricing-demo-price div > span {
          color: rgba(226,232,240,.34);
          font-size: 8px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .smart-pricing-demo-price del {
          margin-top: 3px;
          color: rgba(226,232,240,.3);
          font-size: 9px;
        }

        .smart-pricing-demo-price strong {
          margin-top: 2px;
          color: white;
          font-size: 18px;
          line-height: 1;
          font-weight: 950;
          letter-spacing: -.03em;
        }

        .smart-pricing-demo-price button {
          flex: 0 0 auto;
          padding: 10px 11px;
          border: 0;
          border-radius: 11px;
          color: white;
          background: linear-gradient(135deg, #0284c7, #4f46e5);
          font: inherit;
          font-size: 9px;
          font-weight: 900;
          pointer-events: none;
        }

        .smart-pricing-demo-countdown {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 13px;
          padding: 10px;
          border: 1px solid rgba(251,191,36,.11);
          border-radius: 12px;
          background: rgba(120,53,15,.07);
        }

        .smart-pricing-demo-countdown > span {
          flex: 0 0 auto;
          font-size: 14px;
        }

        .smart-pricing-demo-countdown strong,
        .smart-pricing-demo-countdown small {
          display: block;
        }

        .smart-pricing-demo-countdown strong {
          color: #fde68a;
          font-size: 9px;
          font-weight: 900;
        }

        .smart-pricing-demo-countdown small {
          margin-top: 2px;
          color: rgba(253,230,138,.43);
          font-size: 8px;
          line-height: 1.4;
        }

        .smart-pricing-timeline {
          position: relative;
          display: grid;
          gap: 0;
          margin-top: 20px;
        }

        .smart-pricing-timeline::before {
          content: "";
          position: absolute;
          top: 18px;
          bottom: 18px;
          left: 7px;
          width: 1px;
          background: rgba(255,255,255,.08);
        }

        .smart-pricing-timeline-item {
          position: relative;
          display: grid;
          grid-template-columns: 15px minmax(0, 1fr) auto;
          align-items: center;
          gap: 11px;
          min-height: 64px;
          padding: 8px 0;
        }

        .smart-pricing-timeline-marker {
          position: relative;
          z-index: 2;
          width: 15px;
          height: 15px;
          border: 3px solid #0b1729;
          border-radius: 999px;
          background: #64748b;
          box-shadow: 0 0 0 1px rgba(255,255,255,.08);
        }

        .smart-pricing-timeline-item.is-first
          .smart-pricing-timeline-marker {
          background: #0ea5e9;
          box-shadow: 0 0 14px rgba(14,165,233,.42);
        }

        .smart-pricing-timeline-item.is-second
          .smart-pricing-timeline-marker {
          background: #6366f1;
          box-shadow: 0 0 14px rgba(99,102,241,.42);
        }

        .smart-pricing-timeline-item.is-third
          .smart-pricing-timeline-marker {
          background: #f97316;
          box-shadow: 0 0 14px rgba(249,115,22,.42);
        }

        .smart-pricing-timeline-copy span,
        .smart-pricing-timeline-copy strong,
        .smart-pricing-timeline-copy small {
          display: block;
        }

        .smart-pricing-timeline-copy span {
          color: rgba(226,232,240,.34);
          font-size: 8px;
          font-weight: 850;
          letter-spacing: .05em;
          text-transform: uppercase;
        }

        .smart-pricing-timeline-copy strong {
          margin-top: 2px;
          color: white;
          font-size: 11px;
          font-weight: 900;
        }

        .smart-pricing-timeline-copy small {
          margin-top: 3px;
          color: rgba(226,232,240,.34);
          font-size: 8px;
        }

        .smart-pricing-timeline-price {
          color: #f8fafc;
          font-size: 11px;
          font-weight: 950;
        }

        .smart-pricing-preview-note {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-top: 15px;
          padding: 11px;
          border-radius: 12px;
          background: rgba(255,255,255,.025);
        }

        .smart-pricing-preview-note > span {
          flex: 0 0 auto;
          color: #7dd3fc;
          font-size: 12px;
        }

        .smart-pricing-preview-note p {
          margin: 0;
          color: rgba(226,232,240,.34);
          font-size: 8px;
          line-height: 1.55;
        }

        .smart-pricing-preview-note strong {
          color: rgba(226,232,240,.6);
        }

        .smart-pricing-save-bar {
          position: fixed;
          right: 22px;
          bottom: 20px;
          left: 282px;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          min-height: 76px;
          padding: 13px 15px 13px 20px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 21px;
          background: rgba(8,18,34,.9);
          box-shadow:
            0 24px 70px rgba(0,0,0,.38),
            inset 0 1px 0 rgba(255,255,255,.045);
          backdrop-filter: blur(20px);
        }

        .smart-pricing-save-copy strong,
        .smart-pricing-save-copy > span {
          display: block;
        }

        .smart-pricing-save-copy strong {
          color: white;
          font-size: 12px;
          font-weight: 900;
        }

        .smart-pricing-save-copy > span {
          margin-top: 3px;
          color: rgba(226,232,240,.38);
          font-size: 10px;
        }

        .smart-pricing-message {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #f8fafc;
          font-size: 11px;
          font-weight: 800;
        }

        .smart-pricing-message > span {
          flex: 0 0 auto;
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          font-weight: 950;
        }

        .smart-pricing-message.is-success > span {
          color: #bbf7d0;
          background: rgba(34,197,94,.12);
        }

        .smart-pricing-message.is-error > span {
          color: #fecaca;
          background: rgba(239,68,68,.12);
        }

        .smart-pricing-save-button {
          flex: 0 0 auto;
          min-width: 218px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 14px 18px;
          border: 0;
          border-radius: 15px;
          color: white;
          background: linear-gradient(135deg, #0284c7, #4f46e5);
          box-shadow: 0 13px 30px rgba(37,99,235,.22);
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          transition: .18s ease;
        }

        .smart-pricing-save-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 17px 36px rgba(37,99,235,.3);
        }

        .smart-pricing-save-button:disabled {
          opacity: .65;
          cursor: wait;
        }

        .smart-pricing-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: white;
          border-radius: 999px;
          animation: smart-pricing-spin .75s linear infinite;
        }

        @keyframes smart-pricing-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1250px) {
          .smart-pricing-main-grid {
            grid-template-columns: 1fr;
          }

          .smart-pricing-preview-column {
            position: static;
          }

          .smart-pricing-levels {
            grid-template-columns: repeat(3, minmax(220px, 1fr));
            overflow-x: auto;
            padding-bottom: 4px;
          }
        }

        @media (max-width: 980px) {
          .smart-pricing-save-bar {
            left: 14px;
          }
        }

        @media (max-width: 760px) {
          .smart-pricing-panel {
            padding: 20px 16px;
            border-radius: 20px;
          }

          .smart-pricing-panel-heading,
          .smart-pricing-preview-heading {
            display: grid;
          }

          .smart-pricing-switch {
            width: 100%;
            min-width: 0;
          }

          .smart-pricing-secondary-button {
            width: max-content;
          }

          .smart-pricing-options-grid,
          .smart-pricing-toggle-list {
            grid-template-columns: 1fr;
          }

          .smart-pricing-save-bar {
            right: 10px;
            bottom: 10px;
            left: 10px;
            min-height: auto;
            display: grid;
            padding: 12px;
            border-radius: 18px;
          }

          .smart-pricing-save-copy {
            padding: 2px 3px;
          }

          .smart-pricing-save-button {
            width: 100%;
            min-width: 0;
          }
        }

        @media (max-width: 480px) {
          .smart-pricing-levels {
            grid-template-columns: repeat(3, 250px);
          }

          .smart-pricing-field-grid {
            grid-template-columns: 1fr;
          }

          .smart-pricing-demo-top,
          .smart-pricing-demo-price {
            display: grid;
          }

          .smart-pricing-demo-price button {
            width: 100%;
          }
        }
      `}</style>
    </form>
  );
}