"use client";

import { useState } from "react";

type Props = {
  applicationId: string;
  contactPerson?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  candidateNote?: string | null;
  internalNote?: string | null;
  followUpAt?: string | null;
  reminderAt?: string | null;
};

function toInputDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return local.toISOString().slice(0, 16);
}

export default function CrmPanel({
  applicationId,
  contactPerson,
  contactEmail,
  contactPhone,
  candidateNote,
  internalNote,
  followUpAt,
  reminderAt,
}: Props) {
  const [form, setForm] = useState({
    contactPerson: contactPerson || "",
    contactEmail: contactEmail || "",
    contactPhone: contactPhone || "",
    candidateNote: candidateNote || "",
    internalNote: internalNote || "",
    followUpAt: toInputDate(followUpAt),
    reminderAt: toInputDate(reminderAt),
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function save(markContacted = false) {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/candidates/applications/${applicationId}/crm`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            followUpAt: form.followUpAt
              ? new Date(form.followUpAt).toISOString()
              : null,
            reminderAt: form.reminderAt
              ? new Date(form.reminderAt).toISOString()
              : null,
            markContacted,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Speichern fehlgeschlagen.");
      }

      setMessage(
        markContacted
          ? "Kontakt und CRM-Daten gespeichert."
          : "CRM-Daten gespeichert.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Speichern fehlgeschlagen.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-[28px] border border-white/[0.08] bg-[#091527] p-6 sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
            Talent CRM
          </span>

          <h2 className="mt-2 text-2xl font-black text-white">
            Bewerbung verwalten
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Kontakte, Notizen und nächste Schritte zentral speichern.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => save(true)}
          className="min-h-[46px] rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-5 text-sm font-bold text-emerald-300 transition hover:bg-emerald-400/[0.12] disabled:opacity-50"
        >
          Kontakt erfolgt
        </button>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Kontaktperson
          </span>

          <input
            value={form.contactPerson}
            onChange={(event) => update("contactPerson", event.target.value)}
            placeholder="Name"
            className="mt-2 min-h-[50px] w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            E-Mail
          </span>

          <input
            type="email"
            value={form.contactEmail}
            onChange={(event) => update("contactEmail", event.target.value)}
            placeholder="name@firma.ch"
            className="mt-2 min-h-[50px] w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Telefon
          </span>

          <input
            value={form.contactPhone}
            onChange={(event) => update("contactPhone", event.target.value)}
            placeholder="+41..."
            className="mt-2 min-h-[50px] w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Follow-up
          </span>

          <input
            type="datetime-local"
            value={form.followUpAt}
            onChange={(event) => update("followUpAt", event.target.value)}
            className="mt-2 min-h-[50px] w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white outline-none focus:border-sky-400/40"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Erinnerung
          </span>

          <input
            type="datetime-local"
            value={form.reminderAt}
            onChange={(event) => update("reminderAt", event.target.value)}
            className="mt-2 min-h-[50px] w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm text-white outline-none focus:border-sky-400/40"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Meine Notiz
          </span>

          <textarea
            value={form.candidateNote}
            onChange={(event) => update("candidateNote", event.target.value)}
            placeholder="Was ist wichtig bei dieser Bewerbung?"
            className="mt-2 min-h-[150px] w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Interne CRM-Notiz
          </span>

          <textarea
            value={form.internalNote}
            onChange={(event) => update("internalNote", event.target.value)}
            placeholder="Gespräch, Rückmeldung, nächste Schritte ..."
            className="mt-2 min-h-[150px] w-full resize-y rounded-xl border border-white/[0.08] bg-white/[0.035] p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
          />
        </label>
      </div>

      {message && (
        <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm font-bold text-emerald-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-4 py-3 text-sm font-bold text-red-300">
          {error}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={() => save(false)}
          className="min-h-[50px] rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-7 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          {saving ? "Speichern..." : "CRM speichern"}
        </button>
      </div>
    </section>
  );
}
