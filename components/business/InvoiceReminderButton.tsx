"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function InvoiceReminderButton({
  invoiceId,
  status,
}: {
  invoiceId: string;
  status: string;
}) {
  const router = useRouter();

  const [loading, setLoading] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (status === "PAID" || status === "CANCELLED") {
    return null;
  }

  async function sendReminder(level: number) {
    const label =
      level === 1
        ? "1. Zahlungserinnerung"
        : "2. Mahnung";

    if (
      !window.confirm(
        `${label} wirklich an den Kunden senden?`
      )
    ) {
      return;
    }

    setLoading(level);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `/api/business/invoices/${invoiceId}/reminder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ level }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Mahnung konnte nicht versendet werden."
        );
      }

      setSuccess(data.message || "Erfolgreich versendet.");
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
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => sendReminder(1)}
          disabled={loading !== null}
          style={{
            padding: "13px 16px",
            borderRadius: 12,
            border:
              "1px solid rgba(56,189,248,.24)",
            background:
              "rgba(14,165,233,.10)",
            color: "#7dd3fc",
            fontWeight: 900,
            cursor:
              loading !== null
                ? "wait"
                : "pointer",
          }}
        >
          {loading === 1
            ? "Wird versendet..."
            : "✉ 1. Zahlungserinnerung"}
        </button>

        <button
          type="button"
          onClick={() => sendReminder(2)}
          disabled={loading !== null}
          style={{
            padding: "13px 16px",
            borderRadius: 12,
            border:
              "1px solid rgba(251,191,36,.25)",
            background:
              "rgba(180,83,9,.12)",
            color: "#fbbf24",
            fontWeight: 900,
            cursor:
              loading !== null
                ? "wait"
                : "pointer",
          }}
        >
          {loading === 2
            ? "Wird versendet..."
            : "⚠ 2. Mahnung"}
        </button>
      </div>

      {success && (
        <div
          style={{
            color: "#86efac",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          ✓ {success}
        </div>
      )}

      {error && (
        <div
          style={{
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
