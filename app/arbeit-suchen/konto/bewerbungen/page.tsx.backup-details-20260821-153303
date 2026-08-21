import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCandidateSession } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  SENT: "Beworben",
  VIEWED: "Angesehen",
  INTERVIEW: "Interview",
  OFFER: "Angebot",
  HIRED: "Angestellt",
  REJECTED: "Absage",
};

function statusClass(status: string) {
  if (status === "HIRED") {
    return "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300";
  }

  if (status === "INTERVIEW" || status === "OFFER") {
    return "border-violet-400/20 bg-violet-400/[0.08] text-violet-300";
  }

  if (status === "REJECTED") {
    return "border-red-400/20 bg-red-400/[0.08] text-red-300";
  }

  return "border-sky-400/20 bg-sky-400/[0.08] text-sky-300";
}

export default async function CandidateApplicationsPage() {
  const session = await getCandidateSession();

  if (!session) {
    redirect("/arbeit-suchen/login");
  }

  const applications = await prisma.candidateApplication.findMany({
    where: {
      candidateAccountId: session.user.id,
    },
    orderBy: {
      appliedAt: "desc",
    },
  });

  const counts = {
    all: applications.length,
    interview: applications.filter((item) => item.status === "INTERVIEW")
      .length,
    offer: applications.filter((item) => item.status === "OFFER").length,
    hired: applications.filter((item) => item.status === "HIRED").length,
  };

  return (
    <main className="min-h-screen bg-[#06101f] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1280px]">
        <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#0b1a30] via-[#0a1427] to-[#1b163c] p-7 sm:p-10">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
                Auftrago Talent CRM
              </span>

              <h1 className="mt-6 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Meine Bewerbungen
              </h1>

              <p className="mt-4 max-w-[720px] text-base leading-7 text-slate-400">
                Alle Bewerbungen, Stellen und nächsten Schritte zentral an einem
                Ort.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/arbeit-suchen/stellen"
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white"
              >
                Neue Stellen entdecken
              </Link>

              <Link
                href="/arbeit-suchen/konto"
                className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 text-sm font-black text-white"
              >
                Zurück zum Konto
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Bewerbungen", counts.all],
            ["Interviews", counts.interview],
            ["Angebote", counts.offer],
            ["Angestellt", counts.hired],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-[24px] border border-white/[0.08] bg-[#091527] p-6"
            >
              <span className="text-xs font-bold text-slate-500">{label}</span>

              <strong className="mt-3 block text-4xl font-black">
                {value}
              </strong>
            </div>
          ))}
        </section>

        <section className="mt-6">
          {applications.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-[#091527] p-12 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] text-2xl">
                ✦
              </div>

              <h2 className="mt-6 text-2xl font-black">
                Noch keine Bewerbungen
              </h2>

              <p className="mx-auto mt-3 max-w-[580px] text-sm leading-6 text-slate-400">
                Sobald du dich über Auftrago auf eine Stelle bewirbst, erscheint
                sie automatisch hier.
              </p>

              <Link
                href="/arbeit-suchen/stellen"
                className="mt-7 inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white"
              >
                Stellen durchsuchen
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-[26px] border border-white/[0.08] bg-[#091527] p-6 transition hover:border-sky-400/20 sm:p-7"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${statusClass(
                            application.status,
                          )}`}
                        >
                          {statusLabels[application.status] ||
                            application.status}
                        </span>

                        <span className="text-xs font-bold text-slate-600">
                          {application.appliedAt.toLocaleDateString("de-CH")}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-black">
                        {application.jobTitle}
                      </h2>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                        {application.companyName && (
                          <span>{application.companyName}</span>
                        )}

                        {application.jobLocation && (
                          <span>{application.jobLocation}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {application.jobUrl && (
                        <a
                          href={application.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-5 text-sm font-black text-white"
                        >
                          Stelle öffnen ↗
                        </a>
                      )}

                      <button className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.06] px-5 text-sm font-black text-sky-300">
                        Details
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-5 gap-2 border-t border-white/[0.07] pt-5">
                    {[
                      ["SENT", "Beworben"],
                      ["VIEWED", "Angesehen"],
                      ["INTERVIEW", "Interview"],
                      ["OFFER", "Angebot"],
                      ["HIRED", "Angestellt"],
                    ].map(([status, label]) => {
                      const active =
                        [
                          "SENT",
                          "VIEWED",
                          "INTERVIEW",
                          "OFFER",
                          "HIRED",
                        ].indexOf(application.status) >=
                        [
                          "SENT",
                          "VIEWED",
                          "INTERVIEW",
                          "OFFER",
                          "HIRED",
                        ].indexOf(status);

                      return (
                        <div key={status}>
                          <div
                            className={`h-1.5 rounded-full ${
                              active ? "bg-sky-400" : "bg-white/[0.06]"
                            }`}
                          />

                          <span className="mt-2 hidden text-[10px] font-bold text-slate-600 sm:block">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
