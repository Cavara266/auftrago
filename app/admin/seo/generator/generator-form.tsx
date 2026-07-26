"use client";

import {
  FormEvent,
  useEffect,
  useState,
  useTransition,
} from "react";

import { generateSeoLandingPages } from "./actions";

type GeneratorResult = {
  success: boolean;
  message: string;
  created: number;
  failed?: number;
  skipped: number;
  remaining?: number;
};

const initialState: GeneratorResult = {
  success: false,
  message: "",
  created: 0,
  failed: 0,
  skipped: 0,
  remaining: 0,
};

export default function GeneratorForm() {
  const [state, setState] =
    useState<GeneratorResult>(initialState);

  const [limit, setLimit] = useState(100);

  const [publishImmediately, setPublishImmediately] =
    useState(false);

  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (state.success && state.created > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [state]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.set("limit", String(limit));

    if (publishImmediately) {
      formData.set("publishImmediately", "on");
    } else {
      formData.delete("publishImmediately");
    }

    startTransition(async () => {
      try {
        const result =
          await generateSeoLandingPages(formData);

        setState({
          success: result.success,
          message: result.message,
          created: result.created,
          failed: result.failed ?? 0,
          skipped: result.skipped,
          remaining: result.remaining ?? 0,
        });
      } catch (error) {
        console.error(error);

        setState({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Die Landingpages konnten nicht erstellt werden.",
          created: 0,
          failed: 0,
          skipped: 0,
          remaining: 0,
        });
      }
    });
  }

  return (
    <div className="generator-form-wrap">
      {state.message ? (
        <div
          className={
            state.success
              ? "generator-message success"
              : "generator-message error"
          }
        >
          <strong>
            {state.success
              ? "Generator abgeschlossen"
              : "Fehler"}
          </strong>

          <p>{state.message}</p>

          {state.success ? (
            <div className="generator-result-grid">
              <span>
                <small>Erstellt</small>
                <b>{state.created}</b>
              </span>

              <span>
                <small>Fehlgeschlagen</small>
                <b>{state.failed ?? 0}</b>
              </span>

              <span>
                <small>Noch verfügbar</small>
                <b>{state.remaining ?? 0}</b>
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="generator-form"
      >
        <div className="generator-section">
          <span className="generator-step">01</span>

          <div>
            <h2>Anzahl festlegen</h2>

            <p>
              Bestimme, wie viele neue Kombinationen in
              diesem Durchlauf erstellt werden.
            </p>
          </div>
        </div>

        <div className="generator-limit-options">
          {[10, 50, 100, 250, 500, 1000].map(
            (value) => (
              <button
                type="button"
                key={value}
                className={
                  limit === value
                    ? "limit-button active"
                    : "limit-button"
                }
                onClick={() => setLimit(value)}
                disabled={pending}
              >
                {value}
              </button>
            )
          )}
        </div>

        <label className="generator-custom-limit">
          <span>Eigene Anzahl</span>

          <input
            type="number"
            name="limit"
            min="1"
            max="5000"
            value={limit}
            disabled={pending}
            onChange={(event) => {
              const newValue =
                Number(event.target.value) || 1;

              setLimit(
                Math.min(
                  Math.max(newValue, 1),
                  5000
                )
              );
            }}
          />
        </label>

        <div className="generator-divider" />

        <div className="generator-section">
          <span className="generator-step">02</span>

          <div>
            <h2>Veröffentlichung</h2>

            <p>
              Neue Seiten zuerst als Entwurf speichern oder
              sofort öffentlich freischalten.
            </p>
          </div>
        </div>

        <label className="generator-switch">
          <input
            type="checkbox"
            name="publishImmediately"
            checked={publishImmediately}
            disabled={pending}
            onChange={(event) =>
              setPublishImmediately(
                event.target.checked
              )
            }
          />

          <span className="switch-track">
            <span />
          </span>

          <div>
            <strong>Sofort veröffentlichen</strong>

            <small>
              Seiten werden aktiv, indexierbar und in die
              Sitemap aufgenommen.
            </small>
          </div>
        </label>

        {!publishImmediately ? (
          <div className="generator-info">
            Neue Landingpages werden als Entwurf erstellt und
            können vor der Veröffentlichung geprüft werden.
          </div>
        ) : (
          <div className="generator-warning">
            Die erzeugten Seiten werden sofort öffentlich und
            können von Suchmaschinen indexiert werden.
          </div>
        )}

        <button
          type="submit"
          className="generator-submit"
          disabled={pending}
        >
          {pending
            ? "Landingpages werden erzeugt..."
            : `${limit} Landingpages generieren`}
        </button>
      </form>

      <style jsx>{`
        .generator-form-wrap {
          display: grid;
          gap: 18px;
        }

        .generator-message {
          padding: 22px;
          border: 1px solid;
          border-radius: 20px;
        }

        .generator-message.success {
          border-color: rgba(34, 197, 94, 0.25);
          background: rgba(34, 197, 94, 0.07);
          color: #bbf7d0;
        }

        .generator-message.error {
          border-color: rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.07);
          color: #fecaca;
        }

        .generator-message strong {
          font-size: 15px;
        }

        .generator-message p {
          margin: 7px 0 0;
          color: #cbd5e1;
          font-size: 12px;
        }

        .generator-result-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .generator-result-grid span {
          padding: 13px;
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.18);
        }

        .generator-result-grid small {
          display: block;
          color: #94a3b8;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .generator-result-grid b {
          display: block;
          margin-top: 7px;
          font-size: 22px;
        }

        .generator-form {
          padding: 28px;
          border: 1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 26px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.95),
              rgba(6, 9, 20, 0.98)
            );
        }

        .generator-section {
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }

        .generator-step {
          display: grid;
          width: 39px;
          height: 39px;
          flex: 0 0 auto;
          place-items: center;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.13);
          color: #93c5fd;
          font-size: 11px;
          font-weight: 900;
        }

        .generator-section h2 {
          margin: 0;
          font-size: 18px;
        }

        .generator-section p {
          margin: 7px 0 0;
          color: #7c8aa0;
          font-size: 11px;
          line-height: 1.6;
        }

        .generator-limit-options {
          display: grid;
          grid-template-columns:
            repeat(6, minmax(0, 1fr));
          gap: 9px;
          margin-top: 22px;
        }

        .limit-button {
          min-height: 46px;
          border: 1px solid
            rgba(148, 163, 184, 0.14);
          border-radius: 12px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.03);
          color: #94a3b8;
          font-weight: 900;
        }

        .limit-button.active {
          border-color: rgba(96, 165, 250, 0.4);
          background: rgba(37, 99, 235, 0.14);
          color: #ffffff;
        }

        .limit-button:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        .generator-custom-limit {
          display: grid;
          gap: 8px;
          margin-top: 17px;
        }

        .generator-custom-limit span {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .generator-custom-limit input {
          width: 100%;
          min-height: 50px;
          box-sizing: border-box;
          padding: 0 15px;
          border: 1px solid
            rgba(148, 163, 184, 0.16);
          border-radius: 13px;
          outline: none;
          background: rgba(0, 0, 0, 0.18);
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
        }

        .generator-custom-limit input:disabled {
          opacity: 0.6;
        }

        .generator-divider {
          height: 1px;
          margin: 27px 0;
          background: rgba(148, 163, 184, 0.1);
        }

        .generator-switch {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 21px;
          padding: 17px;
          border: 1px solid
            rgba(148, 163, 184, 0.12);
          border-radius: 16px;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.025);
        }

        .generator-switch input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .switch-track {
          display: flex;
          width: 46px;
          height: 25px;
          flex: 0 0 auto;
          align-items: center;
          padding: 3px;
          border-radius: 999px;
          background: #263244;
          transition: 0.2s ease;
        }

        .switch-track span {
          width: 19px;
          height: 19px;
          border-radius: 999px;
          background: #ffffff;
          transition: 0.2s ease;
        }

        .generator-switch
          input:checked
          + .switch-track {
          background: #2563eb;
        }

        .generator-switch
          input:checked
          + .switch-track
          span {
          transform: translateX(21px);
        }

        .generator-switch strong {
          display: block;
          font-size: 12px;
        }

        .generator-switch small {
          display: block;
          margin-top: 4px;
          color: #7c8aa0;
          font-size: 10px;
          line-height: 1.5;
        }

        .generator-info,
        .generator-warning {
          margin-top: 14px;
          padding: 13px 15px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.6;
        }

        .generator-info {
          border: 1px solid
            rgba(59, 130, 246, 0.2);
          background: rgba(59, 130, 246, 0.07);
          color: #bfdbfe;
        }

        .generator-warning {
          border: 1px solid
            rgba(245, 158, 11, 0.2);
          background: rgba(245, 158, 11, 0.07);
          color: #fde68a;
        }

        .generator-submit {
          width: 100%;
          min-height: 55px;
          margin-top: 23px;
          border: 0;
          border-radius: 14px;
          cursor: pointer;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #7c3aed
            );
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
        }

        .generator-submit:disabled {
          cursor: wait;
          opacity: 0.6;
        }

        @media (max-width: 700px) {
          .generator-limit-options {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .generator-result-grid {
            grid-template-columns: 1fr;
          }

          .generator-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
