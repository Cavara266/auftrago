"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type UnlockButtonProps = {
  leadId: string;

  /**
   * Der aktuell gültige Smart-Preis.
   */
  cost: number;

  /**
   * Der reguläre Lead-Preis vor Rabatt.
   */
  originalCost: number;

  currentCredits: number;

  isDiscounted?: boolean;
  discountPercent?: number;
  discountAmount?: number;
  discountLabel?: string | null;
};

type UnlockResponse = {
  ok?: boolean;
  unlocked?: boolean;
  alreadyUnlocked?: boolean;

  error?: string;
  message?: string;

  credits?: number;

  originalPrice?: number;
  currentPrice?: number;
  paidPrice?: number;

  discountPercent?: number;
  discountAmount?: number;
  discountLabel?: string | null;
  isDiscounted?: boolean;

  purchaseCount?: number;
  maxPurchases?: number;
  remainingSlots?: number;
  soldOut?: boolean;
};

function normalizePositiveInteger(
  value: number,
  fallback: number,
) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  const normalizedValue = Math.round(value);

  if (normalizedValue <= 0) {
    return fallback;
  }

  return normalizedValue;
}

export default function UnlockButton({
  leadId,
  cost,
  originalCost,
  currentCredits,
  isDiscounted = false,
  discountPercent = 0,
  discountAmount = 0,
  discountLabel = null,
}: UnlockButtonProps) {
  const router = useRouter();

  const validOriginalCost = normalizePositiveInteger(
    originalCost,
    cost,
  );

  const validCost = normalizePositiveInteger(
    cost,
    validOriginalCost,
  );

  const validCredits = Math.max(
    0,
    Math.round(currentCredits),
  );

  const calculatedDiscountAmount = Math.max(
    0,
    validOriginalCost - validCost,
  );

  const effectiveDiscountAmount = Math.max(
    calculatedDiscountAmount,
    Math.round(discountAmount || 0),
  );

  const calculatedDiscountPercent =
    validOriginalCost > 0
      ? Math.round(
          (effectiveDiscountAmount / validOriginalCost) *
            100,
        )
      : 0;

  const effectiveDiscountPercent = Math.max(
    calculatedDiscountPercent,
    Math.round(discountPercent || 0),
  );

  const hasDiscount =
    isDiscounted &&
    validCost < validOriginalCost &&
    effectiveDiscountAmount > 0;

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<
    string | null
  >(null);

  const [messageType, setMessageType] = useState<
    "success" | "error" | null
  >(null);

  const insufficientCredits =
    validCredits < validCost;

  const missingCredits = Math.max(
    validCost - validCredits,
    0,
  );

  const remainingCredits = Math.max(
    validCredits - validCost,
    0,
  );

  const progress = useMemo(() => {
    if (validCost <= 0) {
      return 100;
    }

    return Math.min(
      100,
      Math.round(
        (validCredits / validCost) * 100,
      ),
    );
  }, [validCost, validCredits]);

  async function handleUnlock() {
    if (loading) {
      return;
    }

    if (insufficientCredits) {
      setMessageType("error");

      setMessage(
        `Dir fehlen ${missingCredits} Credits. Aktuell verfügbar: ${validCredits} Credits.`,
      );

      return;
    }

    const priceText = hasDiscount
      ? `${validCost} Credits statt ${validOriginalCost} Credits`
      : `${validCost} Credits`;

    const confirmed = window.confirm(
      `Kundenkontakt jetzt für ${priceText} freischalten? Danach bleiben dir voraussichtlich ${remainingCredits} Credits.`,
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await fetch(
        `/api/leads/${encodeURIComponent(
          leadId,
        )}/unlock`,
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",

          headers: {
            Accept: "application/json",
          },
        },
      );

      const data =
        (await response
          .json()
          .catch(() => null)) as
          | UnlockResponse
          | null;

      if (!response.ok || !data?.ok) {
        if (
          data?.error ===
          "NOT_ENOUGH_CREDITS"
        ) {
          throw new Error(
            `Nicht genügend Credits. Aktueller Stand: ${
              data.credits ?? validCredits
            } Credits.`,
          );
        }

        if (
          data?.error === "LEAD_EXPIRED"
        ) {
          throw new Error(
            "Diese Kundenanfrage ist bereits abgelaufen.",
          );
        }

        if (
          data?.error === "LEAD_SOLD_OUT"
        ) {
          throw new Error(
            "Diese Kundenanfrage wurde bereits vollständig vergeben.",
          );
        }

        throw new Error(
          data?.message ||
            data?.error ||
            "Die Kundenanfrage konnte nicht freigeschaltet werden.",
        );
      }

      const paidPrice =
        data.paidPrice ??
        data.currentPrice ??
        validCost;

      const remainingServerCredits =
        typeof data.credits === "number"
          ? data.credits
          : Math.max(
              validCredits - paidPrice,
              0,
            );

      setMessageType("success");

      if (data.alreadyUnlocked) {
        setMessage(
          "Dieser Kundenkontakt ist bereits freigeschaltet.",
        );
      } else {
        setMessage(
          `Erfolgreich für ${paidPrice} Credits freigeschaltet. Dein neues Guthaben beträgt ${remainingServerCredits} Credits.`,
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "UNLOCK BUTTON ERROR:",
        error,
      );

      setMessageType("error");

      setMessage(
        error instanceof Error
          ? error.message
          : "Die Kundenanfrage konnte nicht freigeschaltet werden.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-sky-300/15 bg-[#071326] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />

              Kundenchance verfügbar
            </div>

            {hasDiscount ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-red-400/25 bg-red-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-red-100">
                  🔥{" "}
                  {discountLabel ||
                    "Smart Deal"}
                </span>

                <span className="rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-yellow-200">
                  {effectiveDiscountPercent}%
                  Rabatt
                </span>
              </div>
            ) : null}

            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Kontaktdaten freischalten
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
              Erhalte sofort Telefonnummer,
              E-Mail und vollständige
              Kundendaten, damit du direkt
              Kontakt aufnehmen kannst.
            </p>
          </div>

          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-2xl sm:flex">
            🔓
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            [
              "Telefon",
              "Direkt anrufen",
              "📞",
            ],
            [
              "E-Mail",
              "Offerte senden",
              "✉️",
            ],
            [
              "Adresse",
              "Auftrag planen",
              "📍",
            ],
          ].map(([title, text, icon]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <div className="text-lg">
                {icon}
              </div>

              <div className="mt-3 text-sm font-semibold text-white">
                {title}
              </div>

              <div className="mt-1 text-xs text-white/40">
                {text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[24px] border border-yellow-300/15 bg-gradient-to-br from-yellow-300/[0.10] to-transparent p-5">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-yellow-100/50">
                Freischaltung
              </div>

              {hasDiscount ? (
                <div className="mt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white/35 line-through decoration-red-400 decoration-2">
                      {validOriginalCost} Credits
                    </span>

                    <span className="rounded-full border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-red-200">
                      Spare{" "}
                      {effectiveDiscountAmount}
                    </span>
                  </div>

                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-bold tracking-tight text-yellow-300 sm:text-5xl">
                      {validCost}
                    </span>

                    <span className="pb-1 text-sm font-bold uppercase tracking-[0.13em] text-yellow-100/55">
                      Credits
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight text-yellow-300 sm:text-5xl">
                    {validCost}
                  </span>

                  <span className="pb-1 text-sm font-bold uppercase tracking-[0.13em] text-yellow-100/55">
                    Credits
                  </span>
                </div>
              )}
            </div>

            <div className="sm:text-right">
              <div className="text-xs uppercase tracking-[0.13em] text-white/35">
                Dein Guthaben
              </div>

              <div className="mt-1 text-lg font-semibold text-white">
                {validCredits} Credits
              </div>

              {!insufficientCredits ? (
                <div className="mt-1 text-xs text-emerald-200/70">
                  Danach verbleiben{" "}
                  {remainingCredits} Credits
                </div>
              ) : (
                <div className="mt-1 text-xs text-red-200/75">
                  Es fehlen {missingCredits}{" "}
                  Credits
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={[
                "h-full rounded-full transition-all duration-500",
                insufficientCredits
                  ? "bg-gradient-to-r from-orange-400 to-red-400"
                  : "bg-gradient-to-r from-sky-400 to-emerald-400",
              ].join(" ")}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {hasDiscount ? (
            <p className="mt-4 text-xs leading-5 text-yellow-100/55">
              Der Rabatt wird beim Kauf
              nochmals direkt auf dem Server
              geprüft. Abgebucht wird immer der
              aktuell gültige Smart-Preis.
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleUnlock}
          disabled={
            loading || insufficientCredits
          }
          className={[
            "mt-5 inline-flex min-h-[60px] w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-bold transition duration-200",
            insufficientCredits
              ? "cursor-not-allowed border border-red-400/20 bg-red-400/10 text-red-100"
              : hasDiscount
                ? "bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 text-[#1b0b04] shadow-[0_18px_55px_rgba(251,146,60,0.28)] hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(251,146,60,0.38)] active:translate-y-0"
                : "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white shadow-[0_18px_55px_rgba(59,130,246,0.30)] hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(59,130,246,0.40)] active:translate-y-0",
            loading
              ? "cursor-wait opacity-65"
              : "",
          ].join(" ")}
        >
          <span className="text-xl">
            {loading
              ? "⏳"
              : hasDiscount
                ? "🔥"
                : "🔓"}
          </span>

          {loading
            ? "Kontakt wird freigeschaltet..."
            : insufficientCredits
              ? "Nicht genügend Credits"
              : hasDiscount
                ? `Smart Deal sichern · ${validCost} Credits`
                : `Kontaktdaten freischalten · ${validCost} Credits`}
        </button>

        {insufficientCredits ? (
          <Link
            href="/credits"
            className="mt-3 inline-flex min-h-[50px] w-full items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-5 py-3 text-sm font-bold text-yellow-200 transition hover:bg-yellow-300/15"
          >
            Credits aufladen →
          </Link>
        ) : (
          <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-white/35">
            <span>⚡</span>

            Die Kontaktdaten werden direkt
            nach der Freischaltung angezeigt.
          </div>
        )}

        {message ? (
          <div
            className={[
              "mt-5 rounded-2xl border px-4 py-4 text-sm leading-6",
              messageType === "success"
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
                : "border-red-400/20 bg-red-400/10 text-red-100",
            ].join(" ")}
            aria-live="polite"
            role="status"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-base">
                {messageType === "success"
                  ? "✅"
                  : "⚠️"}
              </span>

              <span>{message}</span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}