"use client";

import { useMemo, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  createFixedOrder,
  type CreateFixedOrderState,
} from "./actions";

const categories = [
  "Umzugsreinigung",
  "Unterhaltsreinigung",
  "Grundreinigung",
  "Fensterreinigung",
  "Hauswartung",
  "Umzug",
  "Transport",
  "Entsorgung",
  "Gartenpflege",
  "Malerarbeiten",
  "Sanitär",
  "Elektriker",
  "Sonstiges",
];

const regions = [
  "Aargau",
  "Zürich",
  "Bern",
  "Basel-Stadt",
  "Basel-Landschaft",
  "Luzern",
  "Zug",
  "Solothurn",
  "Schwyz",
  "St. Gallen",
  "Thurgau",
  "Schaffhausen",
  "Graubünden",
  "Freiburg",
  "Waadt",
  "Wallis",
  "Tessin",
  "Andere Region",
];

const initialState: CreateFixedOrderState = {};

function parseOrderValue(value: string) {
  const normalizedValue = value
    .trim()
    .replace(/\s/g, "")
    .replace(/CHF/gi, "")
    .replace(/['’]/g, "")
    .replace(",", ".");

  const amount = Number(normalizedValue);

  return Number.isFinite(amount) ? amount : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(value);
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-6 py-3 font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {pending
        ? "Fixauftrag wird erstellt..."
        : "Fixauftrag veröffentlichen"}
    </button>
  );
}

export default function FixedOrderForm() {
  const [state, formAction] = useFormState(
    createFixedOrder,
    initialState
  );

  const [orderValue, setOrderValue] = useState("");
  const [flexibleDate, setFlexibleDate] = useState(false);

  const calculations = useMemo(() => {
    const value = parseOrderValue(orderValue);
    const commission = value * 0.25;
    const remainingValue = value - commission;

    return {
      orderValue: value,
      commission,
      remainingValue,
    };
  }, [orderValue]);

  const inputClasses =
    "min-h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/60 focus:bg-white/[0.06]";

  const labelClasses =
    "mb-2 block text-sm font-semibold text-slate-200";

  return (
    <form action={formAction} className="space-y-8">
      {state.error ? (
        <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-200">
          {state.error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Auftrag
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Öffentliche Auftragsinformationen
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Diese Angaben können Anbieter vor der Übernahme sehen.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClasses}>
              Titel *
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="z. B. Umzugsreinigung 4.5 Zimmer in Zürich"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="category" className={labelClasses}>
              Kategorie *
            </label>

            <select
              id="category"
              name="category"
              required
              defaultValue=""
              className={inputClasses}
            >
              <option value="" disabled>
                Kategorie auswählen
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-slate-900"
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="region" className={labelClasses}>
              Region
            </label>

            <select
              id="region"
              name="region"
              defaultValue=""
              className={inputClasses}
            >
              <option value="">Region auswählen</option>

              {regions.map((region) => (
                <option
                  key={region}
                  value={region}
                  className="bg-slate-900"
                >
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClasses}>
              Auftragsbeschreibung
            </label>

            <textarea
              id="description"
              name="description"
              rows={7}
              placeholder="Beschreibe Umfang, Zimmer, Fläche, Zusatzarbeiten, Material, Besonderheiten und alle vereinbarten Leistungen."
              className={`${inputClasses} resize-y`}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-5 sm:p-7">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Preis
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Auftragswert und Vermittlungsgebühr
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label htmlFor="orderValue" className={labelClasses}>
              Vereinbarter Kundenpreis *
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-bold text-slate-400">
                CHF
              </span>

              <input
                id="orderValue"
                name="orderValue"
                type="text"
                inputMode="decimal"
                required
                value={orderValue}
                onChange={(event) =>
                  setOrderValue(event.target.value)
                }
                placeholder="2'000.00"
                className={`${inputClasses} pl-16`}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Diesen Betrag stellt der Anbieter später dem Kunden selbst in Rechnung.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <span className="text-sm text-slate-400">
                Auftragswert
              </span>

              <span className="font-bold">
                {formatCurrency(calculations.orderValue)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
              <span className="text-sm text-slate-400">
                Vermittlungsgebühr
              </span>

              <span className="font-bold text-amber-300">
                25 %
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
              <span className="text-sm text-slate-400">
                Anbieter bezahlt
              </span>

              <span className="text-xl font-bold text-amber-300">
                {formatCurrency(calculations.commission)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
              <span className="text-sm text-slate-400">
                Verbleibender Auftragswert
              </span>

              <span className="font-bold text-emerald-300">
                {formatCurrency(calculations.remainingValue)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Kundendaten
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Vertrauliche Kontaktdaten
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Diese Daten werden erst nach der erfolgreichen Bezahlung freigeschaltet.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="customerFirstName" className={labelClasses}>
              Vorname *
            </label>

            <input
              id="customerFirstName"
              name="customerFirstName"
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="customerLastName" className={labelClasses}>
              Nachname *
            </label>

            <input
              id="customerLastName"
              name="customerLastName"
              required
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="customerPhone" className={labelClasses}>
              Telefonnummer *
            </label>

            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              required
              placeholder="+41 79 000 00 00"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="customerEmail" className={labelClasses}>
              E-Mail
            </label>

            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              placeholder="kunde@beispiel.ch"
              className={inputClasses}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Einsatzort
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Adresse und Termin
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="street" className={labelClasses}>
              Strasse und Hausnummer *
            </label>

            <input
              id="street"
              name="street"
              required
              placeholder="Musterstrasse 10"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="postalCode" className={labelClasses}>
              PLZ *
            </label>

            <input
              id="postalCode"
              name="postalCode"
              required
              inputMode="numeric"
              placeholder="8000"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="city" className={labelClasses}>
              Ort *
            </label>

            <input
              id="city"
              name="city"
              required
              placeholder="Zürich"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="executionDate" className={labelClasses}>
              Ausführungsdatum
            </label>

            <input
              id="executionDate"
              name="executionDate"
              type="date"
              disabled={flexibleDate}
              required={!flexibleDate}
              className={`${inputClasses} disabled:cursor-not-allowed disabled:opacity-40`}
            />
          </div>

          <div className="flex items-end">
            <label className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <input
                name="flexibleDate"
                type="checkbox"
                checked={flexibleDate}
                onChange={(event) =>
                  setFlexibleDate(event.target.checked)
                }
                className="h-5 w-5 accent-amber-400"
              />

              <span className="text-sm font-semibold">
                Termin ist flexibel
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5 sm:p-7">
        <h2 className="text-xl font-bold">
          Auftrag verbindlich veröffentlichen
        </h2>

        <div className="mt-5 space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              name="customerConfirmed"
              type="checkbox"
              required
              className="mt-1 h-5 w-5 shrink-0 accent-amber-400"
            />

            <span className="text-sm leading-6 text-slate-300">
              Ich bestätige, dass der Kunde diesen Auftrag verbindlich zugesagt hat und der angegebene Auftragswert korrekt ist.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              name="termsConfirmed"
              type="checkbox"
              required
              className="mt-1 h-5 w-5 shrink-0 accent-amber-400"
            />

            <span className="text-sm leading-6 text-slate-300">
              Ich habe sämtliche Kundendaten, Leistungsangaben, den Termin und den Preis geprüft.
            </span>
          </label>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-xs leading-5 text-slate-500">
            Nach der Veröffentlichung ist der Auftrag für freigeschaltete Anbieter sichtbar. Die Kundendaten bleiben bis zur erfolgreichen Bezahlung verborgen.
          </p>

          <SubmitButton />
        </div>
      </section>
    </form>
  );
}