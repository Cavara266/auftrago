import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireCandidate } from "@/lib/candidate-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = {
  cancelled?: string;
  error?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

const ACTIVE_STATUSES = new Set(["ACTIVE", "TRIALING"]);

export default async function TalentAboPage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams ?? {});

  let user;

  try {
    user = await requireCandidate();
  } catch {
    redirect("/arbeit-suchen/login");
  }

  const account = await prisma.candidateAccount.findUnique({
    where: {
      id: user.id,
    },
    select: {
      subscriptionExempt: true,
      subscriptionStatus: true,
      subscriptionCurrentPeriodEnd: true,
    },
  });

  if (!account) {
    redirect("/arbeit-suchen/login");
  }

  const subscriptionStatus = account.subscriptionStatus || "INACTIVE";

  const hasActiveSubscription =
    account.subscriptionExempt ||
    ACTIVE_STATUSES.has(subscriptionStatus.toUpperCase());

  return (
    <main className="min-h-screen bg-[#07101f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-sky-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AuftragO Talent
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Alle Stellen.
              <br />
              Ein Preis.
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-400 sm:text-base">
              Mit AuftragO Talent erhältst du jederzeit Zugang zu allen
              verfügbaren Stellenangeboten.
            </p>
          </div>

          <Link
            href="/arbeit-suchen/konto"
            className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            Zurück zum Konto
          </Link>
        </div>

        {params.cancelled === "1" && (
          <div className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm font-bold text-amber-200">
            Der Zahlungsvorgang wurde abgebrochen. Es wurde nichts berechnet.
          </div>
        )}

        {params.error === "checkout" && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm font-bold text-red-300">
            Stripe Checkout konnte nicht gestartet werden. Bitte versuche es
            erneut.
          </div>
        )}

        <section className="overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a1427]">
          <div className="grid lg:grid-cols-[1fr_390px]">
            <div className="p-6 sm:p-8 lg:p-10">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                Talent Mitgliedschaft
              </span>

              <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                Alle Jobs mit Talent-Abo öffnen
              </h2>

              <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-slate-400">
                Keine Zusatzkosten für einzelne Stellen. Solange dein Abo aktiv
                ist, kannst du Stellen jederzeit öffnen.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Zugang zu allen Stellen",
                  "Unbegrenzte Freischaltungen",
                  "Jederzeit Stellen öffnen",
                  "Keine Zusatzkosten pro Stelle",
                  "Monatlich kündbar",
                  "Sichere Zahlung über Stripe",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex min-h-[56px] items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm font-semibold text-slate-200"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-black text-emerald-300">
                      ✓
                    </span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t border-white/[0.08] bg-gradient-to-br from-sky-400/[0.08] via-blue-500/[0.06] to-violet-500/[0.12] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <div className="text-sm font-bold text-slate-400">
                AuftragO Talent
              </div>

              <div className="mt-4 flex items-end gap-2">
                <strong className="text-5xl font-black tracking-tight">
                  CHF 99.–
                </strong>
              </div>

              <div className="mt-2 text-sm font-semibold text-slate-400">
                pro Monat
              </div>

              <div className="my-7 h-px bg-white/[0.08]" />

              {hasActiveSubscription ? (
                <>
                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] p-4">
                    <div className="font-black text-emerald-300">
                      ✓ Dein Abo ist aktiv
                    </div>

                    {account.subscriptionCurrentPeriodEnd && (
                      <div className="mt-2 text-xs font-semibold text-slate-400">
                        Aktuelle Periode bis{" "}
                        {new Intl.DateTimeFormat("de-CH", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(account.subscriptionCurrentPeriodEnd)}
                      </div>
                    )}
                  </div>

                  <Link
                    href="/arbeit-suchen/stellen"
                    className="mt-5 flex min-h-[54px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
                  >
                    Stellen entdecken
                  </Link>
                </>
              ) : (
                <form
                  action="/api/candidates/subscription/checkout"
                  method="POST"
                >
                  <button
                    type="submit"
                    className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
                  >
                    Jetzt für CHF 99.– starten
                  </button>
                </form>
              )}

              <p className="mt-4 text-center text-xs font-semibold leading-5 text-slate-500">
                Monatliche Abrechnung. Jederzeit kündbar.
              </p>
            </aside>
          </div>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <span className="text-xs font-black text-sky-300">01</span>
            <h3 className="mt-3 font-black">Ein Abo</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              CHF 99.– monatlich für den kompletten Stellenzugang.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <span className="text-xs font-black text-sky-300">02</span>
            <h3 className="mt-3 font-black">Alle Stellen</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Alle Stellen sind während deines aktiven Abos enthalten.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <span className="text-xs font-black text-sky-300">03</span>
            <h3 className="mt-3 font-black">Flexibel</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Das Abo läuft monatlich und kann später über Stripe verwaltet
              werden.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
