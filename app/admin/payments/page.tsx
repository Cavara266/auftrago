import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PaymentStatus = {
  label: string;
  classes: string;
};

function formatCurrency(
  amountInCents: number,
  currency = "CHF"
) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amountInCents / 100);
}

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "–";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function getPaymentStatus(status: string): PaymentStatus {
  const normalizedStatus = status.toUpperCase();

  if (
    normalizedStatus === "PAID" ||
    normalizedStatus === "SUCCEEDED" ||
    normalizedStatus === "SUCCESS"
  ) {
    return {
      label: "Bezahlt",
      classes:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (
    normalizedStatus === "OPEN" ||
    normalizedStatus === "PENDING"
  ) {
    return {
      label: "Offen",
      classes:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
    };
  }

  if (
    normalizedStatus === "FAILED" ||
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "CANCELED"
  ) {
    return {
      label: "Fehlgeschlagen",
      classes:
        "border-red-400/20 bg-red-400/10 text-red-300",
    };
  }

  return {
    label: status,
    classes:
      "border-white/10 bg-white/[0.05] text-slate-300",
  };
}

function getPackageName(packageId: string) {
  switch (packageId.toLowerCase()) {
    case "starter":
      return "Starter – 20 Credits";

    case "pro":
      return "Pro – 50 Credits";

    case "business":
      return "Business – 100 Credits";

    case "agency":
      return "Agency – 250 Credits";

    case "enterprise":
      return "Enterprise – 500 Credits";

    default:
      return packageId;
  }
}

function getMonthStart(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1,
    0,
    0,
    0,
    0
  );
}

export default async function AdminPaymentsPage() {
  const now = new Date();
  const monthStart = getMonthStart(now);

  const [
    creditPurchases,
    invoices,
    paidCreditAggregate,
    paidCreditMonthAggregate,
    paidInvoiceAggregate,
    paidInvoiceMonthAggregate,
  ] = await Promise.all([
    prisma.creditPurchase.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      include: {
        provider: {
          select: {
            id: true,
            companyName: true,
            email: true,
          },
        },
      },
    }),

    prisma.invoice.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      include: {
        provider: {
          select: {
            id: true,
            companyName: true,
            email: true,
          },
        },
        fixedOrder: {
          select: {
            id: true,
            title: true,
            category: true,
            city: true,
            postalCode: true,
            orderValueCents: true,
          },
        },
      },
    }),

    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
      },
      _sum: {
        amount: true,
        credits: true,
      },
      _count: {
        id: true,
      },
    }),

    prisma.creditPurchase.aggregate({
      where: {
        status: "paid",
        createdAt: {
          gte: monthStart,
        },
      },
      _sum: {
        amount: true,
        credits: true,
      },
      _count: {
        id: true,
      },
    }),

    prisma.invoice.aggregate({
      where: {
        status: "PAID",
      },
      _sum: {
        amountCents: true,
      },
      _count: {
        id: true,
      },
    }),

    prisma.invoice.aggregate({
      where: {
        status: "PAID",
        createdAt: {
          gte: monthStart,
        },
      },
      _sum: {
        amountCents: true,
      },
      _count: {
        id: true,
      },
    }),
  ]);

  const totalCreditRevenue =
    paidCreditAggregate._sum.amount ?? 0;

  const monthlyCreditRevenue =
    paidCreditMonthAggregate._sum.amount ?? 0;

  const totalCreditsSold =
    paidCreditAggregate._sum.credits ?? 0;

  const monthlyCreditsSold =
    paidCreditMonthAggregate._sum.credits ?? 0;

  const totalFixedOrderRevenue =
    paidInvoiceAggregate._sum.amountCents ?? 0;

  const monthlyFixedOrderRevenue =
    paidInvoiceMonthAggregate._sum.amountCents ?? 0;

  const totalRevenue =
    totalCreditRevenue + totalFixedOrderRevenue;

  const monthlyRevenue =
    monthlyCreditRevenue +
    monthlyFixedOrderRevenue;

  const paidCreditPurchaseCount =
    paidCreditAggregate._count.id;

  const paidInvoiceCount =
    paidInvoiceAggregate._count.id;

  const openInvoiceCount = invoices.filter(
    (invoice) =>
      invoice.status.toUpperCase() === "OPEN"
  ).length;

  const failedCreditPurchaseCount =
    creditPurchases.filter((purchase) => {
      const status = purchase.status.toUpperCase();

      return (
        status === "FAILED" ||
        status === "CANCELLED" ||
        status === "CANCELED"
      );
    }).length;

  const paymentFeed = [
    ...creditPurchases.map((purchase) => ({
      id: `credit-${purchase.id}`,
      createdAt: purchase.createdAt,
      type: "Credit-Kauf",
      typeLabel: getPackageName(purchase.packageId),
      providerId: purchase.provider.id,
      providerCompanyName:
        purchase.provider.companyName,
      providerEmail: purchase.provider.email,
      amount: purchase.amount,
      currency: purchase.currency,
      status: purchase.status,
      detail: `${purchase.credits} Credits`,
      destination: `/admin/providers/${purchase.provider.id}`,
    })),

    ...invoices.map((invoice) => ({
      id: `invoice-${invoice.id}`,
      createdAt: invoice.createdAt,
      type: "Fixauftrag",
      typeLabel: invoice.fixedOrder.title,
      providerId: invoice.provider.id,
      providerCompanyName:
        invoice.provider.companyName,
      providerEmail: invoice.provider.email,
      amount: invoice.amountCents,
      currency: "CHF",
      status: invoice.status,
      detail: invoice.invoiceNumber,
      destination: `/admin/fixed-orders/${invoice.fixedOrder.id}`,
    })),
  ]
    .sort(
      (first, second) =>
        second.createdAt.getTime() -
        first.createdAt.getTime()
    )
    .slice(0, 100);

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
              >
                <span aria-hidden="true">←</span>
                Zurück zum Admin-Dashboard
              </Link>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-cyan-300">
                Auftrago Administration
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Zahlungen
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                Übersicht über Credit-Käufe,
                Fixauftrag-Provisionen, bezahlte
                Rechnungen und fehlgeschlagene
                Transaktionen.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/analytics"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold transition hover:bg-white/[0.08]"
              >
                Analytics
              </Link>

              <Link
                href="/admin/fixed-orders"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold transition hover:bg-white/[0.08]"
              >
                Fixaufträge
              </Link>

              <Link
                href="/admin/providers"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Anbieter
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-5">
            <p className="text-sm text-cyan-300">
              Gesamtumsatz
            </p>

            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(totalRevenue)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Credits und Fixaufträge
            </p>
          </article>

          <article className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-5">
            <p className="text-sm text-violet-300">
              Umsatz diesen Monat
            </p>

            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(monthlyRevenue)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Seit Monatsbeginn
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
            <p className="text-sm text-emerald-300">
              Credit-Umsatz
            </p>

            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(totalCreditRevenue)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {paidCreditPurchaseCount} bezahlte Käufe
            </p>
          </article>

          <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
            <p className="text-sm text-amber-300">
              Fixauftrag-Provisionen
            </p>

            <p className="mt-2 text-3xl font-bold">
              {formatCurrency(totalFixedOrderRevenue)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {paidInvoiceCount} bezahlte Rechnungen
            </p>
          </article>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Credits verkauft
            </p>

            <p className="mt-2 text-2xl font-bold">
              {totalCreditsSold}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {monthlyCreditsSold} diesen Monat
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Credit-Umsatz Monat
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(monthlyCreditRevenue)}
            </p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Fixauftrag-Umsatz Monat
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(
                monthlyFixedOrderRevenue
              )}
            </p>
          </article>

          <article className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5">
            <p className="text-sm text-red-300">
              Aufmerksamkeit nötig
            </p>

            <p className="mt-2 text-2xl font-bold">
              {openInvoiceCount +
                failedCreditPurchaseCount}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {openInvoiceCount} offene Rechnungen ·{" "}
              {failedCreditPurchaseCount} fehlgeschlagene
              Käufe
            </p>
          </article>
        </section>

        <section className="mb-8 grid gap-5 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Credit-Geschäft
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Verkaufte Credit-Pakete
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">
                  Zahlungen
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {paidCreditPurchaseCount}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">
                  Credits
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {totalCreditsSold}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4 sm:col-span-2">
                <p className="text-sm text-emerald-300">
                  Gesamtertrag
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatCurrency(totalCreditRevenue)}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Fixaufträge
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Vermittlungsprovisionen
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">
                  Bezahlte Rechnungen
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {paidInvoiceCount}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm text-slate-400">
                  Offene Rechnungen
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {openInvoiceCount}
                </p>
              </div>

              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4 sm:col-span-2">
                <p className="text-sm text-amber-300">
                  Gesamtertrag
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {formatCurrency(
                    totalFixedOrderRevenue
                  )}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="hidden overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320] lg:block">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-bold">
              Alle Transaktionen
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Die letzten {paymentFeed.length} Zahlungen
              und Rechnungen.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-white/10 bg-white/[0.03]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Datum
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Anbieter
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Zahlung
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Referenz
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Betrag
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                    Aktion
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {paymentFeed.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center text-slate-400"
                    >
                      Noch keine Zahlungen vorhanden.
                    </td>
                  </tr>
                ) : (
                  paymentFeed.map((payment) => {
                    const status = getPaymentStatus(
                      payment.status
                    );

                    return (
                      <tr
                        key={payment.id}
                        className="transition hover:bg-white/[0.025]"
                      >
                        <td className="px-6 py-5 text-sm text-slate-300">
                          {formatDate(payment.createdAt)}
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-bold">
                            {
                              payment.providerCompanyName
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {payment.providerEmail}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            {payment.type}
                          </p>

                          <p className="mt-1 max-w-xs text-xs text-slate-500">
                            {payment.typeLabel}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-300">
                          {payment.detail}
                        </td>

                        <td className="px-6 py-5 font-bold">
                          {formatCurrency(
                            payment.amount,
                            payment.currency
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.classes}`}
                          >
                            {status.label}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <Link
                            href={payment.destination}
                            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold transition hover:bg-white/[0.08]"
                          >
                            Öffnen
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:hidden">
          {paymentFeed.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
              <div className="text-3xl">💳</div>

              <h2 className="mt-4 text-xl font-bold">
                Noch keine Zahlungen
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Neue Credit-Käufe und
                Fixauftrag-Provisionen erscheinen hier
                automatisch.
              </p>
            </div>
          ) : (
            paymentFeed.map((payment) => {
              const status = getPaymentStatus(
                payment.status
              );

              return (
                <article
                  key={payment.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320]"
                >
                  <div className="h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400" />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {payment.type}
                        </p>

                        <h2 className="mt-1 text-lg font-bold">
                          {payment.providerCompanyName}
                        </h2>
                      </div>

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.classes}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xs text-slate-500">
                        Beschreibung
                      </p>

                      <p className="mt-1 font-semibold">
                        {payment.typeLabel}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {payment.detail}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs text-slate-500">
                          Datum
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {formatDate(
                            payment.createdAt
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-4">
                        <p className="text-xs text-cyan-300">
                          Betrag
                        </p>

                        <p className="mt-1 font-bold text-cyan-300">
                          {formatCurrency(
                            payment.amount,
                            payment.currency
                          )}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={payment.destination}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                    >
                      Details öffnen
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-lg font-bold">
            Stripe-Abgleich
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            Diese Übersicht zeigt die in der
            Auftrago-Datenbank gespeicherten Zahlungen.
            Der Stripe-Webhook verarbeitet erfolgreiche
            Credit-Käufe sowie Fixauftrag-Zahlungen
            automatisch und verhindert die doppelte
            Verbuchung derselben Checkout-Session.
          </p>
        </section>
      </div>
    </main>
  );
}