import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCandidateSession } from "@/lib/candidate-auth";
import StatusControl from "./status-control";

export const dynamic = "force-dynamic";

const STEPS = [
  { key: "SENT", label: "Beworben" },
  { key: "VIEWED", label: "Angesehen" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "OFFER", label: "Angebot" },
  { key: "HIRED", label: "Angestellt" },
] as const;

function normalizeStatus(status: string) {
  const value = String(status || "SENT").toUpperCase();

  if (value === "APPLIED") return "SENT";
  if (value === "SEEN") return "VIEWED";

  return value;
}

function statusIndex(status: string) {
  const normalized = normalizeStatus(status);
  const index = STEPS.findIndex((step) => step.key === normalized);
  return index >= 0 ? index : 0;
}

function statusLabel(status: string) {
  const normalized = normalizeStatus(status);

  return STEPS.find((step) => step.key === normalized)?.label || normalized;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "–";

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function CandidateApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getCandidateSession();

  if (!session) {
    redirect("/arbeit-suchen/login");
  }

  const application = await prisma.candidateApplication.findFirst({
    where: {
      id: params.id,
      candidateAccountId: session.user.id,
    },
  });

  if (!application) {
    notFound();
  }

  const currentIndex = statusIndex(application.status);

  return (
    <main className="min-h-screen bg-[#06101f] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-6">
          <Link
            href="/arbeit-suchen/konto/bewerbungen"
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition hover:text-sky-200"
          >
            ← Zurück zu meinen Bewerbungen
          </Link>
        </div>

        <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#0b1a30] via-[#0a1427] to-[#1b163c] p-7 sm:p-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                Auftrago Talent CRM
              </span>

              <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                {application.jobTitle}
              </h1>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-slate-400">
                {application.companyName && (
                  <span>{application.companyName}</span>
                )}

                {application.jobLocation && (
                  <span>{application.jobLocation}</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/[0.07] px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                Aktueller Status
              </p>

              <p className="mt-1 text-lg font-black text-sky-300">
                {statusLabel(application.status)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] border border-white/[0.08] bg-[#091527] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
                Bewerbungsprozess
              </p>

              <h2 className="mt-2 text-2xl font-black">Dein Fortschritt</h2>
            </div>

            <span className="text-sm text-slate-500">
              Schritt {currentIndex + 1} von {STEPS.length}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-5 gap-2">
            {STEPS.map((step, index) => {
              const active = index <= currentIndex;

              return (
                <div key={step.key}>
                  <div
                    className={`h-2 rounded-full ${
                      active
                        ? "bg-gradient-to-r from-sky-400 to-violet-500"
                        : "bg-white/[0.06]"
                    }`}
                  />

                  <p
                    className={`mt-3 text-[11px] font-bold ${
                      active ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[28px] border border-white/[0.08] bg-[#091527] p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
              Stelle
            </p>

            <h2 className="mt-4 text-2xl font-black">{application.jobTitle}</h2>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-bold text-slate-500">Unternehmen</p>
                <p className="mt-1 font-bold text-slate-200">
                  {application.companyName || "Nicht angegeben"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500">Arbeitsort</p>
                <p className="mt-1 font-bold text-slate-200">
                  {application.jobLocation || "Nicht angegeben"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500">
                  Bewerbungsdatum
                </p>
                <p className="mt-1 font-bold text-slate-200">
                  {formatDate(application.appliedAt)}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500">Quelle</p>
                <p className="mt-1 font-bold text-slate-200">
                  {application.jobSource || "Auftrago"}
                </p>
              </div>
            </div>

            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-5 text-sm font-black transition hover:bg-white/[0.07]"
              >
                Original-Stelle öffnen ↗
              </a>
            )}
          </section>

          <section className="rounded-[28px] border border-white/[0.08] bg-[#091527] p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">
              Bewerbung
            </p>

            <h2 className="mt-4 text-2xl font-black">Dein Anschreiben</h2>

            <div className="mt-6 min-h-[280px] whitespace-pre-wrap rounded-[20px] border border-white/[0.07] bg-[#06101f] p-6 text-sm leading-7 text-slate-300">
              {application.coverLetter ||
                "Für diese Bewerbung wurde kein Anschreiben gespeichert."}
            </div>

            {application.candidateNote && (
              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
                  Eigene Notiz
                </p>

                <div className="mt-3 whitespace-pre-wrap rounded-[18px] border border-amber-400/10 bg-amber-400/[0.04] p-5 text-sm leading-6 text-slate-300">
                  {application.candidateNote}
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-6">
          <StatusControl
            applicationId={application.id}
            currentStatus={application.status}
          />
        </div>

        <section className="mt-6 rounded-[28px] border border-white/[0.08] bg-[#091527] p-7">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                Nächster Schritt
              </p>

              <h2 className="mt-2 text-xl font-black">
                Bewerbung weiterverfolgen
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Alle Änderungen und nächsten Schritte bleiben in deinem Talent
                CRM gespeichert.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/arbeit-suchen/stellen"
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 text-sm font-black transition hover:bg-white/[0.07]"
              >
                Weitere Stellen
              </Link>

              <Link
                href="/arbeit-suchen/konto/bewerbungen"
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black"
              >
                Talent CRM
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
