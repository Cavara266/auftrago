import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCandidateSession } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";

export default async function TalentDashboardPage() {
  const session = await getCandidateSession();

  if (!session) {
    redirect("/arbeit-suchen/login");
  }

  const account = await prisma.candidateAccount.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      status: true,
      subscriptionStatus: true,
      subscriptionExempt: true,
      candidateProfile: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      _count: {
        select: {
          candidateApplications: true,
          candidateSavedJobs: true,
          candidateJobAlerts: true,
          jobUnlocks: true,
        },
      },
    },
  });

  if (!account) {
    redirect("/arbeit-suchen/login");
  }

  const firstName = account.candidateProfile?.firstName?.trim() || "Talent";

  const subscriptionStatus =
    account.subscriptionStatus?.toUpperCase() || "INACTIVE";

  const hasActiveSubscription =
    account.subscriptionExempt ||
    ["ACTIVE", "TRIALING"].includes(subscriptionStatus);

  const cards = [
    {
      eyebrow: "STELLENSUCHE",
      title: "Neue Jobs entdecken",
      text: "Durchsuche aktuelle Stellenangebote aus der ganzen Schweiz und finde neue Chancen.",
      value: `${account._count.jobUnlocks}`,
      valueLabel: "geöffnete Stellen",
      href: "/arbeit-suchen/stellen",
      button: "Stellen entdecken",
      accent: "sky",
    },
    {
      eyebrow: "TALENT CRM",
      title: "Meine Bewerbungen",
      text: "Verwalte deine Bewerbungen zentral und behalte Status und nächste Schritte im Blick.",
      value: `${account._count.candidateApplications}`,
      valueLabel: "Bewerbungen",
      href: "/arbeit-suchen/konto/bewerbungen",
      button: "Bewerbungen öffnen",
      accent: "violet",
    },
    {
      eyebrow: "AUTOMATISCHE JOBSUCHE",
      title: "Job-Alarm",
      text: "Lege Suchprofile für Beruf und Region an und lass passende Jobs automatisch zu dir kommen.",
      value: `${account._count.candidateJobAlerts}`,
      valueLabel: "Job-Alarme",
      href: "/arbeit-suchen/konto/job-alarm",
      button: "Job-Alarm verwalten",
      accent: "emerald",
    },
    {
      eyebrow: "MERKLISTE",
      title: "Gespeicherte Stellen",
      text: "Speichere interessante Stellen und entscheide später, wo du dich bewerben möchtest.",
      value: `${account._count.candidateSavedJobs}`,
      valueLabel: "gespeichert",
      href: "/arbeit-suchen/konto/gespeichert",
      button: "Gespeicherte Jobs",
      accent: "amber",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-[#06101f] text-white">
      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 12% 12%, rgba(56,189,248,.13), transparent 30%), radial-gradient(circle at 88% 20%, rgba(139,92,246,.14), transparent 34%)",
          }}
        />

        <div className="relative mx-auto max-w-[1280px]">
          <div className="overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.025]">
            <div className="grid lg:grid-cols-[1fr_340px]">
              <div className="p-7 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-sky-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Auftrago Talent CRM
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[11px] font-bold text-slate-400">
                    Neu
                  </span>
                </div>

                <p className="mt-8 text-sm font-bold text-slate-500">
                  Willkommen zurück, {firstName}
                </p>

                <h1 className="mt-2 max-w-[760px] text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                  Dein Karriere-Cockpit.
                  <span className="mt-1 block bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                    Alles an einem Ort.
                  </span>
                </h1>

                <p className="mt-6 max-w-[720px] text-base font-medium leading-7 text-slate-400 sm:text-lg">
                  Jobs entdecken, Bewerbungen verwalten, interessante Stellen
                  speichern und automatische Job-Alarme einrichten.
                </p>
              </div>

              <div className="border-t border-white/[0.07] bg-white/[0.025] p-7 sm:p-10 lg:border-l lg:border-t-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                  Talent Mitgliedschaft
                </p>

                <p className="mt-3 text-2xl font-black">
                  {hasActiveSubscription ? "Abo aktiv" : "Kein aktives Abo"}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {hasActiveSubscription
                    ? "Dein vollständiger Talent-Zugang ist freigeschaltet."
                    : "Aktiviere Talent für den vollständigen Zugang zu allen Jobs."}
                </p>

                <div className="mt-7 rounded-[22px] border border-white/[0.08] bg-[#071426] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">
                      Status
                    </span>
                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${
                        hasActiveSubscription
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {hasActiveSubscription ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                </div>

                {!hasActiveSubscription && (
                  <Link
                    href="/arbeit-suchen/abo"
                    className="mt-5 inline-flex min-h-[50px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
                  >
                    Talent-Abo aktivieren – CHF 99.–
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                Dein Talent Bereich
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.035em]">
                Was möchtest du machen?
              </h2>
            </div>

            <Link
              href="/arbeit-suchen/stellen"
              className="text-sm font-bold text-sky-300 transition hover:text-sky-200"
            >
              Alle Stellen ansehen →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {cards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#091527] p-7 transition duration-300 hover:-translate-y-1 hover:border-sky-400/20 hover:bg-[#0b192d] sm:p-8"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
                      {card.eyebrow}
                    </span>

                    <h3 className="mt-3 text-2xl font-black tracking-[-0.025em]">
                      {card.title}
                    </h3>
                  </div>

                  <div className="grid min-h-[58px] min-w-[58px] place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl transition group-hover:scale-105">
                    ↗
                  </div>
                </div>

                <p className="mt-4 max-w-[560px] text-sm font-medium leading-6 text-slate-400">
                  {card.text}
                </p>

                <div className="mt-8 flex items-end justify-between gap-4 border-t border-white/[0.07] pt-6">
                  <div>
                    <strong className="block text-3xl font-black">
                      {card.value}
                    </strong>
                    <span className="mt-1 block text-xs font-bold text-slate-500">
                      {card.valueLabel}
                    </span>
                  </div>

                  <span className="text-sm font-black text-sky-300">
                    {card.button} →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-[28px] border border-sky-400/15 bg-gradient-to-br from-sky-400/[0.07] via-blue-500/[0.04] to-violet-500/[0.08] p-7 sm:p-8">
              <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                    Auftrago Matching
                  </p>

                  <h3 className="mt-3 text-2xl font-black">
                    Lass passende Jobs zu dir kommen.
                  </h3>

                  <p className="mt-3 max-w-[650px] text-sm leading-6 text-slate-400">
                    Erstelle einen persönlichen Job-Alarm nach Beruf, Ort und
                    Kanton. So musst du nicht jeden Tag selbst suchen.
                  </p>
                </div>

                <Link
                  href="/arbeit-suchen/konto/job-alarm"
                  className="inline-flex min-h-[52px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
                >
                  Job-Alarm erstellen →
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/[0.08] bg-[#091527] p-7 sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Talent Profil
              </p>

              <h3 className="mt-3 text-xl font-black">
                {account.candidateProfile?.firstName || ""}{" "}
                {account.candidateProfile?.lastName || ""}
              </h3>

              <p className="mt-1 truncate text-sm text-slate-500">
                {account.candidateProfile?.email || ""}
              </p>

              <Link
                href="/arbeit-suchen"
                className="mt-6 inline-flex text-sm font-black text-sky-300"
              >
                Profil ansehen / bearbeiten →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
