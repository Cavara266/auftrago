"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InvoiceEditButton({
  invoiceId,
  title,
  customerName,
  customerEmail,
  customerAddress,
  notes,
  discountCents,
  vatCents,
  subtotalCents,
  dueAt,
}: {
  invoiceId: string;
  title: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerAddress?: string | null;
  notes?: string | null;
  discountCents: number;
  vatCents: number;
  subtotalCents: number;
  dueAt?: string | null;
}) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const taxable =
    Math.max(0, subtotalCents - discountCents);

  const currentVatPercent =
    taxable > 0
      ? Number(((vatCents / taxable) * 100).toFixed(2))
      : 8.1;

  const [form, setForm] = useState({
    title: title || "",
    customerName: customerName || "",
    customerEmail: customerEmail || "",
    customerAddress: customerAddress || "",
    notes: notes || "",
    discountAmount: (discountCents / 100).toFixed(2),
    vatPercent: String(currentVatPercent),
    dueAt: dueAt ? dueAt.slice(0, 10) : "",
  });

  async function save() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Rechnung konnte nicht gespeichert werden"
        );
      }

      setOpen(false);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Fehler"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: "13px 18px",
          borderRadius: 12,
          border: "1px solid rgba(125,211,252,.25)",
          background: "rgba(14,165,233,.08)",
          color: "#7dd3fc",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        ✎ Rechnung bearbeiten
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.72)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "min(720px, 100%)",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: 20,
              border: "1px solid rgba(148,163,184,.20)",
              background: "#07111f",
              padding: 24,
              boxShadow: "0 30px 80px rgba(0,0,0,.5)",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: "#fff",
                marginBottom: 18,
              }}
            >
              Rechnung bearbeiten
            </div>

            <Field
              label="Titel"
              value={form.title}
              onChange={(value) =>
                setForm({ ...form, title: value })
              }
            />

            <Field
              label="Kundenname"
              value={form.customerName}
              onChange={(value) =>
                setForm({ ...form, customerName: value })
              }
            />

            <Field
              label="E-Mail"
              value={form.customerEmail}
              onChange={(value) =>
                setForm({ ...form, customerEmail: value })
              }
            />

            <Field
              label="Adresse"
              value={form.customerAddress}
              onChange={(value) =>
                setForm({ ...form, customerAddress: value })
              }
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              <Field
                label="Rabatt CHF"
                value={form.discountAmount}
                onChange={(value) =>
                  setForm({ ...form, discountAmount: value })
                }
              />

              <Field
                label="MWST %"
                value={form.vatPercent}
                onChange={(value) =>
                  setForm({ ...form, vatPercent: value })
                }
              />

              <Field
                label="Zahlungsziel"
                type="date"
                value={form.dueAt}
                onChange={(value) =>
                  setForm({ ...form, dueAt: value })
                }
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  color: "#7dd3fc",
                  marginBottom: 6,
                }}
              >
                BEMERKUNG / KONDITIONEN
              </div>

              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                rows={5}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,.2)",
                  background: "rgba(15,23,42,.85)",
                  color: "#fff",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  color: "#fca5a5",
                  fontSize: 12,
                  fontWeight: 800,
                  marginTop: 12,
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 20,
              }}
            >
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(148,163,184,.25)",
                  background: "transparent",
                  color: "#cbd5e1",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Abbrechen
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={save}
                style={{
                  padding: "12px 18px",
                  borderRadius: 10,
                  border: 0,
                  background:
                    "linear-gradient(90deg,#0ea5e9,#7c3aed)",
                  color: "#fff",
                  fontWeight: 900,
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                {loading
                  ? "Speichert..."
                  : "Änderungen speichern"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label
      style={{
        display: "block",
        marginTop: 12,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: "#7dd3fc",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid rgba(148,163,184,.2)",
          background: "rgba(15,23,42,.85)",
          color: "#fff",
          outline: "none",
        }}
      />
    </label>
  );
}
