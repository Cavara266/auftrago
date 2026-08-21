import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCandidateSession } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";

async function createJobAlert(formData: FormData) {
  "use server";

  const session = await getCandidateSession();

  if (!session) {
    redirect("/arbeit-suchen/login");
  }

  const jobQuery = String(formData.get("jobQuery") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const canton = String(formData.get("canton") || "").trim();

  await prisma.candidateJobAlert.create({
    data: {
      candidateAccountId: session.user.id,
      jobQuery: jobQuery || null,
      location: location || null,
      canton: canton || null,
      emailEnabled: true,
      frequency: "DAILY",
      active: true,
    },
  });

  redirect("/arbeit-suchen/konto/job-alarm");
}

async function deleteJobAlert(formData: FormData) {
  "use server";

  const session = await getCandidateSession();

  if (!session) {
    redirect("/arbeit-suchen/login");
  }

  const id = String(formData.get("id") || "");

  if (!id) {
    return;
  }

  await prisma.candidateJobAlert.deleteMany({
    where: {
      id,
      candidateAccountId: session.user.id,
    },
  });

  redirect("/arbeit-suchen/konto/job-alarm");
}

export default async function JobAlarmPage() {
  const session = await getCandidateSession();

  if (!session) {
    redirect("/arbeit-suchen/login");
  }

  const alerts = await prisma.candidateJobAlert.findMany({
    where: {
      candidateAccountId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <section className="mx-auto max-w-[1280px] px-5 py-12 sm:px-8 lg:px-12">
        <div className="rounded-[30px] border border-white/[0.08] bg-gradient-to-br from-[#0d2138] via-[#0b1629] to-[#19183b] p-6 sm:p-8">
          <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300">
            Auftrago Job Alarm
          </span>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Lass passende Jobs zu dir kommen.
          </h1>

          <p className="mt-4 max-w-[760px] text-sm leading-7 text-slate-400 sm:text-base">
            Wähle Beruf und Region. Auftrago sucht automatisch nach passenden
            Stellen und informiert dich künftig über neue Treffer.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-[26px] border border-white/[0.08] bg-[#0b1628] p-5 sm:p-6">
            <h2 className="text-2xl font-black">Neuen Job-Alarm erstellen</h2>

            <form action={createJobAlert} className="mt-6 grid gap-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Job / Beruf
                </label>

                <input
                  name="jobQuery"
                  placeholder="z.B. Gärtner, Reinigung, Chauffeur"
                  className="min-h-[52px] w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Ort
                </label>

                <input
                  name="location"
                  placeholder="z.B. Aarau"
                  className="min-h-[52px] w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Kanton
                </label>

                <select
                  name="canton"
                  className="min-h-[52px] w-full rounded-xl border border-white/[0.09] bg-[#0e1a2d] px-4 text-sm font-semibold text-white outline-none focus:border-sky-400/40"
                >
                  <option value="">Ganze Schweiz</option>
                  <option value="AG">Aargau</option>
                  <option value="ZH">Zürich</option>
                  <option value="BE">Bern</option>
                  <option value="LU">Luzern</option>
                  <option value="ZG">Zug</option>
                  <option value="SO">Solothurn</option>
                  <option value="BS">Basel-Stadt</option>
                  <option value="BL">Basel-Landschaft</option>
                  <option value="SZ">Schwyz</option>
                  <option value="SG">St. Gallen</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex min-h-[54px] items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                Job-Alarm aktivieren
              </button>
            </form>
          </section>

          <section className="rounded-[26px] border border-white/[0.08] bg-[#0b1628] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-sky-300">
                  Automatische Jobsuche
                </p>
                <h2 className="mt-2 text-2xl font-black">Meine Job-Alarme</h2>
              </div>

              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-sm font-black text-emerald-300">
                {alerts.filter((alert) => alert.active).length} aktiv
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {alerts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.025] p-8 text-center">
                  <p className="font-black">
                    Noch kein Job-Alarm eingerichtet.
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Erstelle links deinen ersten persönlichen Suchauftrag.
                  </p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <article
                    key={alert.id}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                            Aktiv
                          </span>

                          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[10px] font-bold text-slate-400">
                            täglich
                          </span>
                        </div>

                        <h3 className="mt-4 text-lg font-black">
                          {alert.jobQuery || "Alle Jobs"}
                        </h3>

                        <p className="mt-2 text-sm text-slate-400">
                          {[alert.location, alert.canton]
                            .filter(Boolean)
                            .join(" · ") || "Ganze Schweiz"}
                        </p>

                        <p className="mt-3 text-xs text-slate-500">
                          E-Mail Benachrichtigung aktiviert
                        </p>
                      </div>

                      <form action={deleteJobAlert}>
                        <input type="hidden" name="id" value={alert.id} />

                        <button
                          type="submit"
                          className="rounded-xl border border-red-400/10 bg-red-400/[0.05] px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-400/[0.1]"
                        >
                          Löschen
                        </button>
                      </form>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
