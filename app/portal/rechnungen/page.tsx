import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStatusInformation(status: string) {
  if (status === "PAID") {
    return {
      label: "Bezahlt",
      classes:
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    };
  }

  return {
    label: status,
    classes:
      "border-white/15 bg-white/[0.05] text-slate-300",
  };
}

export default async function ProviderInvoicesPage() {
  const user = await requireUser();

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      companyName: true,
      status: true,
      invoices: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          invoiceNumber: true,
          amountCents: true,
          status: true,
          stripePaymentIntentId: true,
          createdAt: true,
          fixedOrder: {
            select: {
              id: true,
              title: true,
              category: true,
              orderValueCents: true,
              city: true,
              postalCode: true,
              soldAt: true,
            },
          },
        },
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const totalPaid = provider.invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce(
      (sum, invoice) => sum + invoice.amountCents,
      0
    );

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              ← Zurück zum Anbieterportal
            </Link>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
              Auftrago Rechnungen
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Deine Rechnungen
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Hier findest du alle Zahlungsbelege für deine
              gekauften Fixaufträge.
            </p>
          </div>

          <Link
            href="/portal/fixed-orders"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-black transition hover:bg-amber-300"
          >
            Fixaufträge ansehen
          </Link>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Rechnungen
            </p>

            <p className="mt-3 text-3xl font-black">
              {provider.invoices.length}
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.05] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
              Bezahlt
            </p>

            <p className="mt-3 text-3xl font-black">
              {
                provider.invoices.filter(
                  (invoice) =>
                    invoice.status === "PAID"
                ).length
              }
            </p>
          </div>

          <div className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
              Vermittlungsgebühren
            </p>

            <p className="mt-3 text-3xl font-black">
              {formatCurrency(totalPaid)}
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320]">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              Rechnungsarchiv
            </p>

            <h2 className="mt-2 text-xl font-black">
              Alle Zahlungsbelege
            </h2>
          </div>

          {provider.invoices.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-black">
                Noch keine Rechnungen vorhanden
              </p>

              <p className="mt-3 text-sm text-slate-500">
                Nach dem Kauf eines Fixauftrags wird die
                Rechnung automatisch hier gespeichert.
              </p>

              <Link
                href="/portal/fixed-orders"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-black text-black transition hover:bg-amber-300"
              >
                Fixaufträge öffnen
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {provider.invoices.map((invoice) => {
                const status =
                  getStatusInformation(invoice.status);

                return (
                  <div
                    key={invoice.id}
                    className="grid gap-5 px-6 py-6 transition hover:bg-white/[0.02] lg:grid-cols-[minmax(0,1fr)_180px_150px_auto] lg:items-center"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-black">
                          {invoice.invoiceNumber}
                        </p>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${status.classes}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <p className="mt-2 truncate text-sm font-semibold text-slate-200">
                        {invoice.fixedOrder.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {invoice.fixedOrder.category} ·{" "}
                        {invoice.fixedOrder.postalCode}{" "}
                        {invoice.fixedOrder.city}
                      </p>

                      {invoice.stripePaymentIntentId ? (
                        <p className="mt-2 break-all font-mono text-[11px] text-slate-600">
                          {invoice.stripePaymentIntentId}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                        Rechnungsdatum
                      </p>

                      <p className="mt-2 text-sm font-black">
                        {formatDate(invoice.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
                        Betrag
                      </p>

                      <p className="mt-2 text-lg font-black text-amber-300">
                        {formatCurrency(
                          invoice.amountCents
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Auftrag:{" "}
                        {formatCurrency(
                          invoice.fixedOrder
                            .orderValueCents
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      <Link
                        href={`/portal/fixed-orders/${invoice.fixedOrder.id}/customer`}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-bold transition hover:bg-white/[0.1]"
                      >
                        Auftrag öffnen
                      </Link>

                      <a
                        href={`/api/fixed-orders/${invoice.fixedOrder.id}/invoice`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-black text-black transition hover:bg-amber-300"
                      >
                        PDF herunterladen
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-black text-white">
            Hinweis zum Zahlungsbeleg
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-500">
            Die PDF-Rechnung bestätigt die bereits über
            Stripe bezahlte Vermittlungsgebühr. Die Rechnung
            für die eigentliche Auftragsausführung stellst du
            direkt deinem Kunden.
          </p>
        </section>
      </div>
    </main>
  );
}