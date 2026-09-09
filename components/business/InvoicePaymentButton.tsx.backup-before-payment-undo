"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Payment = {
  id: string;
  amountCents: number;
  paymentDate: string | Date;
  note?: string | null;
};

export default function InvoicePaymentButton({
  invoiceId,
  totalCents,
  paidAmountCents = 0,
  payments = [],
}: {
  invoiceId: string;
  totalCents: number;
  paidAmountCents?: number;
  payments?: Payment[];
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const remainingCents = Math.max(0, totalCents - paidAmountCents);
  const remaining = remainingCents / 100;

  const currency = useMemo(
    () =>
      new Intl.NumberFormat("de-CH", {
        style: "currency",
        currency: "CHF",
        minimumFractionDigits: 2,
      }),
    []
  );

  async function savePayment() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            note,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Zahlung konnte nicht gespeichert werden");
      }

      setShowForm(false);
      setAmount("");
      setNote("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function deletePayment(paymentId: string) {
    if (!window.confirm("Diese Zahlung wirklich rückgängig machen?")) {
      return;
    }

    setDeletingId(paymentId);
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/payment`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Zahlung konnte nicht gelöscht werden");
      }

      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div
      style={{
        marginTop: 18,
        padding: 18,
        borderRadius: 16,
        border: "1px solid rgba(125,211,252,.16)",
        background: "rgba(14,22,41,.75)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: "#7dd3fc",
              letterSpacing: ".05em",
            }}
          >
            ZAHLUNGEN
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 24,
              fontWeight: 900,
              color: remainingCents === 0 ? "#86efac" : "#f8fafc",
            }}
          >
            Offen: {currency.format(remaining)}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            Bezahlt: {currency.format(paidAmountCents / 100)}
          </div>
        </div>

        {remainingCents > 0 && (
          <button
            type="button"
            onClick={() => {
              setAmount(remaining.toFixed(2));
              setShowForm(true);
            }}
            style={{
              padding: "11px 15px",
              borderRadius: 10,
              border: 0,
              background: "linear-gradient(90deg,#0ea5e9,#7c3aed)",
              color: "#fff",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            + Zahlung erfassen
          </button>
        )}
      </div>

      {showForm && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 14,
            background: "rgba(2,6,23,.5)",
            border: "1px solid rgba(148,163,184,.14)",
          }}
        >
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Betrag"
            inputMode="decimal"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 13px",
              borderRadius: 10,
              border: "1px solid rgba(148,163,184,.2)",
              background: "rgba(15,23,42,.85)",
              color: "#fff",
              outline: "none",
            }}
          />

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notiz, z.B. Bankzahlung"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginTop: 10,
              padding: "12px 13px",
              borderRadius: 10,
              border: "1px solid rgba(148,163,184,.2)",
              background: "rgba(15,23,42,.85)",
              color: "#fff",
              outline: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button
              type="button"
              onClick={savePayment}
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 9,
                border: 0,
                background: "#16a34a",
                color: "#fff",
                fontWeight: 900,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Speichert..." : "Speichern"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={loading}
              style={{
                padding: "10px 14px",
                borderRadius: 9,
                border: "1px solid rgba(148,163,184,.25)",
                background: "transparent",
                color: "#cbd5e1",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {payments.length > 0 && (
        <div
          style={{
            marginTop: 18,
            borderTop: "1px solid rgba(148,163,184,.12)",
            paddingTop: 12,
          }}
        >
          {payments.map((payment) => (
            <div
              key={payment.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid rgba(148,163,184,.08)",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#e2e8f0",
                  }}
                >
                  {new Intl.DateTimeFormat("de-CH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(payment.paymentDate))}
                </div>

                {payment.note && (
                  <div
                    style={{
                      marginTop: 3,
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  >
                    {payment.note}
                  </div>
                )}
              </div>

              <strong style={{ color: "#86efac" }}>
                {currency.format(payment.amountCents / 100)}
              </strong>

              <button
                type="button"
                onClick={() => deletePayment(payment.id)}
                disabled={deletingId === payment.id}
                title="Zahlung rückgängig machen"
                style={{
                  border: "1px solid rgba(252,165,165,.22)",
                  background: "rgba(127,29,29,.15)",
                  color: "#fca5a5",
                  borderRadius: 8,
                  padding: "7px 9px",
                  cursor: deletingId === payment.id ? "wait" : "pointer",
                }}
              >
                ↩
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 10,
            color: "#fca5a5",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
