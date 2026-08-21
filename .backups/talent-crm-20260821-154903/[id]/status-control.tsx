"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = [
  {
    key: "SENT",
    label: "Beworben",
    description: "Bewerbung wurde versendet",
  },
  {
    key: "VIEWED",
    label: "Angesehen",
    description: "Arbeitgeber hat reagiert",
  },
  {
    key: "INTERVIEW",
    label: "Interview",
    description: "Vorstellungsgespräch geplant",
  },
  {
    key: "OFFER",
    label: "Angebot",
    description: "Jobangebot erhalten",
  },
  {
    key: "HIRED",
    label: "Angestellt",
    description: "Stelle erhalten",
  },
] as const;

function normalizeStatus(status: string) {
  const value = String(status || "SENT").toUpperCase();

  if (value === "APPLIED") return "SENT";
  if (value === "SEEN") return "VIEWED";

  return value;
}

export default function StatusControl({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  const [status, setStatus] = useState(normalizeStatus(currentStatus));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function updateStatus(nextStatus: string) {
    if (loading || nextStatus === status) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/candidates/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Status konnte nicht geändert werden.");
      }

      setStatus(nextStatus);
      setMessage("Status gespeichert.");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Status konnte nicht geändert werden.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-white/[0.08] bg-[#091527] p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
            Talent CRM
          </span>

          <h2 className="mt-3 text-2xl font-black text-white">
            Bewerbungsstatus verwalten
          </h2>

          <p className="mt-2 max-w-[620px] text-sm leading-6 text-slate-400">
            Aktualisiere deinen Bewerbungsprozess. Dashboard und Fortschritt
            werden automatisch synchronisiert.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-5 py-3">
          <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">
            Aktueller Status
          </span>

          <p className="mt-1 font-black text-white">
            {STATUSES.find((item) => item.key === status)?.label || status}
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {STATUSES.map((item, index) => {
          const currentIndex = STATUSES.findIndex(
            (entry) => entry.key === status,
          );

          const active = index <= currentIndex;
          const selected = item.key === status;

          return (
            <button
              key={item.key}
              type="button"
              disabled={loading}
              onClick={() => updateStatus(item.key)}
              className={[
                "group min-h-[112px] rounded-2xl border p-4 text-left transition",
                selected
                  ? "border-sky-400/40 bg-sky-400/[0.10]"
                  : active
                    ? "border-emerald-400/20 bg-emerald-400/[0.05]"
                    : "border-white/[0.08] bg-white/[0.025] hover:border-sky-400/30 hover:bg-sky-400/[0.06]",
                loading ? "cursor-wait opacity-60" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black",
                    active
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "bg-white/[0.05] text-slate-500",
                  ].join(" ")}
                >
                  {index + 1}
                </span>

                {selected && (
                  <span className="text-[9px] font-black uppercase tracking-[0.14em] text-sky-300">
                    Aktiv
                  </span>
                )}
              </div>

              <p className="mt-4 font-black text-white">{item.label}</p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {message && (
        <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm font-bold text-emerald-300">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm font-bold text-red-300">
          {error}
        </div>
      )}
    </section>
  );
}
