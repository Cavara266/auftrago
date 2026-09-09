"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateInvoiceButton({
  quoteId,
}: {
  quoteId: string;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createInvoice() {
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/business/invoices/from-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.invoice?.id) {
        throw new Error(
          data?.error || "Rechnung konnte nicht erstellt werden."
        );
      }

      router.push(`/portal/business/rechnungen/${data.invoice.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Rechnung konnte nicht erstellt werden."
      );

      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={createInvoice}
        disabled={loading}
        style={{
          padding: "13px 18px",
          borderRadius: 12,
          border: 0,
          background: loading
            ? "rgba(124,58,237,.45)"
            : "linear-gradient(90deg,#0ea5e9,#7c3aed)",
          color: "#ffffff",
          fontWeight: 900,
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.75 : 1,
        }}
      >
        {loading ? "Rechnung wird erstellt..." : "💰 Rechnung erstellen"}
      </button>

      {error && (
        <div
          style={{
            marginTop: 8,
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
