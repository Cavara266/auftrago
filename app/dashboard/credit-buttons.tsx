"use client";

import { useState } from "react";

type Preset = { label: string; amount: number };

const presets: Preset[] = [
  { label: "+10 Credits", amount: 10 },
  { label: "+50 Credits", amount: 50 },
  { label: "+100 Credits", amount: 100 },
];

export default function CreditButtons() {
  const [loading, setLoading] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function addCredits(amount: number) {
    setLoading(amount);
    setErr(null);
    setOk(null);

    try {
      const res = await fetch("/api/credits/add", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text.slice(0, 200));
      }

      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

      setOk(`Credits hinzugefügt: +${amount}`);
      // Dashboard ist Server Component → reload zeigt neue Credits
      window.location.reload();
    } catch (e: any) {
      setErr(e?.message || "Fehler");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.amount}
            onClick={() => addCredits(p.amount)}
            disabled={loading !== null}
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 disabled:opacity-50"
          >
            {loading === p.amount ? "..." : p.label}
          </button>
        ))}
      </div>

      {ok ? <p className="text-sm text-green-300">{ok}</p> : null}
      {err ? <p className="text-sm text-red-300">{err}</p> : null}
    </div>
  );
}