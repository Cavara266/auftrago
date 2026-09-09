"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InvoiceSendButton({
  invoiceId,
  customerEmail,
}: {
  invoiceId: string;
  customerEmail?: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendInvoice() {
    if (!customerEmail) {
      setError("Beim Kunden ist keine E-Mail-Adresse hinterlegt.");
      return;
    }

    if (
      !window.confirm(
        `Rechnung jetzt per E-Mail an ${customerEmail} senden?`
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/send`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Versand fehlgeschlagen.");
      }

      setMessage("✓ Rechnung erfolgreich versendet");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Versand fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={sendInvoice}
        disabled={loading}
        style={{
          border: "1px solid rgba(139,92,246,.45)",
          background: loading
            ? "rgba(139,92,246,.12)"
            : "linear-gradient(135deg,#7c3aed,#2563eb)",
          color: "#fff",
          borderRadius: 10,
          padding: "10px 16px",
          fontWeight: 800,
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Wird versendet..." : "✉ Rechnung versenden"}
      </button>

      {message && (
        <div
          style={{
            marginTop: 8,
            color: "#22c55e",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: 8,
            color: "#ef4444",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
