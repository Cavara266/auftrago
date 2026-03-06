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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "Unlock fehlgeschlagen.");
        setLoading(false);
        return;
      }

      // Hard refresh so server components re-fetch credits + unlock state
      window.location.reload();
    } catch {
      setError("Unlock fehlgeschlagen.");
      setLoading(false);
    }
  }

  if (isUnlocked) {
    return (
      <button
        disabled
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70"
      >
        Freigeschaltet
      </button>
    );
  }

  return (
    <div className="text-right">
      <button
        onClick={onUnlock}
        disabled={loading}
        className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-400 disabled:opacity-60"
      >
        {loading ? "..." : `Freischalten (${priceCredits} Credits)`}
      </button>
      {error && <div className="mt-2 text-xs text-red-300">{error}</div>}
    </div>
  );
}