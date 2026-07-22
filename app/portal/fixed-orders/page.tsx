import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date | null, flexibleDate: boolean) {
  if (flexibleDate) {
    return "Termin flexibel";
  }

  if (!date) {
    return "Termin noch offen";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function PortalFixedOrdersPage() {
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
    redirect("/dashboard");
  }

  const fixedOrders = await prisma.fixedOrder.findMany({
    where: {
      status: "OPEN",
      buyerId: null,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      region: true,
      postalCode: true,
      city: true,
      executionDate: true,
      flexibleDate: true,
      orderValueCents: true,
      commissionPercent: true,
      commissionAmountCents: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalOrderValueCents = fixedOrders.reduce(
    (total, order) => total + order.orderValueCents,
    0
  );

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            ← Zurück zum Dashboard
          </Link>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-amber-400">
                Auftrago Firmenportal
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Fixaufträge
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                Übernimm bereits bestätigte Aufträge. Der Kunde hat zugesagt,
                der Auftragswert steht fest und eine Offertenerstellung ist
                nicht mehr notwendig.
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
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">
              Verfügbare Fixaufträge
            </p>

            <p className="mt-2 text-3xl font-bold">
              {fixedOrders.length}
            </p>
          </article>

          <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
            <p className="text-sm text-amber-300">
              Gesamtvolumen
            </p>

            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(totalOrderValueCents)}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5 sm:col-span-2 lg:col-span-1">
            <p className="text-sm text-emerald-300">
              Auftragsstatus
            </p>

            <p className="mt-2 text-xl font-bold">
              Bereits bestätigt
            </p>
          </article>
        </section>

        <section className="mb-8 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-400/[0.08] to-transparent p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-semibold text-white">
                Kunde bestätigt
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Der Auftrag wurde bereits verbindlich zugesagt.
              </p>
            </div>

            <div>
              <p className="font-semibold text-white">
                Keine Offerte nötig
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Preis und Leistung wurden bereits vereinbart.
              </p>
            </div>

            <div>
              <p className="font-semibold text-white">
                Sofort ausführbar
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Nach der Zahlung erhältst du die Kundendaten.
              </p>
            </div>

            <div>
              <p className="font-semibold text-white">
                Nur einmal verfügbar
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Der erste erfolgreiche Käufer erhält den Auftrag.
              </p>
            </div>
          </div>
        </section>

        {fixedOrders.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-3xl">
              🔥
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Aktuell keine Fixaufträge verfügbar
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Sobald ein neuer bestätigter Auftrag veröffentlicht wird,
              erscheint er hier. Fixaufträge sind nur einmal verfügbar und
              können schnell vergeben sein.
            </p>

            <Link
              href="/portal/leads"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 font-bold transition hover:bg-white/[0.1]"
            >
              Normale Leads ansehen
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {fixedOrders.map((order) => (
              <article
                key={order.id}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320] p-6 transition hover:-translate-y-1 hover:border-amber-400/30"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                      Bestätigter Auftrag
                    </span>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {order.category}
                    </p>

                    <h2 className="mt-1 text-xl font-bold leading-snug">
                      {order.title}
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400/10 text-xl">
                    🔥
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                    {order.region || "Schweiz"}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                    {order.postalCode} {order.city}
                  </span>
                </div>

                {order.description ? (
                  <p className="mt-5 line-clamp-4 text-sm leading-6 text-slate-400">
                    {order.description}
                  </p>
                ) : (
                  <p className="mt-5 text-sm italic text-slate-500">
                    Keine zusätzliche Beschreibung vorhanden.
                  </p>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-slate-500">
                      Auftragswert
                    </p>

                    <p className="mt-1 text-lg font-bold">
                      {formatCurrency(order.orderValueCents)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
                    <p className="text-xs text-amber-300">
                      Übernahmepreis
                    </p>

                    <p className="mt-1 text-lg font-bold text-amber-300">
                      {formatCurrency(order.commissionAmountCents)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">
                    Ausführung
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatDate(
                      order.executionDate,
                      order.flexibleDate
                    )}
                  </p>
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Vermittlungsgebühr
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {order.commissionPercent} % des Auftragswerts
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                      Verfügbar
                    </span>
                  </div>

                  <Link
                    href={`/portal/fixed-orders/${order.id}`}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-bold text-black transition hover:bg-amber-300"
                  >
                    Auftrag ansehen
                    <span className="ml-2" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-lg font-bold">
            Wichtiger Hinweis
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            Vor der Übernahme sind Kundenname, Telefonnummer, E-Mail-Adresse
            und genaue Strassenadresse nicht sichtbar. Nach erfolgreicher
            Zahlung der Vermittlungsgebühr werden diese Daten ausschliesslich
            dem übernehmenden Anbieter freigeschaltet.
          </p>
        </section>
      </div>
    </main>
  );
}