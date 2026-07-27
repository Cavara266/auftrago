import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import FixedOrderCheckoutButton from "./checkout-button";
import FixedOrderPaymentStatus from "./payment-status";
import FixedOrderTrustDialog from "./trust-dialog";

export const dynamic = "force-dynamic";

type FixedOrderDetailPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    payment?: string;
  };
};

const PROCESS_STEPS = [
  {
    icon: "👀",
    title: "Auftrag ansehen",
    description:
      "Leistung, Ort, Auftragswert und Gebühr transparent prüfen.",
  },
  {
    icon: "💳",
    title: "Sicher bezahlen",
    description:
      "Die Übernahme läuft verschlüsselt über Stripe.",
  },
  {
    icon: "🔓",
    title: "Kundendaten erhalten",
    description:
      "Name, Telefon, E-Mail und Adresse werden sofort freigeschaltet.",
  },
  {
    icon: "📞",
    title: "Kunde kontaktieren",
    description:
      "Termin und Ausführung direkt mit dem Kunden organisieren.",
  },
  {
    icon: "💰",
    title: "Direkt fakturieren",
    description:
      "Du stellst dem Kunden selbst die Rechnung über den Auftragswert.",
  },
];

const BENEFITS = [
  {
    icon: "🔒",
    title: "Sichere Zahlung",
    description:
      "Die Vermittlungsgebühr wird sicher über Stripe bezahlt.",
  },
  {
    icon: "🏆",
    title: "Exklusive Vergabe",
    description:
      "Nach dem Kauf wird der Auftrag keinem weiteren Anbieter angeboten.",
  },
  {
    icon: "⚡",
    title: "Sofortiger Zugriff",
    description:
      "Die vollständigen Kundendaten werden direkt freigeschaltet.",
  },
  {
    icon: "📋",
    title: "Bereits bestätigt",
    description:
      "Es handelt sich um einen bestätigten Auftrag und nicht um einen gewöhnlichen Lead.",
  },
  {
    icon: "💵",
    title: "Direkte Abrechnung",
    description:
      "Du fakturierst den vereinbarten Auftragswert direkt dem Kunden.",
  },
  {
    icon: "🛡️",
    title: "Persönliche Prüfung",
    description:
      "Bei erheblichen Abweichungen prüfen wir den Fall individuell.",
  },
];

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Termin flexibel";
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStatusInformation(
  status: string,
  isOwner: boolean
) {
  if (status === "OPEN") {
    return {
      label: "Verfügbar",
      classes:
        "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (status === "RESERVED" && isOwner) {
    return {
      label: "Für dich reserviert",
      classes:
        "border-amber-400/25 bg-amber-400/10 text-amber-300",
    };
  }

  if (status === "SOLD" && isOwner) {
    return {
      label: "Von dir übernommen",
      classes:
        "border-blue-400/25 bg-blue-400/10 text-blue-300",
    };
  }

  if (status === "COMPLETED" && isOwner) {
    return {
      label: "Erledigt",
      classes:
        "border-violet-400/25 bg-violet-400/10 text-violet-300",
    };
  }

  return {
    label: "Nicht mehr verfügbar",
    classes:
      "border-slate-400/20 bg-slate-400/10 text-slate-300",
  };
}

export default async function FixedOrderDetailPage({
  params,
  searchParams,
}: FixedOrderDetailPageProps) {
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
      postalCode: true,
      city: true,
      executionDate: true,
      flexibleDate: true,
      orderValueCents: true,
      commissionPercent: true,
      commissionAmountCents: true,
      status: true,
      buyerId: true,
      reservedAt: true,
      soldAt: true,
      completedAt: true,
      createdAt: true,
    },
  });

  if (!fixedOrder) {
    notFound();
  }

  const isOwner = fixedOrder.buyerId === provider.id;
  const statusInformation = getStatusInformation(
    fixedOrder.status,
    isOwner
  );

  const canPurchase =
    provider.status === "APPROVED" &&
    (fixedOrder.status === "OPEN" ||
      (fixedOrder.status === "RESERVED" && isOwner));

  const hasCustomerAccess =
    isOwner &&
    (fixedOrder.status === "SOLD" ||
      fixedOrder.status === "COMPLETED");

  const isUnavailable =
    fixedOrder.status === "CANCELLED" ||
    (fixedOrder.status === "RESERVED" && !isOwner) ||
    (fixedOrder.status === "SOLD" && !isOwner) ||
    (fixedOrder.status === "COMPLETED" && !isOwner);

  const executionText = fixedOrder.flexibleDate
    ? "Termin flexibel"
    : formatDate(fixedOrder.executionDate);

  return (
    <main className="min-h-screen bg-[#070b14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <FixedOrderPaymentStatus
        fixedOrderId={fixedOrder.id}
        paymentState={searchParams?.payment}
      />

      <div className="mx-auto max-w-7xl">
        <Link
          href="/portal/fixed-orders"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          ← Zurück zu den Fixaufträgen
        </Link>

        {searchParams?.payment === "cancelled" ? (
          <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-5 py-4 text-sm font-semibold text-amber-200">
            Die Zahlung wurde abgebrochen. Die Reservierung wird wieder
            freigegeben.
          </div>
        ) : null}

        <div className="mt-6 grid gap-7 xl:grid-cols-[minmax(0,1fr)_370px]">
          <div className="space-y-7">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500" />

              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-amber-300">
                  Bestätigter Auftrag
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${statusInformation.classes}`}
                >
                  {statusInformation.label}
                </span>
              </div>

              <p className="mt-7 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                {fixedOrder.category}
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
                {fixedOrder.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                  {fixedOrder.region || "Schweiz"}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                  {fixedOrder.postalCode} {fixedOrder.city}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-300">
                  {executionText}
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <FixedOrderTrustDialog />

                {hasCustomerAccess ? (
                  <Link
                    href={`/portal/fixed-orders/${fixedOrder.id}/customer`}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-black text-black transition hover:bg-emerald-300"
                  >
                    Kundendaten öffnen
                  </Link>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                    100 % klarer Ablauf
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Das ist kein gewöhnlicher Lead
                  </h2>
                </div>

                <span className="inline-flex w-fit rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-black text-emerald-300">
                  Exklusive Vergabe
                </span>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Der Kunde und der Auftragswert sind bereits hinterlegt. Nach
                erfolgreicher Zahlung wird der Auftrag exklusiv dir
                zugeordnet. Du erhältst sofort die Kontaktdaten und kannst die
                Ausführung direkt organisieren.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "Auftrag bereits bestätigt",
                  "Nur einmalige Vergabe",
                  "Kundendaten sofort sichtbar",
                  "Keine versteckten Gebühren",
                  "Sichere Stripe-Zahlung",
                  "Direkte Rechnung an den Kunden",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm font-semibold text-slate-200"
                  >
                    <span className="text-emerald-300">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                Leistungsumfang
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Auftragsbeschreibung
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

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                So funktioniert&apos;s
              </p>

              <h2 className="mt-2 text-2xl font-black">
                In fünf klaren Schritten zum Auftrag
              </h2>

              <div className="mt-7 grid gap-4 lg:grid-cols-5">
                {PROCESS_STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="relative rounded-2xl border border-white/10 bg-black/10 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl" aria-hidden="true">
                        {step.icon}
                      </span>

                      <span className="text-xs font-black text-slate-600">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-black text-white">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {step.description}
                    </p>

                    {index < PROCESS_STEPS.length - 1 ? (
                      <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-lg text-amber-300 lg:block">
                        →
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                Auftragsinformationen
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Alles auf einen Blick
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-slate-500">
                    Kategorie
                  </p>
                  <p className="mt-2 text-lg font-black">
                    {fixedOrder.category}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-slate-500">
                    Region
                  </p>
                  <p className="mt-2 text-lg font-black">
                    {fixedOrder.region || "Schweiz"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-slate-500">
                    Einsatzort
                  </p>
                  <p className="mt-2 text-lg font-black">
                    {fixedOrder.postalCode} {fixedOrder.city}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs text-slate-500">
                    Ausführung
                  </p>
                  <p className="mt-2 text-lg font-black">
                    {executionText}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-300">
                Deine Vorteile
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Warum Anbieter Fixaufträge wählen
              </h2>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {BENEFITS.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-white/10 bg-black/10 p-5"
                  >
                    <span className="text-2xl" aria-hidden="true">
                      {benefit.icon}
                    </span>

                    <h3 className="mt-4 text-sm font-black">
                      {benefit.title}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.08] to-transparent p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-amber-400/25 bg-amber-400/10 text-2xl">
                  🛡️
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                    Auftrago Käuferschutz
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    Wir prüfen Probleme persönlich
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    Sollte ein Fixauftrag erheblich von der Beschreibung
                    abweichen oder aus Gründen, die du nicht zu vertreten hast,
                    nicht durchgeführt werden können, prüft unser Team den Fall
                    individuell und sucht gemeinsam mit dir nach einer fairen
                    Lösung.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6 sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                Häufige Fragen
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Alles Wichtige vor der Übernahme
              </h2>

              <div className="mt-6 divide-y divide-white/10">
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    Muss ich noch eine Offerte erstellen?
                    <span className="text-amber-300 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Nein. Der Fixauftrag wurde bereits bestätigt. Du kannst
                    nach dem Kauf direkt den Kunden kontaktieren und die
                    Ausführung organisieren.
                  </p>
                </details>

                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    Wird der Auftrag mehrfach verkauft?
                    <span className="text-amber-300 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Nein. Nach erfolgreicher Zahlung wird der Auftrag exklusiv
                    deinem Anbieterprofil zugeordnet.
                  </p>
                </details>

                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    Wann sehe ich die Kundendaten?
                    <span className="text-amber-300 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Sofort nach erfolgreicher Zahlung. Danach stehen dir Name,
                    Telefon, E-Mail-Adresse und die vollständige Einsatzadresse
                    zur Verfügung.
                  </p>
                </details>

                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    Wem stelle ich die Rechnung?
                    <span className="text-amber-300 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Du stellst deine Rechnung über den Auftragswert direkt dem
                    Kunden. Auftrago erhält nur die ausgewiesene
                    Vermittlungsgebühr.
                  </p>
                </details>

                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                    Was passiert, wenn Angaben nicht stimmen?
                    <span className="text-amber-300 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Melde dich mit den entsprechenden Nachweisen bei uns. Wir
                    prüfen erhebliche Abweichungen individuell und suchen nach
                    einer fairen Lösung.
                  </p>
                </details>
              </div>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="overflow-hidden rounded-3xl border border-amber-400/25 bg-[#11131a]">
              <div className="border-b border-white/10 p-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                  Auftrag übernehmen
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Verbindlicher Fixauftrag
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="text-sm text-slate-400">
                      Auftragswert
                    </span>
                    <span className="text-sm font-black">
                      {formatCurrency(
                        fixedOrder.orderValueCents
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="text-sm text-slate-400">
                      Vermittlungsgebühr
                    </span>
                    <span className="text-sm font-black text-amber-300">
                      {fixedOrder.commissionPercent} %
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-5">
                  <p className="text-xs font-bold text-amber-200">
                    Preis für die Auftragsübernahme
                  </p>

                  <p className="mt-2 text-3xl font-black text-amber-300">
                    {formatCurrency(
                      fixedOrder.commissionAmountCents
                    )}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                  <p className="text-sm font-black text-emerald-300">
                    Du fakturierst dem Kunden selbst
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Auftrago berechnet nur die oben ausgewiesene
                    Vermittlungsgebühr. Den Auftragswert stellst du direkt dem
                    Kunden in Rechnung.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    "Kunde und Auftragswert sind bereits hinterlegt.",
                    "Der Auftrag wird nur einmal vergeben.",
                    "Kundendaten werden nach Zahlung sofort freigeschaltet.",
                    "Die Zahlung erfolgt sicher über Stripe.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300"
                    >
                      <span className="text-emerald-300">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {provider.status !== "APPROVED" ? (
                  <div className="mt-5 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm leading-6 text-red-200">
                    Dein Anbieterprofil muss zuerst freigeschaltet werden,
                    bevor du Fixaufträge übernehmen kannst.
                  </div>
                ) : null}

                {canPurchase ? (
                  <div className="mt-5">
                    <FixedOrderCheckoutButton
                      fixedOrderId={fixedOrder.id}
                      amountFormatted={formatCurrency(
                        fixedOrder.commissionAmountCents
                      )}
                    />
                  </div>
                ) : null}

                {hasCustomerAccess ? (
                  <Link
                    href={`/portal/fixed-orders/${fixedOrder.id}/customer`}
                    className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-black transition hover:bg-emerald-300"
                  >
                    Kundendaten öffnen
                  </Link>
                ) : null}

                {isUnavailable ? (
                  <div className="mt-5 rounded-xl border border-slate-400/20 bg-slate-400/10 p-4 text-center text-sm font-semibold text-slate-300">
                    Dieser Fixauftrag ist aktuell nicht mehr verfügbar.
                  </div>
                ) : null}

                <div className="mt-5 text-center text-xs leading-5 text-slate-500">
                  Der Auftrag wird während des sicheren Zahlungsvorgangs
                  vorübergehend für dich reserviert.
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#0d1320] p-6">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Angemeldet als
              </p>

              <p className="mt-2 font-black">
                {provider.companyName}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Anbieterstatus: {provider.status}
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}