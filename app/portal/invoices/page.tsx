import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "–";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStatusStyles(status: string) {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus === "PAID") {
    return {
      label: "Bezahlt",
      classes:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (normalizedStatus === "OPEN") {
    return {
      label: "Offen",
      classes:
        "border-amber-400/20 bg-amber-400/10 text-amber-300",
    };
  }

  if (
    normalizedStatus === "CANCELLED" ||
    normalizedStatus === "CANCELED"
  ) {
    return {
      label: "Storniert",
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

export default async function PortalInvoicesPage() {
  const session = await getSession();
  const sessionEmail = session?.user?.email;

  if (!sessionEmail) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      email: sessionEmail.trim().toLowerCase(),
    },
    select: {
      id: true,
      email: true,
      companyName: true,
      status: true,
    },
  });

  if (!provider) {
    redirect("/login");
  }

  if (provider.status !== "APPROVED") {
    redirect("/portal");
  }

  const invoices = await prisma.invoice.findMany({
    where: {
      providerId: provider.id,
    },
    select: {
      id: true,
      invoiceNumber: true,
      amountCents: true,
      status: true,
      fixedOrderId: true,
      createdAt: true,
      updatedAt: true,
      fixedOrder: {
        select: {
          id: true,
          title: true,
          category: true,
          city: true,
          postalCode: true,
          orderValueCents: true,
          executionDate: true,
          flexibleDate: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalPaidCents = invoices
    .filter(
      (invoice) =>
        invoice.status.toUpperCase() === "PAID"
    )
    .reduce(
      (total, invoice) =>
        total + invoice.amountCents,
      0
    );

  const totalOpenCents = invoices
    .filter(
      (invoice) =>
        invoice.status.toUpperCase() === "OPEN"
    )
    .reduce(
      (total, invoice) =>
        total + invoice.amountCents,
      0
    );

  const paidInvoiceCount = invoices.filter(
    (invoice) =>
      invoice.status.toUpperCase() === "PAID"
  ).length;

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <Link
            href="/portal"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Zurück zum Dashboard
          </Link>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-400">
                Auftrago Firmenportal
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Meine Rechnungen
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                Hier findest du sämtliche Rechnungen für
                übernommene Fixaufträge. Bereits bezahlte
                Rechnungen können direkt als PDF
                heruntergeladen werden.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                Angemeldet als
              </p>

              <p className="mt-1 font-bold">
                {provider.companyName}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Rechnungen
            </p>

            <p className="mt-2 text-3xl font-bold">
              {invoices.length}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
            <p className="text-sm text-emerald-300">
              Bezahlt
            </p>

            <p className="mt-2 text-3xl font-bold">
              {paidInvoiceCount}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
            <p className="text-sm text-emerald-300">
              Bezahlter Gesamtbetrag
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(totalPaidCents)}
            </p>
          </article>

          <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
            <p className="text-sm text-amber-300">
              Offener Betrag
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(totalOpenCents)}
            </p>
          </article>
        </section>

        {invoices.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-3xl">
              🧾
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Noch keine Rechnungen vorhanden
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Sobald du einen Fixauftrag übernimmst und
              die Vermittlungsgebühr erfolgreich bezahlt
              wurde, erscheint die dazugehörige Rechnung
              automatisch hier.
            </p>

            <Link
              href="/portal/fixed-orders"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-bold text-black transition hover:bg-amber-300"
            >
              Fixaufträge ansehen
            </Link>
          </section>
        ) : (
          <>
            <section className="hidden overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320] lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="border-b border-white/10 bg-white/[0.03]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                        Rechnung
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                        Auftrag
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                        Datum
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                        Betrag
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                        Aktionen
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">
                    {invoices.map((invoice) => {
                      const status =
                        getStatusStyles(
                          invoice.status
                        );

                      return (
                        <tr
                          key={invoice.id}
                          className="transition hover:bg-white/[0.025]"
                        >
                          <td className="px-6 py-5">
                            <p className="font-bold text-white">
                              {invoice.invoiceNumber}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Erstellt am{" "}
                              {formatDate(
                                invoice.createdAt
                              )}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="max-w-xs font-semibold text-white">
                              {invoice.fixedOrder.title}
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              {
                                invoice.fixedOrder
                                  .category
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                invoice.fixedOrder
                                  .postalCode
                              }{" "}
                              {
                                invoice.fixedOrder
                                  .city
                              }
                            </p>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-300">
                            {invoice.fixedOrder
                              .flexibleDate
                              ? "Termin flexibel"
                              : formatDate(
                                  invoice
                                    .fixedOrder
                                    .executionDate
                                )}
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-bold text-white">
                              {formatCurrency(
                                invoice.amountCents
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Auftragswert{" "}
                              {formatCurrency(
                                invoice.fixedOrder
                                  .orderValueCents
                              )}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.classes}`}
                            >
                              {status.label}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex justify-end gap-2">
                              <Link
                                href={`/portal/fixed-orders/${invoice.fixedOrderId}`}
                                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold transition hover:bg-white/[0.08]"
                              >
                                Auftrag
                              </Link>

                              <Link
                                href={`/api/invoices/${invoice.id}/download`}
                                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-amber-300"
                              >
                                PDF herunterladen
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-5 lg:hidden">
              {invoices.map((invoice) => {
                const status = getStatusStyles(
                  invoice.status
                );

                return (
                  <article
                    key={invoice.id}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320]"
                  >
                    <div className="h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Rechnungsnummer
                          </p>

                          <h2 className="mt-1 text-lg font-bold">
                            {invoice.invoiceNumber}
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
                          Fixauftrag
                        </p>

                        <p className="mt-1 font-bold">
                          {invoice.fixedOrder.title}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {invoice.fixedOrder.category}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            invoice.fixedOrder
                              .postalCode
                          }{" "}
                          {invoice.fixedOrder.city}
                        </p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                          <p className="text-xs text-slate-500">
                            Rechnungsdatum
                          </p>

                          <p className="mt-1 text-sm font-semibold">
                            {formatDate(
                              invoice.createdAt
                            )}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
                          <p className="text-xs text-amber-300">
                            Rechnungsbetrag
                          </p>

                          <p className="mt-1 font-bold text-amber-300">
                            {formatCurrency(
                              invoice.amountCents
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs text-slate-500">
                          Ausführung
                        </p>

                        <p className="mt-1 font-semibold">
                          {invoice.fixedOrder
                            .flexibleDate
                            ? "Termin flexibel"
                            : formatDate(
                                invoice.fixedOrder
                                  .executionDate
                              )}
                        </p>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <Link
                          href={`/portal/fixed-orders/${invoice.fixedOrderId}`}
                          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-bold transition hover:bg-white/[0.08]"
                        >
                          Auftrag öffnen
                        </Link>

                        <Link
                          href={`/api/invoices/${invoice.id}/download`}
                          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-4 py-3 font-bold text-black transition hover:bg-amber-300"
                        >
                          PDF herunterladen
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold">
                Fragen zu einer Rechnung?
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Halte bei einer Anfrage bitte deine
                Rechnungsnummer bereit. So kann die
                Rechnung schneller zugeordnet werden.
              </p>
            </div>

            <a
              href="mailto:info@auftrago.ch"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-bold transition hover:bg-white/[0.08]"
            >
              Support kontaktieren
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}