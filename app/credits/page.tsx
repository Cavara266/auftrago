"use client";

import { useState } from "react";

export default function CreditsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      credits: 20,
      price: 28,
      discount: null,
    },
    {
      id: "pro",
      credits: 50,
      price: 63,
      discount: "10% Rabatt",
    },
    {
      id: "business",
      credits: 100,
      price: 112,
      discount: "20% Rabatt",
    },
  ];

  async function buy(planId: string) {
    setLoading(planId);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Fehler beim Checkout");
        setLoading(null);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert("Keine Stripe URL erhalten.");
    } catch {
      alert("Fehler beim Checkout");
    }

    setLoading(null);
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-4xl font-semibold">Credits kaufen</h1>

        <p className="mb-12 text-white/60">
          Schalte Leads frei und kontaktiere Kunden direkt.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
            >
              <div>
                <h2 className="mb-2 text-2xl font-semibold">
                  {plan.credits} Credits
                </h2>

                <div className="mb-3 text-4xl font-bold">CHF {plan.price}</div>

                <div className="mb-6 h-6">
                  {plan.discount && (
                    <div className="text-sm text-[#7EC8FF]">
                      {plan.discount}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => buy(plan.id)}
                disabled={loading === plan.id}
                className="w-full rounded-2xl bg-[#7EC8FF] py-3 font-semibold text-black hover:bg-[#6BBEFF] disabled:opacity-60"
              >
                {loading === plan.id ? "Weiterleitung..." : "Credits kaufen"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}