import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type SystemStatus = {
  label: string;
  description: string;
  active: boolean;
  required?: boolean;
};

function getEnvironmentStatus(
  value: string | undefined,
  options?: {
    activeLabel?: string;
    inactiveLabel?: string;
    required?: boolean;
  }
): SystemStatus {
  const active = Boolean(value?.trim());

  return {
    active,
    required: options?.required,
    label: active
      ? options?.activeLabel ?? "Konfiguriert"
      : options?.inactiveLabel ?? "Nicht konfiguriert",
    description: active
      ? "Die erforderliche Umgebungsvariable ist vorhanden."
      : "Die erforderliche Umgebungsvariable fehlt.",
  };
}

function getBooleanEnvironmentStatus(
  value: string | undefined,
  defaultValue = false
) {
  if (!value?.trim()) {
    return defaultValue;
  }

  return ["true", "1", "yes", "on"].includes(
    value.trim().toLowerCase()
  );
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "Noch keine Daten";
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

function StatusBadge({
  active,
  activeLabel = "Aktiv",
  inactiveLabel = "Fehlt",
}: {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <span
      className={
        active
          ? "inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300"
          : "inline-flex rounded-full border border-red-400/20 bg-red-400/10 px-3 py-1 text-xs font-bold text-red-300"
      }
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

export default async function AdminSettingsPage() {
  const stripeSecretStatus = getEnvironmentStatus(
    process.env.STRIPE_SECRET_KEY,
    {
      required: true,
    }
  );

  const stripeWebhookStatus = getEnvironmentStatus(
    process.env.STRIPE_WEBHOOK_SECRET,
    {
      required: true,
    }
  );

  const publicStripeStatus = getEnvironmentStatus(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    {
      required: true,
    }
  );

  const databaseStatus = getEnvironmentStatus(
    process.env.DATABASE_URL,
    {
      required: true,
    }
  );

  const authSecretStatus = getEnvironmentStatus(
    process.env.AUTH_SECRET,
    {
      required: true,
    }
  );

  const resendStatus = getEnvironmentStatus(
    process.env.RESEND_API_KEY,
    {
      required: false,
    }
  );

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "Nicht konfiguriert");

  const maintenanceMode =
    getBooleanEnvironmentStatus(
      process.env.MAINTENANCE_MODE
    );

  const [
    providerCount,
    approvedProviderCount,
    pendingProviderCount,
    leadCount,
    fixedOrderCount,
    openFixedOrderCount,
    soldFixedOrderCount,
    paidCreditAggregate,
    paidInvoiceAggregate,
    latestProvider,
    latestLead,
    latestFixedOrder,
  ] = await Promise.all([
    prisma.provider.count(),

    prisma.provider.count({
      where: {
        status: "APPROVED",
      },
    }),

    prisma.provider.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.lead.count(),

    prisma.fixedOrder.count(),

    prisma.fixedOrder.count({
      where: {
        status: "OPEN",
      },
    }),

    prisma.fixedOrder.count({
      where: {
        status: "SOLD",
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

    prisma.provider.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    }),

    prisma.lead.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    }),

    prisma.fixedOrder.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    }),
  ]);

  const totalCreditRevenue =
    paidCreditAggregate._sum.amount ?? 0;

  const totalCreditsSold =
    paidCreditAggregate._sum.credits ?? 0;

  const totalFixedOrderRevenue =
    paidInvoiceAggregate._sum.amountCents ?? 0;

  const totalRevenue =
    totalCreditRevenue + totalFixedOrderRevenue;

  const requiredSystems = [
    databaseStatus,
    authSecretStatus,
    stripeSecretStatus,
    stripeWebhookStatus,
    publicStripeStatus,
  ];

  const configuredRequiredSystems =
    requiredSystems.filter(
      (system) => system.active
    ).length;

  const launchReadiness = Math.round(
    (configuredRequiredSystems /
      requiredSystems.length) *
      100
  );

  const configurationItems = [
    {
      name: "Datenbank",
      variable: "DATABASE_URL",
      description:
        "Verbindung zur PostgreSQL-Datenbank von Auftrago.",
      status: databaseStatus,
    },
    {
      name: "Authentifizierung",
      variable: "AUTH_SECRET",
      description:
        "Geheimer Schlüssel für Anmeldung und Sessions.",
      status: authSecretStatus,
    },
    {
      name: "Stripe Secret Key",
      variable: "STRIPE_SECRET_KEY",
      description:
        "Serverseitiger Schlüssel für Stripe-Zahlungen.",
      status: stripeSecretStatus,
    },
    {
      name: "Stripe Webhook",
      variable: "STRIPE_WEBHOOK_SECRET",
      description:
        "Verifiziert erfolgreiche Stripe-Zahlungen.",
      status: stripeWebhookStatus,
    },
    {
      name: "Stripe Public Key",
      variable:
        "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      description:
        "Öffentlicher Stripe-Schlüssel für den Checkout.",
      status: publicStripeStatus,
    },
    {
      name: "E-Mail-Versand",
      variable: "RESEND_API_KEY",
      description:
        "Versendet Benachrichtigungen und Bestätigungen.",
      status: resendStatus,
    },
  ];

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

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-violet-300">
                Auftrago Administration
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Einstellungen
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
                Zentrale Übersicht über Systemstatus,
                Zahlungsdienste, E-Mail-Versand,
                Plattformdaten und Launch-Bereitschaft.
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
                href="/admin/payments"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold transition hover:bg-white/[0.08]"
              >
                Zahlungen
              </Link>

              <Link
                href="/admin/providers"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-violet-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-violet-300"
              >
                Anbieter
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-violet-400/20 bg-violet-400/[0.06] p-5">
            <p className="text-sm text-violet-300">
              Launch-Bereitschaft
            </p>

            <p className="mt-2 text-3xl font-bold">
              {launchReadiness} %
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
                style={{
                  width: `${launchReadiness}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-500">
              {configuredRequiredSystems} von{" "}
              {requiredSystems.length} Pflichtsystemen
            </p>
          </article>

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

          <article className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
            <p className="text-sm text-emerald-300">
              Anbieter
            </p>

            <p className="mt-2 text-3xl font-bold">
              {providerCount}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {approvedProviderCount} freigeschaltet ·{" "}
              {pendingProviderCount} in Prüfung
            </p>
          </article>

          <article className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-5">
            <p className="text-sm text-amber-300">
              Plattform-Inhalte
            </p>

            <p className="mt-2 text-3xl font-bold">
              {leadCount + fixedOrderCount}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              {leadCount} Leads · {fixedOrderCount}{" "}
              Fixaufträge
            </p>
          </article>
        </section>

        <section className="mb-8 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
                  Systemstatus
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Dienste und Konfiguration
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Diese Übersicht zeigt, ob die wichtigen
                  Umgebungsvariablen in Vercel oder deiner
                  lokalen Umgebung gesetzt sind.
                </p>
              </div>

              <StatusBadge
                active={launchReadiness === 100}
                activeLabel="Launchbereit"
                inactiveLabel="Prüfung nötig"
              />
            </div>

            <div className="mt-7 grid gap-4">
              {configurationItems.map((item) => (
                <div
                  key={item.variable}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-bold">
                          {item.name}
                        </h3>

                        {item.status.required ? (
                          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                            Pflicht
                          </span>
                        ) : (
                          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Optional
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {item.description}
                      </p>

                      <code className="mt-3 inline-flex rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-cyan-300">
                        {item.variable}
                      </code>
                    </div>

                    <StatusBadge
                      active={item.status.active}
                      activeLabel="Konfiguriert"
                      inactiveLabel="Fehlt"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-5">
            <article className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Plattform
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Allgemeine Angaben
              </h2>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">
                    Plattform-URL
                  </p>

                  <p className="mt-2 break-all font-semibold">
                    {appUrl}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Wartungsmodus
                      </p>

                      <p className="mt-1 font-semibold">
                        {maintenanceMode
                          ? "Aktiviert"
                          : "Deaktiviert"}
                      </p>
                    </div>

                    <StatusBadge
                      active={!maintenanceMode}
                      activeLabel="Online"
                      inactiveLabel="Wartung"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">
                    Systemumgebung
                  </p>

                  <p className="mt-1 font-semibold">
                    {process.env.NODE_ENV ===
                    "production"
                      ? "Produktion"
                      : "Entwicklung"}
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                Fixaufträge
              </p>

              <h2 className="mt-2 text-xl font-bold">
                Auftragsstatus
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-slate-500">
                    Gesamt
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {fixedOrderCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4">
                  <p className="text-xs text-emerald-300">
                    Offen
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {openFixedOrderCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4 col-span-2">
                  <p className="text-xs text-amber-300">
                    Verkauft
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {soldFixedOrderCount}
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="mb-8 grid gap-5 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              Credits
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Credit-Verkäufe
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-slate-400">
                  Zahlungen
                </span>

                <strong>
                  {paidCreditAggregate._count.id}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-slate-400">
                  Credits verkauft
                </span>

                <strong>{totalCreditsSold}</strong>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-400">
                  Umsatz
                </span>

                <strong className="text-emerald-300">
                  {formatCurrency(
                    totalCreditRevenue
                  )}
                </strong>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              Provisionen
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Fixauftrag-Umsatz
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-slate-400">
                  Bezahlte Rechnungen
                </span>

                <strong>
                  {paidInvoiceAggregate._count.id}
                </strong>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-400">
                  Umsatz
                </span>

                <strong className="text-amber-300">
                  {formatCurrency(
                    totalFixedOrderRevenue
                  )}
                </strong>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
              Letzte Aktivitäten
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Aktualität
            </h2>

            <div className="mt-6 space-y-4">
              <div className="border-b border-white/10 pb-4">
                <p className="text-xs text-slate-500">
                  Letzter Anbieter
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatDate(
                    latestProvider?.createdAt
                  )}
                </p>
              </div>

              <div className="border-b border-white/10 pb-4">
                <p className="text-xs text-slate-500">
                  Letzter Lead
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatDate(latestLead?.createdAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Letzter Fixauftrag
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {formatDate(
                    latestFixedOrder?.createdAt
                  )}
                </p>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">
            Schnellzugriff
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Plattform verwalten
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/providers"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-violet-400/30 hover:bg-white/[0.06]"
            >
              <span className="text-2xl">👥</span>

              <h3 className="mt-4 font-bold">
                Anbieter
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Anbieter prüfen, freischalten oder
                sperren.
              </p>
            </Link>

            <Link
              href="/admin/leads"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.06]"
            >
              <span className="text-2xl">📋</span>

              <h3 className="mt-4 font-bold">Leads</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Neue Anfragen und bestehende Leads
                verwalten.
              </p>
            </Link>

            <Link
              href="/admin/fixed-orders"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-amber-400/30 hover:bg-white/[0.06]"
            >
              <span className="text-2xl">🔥</span>

              <h3 className="mt-4 font-bold">
                Fixaufträge
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Bestätigte Aufträge erstellen und
                bearbeiten.
              </p>
            </Link>

            <Link
              href="/admin/payments"
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.06]"
            >
              <span className="text-2xl">💳</span>

              <h3 className="mt-4 font-bold">
                Zahlungen
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Stripe-Zahlungen und Provisionen
                kontrollieren.
              </p>
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-amber-200">
            Sicherheitshinweis
          </h2>

          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
            Geheime Schlüssel dürfen niemals direkt im
            Quellcode gespeichert werden. Hinterlege
            Datenbank-, Stripe-, Auth- und
            E-Mail-Schlüssel ausschliesslich als
            Umgebungsvariablen in Vercel oder deiner
            lokalen <code>.env</code>-Datei.
          </p>
        </section>
      </div>
    </main>
  );
}