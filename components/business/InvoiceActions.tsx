"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InvoiceActions({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState<
    "duplicate" | "cancel" | null
  >(null);

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
        throw new Error(
          data.error || "Rechnung konnte nicht dupliziert werden"
        );
      }

      router.push(
        `/portal/business/rechnungen/${data.invoice.id}`
      );
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Fehler"
      );
    } finally {
      setLoading(null);
    }
  }

  async function cancelInvoice() {
    const ok = confirm(
      "Rechnung wirklich stornieren?"
    );

    if (!ok) return;

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
        throw new Error(
          data.error || "Rechnung konnte nicht storniert werden"
        );
      }

      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Fehler"
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        marginTop: 18,
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
          padding: "11px 15px",
          borderRadius: 10,
          border:
            "1px solid rgba(125,211,252,.20)",
          background: "rgba(14,165,233,.08)",
          color: "#7dd3fc",
          fontWeight: 900,
          cursor:
            loading !== null ? "wait" : "pointer",
        }}
      >
        {loading === "duplicate"
          ? "Dupliziert..."
          : "⧉ Rechnung duplizieren"}
      </button>

      {status !== "CANCELLED" && (
        <button
          type="button"
          onClick={cancelInvoice}
          disabled={loading !== null}
          style={{
            padding: "11px 15px",
            borderRadius: 10,
            border:
              "1px solid rgba(252,165,165,.20)",
            background: "rgba(220,38,38,.08)",
            color: "#fca5a5",
            fontWeight: 900,
            cursor:
              loading !== null ? "wait" : "pointer",
          }}
        >
          {loading === "cancel"
            ? "Storniert..."
            : "✕ Rechnung stornieren"}
        </button>
      )}

      {status === "CANCELLED" && (
        <div
          style={{
            padding: "11px 15px",
            borderRadius: 10,
            border:
              "1px solid rgba(252,165,165,.20)",
            background: "rgba(220,38,38,.08)",
            color: "#fca5a5",
            fontWeight: 900,
          }}
        >
          ✕ Rechnung storniert
        </div>
      )}

      {error && (
        <div
          style={{
            width: "100%",
            marginTop: 4,
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
