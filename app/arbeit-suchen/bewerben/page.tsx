"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CandidateApplyPage() {
  const searchParams = useSearchParams();

  const externalJobId = searchParams.get("job") || "";
  const jobTitle = searchParams.get("title") || "Stellenangebot";
  const companyName = searchParams.get("company") || "";
  const jobLocation = searchParams.get("location") || "";
  const jobUrl = searchParams.get("url") || "";
  const jobSource = searchParams.get("source") || "external";

  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [error, setError] = useState("");

  const defaultText = useMemo(() => {
    return `Guten Tag

Hiermit bewerbe ich mich für die Stelle "${jobTitle}"${companyName ? ` bei ${companyName}` : ""}.

Gerne möchte ich mehr über die Stelle erfahren und freue mich über eine Kontaktaufnahme.

Freundliche Grüsse`;
  }, [jobTitle, companyName]);

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/candidates/applications", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          externalJobId,
          jobTitle,
          companyName,
          jobLocation,
          jobUrl,
          jobSource,
          coverLetter: coverLetter || defaultText,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(
          result.error || "Bewerbung konnte nicht gespeichert werden.",
        );
      }

      setDuplicate(Boolean(result.duplicate));
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Bewerbung konnte nicht gespeichert werden.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#06101f] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1050px]">
        <div className="rounded-[30px] border border-white/[0.08] bg-[#091527] p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">
              Auftrago Bewerbung
            </span>

            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-300">
              Talent CRM
            </span>
          </div>

          <h1 className="mt-7 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Direkt über Auftrago bewerben.
          </h1>

          <p className="mt-4 max-w-[760px] text-base leading-7 text-slate-400">
            Deine Bewerbung wird automatisch in deinem Talent CRM gespeichert.
            So behältst du Stelle, Status und nächste Schritte jederzeit im
            Blick.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[28px] border border-white/[0.08] bg-[#091527] p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
              Stelle
            </p>

            <h2 className="mt-3 text-2xl font-black">{jobTitle}</h2>

            {companyName && (
              <p className="mt-3 text-sm font-bold text-slate-300">
                {companyName}
              </p>
            )}

            {jobLocation && (
              <p className="mt-2 text-sm text-slate-500">{jobLocation}</p>
            )}

            <div className="mt-7 border-t border-white/[0.07] pt-6">
              <p className="text-xs font-bold text-slate-500">
                Bewerbungsstatus
              </p>

              <div className="mt-3 inline-flex rounded-full bg-amber-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-amber-300">
                Noch nicht gesendet
              </div>
            </div>

            <Link
              href="/arbeit-suchen/stellen"
              className="mt-7 inline-flex text-sm font-black text-sky-300"
            >
              ← Zurück zu den Stellen
            </Link>
          </aside>

          <section className="rounded-[28px] border border-white/[0.08] bg-[#091527] p-7 sm:p-8">
            {success ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.08] text-3xl">
                  ✓
                </div>

                <h2 className="mt-6 text-3xl font-black">
                  {duplicate
                    ? "Bewerbung bereits gespeichert."
                    : "Bewerbung gespeichert."}
                </h2>

                <p className="mt-3 max-w-[520px] text-sm leading-6 text-slate-400">
                  Die Stelle befindet sich jetzt in deinem Talent CRM. Dort
                  kannst du den Bewerbungsstatus weiterverfolgen.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/arbeit-suchen/konto/bewerbungen"
                    className="inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white"
                  >
                    Talent CRM öffnen →
                  </Link>

                  <Link
                    href="/arbeit-suchen/stellen"
                    className="inline-flex min-h-[50px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 text-sm font-black text-white"
                  >
                    Weitere Stellen
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submitApplication}>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-300">
                  Anschreiben
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Bewerbung vorbereiten
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Passe dein Anschreiben an. Später erweitern wir diesen Bereich
                  noch um CV, Dokumente und Bewerbungsprofil.
                </p>

                <textarea
                  value={coverLetter}
                  onChange={(event) => setCoverLetter(event.target.value)}
                  placeholder={defaultText}
                  rows={13}
                  className="mt-7 w-full resize-none rounded-[22px] border border-white/[0.09] bg-[#06101f] p-5 text-sm leading-7 text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
                />

                {error && (
                  <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm font-bold text-red-300">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-[54px] flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Bewerbung wird gespeichert..."
                      : "Jetzt über Auftrago bewerben →"}
                  </button>

                  {jobUrl && (
                    <a
                      href={jobUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 text-sm font-black text-white"
                    >
                      Originalstelle ↗
                    </a>
                  )}
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
