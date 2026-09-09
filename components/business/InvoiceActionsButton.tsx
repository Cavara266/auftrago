"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InvoiceActionsButton({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState<"duplicate" | "cancel" | null>(null);
  const [error, setError] = useState("");

  async function duplicateInvoice() {
    setLoading("duplicate");
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/duplicate`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rechnung konnte nicht dupliziert werden");
      }

      router.push(`/portal/business/rechnungen/${data.invoice.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setLoading(null);
    }
  }

  async function cancelInvoice() {
    const confirmed = window.confirm(
      "Möchtest du diese Rechnung wirklich stornieren?"
    );

    if (!confirmed) return;

    setLoading("cancel");
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/cancel`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Rechnung konnte nicht storniert werden");
      }

      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={duplicateInvoice}
          disabled={loading !== null}
          style={{
            padding: "13px 18px",
            borderRadius: 12,
            border: "1px solid rgba(125,211,252,.25)",
            background: "rgba(14,165,233,.08)",
            color: "#7dd3fc",
            fontWeight: 900,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading === "duplicate" ? "Wird kopiert..." : "⧉ Duplizieren"}
        </button>

        {status !== "CANCELLED" && (
          <button
            type="button"
            onClick={cancelInvoice}
            disabled={loading !== null}
            style={{
              padding: "13px 18px",
              borderRadius: 12,
              border: "1px solid rgba(252,165,165,.28)",
              background: "rgba(127,29,29,.18)",
              color: "#fca5a5",
              fontWeight: 900,
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading === "cancel" ? "Wird storniert..." : "✕ Stornieren"}
          </button>
        )}

        {status === "CANCELLED" && (
          <div
            style={{
              padding: "13px 18px",
              borderRadius: 12,
              border: "1px solid rgba(252,165,165,.28)",
              background: "rgba(127,29,29,.18)",
              color: "#fca5a5",
              fontWeight: 900,
            }}
          >
            ✕ Rechnung storniert
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: 8,
            color: "#fca5a5",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
