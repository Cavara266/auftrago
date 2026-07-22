import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminFixedOrdersPageProps = {
  searchParams?: {
    status?: string;
    query?: string;
    message?: string;
    error?: string;
  };
};

type StatusFilter =
  | "ALL"
  | "OPEN"
  | "RESERVED"
  | "SOLD"
  | "COMPLETED"
  | "CANCELLED";

const VALID_STATUSES: StatusFilter[] = [
  "ALL",
  "OPEN",
  "RESERVED",
  "SOLD",
  "COMPLETED",
  "CANCELLED",
];

function formatMoney(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Noch offen";
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

function getStatusLabel(status: string) {
  switch (status) {
    case "OPEN":
      return "Offen";

    case "RESERVED":
      return "Reserviert";

    case "SOLD":
      return "Verkauft";

    case "COMPLETED":
      return "Erledigt";

    case "CANCELLED":
      return "Storniert";

    default:
      return status;
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "OPEN":
      return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";

    case "RESERVED":
      return "border-amber-400/25 bg-amber-400/10 text-amber-300";

    case "SOLD":
      return "border-blue-400/25 bg-blue-400/10 text-blue-300";

    case "COMPLETED":
      return "border-violet-400/25 bg-violet-400/10 text-violet-300";

    case "CANCELLED":
      return "border-red-400/25 bg-red-400/10 text-red-300";

    default:
      return "border-white/15 bg-white/[0.05] text-slate-300";
  }
}

function getMessage(message?: string) {
  switch (message) {
    case "created":
      return "Der Fixauftrag wurde erfolgreich erstellt.";

    case "updated":
      return "Der Fixauftrag wurde erfolgreich aktualisiert.";

    case "cancelled":
      return "Der Fixauftrag wurde storniert.";

    case "reopened":
      return "Der Fixauftrag wurde wieder freigegeben.";

    case "completed":
      return "Der Fixauftrag wurde als erledigt markiert.";

    default:
      return null;
  }
}

function getError(error?: string) {
  switch (error) {
    case "not-found":
      return "Der Fixauftrag wurde nicht gefunden.";

    case "cannot-edit":
      return "Dieser Fixauftrag kann aktuell nicht bearbeitet werden.";

    case "cannot-cancel":
      return "Dieser Fixauftrag kann aktuell nicht storniert werden.";

    default:
      return error
        ? "Die Aktion konnte nicht ausgeführt werden."
        : null;
  }
}

export default async function AdminFixedOrdersPage({
  searchParams,
}: AdminFixedOrdersPageProps) {
  const rawStatus =
    searchParams?.status?.trim().toUpperCase() || "ALL";

  const status: StatusFilter = VALID_STATUSES.includes(
    rawStatus as StatusFilter
  )
    ? (rawStatus as StatusFilter)
    : "ALL";

  const query = searchParams?.query?.trim() || "";

  const where = {
    ...(status !== "ALL"
      ? {
          status,
        }
      : {}),

    ...(query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              category: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              city: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              postalCode: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              customerFirstName: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              customerLastName: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              customerEmail: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              customerPhone: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [
    fixedOrders,
    totalCount,
    openCount,
    reservedCount,
    soldCount,
    completedCount,
    cancelledCount,
    totalRevenueAggregate,
    monthRevenueAggregate,
  ] = await Promise.all([
    prisma.fixedOrder.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        buyer: {
          select: {
            id: true,
            companyName: true,
            contactName: true,
            email: true,
          },
        },
      },
    }),

    prisma.fixedOrder.count(),

    prisma.fixedOrder.count({
      where: {
        status: "OPEN",
      },
    }),

    prisma.fixedOrder.count({
      where: {
        status: "RESERVED",
      },
    }),

    prisma.fixedOrder.count({
      where: {
        status: "SOLD",
      },
    }),

    prisma.fixedOrder.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.fixedOrder.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.fixedOrder.aggregate({
      where: {
        status: {
          in: ["SOLD", "COMPLETED"],
        },
      },
      _sum: {
        commissionAmountCents: true,
      },
    }),

    prisma.fixedOrder.aggregate({
      where: {
        status: {
          in: ["SOLD", "COMPLETED"],
        },
        soldAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          ),
        },
      },
      _sum: {
        commissionAmountCents: true,
      },
    }),
  ]);

  const totalRevenue =
    totalRevenueAggregate._sum.commissionAmountCents ?? 0;

  const monthRevenue =
    monthRevenueAggregate._sum.commissionAmountCents ?? 0;

  const successMessage = getMessage(searchParams?.message);
  const errorMessage = getError(searchParams?.error);

  const statusLinks: Array<{
    value: StatusFilter;
    label: string;
    count: number;
  }> = [
    {
      value: "ALL",
      label: "Alle",
      count: totalCount,
    },
    {
      value: "OPEN",
      label: "Offen",
      count: openCount,
    },
    {
      value: "RESERVED",
      label: "Reserviert",
      count: reservedCount,
    },
    {
      value: "SOLD",
      label: "Verkauft",
      count: soldCount,
    },
    {
      value: "COMPLETED",
      label: "Erledigt",
      count: completedCount,
    },
    {
      value: "CANCELLED",
      label: "Storniert",
      count: cancelledCount,
    },
  ];

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              ← Zurück zum Admin-Dashboard
            </Link>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-amber-400">
              Auftrago Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Fixaufträge
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
              Verwalte bestätigte Kundenaufträge, Verkäufe,
              Reservierungen und Vermittlungsgebühren.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/fixed-orders/analytics"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-bold transition hover:bg-white/[0.1]"
            >
              Analytics
            </Link>

            <Link
              href="/admin/fixed-orders/new"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300"
            >
              + Neuer Fixauftrag
            </Link>
          </div>
        </header>

        {successMessage ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-200">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/10 px-5 py-4 text-sm font-semibold text-red-200">
            {errorMessage}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-[#0d1320] p-5">
            <p className="text-sm text-slate-400">
              Fixaufträge insgesamt
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalCount}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {openCount} aktuell verfügbar
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
            <p className="text-sm text-emerald-300">
              Verkauft und erledigt
            </p>

            <p className="mt-2 text-3xl font-bold">
              {soldCount + completedCount}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {reservedCount} momentan reserviert
            </p>
          </article>

          <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
            <p className="text-sm text-amber-300">
              Provision diesen Monat
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatMoney(monthRevenue)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Erfolgreich bezahlte Übernahmen
            </p>
          </article>

          <article className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.05] p-5">
            <p className="text-sm text-blue-300">
              Provision insgesamt
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatMoney(totalRevenue)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Seit Beginn der Fixaufträge
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#0d1320] p-5 sm:p-6">
          <form
            method="GET"
            className="flex flex-col gap-3 lg:flex-row"
          >
            <div className="flex-1">
              <label
                htmlFor="query"
                className="sr-only"
              >
                Fixaufträge durchsuchen
              </label>

              <input
                id="query"
                name="query"
                type="search"
                defaultValue={query}
                placeholder="Titel, Kategorie, Ort, Kunde, E-Mail oder Telefon suchen"
                className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/40"
              />
            </div>

            {status !== "ALL" ? (
              <input
                type="hidden"
                name="status"
                value={status}
              />
            ) : null}

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-slate-200"
            >
              Suchen
            </button>

            {query || status !== "ALL" ? (
              <Link
                href="/admin/fixed-orders"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold transition hover:bg-white/[0.08]"
              >
                Filter löschen
              </Link>
            ) : null}
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {statusLinks.map((item) => {
              const isActive = status === item.value;

              const params = new URLSearchParams();

              if (item.value !== "ALL") {
                params.set("status", item.value);
              }

              if (query) {
                params.set("query", query);
              }

              const href = params.toString()
                ? `/admin/fixed-orders?${params.toString()}`
                : "/admin/fixed-orders";

              return (
                <Link
                  key={item.value}
                  href={href}
                  className={`inline-flex min-h-10 items-center justify-center rounded-xl border px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "border-amber-400 bg-amber-400 text-black"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? "bg-black/15 text-black"
                        : "bg-white/[0.08] text-slate-400"
                    }`}
                  >
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          {fixedOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-3xl">
                🔥
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Keine Fixaufträge gefunden
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Für den gewählten Filter oder Suchbegriff
                wurden keine passenden Fixaufträge gefunden.
              </p>

              <Link
                href="/admin/fixed-orders/new"
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-bold text-black transition hover:bg-amber-300"
              >
                Ersten Fixauftrag erstellen
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320]">
              <div className="hidden grid-cols-[minmax(250px,2fr)_150px_150px_150px_170px] gap-4 border-b border-white/10 bg-white/[0.03] px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 xl:grid">
                <span>Auftrag</span>
                <span>Status</span>
                <span>Auftragswert</span>
                <span>Provision</span>
                <span>Aktion</span>
              </div>

              <div className="divide-y divide-white/10">
                {fixedOrders.map((order) => (
                  <article
                    key={order.id}
                    className="grid gap-5 px-5 py-6 transition hover:bg-white/[0.025] sm:px-6 xl:grid-cols-[minmax(250px,2fr)_150px_150px_150px_170px] xl:items-center xl:gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          {order.category}
                        </p>

                        {order.flexibleDate ? (
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                            Termin flexibel
                          </span>
                        ) : null}
                      </div>

                      <h2 className="mt-1 truncate text-lg font-bold">
                        {order.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {order.postalCode} {order.city}
                        {order.region
                          ? ` · ${order.region}`
                          : ""}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                        <span>
                          Ausführung:{" "}
                          {order.flexibleDate
                            ? "Flexibel"
                            : formatDate(order.executionDate)}
                        </span>

                        <span>
                          Erstellt:{" "}
                          {formatDateTime(order.createdAt)}
                        </span>

                        {order.buyer ? (
                          <span className="text-blue-300">
                            Käufer: {order.buyer.companyName}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>

                      {order.status === "RESERVED" &&
                      order.reservedAt ? (
                        <p className="mt-2 text-xs text-slate-500">
                          Seit{" "}
                          {formatDateTime(order.reservedAt)}
                        </p>
                      ) : null}

                      {(order.status === "SOLD" ||
                        order.status === "COMPLETED") &&
                      order.soldAt ? (
                        <p className="mt-2 text-xs text-slate-500">
                          {formatDateTime(order.soldAt)}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 xl:hidden">
                        Auftragswert
                      </p>

                      <p className="mt-1 font-bold">
                        {formatMoney(order.orderValueCents)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 xl:hidden">
                        Provision
                      </p>

                      <p className="mt-1 font-bold text-amber-300">
                        {formatMoney(
                          order.commissionAmountCents
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {order.commissionPercent} %
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/admin/fixed-orders/${order.id}`}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-slate-200"
                      >
                        Öffnen
                      </Link>

                      {order.status === "OPEN" ? (
                        <Link
                          href={`/admin/fixed-orders/${order.id}/edit`}
                          className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-bold transition hover:bg-white/[0.08]"
                        >
                          Bearbeiten
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-bold">
            Status-Erklärung
          </h2>

          <div className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <strong className="text-emerald-300">
                Offen
              </strong>
              <p className="mt-1">
                Im Anbieterportal verfügbar.
              </p>
            </div>

            <div>
              <strong className="text-amber-300">
                Reserviert
              </strong>
              <p className="mt-1">
                Anbieter befindet sich im Checkout.
              </p>
            </div>

            <div>
              <strong className="text-blue-300">
                Verkauft
              </strong>
              <p className="mt-1">
                Stripe-Zahlung wurde bestätigt.
              </p>
            </div>

            <div>
              <strong className="text-violet-300">
                Erledigt
              </strong>
              <p className="mt-1">
                Auftrag wurde abgeschlossen.
              </p>
            </div>

            <div>
              <strong className="text-red-300">
                Storniert
              </strong>
              <p className="mt-1">
                Auftrag ist nicht mehr verfügbar.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}