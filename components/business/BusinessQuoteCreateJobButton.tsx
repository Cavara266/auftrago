"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BusinessQuoteCreateJobButton({
  quoteId,
  status,
  customerName,
  location,
}: {
  quoteId: string;
  status: string;
  customerName?: string | null;
  location?: string | null;
}) {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      scheduledDate: "",
      startTime: "08:00",
      endTime: "17:00",
      assignedTo: "",
      location: location || "",
      notes: "",
    });

  if (status !== "ACCEPTED") {
    return null;
  }

  async function createJob() {
    if (!form.scheduledDate) {
      setError(
        "Bitte ein Einsatzdatum auswählen."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `/api/business/quotes/${quoteId}/create-job`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(form),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Einsatz konnte nicht erstellt werden."
        );
      }

      if (data.alreadyExists) {
        alert(
          "Für diese Offerte existiert bereits ein Einsatz."
        );
      }

      setOpen(false);

      router.push(
        "/portal/business/operations"
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unbekannter Fehler"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setOpen(true)
        }
        style={{
          minHeight: 44,
          padding: "0 18px",
          borderRadius: 12,
          border:
            "1px solid rgba(34,197,94,.18)",
          background:
            "linear-gradient(100deg,rgba(34,197,94,.14),rgba(14,165,233,.12))",
          color: "#86efac",
          fontSize: 10,
          fontWeight: 950,
          cursor: "pointer",
          boxShadow:
            "0 10px 30px rgba(34,197,94,.08)",
        }}
      >
        ✓ Einsatz planen →
      </button>

      {open && (
        <div
          onClick={() =>
            setOpen(false)
          }
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "grid",
            placeItems: "center",
            padding: 20,
            background:
              "rgba(2,6,23,.80)",
            backdropFilter:
              "blur(15px)",
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: 690,
              padding: 26,
              borderRadius: 25,
              border:
                "1px solid rgba(125,211,252,.14)",
              background:
                "linear-gradient(145deg,rgba(6,18,34,.99),rgba(20,20,55,.98))",
              boxShadow:
                "0 45px 120px rgba(2,6,23,.60)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 15,
                alignItems: "start",
              }}
            >
              <div>
                <div
                  style={{
                    color:
                      "#86efac",
                    fontSize: 9,
                    fontWeight: 950,
                    letterSpacing:
                      ".09em",
                  }}
                >
                  OFFERTE ANGENOMMEN
                </div>

                <h2
                  style={{
                    margin:
                      "7px 0 0",
                    fontSize: 27,
                    letterSpacing:
                      "-.03em",
                  }}
                >
                  Einsatz planen
                </h2>

                <div
                  style={{
                    color:
                      "#64748b",
                    fontSize: 10,
                    marginTop: 6,
                  }}
                >
                  {customerName ||
                    "Kunde"}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border:
                    "1px solid rgba(148,163,184,.10)",
                  background:
                    "rgba(15,23,42,.48)",
                  color:
                    "#94a3b8",
                  cursor:
                    "pointer",
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
                gap: 12,
                marginTop: 22,
              }}
            >
              <Field
                label="Einsatzdatum"
                type="date"
                value={
                  form.scheduledDate
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    scheduledDate:
                      value,
                  })
                }
              />

              <Field
                label="Verantwortlich"
                value={
                  form.assignedTo
                }
                placeholder="z.B. Dejan"
                onChange={(value) =>
                  setForm({
                    ...form,
                    assignedTo:
                      value,
                  })
                }
              />

              <Field
                label="Startzeit"
                type="time"
                value={
                  form.startTime
                }
                onChange={(value) =>
                  setForm({
                    ...form,
                    startTime:
                      value,
                  })
                }
              />

              <Field
                label="Endzeit"
                type="time"
                value={form.endTime}
                onChange={(value) =>
                  setForm({
                    ...form,
                    endTime: value,
                  })
                }
              />
            </div>

            <div
              style={{
                marginTop: 12,
              }}
            >
              <Field
                label="Einsatzort"
                value={form.location}
                placeholder="Adresse / Ort"
                onChange={(value) =>
                  setForm({
                    ...form,
                    location: value,
                  })
                }
              />
            </div>

            <div
              style={{
                marginTop: 12,
              }}
            >
              <div style={labelStyle}>
                INTERNE NOTIZ
              </div>

              <textarea
                rows={4}
                value={form.notes}
                placeholder="z.B. Schlüssel im Briefkasten, Übergabe 17:00..."
                onChange={(event) =>
                  setForm({
                    ...form,
                    notes:
                      event.target
                        .value,
                  })
                }
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 17,
                padding: 14,
                borderRadius: 14,
                border:
                  "1px solid rgba(34,197,94,.10)",
                background:
                  "rgba(34,197,94,.035)",
              }}
            >
              <div
                style={{
                  color: "#86efac",
                  fontSize: 9,
                  fontWeight: 900,
                }}
              >
                ✓ Kundendaten werden automatisch übernommen
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: 9,
                  lineHeight: 1.6,
                  marginTop: 5,
                }}
              >
                Kunde, E-Mail, Telefon, Auftragswert und
                Offertenreferenz werden direkt mit dem Einsatz
                verknüpft.
              </div>
            </div>

            {error && (
              <div
                style={{
                  marginTop: 12,
                  color:
                    "#fca5a5",
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
                justifyContent:
                  "flex-end",
                gap: 9,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                style={secondaryButton}
              >
                Abbrechen
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={createJob}
                style={{
                  ...primaryButton,
                  opacity:
                    loading
                      ? .6
                      : 1,
                }}
              >
                {loading
                  ? "Einsatz wird erstellt..."
                  : "✓ Einsatz erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label>
      <div style={labelStyle}>
        {label.toUpperCase()}
      </div>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        style={inputStyle}
      />
    </label>
  );
}

const labelStyle = {
  color: "#64748b",
  fontSize: 8,
  fontWeight: 950,
  letterSpacing: ".08em",
  marginBottom: 6,
} as const;

const inputStyle = {
  width: "100%",
  boxSizing:
    "border-box" as const,
  padding: "11px 12px",
  borderRadius: 10,
  border:
    "1px solid rgba(148,163,184,.10)",
  background:
    "rgba(2,6,23,.44)",
  color: "#f8fafc",
  outline: "none",
  fontSize: 11,
} as const;

const secondaryButton = {
  minHeight: 40,
  padding: "0 15px",
  borderRadius: 10,
  border:
    "1px solid rgba(148,163,184,.10)",
  background:
    "rgba(15,23,42,.44)",
  color: "#94a3b8",
  fontSize: 9,
  fontWeight: 900,
  cursor: "pointer",
} as const;

const primaryButton = {
  minHeight: 40,
  padding: "0 17px",
  borderRadius: 10,
  border: 0,
  background:
    "linear-gradient(90deg,#22c55e,#0ea5e9,#6366f1)",
  color: "#fff",
  fontSize: 9,
  fontWeight: 950,
  cursor: "pointer",
} as const;
