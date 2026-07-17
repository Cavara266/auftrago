"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OfferStatus = "SENT" | "ACCEPTED" | "DECLINED";

type Offer = {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  status: OfferStatus;
  pdfUrl: string | null;
  createdAt: string;
};

type LeadOffersProps = {
  purchaseId: string;
  leadTitle: string;
  customerName: string;
  initialOffers: Offer[];
};

const STATUS_LABELS: Record<OfferStatus, string> = {
  SENT: "Gesendet",
  ACCEPTED: "Angenommen",
  DECLINED: "Abgelehnt",
};

function formatMoney(amount: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function LeadOffers({
  purchaseId,
  leadTitle,
  customerName,
  initialOffers,
}: LeadOffersProps) {
  const router = useRouter();

  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState(`Offerte – ${leadTitle}`);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function createOffer() {
    const cleanedAmount = amount
      .replaceAll("'", "")
      .replaceAll(" ", "")
      .replace(",", ".");

    const numericAmount = Number(cleanedAmount);

    if (!title.trim()) {
      setError("Bitte einen Titel eingeben.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Bitte einen gültigen Betrag eingeben.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/crm/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          purchaseId,
          title: title.trim(),
          description: description.trim() || null,
          amount: numericAmount,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.message || "Die Offerte konnte nicht erstellt werden."
        );
      }

      setOffers((current) => [data.offer, ...current]);
      setDescription("");
      setAmount("");
      setFormOpen(false);
      setSuccess("Die Offerte wurde erfolgreich erstellt.");

      router.refresh();
    } catch (offerError) {
      setError(
        offerError instanceof Error
          ? offerError.message
          : "Die Offerte konnte nicht erstellt werden."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(offerId: string, status: OfferStatus) {
    setUpdatingId(offerId);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/crm/offer", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          offerId,
          status,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.message || "Der Status konnte nicht geändert werden."
        );
      }

      setOffers((current) =>
        current.map((offer) =>
          offer.id === offerId
            ? {
                ...offer,
                status,
              }
            : offer
        )
      );

      setSuccess("Der Offertenstatus wurde aktualisiert.");
      router.refresh();
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : "Der Status konnte nicht geändert werden."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0b1427]/95 shadow-[0_30px_100px_rgba(0,0,0,0.28)]">
      <div className="flex flex-col justify-between gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.18em] text-amber-200/70">
            Offerten
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Offerten für {customerName}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/50">
            Erstelle Angebote direkt im Portal und verfolge, ob die Offerte
            gesendet, angenommen oder abgelehnt wurde.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormOpen((current) => !current);
            setError(null);
            setSuccess(null);
          }}
          className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#04101d] transition hover:bg-amber-100"
        >
          {formOpen ? "Schliessen" : "+ Neue Offerte"}
        </button>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        {formOpen ? (
          <div className="rounded-[26px] border border-amber-300/20 bg-amber-300/[0.04] p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-white/40">
                  Titel
                </span>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={150}
                  className="mt-2 min-h-[50px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-amber-300/40"
                />
              </label>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.14em] text-white/40">
                  Betrag in CHF
                </span>

                <input
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  inputMode="decimal"
                  placeholder="Zum Beispiel 1490"
                  className="mt-2 min-h-[50px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/40"
                />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-white/40">
                Leistungsbeschreibung
              </span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                maxLength={3000}
                placeholder="Zum Beispiel: Komplette Umzugsreinigung inklusive Fenster, Storen und Abgabegarantie."
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-white/25 focus:border-amber-300/40"
              />
            </label>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={createOffer}
                disabled={saving}
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-amber-300 px-6 py-3 text-sm font-black text-[#1a1300] transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Wird gespeichert ..." : "Offerte speichern"}
              </button>
            </div>
          </div>
        ) : null}

        {offers.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {offers.map((offer) => (
              <article
                key={offer.id}
                className="rounded-[26px] border border-white/10 bg-white/[0.035] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-white/35">
                      {formatDate(offer.createdAt)}
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {offer.title}
                    </h3>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/60">
                    {STATUS_LABELS[offer.status]}
                  </span>
                </div>

                <div className="mt-5 text-3xl font-black tracking-tight text-amber-200">
                  {formatMoney(offer.amount)}
                </div>

                {offer.description ? (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/55">
                    {offer.description}
                  </p>
                ) : null}

                {offer.pdfUrl ? (
                  <a
                    href={offer.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-bold text-white/70 transition hover:bg-white/[0.1]"
                  >
                    PDF öffnen
                  </a>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  {(
                    ["SENT", "ACCEPTED", "DECLINED"] as OfferStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateStatus(offer.id, status)}
                      disabled={
                        updatingId === offer.id || offer.status === status
                      }
                      className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-xs font-bold text-white/60 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[26px] border border-dashed border-white/10 p-6 text-sm leading-7 text-white/40">
            Noch keine Offerte vorhanden. Erstelle jetzt die erste Offerte für
            diesen Kunden.
          </div>
        )}
      </div>

      {success || error ? (
        <div
          className={`border-t px-6 py-4 text-sm sm:px-8 ${
            error
              ? "border-red-400/15 bg-red-400/10 text-red-100"
              : "border-emerald-400/15 bg-emerald-400/10 text-emerald-100"
          }`}
          aria-live="polite"
        >
          {error || success}
        </div>
      ) : null}
    </section>
  );
}