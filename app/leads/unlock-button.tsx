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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Freischaltung fehlgeschlagen.");
        setLoading(false);
        return;
      }

      window.location.reload();
    } catch {
      setError("Freischaltung fehlgeschlagen.");
      setLoading(false);
    }
  }

  if (isUnlocked) {
    return (
      <div className="w-full">
        <button
          disabled
          className="w-full rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 sm:px-5 sm:py-3"
        >
          Bereits freigeschaltet
        </button>

        <p className="mt-2 text-center text-xs leading-5 text-white/45">
          Kontakt ist bereits geöffnet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={onUnlock}
        disabled={loading}
        className="w-full rounded-2xl bg-[#7EC8FF] px-4 py-3 text-sm font-semibold text-[#04101d] shadow-[0_14px_40px_rgba(126,200,255,0.18)] transition hover:bg-[#91d2ff] disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 sm:py-3"
      >
        {loading ? "Wird freigeschaltet..." : `Freischalten (${priceCredits} Credits)`}
      </button>

      <p className="mt-2 text-center text-xs leading-5 text-white/45">
        Nur freischalten, wenn der Lead zu deinem Angebot passt
      </p>

      {error ? (
        <div className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300 sm:text-sm">
          {error}
        </div>
      ) : null}
    </div>
  );
}