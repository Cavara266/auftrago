import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type FixedOrderCustomerPageProps = {
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
    return "Noch nicht festgelegt";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-slate-200">
        {value || "–"}
      </p>
    </div>
  );
}

export default async function FixedOrderCustomerPage({
  params,
}: FixedOrderCustomerPageProps) {
  const user = await requireUser();

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      companyName: true,
      status: true,
    },
  });

  if (!provider) {
    redirect("/login");
  }

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

      status: true,
      buyerId: true,

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
      commissionAmountCents: true,

      soldAt: true,
      completedAt: true,
      createdAt: true,
    },
  });

  if (!fixedOrder) {
    notFound();
  }

  const hasAccess =
    fixedOrder.buyerId === provider.id &&
    (fixedOrder.status === "SOLD" ||
      fixedOrder.status === "COMPLETED");

  if (!hasAccess) {
    redirect(`/portal/fixed-orders/${fixedOrder.id}`);
  }

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

  const executionText = fixedOrder.flexibleDate
    ? "Termin flexibel"
    : formatDate(fixedOrder.executionDate);

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/portal/fixed-orders/${fixedOrder.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          ← Zurück zum Fixauftrag
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-3xl border border-emerald-400/20 bg-[#0d1320] p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-500" />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
                Kundendaten freigeschaltet
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {fixedOrder.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Die Zahlung wurde bestätigt. Du kannst den
                Kunden jetzt direkt kontaktieren und die
                Ausführung organisieren.
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
              {fixedOrder.status === "COMPLETED"
                ? "Erledigt"
                : "Verkauft"}
            </span>
          </div>
        </section>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-7">
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
                  label="Adresse"
                  value={fullAddress}
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`tel:${fixedOrder.customerPhone}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-emerald-300"
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
                  Adresse in Maps öffnen ↗
                </a>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                Auftrag
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Leistungsumfang
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
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                Zusammenfassung
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-sm text-slate-400">
                    Kategorie
                  </span>
                  <span className="text-right text-sm font-bold">
                    {fixedOrder.category}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-sm text-slate-400">
                    Region
                  </span>
                  <span className="text-right text-sm font-bold">
                    {fixedOrder.region || "Schweiz"}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-sm text-slate-400">
                    Ausführung
                  </span>
                  <span className="text-right text-sm font-bold">
                    {executionText}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-sm text-slate-400">
                    Auftragswert
                  </span>
                  <span className="text-right text-sm font-bold">
                    {formatCurrency(
                      fixedOrder.orderValueCents
                    )}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-400">
                    Vermittlungsgebühr
                  </span>
                  <span className="text-right text-sm font-bold text-amber-300">
                    {formatCurrency(
                      fixedOrder.commissionAmountCents
                    )}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-6">
              <p className="text-sm font-bold text-amber-200">
                Wichtig
              </p>

              <p className="mt-3 text-xs leading-6 text-slate-400">
                Terminabstimmung, Ausführung,
                Rechnungsstellung und Gewährleistung erfolgen
                direkt zwischen dir und dem Kunden.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}