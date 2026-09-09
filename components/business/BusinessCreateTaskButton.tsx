"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BusinessCreateTaskButton() {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      assigneeName: "",
      priority: "MEDIUM",
      dueAt: "",
      value: "",
      notes: "",
    });

  async function createTask() {
    if (!form.title.trim()) {
      setError(
        "Bitte einen Titel eingeben."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/business/tasks",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              form
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Aufgabe konnte nicht erstellt werden."
        );
      }

      setForm({
        title: "",
        description: "",
        assigneeName: "",
        priority: "MEDIUM",
        dueAt: "",
        value: "",
        notes: "",
      });

      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
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
          boxShadow:
            "0 10px 28px rgba(99,102,241,.17)",
        }}
      >
        + Neue Aufgabe
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
              "rgba(2,6,23,.76)",
            backdropFilter:
              "blur(14px)",
          }}
        >
          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: 700,
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
                      "#7dd3fc",
                    fontSize: 9,
                    fontWeight:
                      950,
                    letterSpacing:
                      ".09em",
                  }}
                >
                  AUFTRAGO WORKFLOW
                </div>

                <h2
                  style={{
                    margin:
                      "6px 0 0",
                    fontSize: 25,
                  }}
                >
                  Neue Aufgabe
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                style={{
                  width: 32,
                  height: 32,
                  borderRadius:
                    10,
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
                gap: 13,
                marginTop: 20,
              }}
            >
              <Field
                label="Titel"
                value={form.title}
                onChange={(value) =>
                  setForm({
                    ...form,
                    title: value,
                  })
                }
              />

              <Field
                label="Verantwortlich"
                value={
                  form.assigneeName
                }
                placeholder="z.B. Dejan"
                onChange={(value) =>
                  setForm({
                    ...form,
                    assigneeName:
                      value,
                  })
                }
              />

              <label>
                <div style={label}>
                  PRIORITÄT
                </div>

                <select
                  value={
                    form.priority
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      priority:
                        e.target
                          .value,
                    })
                  }
                  style={input}
                >
                  <option value="LOW">
                    Niedrig
                  </option>
                  <option value="MEDIUM">
                    Mittel
                  </option>
                  <option value="HIGH">
                    Hoch
                  </option>
                  <option value="CRITICAL">
                    Kritisch
                  </option>
                </select>
              </label>

              <label>
                <div style={label}>
                  FÄLLIGKEIT
                </div>

                <input
                  type="date"
                  value={form.dueAt}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dueAt:
                        e.target
                          .value,
                    })
                  }
                  style={input}
                />
              </label>

              <Field
                label="Wert CHF"
                type="number"
                value={form.value}
                placeholder="0.00"
                onChange={(value) =>
                  setForm({
                    ...form,
                    value,
                  })
                }
              />
            </div>

            <div
              style={{
                marginTop: 13,
              }}
            >
              <div style={label}>
                BESCHREIBUNG
              </div>

              <textarea
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target
                        .value,
                  })
                }
                rows={3}
                style={{
                  ...input,
                  resize:
                    "vertical",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 13,
              }}
            >
              <div style={label}>
                NOTIZEN
              </div>

              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes:
                      e.target
                        .value,
                  })
                }
                rows={3}
                placeholder="Interne Notizen..."
                style={{
                  ...input,
                  resize:
                    "vertical",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  marginTop: 12,
                  color:
                    "#fca5a5",
                  fontSize: 10,
                  fontWeight:
                    850,
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
                style={{
                  ...secondaryButton,
                }}
              >
                Abbrechen
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={createTask}
                style={{
                  ...primaryButton,
                  opacity:
                    loading
                      ? .65
                      : 1,
                }}
              >
                {loading
                  ? "Speichert..."
                  : "Aufgabe erstellen"}
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
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label>
      <div style={label}>
        {fieldLabel.toUpperCase()}
      </div>

      <input
        type={type}
        value={value}
        placeholder={
          placeholder
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
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

const secondaryButton = {
  minHeight: 38,
  padding: "0 15px",
  borderRadius: 10,
  border:
    "1px solid rgba(148,163,184,.10)",
  background:
    "rgba(15,23,42,.42)",
  color: "#94a3b8",
  fontSize: 9,
  fontWeight: 900,
  cursor: "pointer",
} as const;
