import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type AdminFixedOrdersPageProps = {
  searchParams?: {
    status?: string;
    q?: string;
    message?: string;
    error?: string;
  };
};

const STATUS_OPTIONS = [
  "ALL",
  "OPEN",
  "RESERVED",
  "SOLD",
  "COMPLETED",
  "CANCELLED",
] as const;

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

function getMessageText(message?: string) {
  switch (message) {
    case "reservation-released":
      return "Die Reservierung wurde erfolgreich freigegeben.";
    case "completed":
      return "Der Fixauftrag wurde als erledigt markiert.";
    case "reopened":
      return "Der Fixauftrag wurde wieder geöffnet.";
    case "cancelled":
      return "Der Fixauftrag wurde storniert.";
    case "deleted":
      return "Der Fixauftrag wurde endgültig gelöscht.";
    default:
      return "";
  }
}

function getErrorText(error?: string) {
  switch (error) {
    case "invalid-order":
      return "Der Fixauftrag wurde nicht gefunden.";
    case "order-not-reserved":
      return "Dieser Fixauftrag ist nicht reserviert.";
    case "order-not-sold":
      return "Nur verkaufte Fixaufträge können abgeschlossen werden.";
    case "order-not-completed":
      return "Dieser Fixauftrag ist nicht abgeschlossen.";
    case "order-not-cancelled":
      return "Dieser Fixauftrag ist nicht storniert.";
    case "buyer-missing":
      return "Dem Fixauftrag ist kein Käufer zugeordnet.";
    case "paid-order-cannot-be-cancelled":
      return "Ein bezahlter Fixauftrag kann nicht storniert werden.";
    case "paid-order-cannot-be-deleted":
      return "Ein bezahlter Fixauftrag kann nicht gelöscht werden.";
    default:
      return "";
  }
}

export default async function AdminFixedOrdersPage({
  searchParams,
}: AdminFixedOrdersPageProps) {
  const selectedStatus =
    searchParams?.status &&
    STATUS_OPTIONS.includes(
      searchParams.status as (typeof STATUS_OPTIONS)[number]
    )
      ? searchParams.status
      : "ALL";

  const query = searchParams?.q?.trim() || "";

  const where: Prisma.FixedOrderWhereInput = {
    ...(selectedStatus !== "ALL"
      ? {
          status:
            selectedStatus as Prisma.EnumFixedOrderStatusFilter["equals"],
        }
      : {}),
    ...(query
      ? {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              category: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              city: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              postalCode: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              customerFirstName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              customerLastName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              customerEmail: {
                contains: query,
                mode: "insensitive",
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
    soldRevenue,
  ] = await Promise.all([
    prisma.fixedOrder.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        postalCode: true,
        customerFirstName: true,
        customerLastName: true,
        executionDate: true,
        flexibleDate: true,
        orderValueCents: true,
        commissionAmountCents: true,
        commissionPercent: true,
        status: true,
        buyerId: true,
        reservedAt: true,
        soldAt: true,
        createdAt: true,
      },
    }),
    prisma.fixedOrder.count(),
    prisma.fixedOrder.count({
      where: { status: "OPEN" },
    }),
    prisma.fixedOrder.count({
      where: { status: "RESERVED" },
    }),
    prisma.fixedOrder.count({
      where: { status: "SOLD" },
    }),
    prisma.fixedOrder.count({
      where: { status: "COMPLETED" },
    }),
    prisma.fixedOrder.count({
      where: { status: "CANCELLED" },
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
  ]);

  const messageText = getMessageText(
    searchParams?.message
  );
  const errorText = getErrorText(searchParams?.error);

  const statistics = [
    {
      label: "Gesamt",
      value: totalCount,
      href: "/admin/fixed-orders",
    },
    {
      label: "Offen",
      value: openCount,
      href: "/admin/fixed-orders?status=OPEN",
    },
    {
      label: "Reserviert",
      value: reservedCount,
      href: "/admin/fixed-orders?status=RESERVED",
    },
    {
      label: "Verkauft",
      value: soldCount,
      href: "/admin/fixed-orders?status=SOLD",
    },
    {
      label: "Erledigt",
      value: completedCount,
      href: "/admin/fixed-orders?status=COMPLETED",
    },
    {
      label: "Storniert",
      value: cancelledCount,
      href: "/admin/fixed-orders?status=CANCELLED",
    },
  ];

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Auftrago Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Fixaufträge
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Verwalte offene, reservierte, verkaufte und
              abgeschlossene Fixaufträge.
            </p>
          </div>

          <Link
            href="/admin/fixed-orders/new"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300"
          >
            + Neuen Fixauftrag erstellen
          </Link>
        </div>

        {messageText ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-sm font-semibold text-emerald-200">
            {messageText}
          </div>
        ) : null}

        {errorText ? (
          <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-400/10 px-5 py-4 text-sm font-semibold text-red-200">
            {errorText}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statistics.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-[#0d1320] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-bold">
                {item.value}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
            Einnahmen aus Fixaufträgen
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(
              soldRevenue._sum.commissionAmountCents ?? 0
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Summe der Vermittlungsgebühren aus verkauften
            und erledigten Aufträgen.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-[#0d1320] p-5 sm:p-6">
          <form
            method="GET"
            className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto]"
          >
            <div>
              <label
                htmlFor="q"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
              >
                Suche
              </label>
              <input
                id="q"
                name="q"
                defaultValue={query}
                placeholder="Titel, Kunde, Ort, PLZ oder E-Mail"
                className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/50"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={selectedStatus}
                className="min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition focus:border-amber-400/50"
              >
                <option value="ALL">Alle Status</option>
                <option value="OPEN">Offen</option>
                <option value="RESERVED">
                  Reserviert
                </option>
                <option value="SOLD">Verkauft</option>
                <option value="COMPLETED">
                  Erledigt
                </option>
                <option value="CANCELLED">
                  Storniert
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="min-h-12 self-end rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-slate-200"
            >
              Filtern
            </button>
          </form>

          {query || selectedStatus !== "ALL" ? (
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                {fixedOrders.length} Treffer
              </p>
              <Link
                href="/admin/fixed-orders"
                className="text-sm font-semibold text-amber-300 transition hover:text-amber-200"
              >
                Filter zurücksetzen
              </Link>
            </div>
          ) : null}
        </section>

        <section className="mt-8">
          {fixedOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-[#0d1320] px-6 py-16 text-center">
              <p className="text-xl font-bold">
                Keine Fixaufträge gefunden
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Passe die Suche an oder erstelle einen neuen
                Fixauftrag.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {fixedOrders.map((fixedOrder) => {
                const statusInformation =
                  getStatusInformation(
                    fixedOrder.status
                  );

                const customerName = [
                  fixedOrder.customerFirstName,
                  fixedOrder.customerLastName,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <Link
                    key={fixedOrder.id}
                    href={`/admin/fixed-orders/${fixedOrder.id}`}
                    className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320] transition hover:-translate-y-0.5 hover:border-white/20 hover:shadow-2xl hover:shadow-black/20"
                  >
                    <div className="border-b border-white/10 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-300">
                            {fixedOrder.category}
                          </p>
                          <h2 className="mt-2 truncate text-xl font-bold transition group-hover:text-amber-200">
                            {fixedOrder.title}
                          </h2>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${statusInformation.classes}`}
                        >
                          {statusInformation.label}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                          {fixedOrder.postalCode}{" "}
                          {fixedOrder.city}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                          {fixedOrder.flexibleDate
                            ? "Termin flexibel"
                            : formatDate(
                                fixedOrder.executionDate
                              )}
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                          {customerName}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-white/10">
                      <div className="p-4">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-600">
                          Auftrag
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {formatCurrency(
                            fixedOrder.orderValueCents
                          )}
                        </p>
                      </div>

                      <div className="p-4">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-600">
                          Marge
                        </p>
                        <p className="mt-1 text-sm font-bold text-amber-300">
                          {fixedOrder.commissionPercent} %
                        </p>
                      </div>

                      <div className="p-4">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-600">
                          Preis
                        </p>
                        <p className="mt-1 text-sm font-bold text-amber-300">
                          {formatCurrency(
                            fixedOrder.commissionAmountCents
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-white/10 px-6 py-4 text-xs text-slate-500">
                      <span>
                        Erstellt am{" "}
                        {formatDate(fixedOrder.createdAt)}
                      </span>
                      <span className="font-semibold text-slate-300 transition group-hover:text-white">
                        Verwalten →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
