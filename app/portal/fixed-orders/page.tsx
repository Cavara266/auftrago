import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PortalFixedOrdersPageProps = {
  searchParams?: {
    query?: string;
    region?: string;
    category?: string;
    sort?: string;
  };
};

type SortOption = "newest" | "value-desc" | "price-asc" | "date-asc";

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

function getAgeLabel(date: Date) {
  const difference = Date.now() - new Date(date).getTime();
  const minutes = Math.max(0, Math.floor(difference / 60_000));

  if (minutes < 2) {
    return "Gerade veröffentlicht";
  }

  if (minutes < 60) {
    return `Vor ${minutes} Minuten`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Vor ${hours} ${hours === 1 ? "Stunde" : "Stunden"}`;
  }

  const days = Math.floor(hours / 24);
  return `Vor ${days} ${days === 1 ? "Tag" : "Tagen"}`;
}

function getUrgencyLabel(date: Date) {
  const ageHours = (Date.now() - new Date(date).getTime()) / 3_600_000;

  if (ageHours < 2) {
    return {
      label: "Brandneu",
      classes: "border-red-400/25 bg-red-400/10 text-red-300",
    };
  }

  if (ageHours < 24) {
    return {
      label: "Heute veröffentlicht",
      classes: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    };
  }

  return {
    label: "Verfügbar",
    classes: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  };
}

function normalizeSort(value?: string): SortOption {
  if (
    value === "value-desc" ||
    value === "price-asc" ||
    value === "date-asc"
  ) {
    return value;
  }

  return "newest";
}

export default async function PortalFixedOrdersPage({
  searchParams,
}: PortalFixedOrdersPageProps) {
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
      region: true,
    },
  });

  if (!provider) {
    redirect("/login");
  }

  if (provider.status !== "APPROVED") {
    redirect("/portal");
  }

  const query = searchParams?.query?.trim() || "";
  const region = searchParams?.region?.trim() || "";
  const category = searchParams?.category?.trim() || "";
  const sort = normalizeSort(searchParams?.sort);

  const orderBy =
    sort === "value-desc"
      ? { orderValueCents: "desc" as const }
      : sort === "price-asc"
        ? { commissionAmountCents: "asc" as const }
        : sort === "date-asc"
          ? { executionDate: "asc" as const }
          : { createdAt: "desc" as const };

  const [fixedOrders, regionsRaw, categoriesRaw, myOrdersCount] =
    await Promise.all([
      prisma.fixedOrder.findMany({
        where: {
          status: "OPEN",
          buyerId: null,
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
                    description: {
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
                    region: {
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
                ],
              }
            : {}),
          ...(region ? { region } : {}),
          ...(category ? { category } : {}),
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
        orderBy,
      }),

      prisma.fixedOrder.findMany({
        where: {
          status: "OPEN",
          buyerId: null,
          region: {
            not: null,
          },
        },
        distinct: ["region"],
        select: {
          region: true,
        },
        orderBy: {
          region: "asc",
        },
      }),

      prisma.fixedOrder.findMany({
        where: {
          status: "OPEN",
          buyerId: null,
        },
        distinct: ["category"],
        select: {
          category: true,
        },
        orderBy: {
          category: "asc",
        },
      }),

      prisma.fixedOrder.count({
        where: {
          buyerId: provider.id,
          status: {
            in: ["SOLD", "COMPLETED"],
          },
        },
      }),
    ]);

  const totalOrderValueCents = fixedOrders.reduce(
    (total, order) => total + order.orderValueCents,
    0
  );

  const totalCommissionCents = fixedOrders.reduce(
    (total, order) => total + order.commissionAmountCents,
    0
  );

  const averageOrderValueCents =
    fixedOrders.length > 0
      ? Math.round(totalOrderValueCents / fixedOrders.length)
      : 0;

  const regions = regionsRaw
    .map((item) => item.region)
    .filter((item): item is string => Boolean(item));

  const categories = categoriesRaw
    .map((item) => item.category)
    .filter(Boolean);

  const hasFilters = Boolean(query || region || category || sort !== "newest");

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <Link
            href="/portal"
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
                Premium Fixaufträge
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                Übernimm bestätigte Kundenaufträge ohne erneute
                Offertenerstellung. Nach erfolgreicher Zahlung werden die
                vollständigen Kundendaten direkt freigeschaltet.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  Angemeldet als
                </p>
                <p className="mt-1 font-bold">{provider.companyName}</p>
              </div>

              <Link
                href="/portal/rechnungen"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm font-bold transition hover:bg-white/[0.1]"
              >
                Meine Käufe ({myOrdersCount})
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-400">Verfügbare Fixaufträge</p>
            <p className="mt-2 text-3xl font-bold">{fixedOrders.length}</p>
            <p className="mt-2 text-xs text-slate-500">Nur einmal verfügbar</p>
          </article>

          <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5">
            <p className="text-sm text-amber-300">Gesamtvolumen</p>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(totalOrderValueCents)}
            </p>
            <p className="mt-2 text-xs text-slate-500">Verfügbare Aufträge</p>
          </article>

          <article className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.05] p-5">
            <p className="text-sm text-blue-300">Durchschnittlicher Auftrag</p>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(averageOrderValueCents)}
            </p>
            <p className="mt-2 text-xs text-slate-500">Pro Fixauftrag</p>
          </article>

          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
            <p className="text-sm text-emerald-300">Übernahmepreise gesamt</p>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(totalCommissionCents)}
            </p>
            <p className="mt-2 text-xs text-slate-500">Bei Übernahme aller Aufträge</p>
          </article>
        </section>

        <section className="mb-8 rounded-3xl border border-white/10 bg-[#0d1320] p-5 sm:p-6">
          <form method="GET" className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <input
              type="search"
              name="query"
              defaultValue={query}
              placeholder="Titel, Kategorie, Ort oder Beschreibung suchen"
              className="min-h-12 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400/40"
            />

            <select
              name="region"
              defaultValue={region}
              className="min-h-12 rounded-xl border border-white/10 bg-[#0a0f1b] px-4 text-sm text-white outline-none transition focus:border-amber-400/40"
            >
              <option value="">Alle Regionen</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="category"
              defaultValue={category}
              className="min-h-12 rounded-xl border border-white/10 bg-[#0a0f1b] px-4 text-sm text-white outline-none transition focus:border-amber-400/40"
            >
              <option value="">Alle Kategorien</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="min-h-12 rounded-xl border border-white/10 bg-[#0a0f1b] px-4 text-sm text-white outline-none transition focus:border-amber-400/40"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="value-desc">Höchster Auftragswert</option>
              <option value="price-asc">Günstigste Übernahme</option>
              <option value="date-asc">Frühester Termin</option>
            </select>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 text-sm font-bold text-black transition hover:bg-amber-300"
            >
              Filtern
            </button>
          </form>

          {hasFilters ? (
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
              <p className="text-sm text-slate-400">
                {fixedOrders.length} passende Fixaufträge gefunden
              </p>
              <Link
                href="/portal/fixed-orders"
                className="text-sm font-bold text-amber-300 transition hover:text-amber-200"
              >
                Filter löschen
              </Link>
            </div>
          ) : null}
        </section>

        <section className="mb-8 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-400/[0.08] to-transparent p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Kunde bestätigt", "Der Auftrag wurde verbindlich zugesagt."],
              ["Keine Offerte nötig", "Preis und Leistung stehen bereits fest."],
              ["Sofort freigeschaltet", "Kundendaten nach erfolgreicher Zahlung."],
              ["Nur ein Anbieter", "Der erste erfolgreiche Käufer erhält den Auftrag."],
            ].map(([title, text]) => (
              <div key={title}>
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-1 text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {fixedOrders.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/10 text-3xl">
              🔥
            </div>
            <h2 className="mt-5 text-2xl font-bold">
              Keine passenden Fixaufträge gefunden
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Passe deine Filter an oder prüfe später erneut. Neue bestätigte
              Aufträge erscheinen automatisch auf dieser Seite.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {hasFilters ? (
                <Link
                  href="/portal/fixed-orders"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-bold text-black transition hover:bg-amber-300"
                >
                  Filter löschen
                </Link>
              ) : null}
              <Link
                href="/portal/leads"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 font-bold transition hover:bg-white/[0.1]"
              >
                Normale Leads ansehen
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {fixedOrders.map((order) => {
              const urgency = getUrgencyLabel(order.createdAt);

              return (
                <article
                  key={order.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320] p-6 transition duration-300 hover:-translate-y-1 hover:border-amber-400/35 hover:shadow-2xl hover:shadow-amber-950/20"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                          Bestätigter Auftrag
                        </span>
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${urgency.classes}`}
                        >
                          {urgency.label}
                        </span>
                      </div>

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

                  <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-300">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    {getAgeLabel(order.createdAt)}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                      📍 {order.postalCode} {order.city}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300">
                      {order.region || "Schweiz"}
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
                      <p className="text-xs text-slate-500">Auftragswert</p>
                      <p className="mt-1 text-lg font-bold">
                        {formatCurrency(order.orderValueCents)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
                      <p className="text-xs text-amber-300">Übernahmepreis</p>
                      <p className="mt-1 text-lg font-bold text-amber-300">
                        {formatCurrency(order.commissionAmountCents)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs text-slate-500">Ausführung</p>
                    <p className="mt-1 font-semibold">
                      {formatDate(order.executionDate, order.flexibleDate)}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.04] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-emerald-300">Sichere Übernahme</p>
                        <p className="mt-1 text-sm font-semibold">
                          Zahlung geschützt über Stripe
                        </p>
                      </div>
                      <span className="text-xl">🔒</span>
                    </div>
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
                        Nur 1 Anbieter
                      </span>
                    </div>

                    <Link
                      href={`/portal/fixed-orders/${order.id}`}
                      className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 font-bold text-black transition hover:bg-amber-300"
                    >
                      Auftrag prüfen und übernehmen
                      <span className="ml-2" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <h2 className="text-lg font-bold">Wichtiger Hinweis</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            Vor der Übernahme sind Kundenname, Telefonnummer, E-Mail-Adresse
            und genaue Strassenadresse geschützt. Nach erfolgreicher Zahlung
            der Vermittlungsgebühr werden diese Daten ausschliesslich dem
            übernehmenden Anbieter freigeschaltet.
          </p>
        </section>
      </div>
    </main>
  );
}