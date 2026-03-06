"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UnlockButton({
  leadId,
  priceCredits,
  disabled,
}: {
  leadId: number;
  priceCredits: number;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onUnlock() {
    try {
      setErr(null);
      setLoading(true);

      const res = await fetch(`/api/leads/${leadId}/unlock`, {
        method: "POST",
      });

      if (!res.ok) {
        const txt = await res.text();
        setErr(txt || "Freischalten fehlgeschlagen.");
        return;
      }

      router.refresh(); // wichtig: Server-Komponenten neu laden (isUnlocked + credits)
    } catch (e: any) {
      setErr("Serverfehler.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={onUnlock}
        disabled={disabled || loading}
        className={[
          "btn btn-primary w-full",
          (disabled || loading) ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {loading ? "Bitte warten…" : `Kontakt freischalten (${priceCredits})`}
      </button>

      {err && <div className="text-sm text-red-400">{err}</div>}
    </div>
  );
}