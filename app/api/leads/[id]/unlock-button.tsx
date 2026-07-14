"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type UnlockButtonProps = {
  leadId: string;
  cost: number;
  currentCredits: number;
};

type UnlockResponse = {
  ok?: boolean;
  unlocked?: boolean;
  alreadyUnlocked?: boolean;
  error?: string;
  message?: string;
  credits?: number;
};

export default function UnlockButton({
  leadId,
  cost,
  currentCredits,
}: UnlockButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<
    "success" | "error" | null
  >(null);

  const insufficientCredits = currentCredits < cost;

  async function handleUnlock() {
    if (loading) {
      return;
    }

    if (insufficientCredits) {
      setMessageType("error");
      setMessage(
        `Nicht genügend Credits. Du hast ${currentCredits}, benötigst aber ${cost}.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Möchtest du diese Kundenanfrage für ${cost} Credits freischalten?`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await fetch(
        `/api/leads/${encodeURIComponent(leadId)}/unlock`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data =
        (await response.json().catch(() => null)) as UnlockResponse | null;

      if (!response.ok || !data?.ok) {
        if (data?.error === "NOT_ENOUGH_CREDITS") {
          throw new Error(
            `Nicht genügend Credits. Aktueller Stand: ${
              data.credits ?? currentCredits
            } Credits.`
          );
        }

        throw new Error(
          data?.message ||
            data?.error ||
            "Die Freischaltung ist fehlgeschlagen."
        );
      }

      setMessageType("success");

      setMessage(
        data.alreadyUnlocked
          ? "Diese Kundenanfrage ist bereits freigeschaltet."
          : "Kundenanfrage erfolgreich freigeschaltet."
      );

      router.refresh();
    } catch (error) {
      console.error("UNLOCK BUTTON ERROR:", error);

      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Die Freischaltung ist fehlgeschlagen."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="text-sm font-medium text-white/55">
            Kundenkontakt freischalten
          </div>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold text-yellow-300">
              {cost}
            </span>

            <span className="pb-1 text-sm font-semibold uppercase tracking-[0.12em] text-yellow-100/60">
              Credits
            </span>
          </div>

          <div className="mt-2 text-sm text-white/45">
            Dein Guthaben: {currentCredits} Credits
          </div>
        </div>

        <button
          type="button"
          onClick={handleUnlock}
          disabled={loading || insufficientCredits}
          className={[
            "inline-flex min-h-[52px] items-center justify-center rounded-2xl px-6 py-3 text-sm font-bold transition",
            insufficientCredits
              ? "cursor-not-allowed border border-red-400/20 bg-red-400/10 text-red-200"
              : "bg-gradient-to-r from-sky-400 to-indigo-500 text-white shadow-[0_16px_45px_rgba(59,130,246,0.22)] hover:-translate-y-0.5",
            loading ? "cursor-wait opacity-60" : "",
          ].join(" ")}
        >
          {loading
            ? "Wird freigeschaltet..."
            : insufficientCredits
              ? "Zu wenig Credits"
              : "🔓 Jetzt freischalten"}
        </button>
      </div>

      {insufficientCredits ? (
        <a
          href="/credits"
          className="mt-4 inline-flex text-sm font-semibold text-yellow-300 hover:text-yellow-200"
        >
          Credits kaufen →
        </a>
      ) : null}

      {message ? (
        <div
          className={[
            "mt-5 rounded-2xl border px-4 py-3 text-sm leading-6",
            messageType === "success"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border-red-400/20 bg-red-400/10 text-red-100",
          ].join(" ")}
          aria-live="polite"
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}