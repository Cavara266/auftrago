"use client";

import { useState } from "react";

export default function QuoteDecisionClient({
  quoteId,
  initialStatus,
}: {
  quoteId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] =
    useState<"ACCEPTED" | "DECLINED" | null>(null);
  const [error, setError] = useState("");

  async function decide(
    decision: "ACCEPTED" | "DECLINED"
  ) {
    setLoading(decision);
    setError("");

    try {
      const response = await fetch(
        `/api/public/quotes/${quoteId}/decision`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ decision }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Aktion fehlgeschlagen."
        );
      }

      setStatus(decision);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unbekannter Fehler"
      );
    } finally {
      setLoading(null);
    }
  }

  if (status === "ACCEPTED") {
    return (
      <div
        style={{
          marginTop: 24,
          padding: 18,
          borderRadius: 16,
          background: "rgba(34,197,94,.10)",
          border:
            "1px solid rgba(34,197,94,.25)",
          color: "#86efac",
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        ✓ Offerte angenommen
      </div>
    );
  }

  if (status === "DECLINED") {
    return (
      <div
        style={{
          marginTop: 24,
          padding: 18,
          borderRadius: 16,
          background: "rgba(239,68,68,.08)",
          border:
            "1px solid rgba(239,68,68,.22)",
          color: "#fca5a5",
          fontWeight: 900,
          textAlign: "center",
        }}
      >
        Offerte abgelehnt
      </div>
    );
  }

  return (
    <div style={{ marginTop: 24 }}>
      <button
        type="button"
        onClick={() => decide("ACCEPTED")}
        disabled={loading !== null}
        style={{
          width: "100%",
          padding: "15px 18px",
          borderRadius: 13,
          border: 0,
          background:
            "linear-gradient(90deg,#10b981,#22c55e)",
          color: "#fff",
          fontWeight: 950,
          fontSize: 15,
          cursor:
            loading ? "wait" : "pointer",
          boxShadow:
            "0 12px 30px rgba(34,197,94,.20)",
        }}
      >
        {loading === "ACCEPTED"
          ? "Wird bestätigt..."
          : "✓ Offerte annehmen"}
      </button>

      <button
        type="button"
        onClick={() => decide("DECLINED")}
        disabled={loading !== null}
        style={{
          width: "100%",
          marginTop: 10,
          padding: "13px 18px",
          borderRadius: 13,
          border:
            "1px solid rgba(248,113,113,.18)",
          background: "rgba(239,68,68,.06)",
          color: "#fca5a5",
          fontWeight: 850,
          cursor:
            loading ? "wait" : "pointer",
        }}
      >
        {loading === "DECLINED"
          ? "Wird gespeichert..."
          : "Ablehnen"}
      </button>

      {error && (
        <div
          style={{
            marginTop: 12,
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
