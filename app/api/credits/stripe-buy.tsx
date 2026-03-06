"use client";

import { useState } from "react";

export default function StripeBuy({ pack }: { pack: "10" | "25" | "50" }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack }),
      });

      if (!res.ok) {
        const txt = await res.text();
        setErr(txt || "Checkout fehlgeschlagen.");
        return;
      }

      const data = await res.json();
      if (!data?.url) {
        setErr("Keine Checkout URL erhalten.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setErr("Serverfehler.");
    } finally {
      setLoading(false);
    }
  }

  const label =
    pack === "10" ? "CHF 20 → 10 Credits" : pack === "25" ? "CHF 45 → 25 Credits" : "CHF 80 → 50 Credits";

  return (
    <div className="space-y-2">
      <button className="btn btn-primary w-full" onClick={go} disabled={loading}>
        {loading ? "…" : label}
      </button>
      {err && <div className="text-xs text-red-400">{err}</div>}
    </div>
  );
}