"use client";

import { useState } from "react";

export default function UnlockButton({
  leadId,
  priceCredits,
  isUnlocked,
}: {
  leadId: string;
  priceCredits: number;
  isUnlocked: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUnlock() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Freischaltung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      // Refresh server components
      window.location.reload();
    } catch {
      setError("Freischaltung fehlgeschlagen.");
      setLoading(false);
    }
  }

  if (isUnlocked) {
    return (
      <button
        disabled
        className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 sm:w-auto sm:px-5 sm:py-2.5"
      >
        Freigeschaltet
      </button>
    );
  }

  return (
    <div className="w-full space-y-2 text-right sm:w-auto">
      <button
        onClick={onUnlock}
        disabled={loading}
        className="w-full rounded-2xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-5 sm:py-2.5"
      >
        {loading ? "Freischalten..." : `Freischalten (${priceCredits} Credits)`}
      </button>

      {error && (
        <div className="text-xs text-red-300 sm:text-right">
          {error}
        </div>
      )}
    </div>
  );
}