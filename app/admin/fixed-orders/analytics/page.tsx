import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
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

function getMonthStart() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
}

function getTodayStart() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
}

function getStatusBadge(status: string) {
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

export default async function FixedOrderAnalyticsPage() {
  const monthStart = getMonthStart();
  const todayStart = getTodayStart();

  const [
    totalOrders,
    openOrders,
    reservedOrders,
    soldOrders,
    completedOrders,
    cancelledOrders,
    todaySales,
    monthSales,
    totalSales,
    orderValueTotal,
    recentOrders,
    topBuyers,
  ] = await Promise.all([
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
        soldAt: {
          gte: todayStart,
        },
        status: {
          in: ["SOLD", "COMPLETED"],
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        commissionAmountCents: true,
      },
    }),

    prisma.fixedOrder.aggregate({
      where: {
        soldAt: {
          gte: monthStart,
        },
        status: {
          in: ["SOLD", "COMPLETED"],
        },
      },
      _count: {
        id: true,
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
      },
      _count: {
        id: true,
      },
      _sum: {
        commissionAmountCents: true,
      },
      _avg: {
        commissionAmountCents: true,
      },
    }),

    prisma.fixedOrder.aggregate({
      where: {
        status: {
          in: ["SOLD", "COMPLETED"],
        },
      },
      _sum: {
        orderValueCents: true,
      },
      _avg: {
        orderValueCents: true,
      },
    }),

    prisma.fixedOrder.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        postalCode: true,
        status: true,
        orderValueCents: true,
        commissionAmountCents: true,
        soldAt: true,
        createdAt: true,
      },
    }),

    prisma.fixedOrder.groupBy({
      by: ["buyerId"],
      where: {
        buyerId: {
          not: null,
        },
        status: {
          in: ["SOLD", "COMPLETED"],
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        commissionAmountCents: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const buyerIds = topBuyers
    .map((entry) => entry.buyerId)
    .filter((value): value is string => Boolean(value));

  const buyers = buyerIds.length
    ? await prisma.provider.findMany({
        where: {
          id: {
            in: buyerIds,
          },
        },
        select: {
          id: true,
          companyName: true,
          email: true,
          status: true,
        },
      })
    : [];

  const buyersById = new Map(
    buyers.map((buyer) => [buyer.id, buyer])
  );

  const totalClosedOrders =
    soldOrders + completedOrders;

  const conversionRate =
    totalOrders > 0
      ? totalClosedOrders / totalOrders
      : 0;

  const completionRate =
    totalClosedOrders > 0
      ? completedOrders / totalClosedOrders
      : 0;

  const summaryCards = [
    {
      label: "Umsatz heute",
      value: formatCurrency(
        todaySales._sum.commissionAmountCents ?? 0
      ),
      subtitle: `${todaySales._count.id} Verkäufe`,
    },
    {
      label: "Umsatz diesen Monat",
      value: formatCurrency(
        monthSales._sum.commissionAmountCents ?? 0
      ),
      subtitle: `${monthSales._count.id} Verkäufe`,
    },
    {
      label: "Gesamtumsatz",
      value: formatCurrency(
        totalSales._sum.commissionAmountCents ?? 0
      ),
      subtitle: `${totalSales._count.id} Verkäufe`,
    },
    {
      label: "Vermittelter Auftragswert",
      value: formatCurrency(
        orderValueTotal._sum.orderValueCents ?? 0
      ),
      subtitle: "Direkt an Anbieter",
    },
  ];

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin/fixed-orders"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              ← Zurück zu den Fixaufträgen
            </Link>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              Auftrago Analytics
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Fixauftrag Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Umsatz, Verkäufe, Statusverteilung und Top-Anbieter
              auf einen Blick.
            </p>
          </div>

          <Link
            href="/admin/fixed-orders/new"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300"
          >
            + Fixauftrag erstellen
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-[#0d1320] p-6"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {card.label}
              </p>

              <p className="mt-3 text-3xl font-black">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {card.subtitle}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            {
              label: "Gesamt",
              value: totalOrders,
              href: "/admin/fixed-orders",
            },
            {
              label: "Offen",
              value: openOrders,
              href: "/admin/fixed-orders?status=OPEN",
            },
            {
              label: "Reserviert",
              value: reservedOrders,
              href: "/admin/fixed-orders?status=RESERVED",
            },
            {
              label: "Verkauft",
              value: soldOrders,
              href: "/admin/fixed-orders?status=SOLD",
            },
            {
              label: "Erledigt",
              value: completedOrders,
              href: "/admin/fixed-orders?status=COMPLETED",
            },
            {
              label: "Storniert",
              value: cancelledOrders,
              href: "/admin/fixed-orders?status=CANCELLED",
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-white/10 bg-[#0d1320] p-5 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {item.label}
              </p>

              <p className="mt-2 text-3xl font-black">
                {item.value}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
              Verkaufsquote
            </p>

            <p className="mt-3 text-3xl font-black">
              {formatPercent(conversionRate)}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Verkauft oder erledigt
            </p>
          </div>

          <div className="rounded-3xl border border-violet-400/20 bg-violet-400/[0.05] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-violet-300">
              Abschlussquote
            </p>

            <p className="mt-3 text-3xl font-black">
              {formatPercent(completionRate)}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Erledigt nach Verkauf
            </p>
          </div>

          <div className="rounded-3xl border border-blue-400/20 bg-blue-400/[0.05] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
              Ø Vermittlungsgebühr
            </p>

            <p className="mt-3 text-3xl font-black">
              {formatCurrency(
                Math.round(
                  totalSales._avg
                    .commissionAmountCents ?? 0
                )
              )}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Pro verkauftem Auftrag
            </p>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
              Ø Auftragswert
            </p>

            <p className="mt-3 text-3xl font-black">
              {formatCurrency(
                Math.round(
                  orderValueTotal._avg
                    .orderValueCents ?? 0
                )
              )}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Pro verkauftem Auftrag
            </p>
          </div>
        </section>

        <div className="mt-8 grid gap-7 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-3xl border border-white/10 bg-[#0d1320]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  Letzte Aktivitäten
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Neueste Fixaufträge
                </h2>
              </div>

              <Link
                href="/admin/fixed-orders"
                className="text-sm font-bold text-amber-300 transition hover:text-amber-200"
              >
                Alle anzeigen
              </Link>
            </div>

            <div className="divide-y divide-white/10">
              {recentOrders.length ? (
                recentOrders.map((order) => {
                  const badge = getStatusBadge(
                    order.status
                  );

                  return (
                    <Link
                      key={order.id}
                      href={`/admin/fixed-orders/${order.id}`}
                      className="flex flex-col gap-4 px-6 py-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-black">
                          {order.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {order.category} ·{" "}
                          {order.postalCode} {order.city}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          Erstellt am{" "}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-black text-amber-300">
                            {formatCurrency(
                              order.commissionAmountCents
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatCurrency(
                              order.orderValueCents
                            )}{" "}
                            Auftrag
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${badge.classes}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  Noch keine Fixaufträge vorhanden.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#0d1320]">
            <div className="border-b border-white/10 px-6 py-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-300">
                Anbieter-Ranking
              </p>

              <h2 className="mt-2 text-xl font-black">
                Top-Käufer
              </h2>
            </div>

            <div className="divide-y divide-white/10">
              {topBuyers.length ? (
                topBuyers.map((entry, index) => {
                  const buyer = entry.buyerId
                    ? buyersById.get(entry.buyerId)
                    : null;

                  return (
                    <div
                      key={entry.buyerId || index}
                      className="flex items-center gap-4 px-6 py-5"
                    >
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-violet-400/25 bg-violet-400/10 text-sm font-black text-violet-300">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black">
                          {buyer?.companyName ||
                            "Unbekannter Anbieter"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {buyer?.email || "Keine E-Mail"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black">
                          {entry._count.id}
                        </p>

                        <p className="mt-1 text-xs text-amber-300">
                          {formatCurrency(
                            entry._sum
                              .commissionAmountCents ?? 0
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center text-sm text-slate-500">
                  Noch keine Käufer vorhanden.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}