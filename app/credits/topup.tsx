"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreditTopup({
  amount,
  custom,
}: {
  amount: number;
  custom?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [val, setVal] = useState(amount || 10);

  async function topup(n: number) {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/credits/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: n }),
      });

      if (!res.ok) {
        const txt = await res.text();
        setErr(txt || "Topup fehlgeschlagen.");
        return;
      }

      router.refresh();
    } catch {
      setErr("Serverfehler.");
    } finally {
      setLoading(false);
    }
  }

  if (custom) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            className="input"
            type="number"
            min={1}
            max={500}
            value={val}
            onChange={(e) => setVal(Number(e.target.value))}
          />
          <button
            className="btn btn-primary"
            disabled={loading || !val || val < 1}
            onClick={() => topup(val)}
          >
            {loading ? "…" : "Hinzufügen"}
          </button>
        </div>
        {err && <div className="text-xs text-red-400">{err}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        className="btn btn-primary w-full"
        disabled={loading}
        onClick={() => topup(amount)}
      >
        {loading ? "…" : `+${amount} Credits`}
      </button>
      {err && <div className="text-xs text-red-400">{err}</div>}
    </div>
  );
}