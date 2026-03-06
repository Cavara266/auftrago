"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOkMsg(null);

    const fd = new FormData(e.currentTarget);

    const payload = {
      title: String(fd.get("title") || "").trim(),
      category: String(fd.get("category") || "").trim(),
      city: String(fd.get("city") || "").trim(),
      description: String(fd.get("description") || "").trim(),

      contactName: String(fd.get("contactName") || "").trim(),
      contactPhone: String(fd.get("contactPhone") || "").trim(),
      contactEmail: String(fd.get("contactEmail") || "").trim(),

      priceCredits: Number(fd.get("priceCredits") || 5),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        setErr(txt || "Speichern fehlgeschlagen.");
        return;
      }

      const data = (await res.json()) as { id: number };
      setOkMsg(`✅ Lead gespeichert (ID: ${data.id})`);

      // optional: direkt zur Lead-Detailseite
      router.push(`/leads/${data.id}`);
      router.refresh();
    } catch {
      setErr("Serverfehler.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm text-white/70">Titel</label>
        <input name="title" className="input" placeholder="z.B. Hauswartung" required />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Kategorie</label>
          <input name="category" className="input" placeholder="Hauswartung / Reinigung" required />
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-white/70">Stadt</label>
          <input name="city" className="input" placeholder="Zürich" required />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm text-white/70">Beschreibung</label>
        <textarea
          name="description"
          className="input min-h-[110px]"
          placeholder="Was wird gesucht?"
          required
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="grid gap-2 sm:col-span-1">
          <label className="text-sm text-white/70">Credits Preis</label>
          <input name="priceCredits" className="input" type="number" min={1} defaultValue={5} />
        </div>
      </div>

      <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Kontakt (wird erst nach Unlock sichtbar)</div>

        <div className="mt-3 grid gap-3">
          <input name="contactName" className="input" placeholder="Name" required />
          <input name="contactPhone" className="input" placeholder="Telefon" required />
          <input name="contactEmail" className="input" placeholder="E-Mail" required />
        </div>
      </div>

      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Speichere…" : "Lead speichern"}
      </button>

      {err && <div className="text-sm text-red-400">{err}</div>}
      {okMsg && <div className="text-sm text-green-400">{okMsg}</div>}
    </form>
  );
}