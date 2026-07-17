"use client";

import { useState } from "react";

type UnlockButtonProps = {
  leadId: string;
  priceCredits: number;
  isUnlocked: boolean;
};

type UnlockResponse = {
  ok?: boolean;
  error?: string;
  message?: string;
};

export default function UnlockButton({
  leadId,
  priceCredits,
  isUnlocked,
}: UnlockButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  async function trackCheckoutStarted() {
    try {
      await fetch("/api/analytics/checkout-started", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          leadId,
          priceCredits,
        }),
      });
    } catch (trackingError) {
      /*
       * Ein Analytics-Fehler darf die Freischaltung
       * des Leads nicht verhindern.
       */
      console.error(
        "CHECKOUT STARTED TRACKING ERROR:",
        trackingError
      );
    }
  }

  async function onUnlock() {
    if (loading || isUnlocked) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      /*
       * Der Kaufstart wird unmittelbar nach der
       * Bestätigung des Anbieters gespeichert.
       */
      await trackCheckoutStarted();

      const response = await fetch("/api/leads/unlock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          leadId,
        }),
      });

      const data =
        (await response
          .json()
          .catch(() => null)) as UnlockResponse | null;

      if (!response.ok || data?.ok === false) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Freischaltung fehlgeschlagen."
        );
      }

      setShowConfirm(false);

      /*
       * Die Seite wird neu geladen, damit die freigeschalteten
       * Kontaktdaten und der aktuelle Credit-Stand angezeigt werden.
       */
      window.location.reload();
    } catch (unlockError) {
      console.error("LEAD UNLOCK ERROR:", unlockError);

      setError(
        unlockError instanceof Error
          ? unlockError.message
          : "Freischaltung fehlgeschlagen."
      );

      setLoading(false);
    }
  }

  function openConfirmation() {
    if (loading || isUnlocked) {
      return;
    }

    setError(null);
    setShowConfirm(true);
  }

  function closeConfirmation() {
    if (loading) {
      return;
    }

    setError(null);
    setShowConfirm(false);
  }

  if (isUnlocked) {
    return (
      <div className="w-full min-w-0">
        <button
          type="button"
          disabled
          className="w-full rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-200"
        >
          Bereits freigeschaltet
        </button>

        <p className="mt-2 text-center text-xs leading-5 text-white/45">
          Kontakt ist bereits geöffnet
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      <button
        type="button"
        onClick={openConfirmation}
        disabled={loading}
        className="w-full rounded-2xl bg-[#7EC8FF] px-5 py-3 text-sm font-semibold text-[#04101d] shadow-[0_14px_40px_rgba(126,200,255,0.18)] transition hover:bg-[#91d2ff] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Wird freigeschaltet..."
          : `Freischalten (${priceCredits} Credits)`}
      </button>

      <p className="mt-2 text-center text-xs leading-5 text-white/45">
        Nur freischalten, wenn der Lead zu deinem Angebot passt
      </p>

      {error ? (
        <div
          className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300 sm:text-sm"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      ) : null}

      {showConfirm ? (
        <div className="mt-4 rounded-[24px] border border-white/10 bg-black/30 p-4 sm:p-5">
          <div className="text-base font-semibold text-white sm:text-lg">
            Lead wirklich freischalten?
          </div>

          <p className="mt-2 text-sm leading-7 text-white/65 sm:text-base">
            Diese Freischaltung kostet{" "}
            <span className="font-semibold text-white">
              {priceCredits} Credits
            </span>
            . Danach wird der Kontakt dauerhaft für dein Konto
            geöffnet.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onUnlock}
              disabled={loading}
              className="w-full rounded-2xl bg-[#7EC8FF] px-5 py-3 text-sm font-semibold text-[#04101d] shadow-[0_14px_40px_rgba(126,200,255,0.18)] transition hover:bg-[#91d2ff] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Wird freigeschaltet..."
                : `Ja, ${priceCredits} Credits einsetzen`}
            </button>

            <button
              type="button"
              onClick={closeConfirmation}
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}