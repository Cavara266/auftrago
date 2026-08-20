import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "missing":
      return "Bitte E-Mail und Passwort eingeben.";
    case "invalid":
      return "E-Mail oder Passwort ist falsch.";
    case "server":
      return "Beim Login ist ein Fehler aufgetreten. Bitte versuche es erneut.";
    default:
      return null;
  }
}

export default async function CandidateLoginPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="min-h-screen bg-[#07101f] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-[560px]">
        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a1427] p-6 sm:p-8">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 8% 0%, rgba(45,145,255,.14), transparent 30%), radial-gradient(circle at 94% 85%, rgba(180,61,255,.14), transparent 30%)",
            }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Auftrago Talent
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Kandidaten-Login
            </h1>

            <p className="mt-4 text-sm font-medium leading-7 text-slate-400 sm:text-base">
              Melde dich an, um dein Profil zu verwalten und freigeschaltete
              Stellenangebote anzusehen.
            </p>

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm font-bold text-red-300">
                {errorMessage}
              </div>
            )}

            <form
              action="/api/candidates/login"
              method="POST"
              className="mt-8 space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-white"
                >
                  E-Mail
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="deine@email.ch"
                  className="min-h-[52px] w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-white"
                >
                  Passwort
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="Passwort"
                  className="min-h-[52px] w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40"
                />
              </div>

              <button
                type="submit"
                className="min-h-[54px] w-full rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 px-6 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                Einloggen
              </button>
            </form>

            <div className="mt-6 border-t border-white/[0.07] pt-6 text-center">
              <p className="text-sm text-slate-400">Noch kein Profil?</p>

              <Link
                href="/arbeit-suchen"
                className="mt-3 inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-bold text-white transition hover:bg-white/[0.06]"
              >
                Kostenloses Profil erstellen
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
