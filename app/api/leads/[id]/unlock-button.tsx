"use client";

import { useState } from "react";

export default function UnlockButton({
  leadId,
  cost,
}: {
  leadId: string;
  cost: number;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onUnlock() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/leads/${leadId}/unlock`, { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        if (data?.error === "NOT_ENOUGH_CREDITS") {
          setMsg(`Nicht genug Credits (du hast ${data.credits}, brauchst ${data.needed}).`);
        } else {
          setMsg("Unlock fehlgeschlagen.");
        }
        return;
      }

      // Reload damit Seite nun „unlocked“ Details zeigt
      window.location.reload();
    } catch {
      setMsg("Netzwerkfehler.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/60">Lead ist gesperrt</div>
          <div className="font-semibold">Unlock kostet {cost} Credits</div>
        </div>

        <button
          onClick={onUnlock}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500 disabled:opacity-60"
        >
          {loading ? "Unlock..." : "Jetzt freischalten"}
        </button>
      </div>

      {msg && <div className="mt-3 text-sm text-red-200">{msg}</div>}
    </div>
  );
}