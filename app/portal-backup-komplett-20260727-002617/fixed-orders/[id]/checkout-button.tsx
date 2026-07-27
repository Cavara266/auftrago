"use client";

import { useState } from "react";

type FixedOrderCheckoutButtonProps = {
  fixedOrderId: string;
  amountFormatted: string;
};

export default function FixedOrderCheckoutButton({
  fixedOrderId,
  amountFormatted,
}: FixedOrderCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    if (loading) {
      return;
    }

    const confirmed = window.confirm(
      `Möchtest du diesen Fixauftrag verbindlich übernehmen?\n\n` +
        `Zu bezahlen: ${amountFormatted}\n\n` +
        `Nach erfolgreicher Zahlung erhältst du die vollständigen Kundendaten.`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/fixed-orders/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fixedOrderId,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.url) {
        throw new Error(
          data?.error ||
            "Der Checkout konnte nicht gestartet werden."
        );
      }

      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Der Checkout konnte nicht gestartet werden."
      );

      setLoading(false);
    }
  }

  return (
    <div className="mt-5">
      {error ? (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-200">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-base font-bold text-black transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60"
      >
        {loading
          ? "Stripe Checkout wird geöffnet..."
          : `Auftrag übernehmen – ${amountFormatted}`}
      </button>

      <p className="mt-3 text-center text-xs leading-5 text-slate-500">
        Der Auftrag wird während des Zahlungsvorgangs
        vorübergehend für dich reserviert.
      </p>
    </div>
  );
}