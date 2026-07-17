"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type LeadStatus =
  | "OPEN"
  | "CONTACTED"
  | "APPOINTMENT_SET"
  | "OFFER_SENT"
  | "WON"
  | "LOST"
  | "NO_OFFER";

type Note = {
  id: string;
  content: string;
  createdAt: string;
};

type Activity = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
};

type LeadCrmProps = {
  purchaseId: string;
  initialStatus: LeadStatus;
  purchaseCreatedAt: string;
  initialNotes: Note[];
  initialActivities: Activity[];
};

const STATUS_OPTIONS: Array<{
  value: LeadStatus;
  label: string;
  description: string;
  tone: string;
}> = [
  {
    value: "OPEN",
    label: "Neu",
    description: "Noch nicht bearbeitet",
    tone: "border-sky-400/25 bg-sky-400/10 text-sky-100",
  },
  {
    value: "CONTACTED",
    label: "Kontaktiert",
    description: "Kunde wurde kontaktiert",
    tone: "border-cyan-400/25 bg-cyan-400/10 text-cyan-100",
  },
  {
    value: "APPOINTMENT_SET",
    label: "Termin vereinbart",
    description: "Besichtigung oder Gespräch geplant",
    tone: "border-violet-400/25 bg-violet-400/10 text-violet-100",
  },
  {
    value: "OFFER_SENT",
    label: "Offerte gesendet",
    description: "Angebot wurde verschickt",
    tone: "border-amber-400/25 bg-amber-400/10 text-amber-100",
  },
  {
    value: "WON",
    label: "Gewonnen",
    description: "Auftrag wurde bestätigt",
    tone: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
  },
  {
    value: "LOST",
    label: "Verloren",
    description: "Auftrag wurde nicht gewonnen",
    tone: "border-red-400/25 bg-red-400/10 text-red-100",
  },
  {
    value: "NO_OFFER",
    label: "Keine Offerte",
    description: "Anfrage wird nicht weiterverfolgt",
    tone: "border-white/15 bg-white/[0.05] text-white/65",
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function activityIcon(type: string) {
  if (type === "STATUS_CHANGED") return "↗";
  if (type === "NOTE_ADDED") return "✎";
  if (type === "LEAD_PURCHASED") return "✓";
  return "•";
}

export default function LeadCrm({
  purchaseId,
  initialStatus,
  purchaseCreatedAt,
  initialNotes,
  initialActivities,
}: LeadCrmProps) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activities, setActivities] =
    useState<Activity[]>(initialActivities);
  const [note, setNote] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentStatus =
    STATUS_OPTIONS.find((option) => option.value === status) ||
    STATUS_OPTIONS[0];

  const timeline = useMemo(() => {
    return [
      ...activities,
      {
        id: "purchase-created",
        type: "LEAD_PURCHASED",
        description: "Kundenanfrage freigeschaltet",
        createdAt: purchaseCreatedAt,
      },
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }, [activities, purchaseCreatedAt]);

  async function updateStatus(nextStatus: LeadStatus) {
    if (savingStatus || nextStatus === status) return;

    const previousStatus = status;
    setStatus(nextStatus);
    setSavingStatus(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/crm/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ purchaseId, status: nextStatus }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || "Status konnte nicht gespeichert werden.");
      }

      if (data.activity) {
        setActivities((current) => [data.activity, ...current]);
      }

      setMessage("Status erfolgreich aktualisiert.");
      router.refresh();
    } catch (statusError) {
      setStatus(previousStatus);
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Status konnte nicht gespeichert werden."
      );
    } finally {
      setSavingStatus(false);
    }
  }

  async function addNote() {
    const content = note.trim();

    if (!content || savingNote) return;

    setSavingNote(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/crm/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ purchaseId, content }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || "Notiz konnte nicht gespeichert werden.");
      }

      setNotes((current) => [data.note, ...current]);
      if (data.activity) {
        setActivities((current) => [data.activity, ...current]);
      }
      setNote("");
      setMessage("Notiz gespeichert.");
      router.refresh();
    } catch (noteError) {
      setError(
        noteError instanceof Error
          ? noteError.message
          : "Notiz konnte nicht gespeichert werden."
      );
    } finally {
      setSavingNote(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1427]/95 shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
      <div className="border-b border-white/10 p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-sky-200/70">
              Auftrago CRM
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Auftrag bearbeiten
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">
              Verfolge den Kontakt vom ersten Anruf bis zum gewonnenen Auftrag.
              Änderungen werden automatisch in der Timeline dokumentiert.
            </p>
          </div>

          <div className={`rounded-2xl border px-4 py-3 ${currentStatus.tone}`}>
            <div className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60">
              Aktueller Status
            </div>
            <div className="mt-1 font-bold">{currentStatus.label}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-6">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
              Pipeline-Status
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {STATUS_OPTIONS.map((option) => {
                const active = option.value === status;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateStatus(option.value)}
                    disabled={savingStatus}
                    className={[
                      "rounded-2xl border p-4 text-left transition",
                      active
                        ? option.tone
                        : "border-white/10 bg-black/10 text-white/70 hover:border-sky-300/25 hover:bg-white/[0.06]",
                      savingStatus ? "cursor-wait opacity-70" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-sm">{option.label}</strong>
                      <span className="text-sm">{active ? "●" : "○"}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5 opacity-60">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
                  Interne Notizen
                </div>
                <h3 className="mt-2 text-xl font-semibold">
                  Gespräch und nächste Schritte
                </h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/45">
                {notes.length} Notizen
              </span>
            </div>

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Zum Beispiel: Kunde angerufen, Offerte bis Freitag gewünscht ..."
              className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/35 focus:bg-black/30"
            />

            <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <span className="text-xs text-white/30">
                {note.length}/2000 Zeichen
              </span>
              <button
                type="button"
                onClick={addNote}
                disabled={savingNote || note.trim().length === 0}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-[#04101d] transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {savingNote ? "Wird gespeichert ..." : "+ Notiz speichern"}
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {notes.length > 0 ? (
                notes.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <p className="whitespace-pre-wrap text-sm leading-7 text-white/70">
                      {item.content}
                    </p>
                    <div className="mt-3 text-xs text-white/30">
                      {formatDate(item.createdAt)}
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm leading-6 text-white/35">
                  Noch keine Notizen vorhanden. Speichere hier Gesprächsdetails,
                  Kundenwünsche und geplante Follow-ups.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-black/15 p-5">
          <div className="text-xs font-black uppercase tracking-[0.15em] text-white/35">
            Aktivitätsverlauf
          </div>
          <h3 className="mt-2 text-xl font-semibold">Timeline</h3>

          <div className="mt-6 space-y-0">
            {timeline.map((item, index) => (
              <div key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index < timeline.length - 1 ? (
                  <div className="absolute left-[17px] top-9 h-[calc(100%-20px)] w-px bg-white/10" />
                ) : null}

                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-300/20 bg-sky-400/10 text-sm font-black text-sky-100">
                  {activityIcon(item.type)}
                </div>

                <div className="min-w-0 pt-1">
                  <div className="text-sm font-semibold text-white/75">
                    {item.description}
                  </div>
                  <div className="mt-1 text-xs text-white/30">
                    {formatDate(item.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {message || error ? (
        <div
          className={[
            "border-t px-6 py-4 text-sm sm:px-8",
            error
              ? "border-red-400/15 bg-red-400/10 text-red-100"
              : "border-emerald-400/15 bg-emerald-400/10 text-emerald-100",
          ].join(" ")}
          aria-live="polite"
        >
          {error || message}
        </div>
      ) : null}
    </section>
  );
}