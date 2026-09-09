"use client";

import { useMemo, useState } from "react";

export default function BusinessJobNotifyButton({
  jobId,
  customerName,
  customerEmail,
  customerPhone,
  startTime,
}: {
  jobId: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  startTime?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const templates = useMemo(
    () => [
      {
        label: "Wir sind unterwegs",
        text:
          "Guten Tag, wir möchten Sie kurz informieren, dass wir nun auf dem Weg zu Ihnen sind. Bis gleich.",
      },
      {
        label: "Ankunftszeit",
        text:
          `Guten Tag, wir werden voraussichtlich um ${
            startTime || "der vereinbarten Zeit"
          } bei Ihnen sein. Vielen Dank und bis gleich.`,
      },
      {
        label: "Wir sind vor Ort",
        text:
          "Guten Tag, wir sind nun vor Ort und beginnen mit den vereinbarten Arbeiten.",
      },
      {
        label: "Arbeiten abgeschlossen",
        text:
          "Guten Tag, die vereinbarten Arbeiten wurden erfolgreich abgeschlossen. Vielen Dank für Ihren Auftrag.",
      },
    ],
    [startTime]
  );

  async function sendEmail() {
    if (!message.trim()) {
      setError("Bitte zuerst eine Nachricht auswählen oder schreiben.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/business/jobs/${jobId}/notify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            sendEmail: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "E-Mail konnte nicht gesendet werden.");
      }

      alert("E-Mail wurde erfolgreich versendet.");
      setOpen(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Fehler beim Versand."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyWhatsapp() {
    if (!message.trim()) {
      setError("Bitte zuerst eine Nachricht auswählen oder schreiben.");
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      alert("WhatsApp-Text wurde kopiert.");
    } catch {
      setError("Text konnte nicht kopiert werden.");
    }
  }

  const whatsappUrl =
    customerPhone && message
      ? `https://wa.me/${customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          minHeight: 34,
          padding: "0 11px",
          borderRadius: 9,
          border:
            "1px solid rgba(125,211,252,.12)",
          background: "rgba(14,165,233,.06)",
          color: "#7dd3fc",
          fontSize: 8,
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        ✉ Kunde informieren
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: 20,
            background: "rgba(2,6,23,.78)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 720,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 25,
              borderRadius: 24,
              border:
                "1px solid rgba(125,211,252,.14)",
              background:
                "linear-gradient(145deg,rgba(7,18,34,.99),rgba(20,20,55,.98))",
              boxShadow:
                "0 45px 120px rgba(2,6,23,.58)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 15,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#7dd3fc",
                    fontSize: 9,
                    fontWeight: 950,
                    letterSpacing: ".09em",
                  }}
                >
                  KUNDENKOMMUNIKATION
                </div>

                <h2
                  style={{
                    margin: "6px 0 0",
                    fontSize: 25,
                  }}
                >
                  Kunde informieren
                </h2>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: 10,
                    marginTop: 6,
                  }}
                >
                  {customerName || "Kunde"}
                  {customerEmail
                    ? ` · ${customerEmail}`
                    : ""}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  border:
                    "1px solid rgba(148,163,184,.10)",
                  background: "rgba(15,23,42,.48)",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2,minmax(0,1fr))",
                gap: 9,
                marginTop: 20,
              }}
            >
              {templates.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  onClick={() => setMessage(template.text)}
                  style={{
                    padding: 13,
                    borderRadius: 12,
                    border:
                      "1px solid rgba(148,163,184,.09)",
                    background: "rgba(2,6,23,.32)",
                    color: "#cbd5e1",
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: 10,
                    fontWeight: 850,
                  }}
                >
                  {template.label}
                </button>
              ))}
            </div>

            <div
              style={{
                marginTop: 14,
                padding: 13,
                borderRadius: 13,
                border:
                  "1px solid rgba(125,211,252,.09)",
                background:
                  "rgba(14,165,233,.035)",
              }}
            >
              <div
                style={{
                  color: "#7dd3fc",
                  fontSize: 8,
                  fontWeight: 950,
                  letterSpacing: ".08em",
                }}
              >
                SCHNELLE ETA
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 9,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Guten Tag, wir sind unterwegs und werden voraussichtlich in ca. 15 Minuten bei Ihnen sein. Vielen Dank und bis gleich."
                    )
                  }
                  style={quickButton}
                >
                  +15 Min
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Guten Tag, wir sind unterwegs und werden voraussichtlich in ca. 30 Minuten bei Ihnen sein. Vielen Dank und bis gleich."
                    )
                  }
                  style={quickButton}
                >
                  +30 Min
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Guten Tag, wir sind unterwegs und werden voraussichtlich in ca. 45 Minuten bei Ihnen sein. Vielen Dank und bis gleich."
                    )
                  }
                  style={quickButton}
                >
                  +45 Min
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMessage(
                      "Guten Tag, wir sind unterwegs und werden voraussichtlich in ca. 60 Minuten bei Ihnen sein. Vielen Dank und bis gleich."
                    )
                  }
                  style={quickButton}
                >
                  +60 Min
                </button>
              </div>
            </div>

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              rows={7}
              placeholder="Nachricht an den Kunden..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginTop: 14,
                padding: 14,
                borderRadius: 13,
                border:
                  "1px solid rgba(148,163,184,.10)",
                background: "rgba(2,6,23,.42)",
                color: "#f8fafc",
                fontSize: 11,
                lineHeight: 1.6,
                outline: "none",
                resize: "vertical",
              }}
            />

            {error && (
              <div
                style={{
                  marginTop: 10,
                  color: "#fca5a5",
                  fontSize: 10,
                  fontWeight: 850,
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 9,
                flexWrap: "wrap",
                marginTop: 15,
              }}
            >
              <button
                type="button"
                onClick={copyWhatsapp}
                style={secondaryButton}
              >
                WhatsApp-Text kopieren
              </button>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    ...secondaryButton,
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "#86efac",
                  }}
                >
                  WhatsApp öffnen →
                </a>
              )}

              <button
                type="button"
                disabled={loading || !customerEmail}
                onClick={sendEmail}
                style={{
                  ...primaryButton,
                  marginLeft: "auto",
                  opacity:
                    !customerEmail || loading
                      ? 0.55
                      : 1,
                }}
              >
                {loading
                  ? "Wird gesendet..."
                  : customerEmail
                  ? "✉ E-Mail senden"
                  : "Keine E-Mail hinterlegt"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const quickButton = {
  minHeight: 31,
  padding: "0 10px",
  borderRadius: 8,
  border:
    "1px solid rgba(125,211,252,.10)",
  background:
    "rgba(14,165,233,.045)",
  color: "#7dd3fc",
  fontSize: 8,
  fontWeight: 900,
  cursor: "pointer",
} as const;

const secondaryButton = {
  minHeight: 38,
  padding: "0 14px",
  borderRadius: 10,
  border:
    "1px solid rgba(148,163,184,.10)",
  background: "rgba(15,23,42,.48)",
  color: "#cbd5e1",
  fontSize: 9,
  fontWeight: 900,
  cursor: "pointer",
} as const;

const primaryButton = {
  minHeight: 38,
  padding: "0 15px",
  borderRadius: 10,
  border: 0,
  background:
    "linear-gradient(90deg,#0ea5e9,#6366f1,#7c3aed)",
  color: "#fff",
  fontSize: 9,
  fontWeight: 950,
  cursor: "pointer",
} as const;
