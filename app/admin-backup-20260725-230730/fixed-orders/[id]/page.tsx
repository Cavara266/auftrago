import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  cancelFixedOrderAction,
  completeFixedOrderAction,
  deleteFixedOrderAction,
  releaseFixedOrderAction,
  reopenCancelledFixedOrderAction,
  reopenCompletedFixedOrderAction,
} from "../actions";

export const dynamic = "force-dynamic";

type AdminFixedOrderDetailPageProps = {
  params: {
    id: string;
  };
};

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date | null) {
  if (!date) {
    return "–";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date | null) {
  if (!date) {
    return "–";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStatusInformation(status: string) {
  switch (status) {
    case "OPEN":
      return {
        label: "Offen",
        classes:
          "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
      };

    case "RESERVED":
      return {
        label: "Reserviert",
        classes:
          "border-amber-400/25 bg-amber-400/10 text-amber-300",
      };

    case "SOLD":
      return {
        label: "Verkauft",
        classes:
          "border-blue-400/25 bg-blue-400/10 text-blue-300",
      };

    case "COMPLETED":
      return {
        label: "Erledigt",
        classes:
          "border-violet-400/25 bg-violet-400/10 text-violet-300",
      };

    case "CANCELLED":
      return {
        label: "Storniert",
        classes:
          "border-red-400/25 bg-red-400/10 text-red-300",
      };

    default:
      return {
        label: status,
        classes:
          "border-white/15 bg-white/[0.05] text-slate-300",
      };
  }
}

function DetailCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-sm font-semibold text-slate-200 ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value || "–"}
      </p>
    </div>
  );
}

function ActionButton({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue";
}) {
  const classes = {
    neutral:
      "border-white/15 bg-white/[0.05] text-white hover:bg-white/[0.1]",
    green:
      "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20",
    amber:
      "border-amber-400/30 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20",
    red:
      "border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/20",
    blue:
      "border-blue-400/30 bg-blue-400/10 text-blue-200 hover:bg-blue-400/20",
  };

  return (
    <button
      type="submit"
      className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-bold transition ${classes[tone]}`}
    >
      {children}
    </button>
  );
}

export default async function AdminFixedOrderDetailPage({
  params,
}: AdminFixedOrderDetailPageProps) {
  const fixedOrder = await prisma.fixedOrder.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      region: true,

      customerFirstName: true,
      customerLastName: true,
      customerEmail: true,
      customerPhone: true,

      street: true,
      postalCode: true,
      city: true,

      executionDate: true,
      flexibleDate: true,

      orderValueCents: true,
      commissionPercent: true,
      commissionAmountCents: true,

      status: true,
      buyerId: true,

      reservedAt: true,
      soldAt: true,
      completedAt: true,
      cancelledAt: true,
      createdAt: true,
      updatedAt: true,

      stripeCheckoutSessionId: true,
      stripePaymentIntentId: true,
    },
  });

  if (!fixedOrder) {
    notFound();
  }

  const buyer = fixedOrder.buyerId
    ? await prisma.provider.findUnique({
        where: {
          id: fixedOrder.buyerId,
        },
        select: {
          id: true,
          companyName: true,
          contactName: true,
          email: true,
          phone: true,
          status: true,
          credits: true,
          createdAt: true,
        },
      })
    : null;

  const statusInformation = getStatusInformation(
    fixedOrder.status
  );

  const customerName = [
    fixedOrder.customerFirstName,
    fixedOrder.customerLastName,
  ]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [
    fixedOrder.street,
    `${fixedOrder.postalCode} ${fixedOrder.city}`,
  ]
    .filter(Boolean)
    .join(", ");

  const canRelease = fixedOrder.status === "RESERVED";
  const canComplete = fixedOrder.status === "SOLD";
  const canReopenCompleted =
    fixedOrder.status === "COMPLETED";
  const canCancel =
    fixedOrder.status === "OPEN" ||
    fixedOrder.status === "RESERVED";
  const canReopenCancelled =
    fixedOrder.status === "CANCELLED";
  const canDelete =
    fixedOrder.status !== "SOLD" &&
    fixedOrder.status !== "COMPLETED" &&
    !fixedOrder.stripePaymentIntentId;

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/fixed-orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              ← Zurück zu den Fixaufträgen
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Fixauftrag verwalten
              </h1>

              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusInformation.classes}`}
              >
                {statusInformation.label}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-400">
              Auftrag, Kunde, Käufer und Stripe-Zahlung an
              einem Ort verwalten.
            </p>
          </div>

          <Link
            href={`/portal/fixed-orders/${fixedOrder.id}`}
            target="_blank"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-5 py-2.5 text-sm font-bold transition hover:bg-white/[0.1]"
          >
            Portalansicht öffnen ↗
          </Link>
        </div>

        <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-7">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                {fixedOrder.category}
              </p>

              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                {fixedOrder.title}
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                  {fixedOrder.region || "Schweiz"}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                  {fixedOrder.postalCode} {fixedOrder.city}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                  {fixedOrder.flexibleDate
                    ? "Termin flexibel"
                    : formatDate(fixedOrder.executionDate)}
                </span>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-slate-500">
                    Auftragswert
                  </p>
                  <p className="mt-2 text-xl font-bold">
                    {formatCurrency(
                      fixedOrder.orderValueCents
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-slate-500">
                    Vermittlungsgebühr
                  </p>
                  <p className="mt-2 text-xl font-bold text-amber-300">
                    {fixedOrder.commissionPercent} %
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-5">
                  <p className="text-xs text-amber-200/70">
                    Verkaufspreis
                  </p>
                  <p className="mt-2 text-xl font-bold text-amber-300">
                    {formatCurrency(
                      fixedOrder.commissionAmountCents
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Leistungsumfang
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Auftragsbeschreibung
              </h2>

              {fixedOrder.description ? (
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-300 sm:text-base">
                  {fixedOrder.description}
                </p>
              ) : (
                <p className="mt-5 text-sm italic text-slate-500">
                  Keine zusätzliche Beschreibung hinterlegt.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                Kundendaten
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Auftraggeber
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailCard
                  label="Kundenname"
                  value={customerName}
                />
                <DetailCard
                  label="Telefonnummer"
                  value={fixedOrder.customerPhone}
                />
                <DetailCard
                  label="E-Mail-Adresse"
                  value={
                    fixedOrder.customerEmail ||
                    "Nicht hinterlegt"
                  }
                />
                <DetailCard
                  label="Vollständige Adresse"
                  value={fullAddress}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={`tel:${fixedOrder.customerPhone}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-400/10 px-4 py-2.5 text-sm font-bold text-blue-200 transition hover:bg-blue-400/20"
                >
                  Kunde anrufen
                </a>

                {fixedOrder.customerEmail ? (
                  <a
                    href={`mailto:${fixedOrder.customerEmail}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-400/10 px-4 py-2.5 text-sm font-bold text-blue-200 transition hover:bg-blue-400/20"
                  >
                    E-Mail schreiben
                  </a>
                ) : null}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    fullAddress
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-bold transition hover:bg-white/[0.1]"
                >
                  Adresse öffnen ↗
                </a>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                Käufer
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Übernehmender Anbieter
              </h2>

              {buyer ? (
                <>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <DetailCard
                      label="Unternehmen"
                      value={buyer.companyName}
                    />
                    <DetailCard
                      label="Kontaktperson"
                      value={buyer.contactName}
                    />
                    <DetailCard
                      label="Anbieterstatus"
                      value={buyer.status}
                    />
                    <DetailCard
                      label="E-Mail-Adresse"
                      value={buyer.email}
                    />
                    <DetailCard
                      label="Telefonnummer"
                      value={
                        buyer.phone || "Nicht hinterlegt"
                      }
                    />
                    <DetailCard
                      label="Aktuelle Credits"
                      value={String(buyer.credits)}
                    />
                    <DetailCard
                      label="Anbieter seit"
                      value={formatDateTime(
                        buyer.createdAt
                      )}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/admin/providers/${buyer.id}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-400/10 px-4 py-2.5 text-sm font-bold text-violet-200 transition hover:bg-violet-400/20"
                    >
                      Anbieter öffnen
                    </Link>

                    <a
                      href={`mailto:${buyer.email}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-bold transition hover:bg-white/[0.1]"
                    >
                      Anbieter kontaktieren
                    </a>
                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
                  Diesem Fixauftrag ist aktuell kein Käufer
                  zugeordnet.
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                Stripe und Zeitverlauf
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Zahlungsinformationen
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailCard
                  label="Stripe Checkout Session"
                  value={
                    fixedOrder.stripeCheckoutSessionId ||
                    "Nicht vorhanden"
                  }
                  mono
                />
                <DetailCard
                  label="Stripe Payment Intent"
                  value={
                    fixedOrder.stripePaymentIntentId ||
                    "Nicht vorhanden"
                  }
                  mono
                />
                <DetailCard
                  label="Erstellt"
                  value={formatDateTime(
                    fixedOrder.createdAt
                  )}
                />
                <DetailCard
                  label="Zuletzt aktualisiert"
                  value={formatDateTime(
                    fixedOrder.updatedAt
                  )}
                />
                <DetailCard
                  label="Reserviert"
                  value={formatDateTime(
                    fixedOrder.reservedAt
                  )}
                />
                <DetailCard
                  label="Verkauft"
                  value={formatDateTime(
                    fixedOrder.soldAt
                  )}
                />
                <DetailCard
                  label="Erledigt"
                  value={formatDateTime(
                    fixedOrder.completedAt
                  )}
                />
                <DetailCard
                  label="Storniert"
                  value={formatDateTime(
                    fixedOrder.cancelledAt
                  )}
                />
              </div>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320]">
              <div className="border-b border-white/10 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                  Admin-Steuerung
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Auftrag verwalten
                </h2>
              </div>

              <div className="space-y-3 p-6">
                {canRelease ? (
                  <form action={releaseFixedOrderAction}>
                    <input
                      type="hidden"
                      name="fixedOrderId"
                      value={fixedOrder.id}
                    />
                    <ActionButton tone="amber">
                      Reservierung freigeben
                    </ActionButton>
                  </form>
                ) : null}

                {canComplete ? (
                  <form action={completeFixedOrderAction}>
                    <input
                      type="hidden"
                      name="fixedOrderId"
                      value={fixedOrder.id}
                    />
                    <ActionButton tone="green">
                      Als erledigt markieren
                    </ActionButton>
                  </form>
                ) : null}

                {canReopenCompleted ? (
                  <form
                    action={
                      reopenCompletedFixedOrderAction
                    }
                  >
                    <input
                      type="hidden"
                      name="fixedOrderId"
                      value={fixedOrder.id}
                    />
                    <ActionButton tone="blue">
                      Wieder auf verkauft setzen
                    </ActionButton>
                  </form>
                ) : null}

                {canCancel ? (
                  <form action={cancelFixedOrderAction}>
                    <input
                      type="hidden"
                      name="fixedOrderId"
                      value={fixedOrder.id}
                    />
                    <ActionButton tone="red">
                      Auftrag stornieren
                    </ActionButton>
                  </form>
                ) : null}

                {canReopenCancelled ? (
                  <form
                    action={
                      reopenCancelledFixedOrderAction
                    }
                  >
                    <input
                      type="hidden"
                      name="fixedOrderId"
                      value={fixedOrder.id}
                    />
                    <ActionButton tone="green">
                      Auftrag wieder öffnen
                    </ActionButton>
                  </form>
                ) : null}

                {!canRelease &&
                !canComplete &&
                !canReopenCompleted &&
                !canCancel &&
                !canReopenCancelled ? (
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-400">
                    Für den aktuellen Status ist keine
                    weitere Statusaktion verfügbar.
                  </div>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
              <p className="text-sm font-bold">
                Technische Referenz
              </p>
              <p className="mt-3 break-all font-mono text-xs leading-6 text-slate-500">
                {fixedOrder.id}
              </p>
            </section>

            {canDelete ? (
              <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-6">
                <p className="text-sm font-bold text-red-200">
                  Gefahrenbereich
                </p>
                <p className="mt-3 text-xs leading-6 text-slate-400">
                  Löschen entfernt den Fixauftrag endgültig.
                  Bezahlte oder abgeschlossene Aufträge
                  können nicht gelöscht werden.
                </p>

                <form
                  action={deleteFixedOrderAction}
                  className="mt-5"
                >
                  <input
                    type="hidden"
                    name="fixedOrderId"
                    value={fixedOrder.id}
                  />
                  <ActionButton tone="red">
                    Fixauftrag endgültig löschen
                  </ActionButton>
                </form>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
