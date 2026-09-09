"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InvoiceStatusButtons({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function changeStatus(newStatus: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Status konnte nicht geändert werden");
      }

      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {status !== "SENT" && status !== "PAID" && (
          <button
            onClick={() => changeStatus("SENT")}
            disabled={loading}
            style={secondaryButton}
          >
            ✉️ Als versendet markieren
          </button>
        )}

        {status !== "PAID" && (
          <button
            onClick={() => changeStatus("PAID")}
            disabled={loading}
            style={primaryButton}
          >
            {loading ? "Wird gespeichert..." : "✓ Als bezahlt markieren"}
          </button>
        )}

        {status === "PAID" && (
          <div
            style={{
              padding: "13px 18px",
              borderRadius: 12,
              background: "rgba(34,197,94,.12)",
              border: "1px solid rgba(134,239,172,.25)",
              color: "#86efac",
              fontWeight: 900,
            }}
          >
            ✓ Rechnung bezahlt
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            color: "#fca5a5",
            marginTop: 8,
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

const secondaryButton = {
  padding: "13px 18px",
  borderRadius: 12,
  border: "1px solid rgba(167,139,250,.28)",
  background: "rgba(124,58,237,.10)",
  color: "#ddd6fe",
  fontWeight: 800,
  cursor: "pointer",
};

const primaryButton = {
  padding: "13px 18px",
  borderRadius: 12,
  border: 0,
  background: "linear-gradient(90deg,#0ea5e9,#7c3aed)",
  color: "#ffffff",
  fontWeight: 900,
  cursor: "pointer",
};
