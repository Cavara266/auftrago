"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BusinessCreateJobButton() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    location: "",
    assignedTo: "",
    scheduledDate: "",
    startTime: "",
    endTime: "",
    value: "",
    notes: "",
  });

  async function createJob() {
    if (!form.title.trim()) {
      setError("Titel fehlt.");
      return;
    }

    if (!form.scheduledDate) {
      setError("Datum fehlt.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/business/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Einsatz konnte nicht erstellt werden."
        );
      }

      setForm({
        title: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        location: "",
        assignedTo: "",
        scheduledDate: "",
        startTime: "",
        endTime: "",
        value: "",
        notes: "",
      });

      setOpen(false);
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
        onClick={() => setOpen(true)}
        style={{
          minHeight: 42,
          padding: "0 16px",
          borderRadius: 12,
          border: 0,
          background:
            "linear-gradient(100deg,#0ea5e9,#6366f1,#7c3aed)",
          color: "#fff",
          fontSize: 10,
          fontWeight: 950,
          cursor: "pointer",
        }}
      >
        + Neuer Einsatz
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
            onClick={(e) => e.stopPropagation()}
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
                  AUFTRAGO EINSATZPLANUNG
                </div>

                <h2
                  style={{
                    margin: "6px 0 0",
                    fontSize: 25,
                  }}
                >
                  Neuer Einsatz
                </h2>
              </div>

              <button
                onClick={() => setOpen(false)}
                style={closeButton}
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
                marginTop: 20,
              }}
            >
              <Field
                label="Titel"
                value={form.title}
                onChange={(value) =>
                  setForm({ ...form, title: value })
                }
              />

              <Field
                label="Kunde"
                value={form.customerName}
                onChange={(value) =>
                  setForm({
                    ...form,
                    customerName: value,
                  })
                }
              />

              <Field
                label="Kunden E-Mail"
                type="email"
                value={form.customerEmail}
                placeholder="kunde@example.ch"
                onChange={(value) =>
                  setForm({
                    ...form,
                    customerEmail: value,
                  })
                }
              />

              <Field
                label="Kunden Telefon"
                value={form.customerPhone}
                placeholder="+41 79 000 00 00"
                onChange={(value) =>
                  setForm({
                    ...form,
                    customerPhone: value,
                  })
                }
              />

              <Field
                label="Ort"
                value={form.location}
                placeholder="z.B. Zürich"
                onChange={(value) =>
                  setForm({
                    ...form,
                    location: value,
                  })
                }
              />

              <Field
                label="Verantwortlich"
                value={form.assignedTo}
                placeholder="z.B. Dejan"
                onChange={(value) =>
                  setForm({
                    ...form,
                    assignedTo: value,
                  })
                }
              />

              <Field
                label="Datum"
                type="date"
                value={form.scheduledDate}
                onChange={(value) =>
                  setForm({
                    ...form,
                    scheduledDate: value,
                  })
                }
              />

              <Field
                label="Wert CHF"
                type="number"
                value={form.value}
                onChange={(value) =>
                  setForm({ ...form, value })
                }
              />

              <Field
                label="Startzeit"
                type="time"
                value={form.startTime}
                onChange={(value) =>
                  setForm({
                    ...form,
                    startTime: value,
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

            <div style={{ marginTop: 12 }}>
              <div style={label}>NOTIZEN</div>

              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                style={{
                  ...input,
                  resize: "vertical",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  marginTop: 12,
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
                justifyContent: "flex-end",
                gap: 9,
                marginTop: 20,
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={secondaryButton}
              >
                Abbrechen
              </button>

              <button
                onClick={createJob}
                disabled={loading}
                style={primaryButton}
              >
                {loading
                  ? "Speichert..."
                  : "Einsatz erstellen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label: fieldLabel,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label>
      <div style={label}>
        {fieldLabel.toUpperCase()}
      </div>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={input}
      />
    </label>
  );
}

const label = {
  color: "#64748b",
  fontSize: 8,
  fontWeight: 950,
  letterSpacing: ".08em",
  marginBottom: 6,
} as const;

const input = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "11px 12px",
  borderRadius: 10,
  border:
    "1px solid rgba(148,163,184,.10)",
  background: "rgba(2,6,23,.44)",
  color: "#f8fafc",
  outline: "none",
  fontSize: 11,
} as const;

const closeButton = {
  width: 32,
  height: 32,
  borderRadius: 10,
  border:
    "1px solid rgba(148,163,184,.10)",
  background: "rgba(15,23,42,.48)",
  color: "#94a3b8",
  cursor: "pointer",
};

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
};

const secondaryButton = {
  minHeight: 38,
  padding: "0 15px",
  borderRadius: 10,
  border:
    "1px solid rgba(148,163,184,.10)",
  background: "rgba(15,23,42,.42)",
  color: "#94a3b8",
  fontSize: 9,
  fontWeight: 900,
  cursor: "pointer",
};
