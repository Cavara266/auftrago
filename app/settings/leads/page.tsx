import Link from "next/link";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  SERVICE_CATEGORIES,
  SWISS_REGIONS,
} from "@/lib/provider-preferences";

import { updateLeadPreferencesAction } from "./actions";

type SettingsPageProps = {
  searchParams?: {
    message?: string;
    error?: string;
  };
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Regionen & Kategorien",
  description:
    "Dienstleistungen, Einsatzgebiete und Lead-Benachrichtigungen verwalten.",
};

export default async function LeadSettingsPage({
  searchParams,
}: SettingsPageProps) {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      companyName: true,
      serviceCategories: true,
      serviceRegions: true,
      serviceCities: true,
      servicePostalCodes: true,
      receiveLeadEmails: true,
      receiveAllLeadEmails: true,
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const selectedCategories = new Set(
    provider.serviceCategories
  );

  const selectedRegions = new Set(
    provider.serviceRegions
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-12%] top-[-10%] h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute right-[-10%] top-[12%] h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-[-18%] left-[34%] h-[450px] w-[450px] rounded-full bg-cyan-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-bold text-white transition hover:bg-white/10"
          >
            ← Zurück zum Dashboard
          </Link>

          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-200">
            Anbieter-Einstellungen
          </div>
        </div>

        <section className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(14,29,55,0.98),rgba(5,12,29,0.96))] shadow-[0_35px_120px_rgba(0,0,0,0.38)]">
          <div className="border-b border-white/10 p-6 sm:p-8 lg:p-10">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-sky-200/70">
              Lead-Einstellungen
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Regionen und Kategorien auswählen
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-white/55">
              Bestimme, welche Kundenanfragen zu deinem
              Unternehmen passen. Deine Auswahl wird später
              für das Dashboard, die E-Mail-Benachrichtigungen
              und die Live-Glocke verwendet.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-sm text-white/50">
                Unternehmen
              </div>

              <div className="mt-1 text-lg font-bold">
                {provider.companyName}
              </div>
            </div>
          </div>

          {searchParams?.message === "saved" ? (
            <div className="mx-6 mt-6 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-5 py-4 text-sm font-bold text-emerald-100 sm:mx-8 lg:mx-10">
              ✅ Deine Regionen, Kategorien und
              Benachrichtigungen wurden gespeichert.
            </div>
          ) : null}

          <form
            action={updateLeadPreferencesAction}
            className="space-y-8 p-6 sm:p-8 lg:p-10"
          >
            <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.15em] text-sky-200/65">
                    Schritt 1
                  </div>

                  <h2 className="mt-2 text-2xl font-semibold">
                    Welche Dienstleistungen bietest du an?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Du kannst mehrere Kategorien auswählen.
                  </p>
                </div>

                <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-bold text-white/50">
                  Mehrfachauswahl möglich
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICE_CATEGORIES.map((category) => (
                  <label
                    key={category}
                    className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-sky-300/30 hover:bg-white/[0.06]"
                  >
                    <input
                      type="checkbox"
                      name="serviceCategories"
                      value={category}
                      defaultChecked={selectedCategories.has(
                        category
                      )}
                      className="h-5 w-5 shrink-0 accent-sky-400"
                    />

                    <span className="text-sm font-bold text-white/80 group-hover:text-white">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.15em] text-indigo-200/65">
                  Schritt 2
                </div>

                <h2 className="mt-2 text-2xl font-semibold">
                  In welchen Kantonen arbeitest du?
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Wähle alle Kantone aus, in denen du
                  Kundenanfragen erhalten möchtest.
                </p>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {SWISS_REGIONS.map((region) => (
                  <label
                    key={region}
                    className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-indigo-300/30 hover:bg-white/[0.06]"
                  >
                    <input
                      type="checkbox"
                      name="serviceRegions"
                      value={region}
                      defaultChecked={selectedRegions.has(
                        region
                      )}
                      className="h-5 w-5 shrink-0 accent-indigo-400"
                    />

                    <span className="text-sm font-bold text-white/80 group-hover:text-white">
                      {region}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.15em] text-emerald-200/65">
                  Schritt 3
                </div>

                <h2 className="mt-2 text-2xl font-semibold">
                  Gewünschte Ortschaften und Postleitzahlen
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Optional kannst du deine Einsatzgebiete
                  genauer eingrenzen. Trenne mehrere Angaben
                  mit Kommas oder schreibe jede Angabe auf
                  eine neue Zeile.
                </p>
              </div>

              <div className="mt-7 grid gap-5 lg:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-white/70">
                    Ortschaften
                  </span>

                  <textarea
                    name="serviceCities"
                    rows={7}
                    defaultValue={provider.serviceCities.join(
                      "\n"
                    )}
                    placeholder={
                      "Zürich\nDietikon\nSchlieren\nBaden"
                    }
                    className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-[#020817] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-sky-300/40 focus:ring-4 focus:ring-sky-400/10"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-white/70">
                    Postleitzahlen
                  </span>

                  <textarea
                    name="servicePostalCodes"
                    rows={7}
                    defaultValue={provider.servicePostalCodes.join(
                      "\n"
                    )}
                    placeholder={
                      "8000\n8953\n8952\n5400"
                    }
                    className="mt-3 w-full resize-y rounded-2xl border border-white/10 bg-[#020817] px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-indigo-300/40 focus:ring-4 focus:ring-indigo-400/10"
                  />

                  <p className="mt-2 text-xs text-white/35">
                    Es werden nur gültige vierstellige
                    Schweizer Postleitzahlen gespeichert.
                  </p>
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 sm:p-7">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.15em] text-yellow-200/65">
                  Schritt 4
                </div>

                <h2 className="mt-2 text-2xl font-semibold">
                  E-Mail-Benachrichtigungen
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  Lege fest, über welche neuen Leads du per
                  E-Mail informiert werden möchtest.
                </p>
              </div>

              <div className="mt-7 space-y-4">
                <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-black/15 p-5 transition hover:bg-white/[0.055]">
                  <input
                    type="checkbox"
                    name="receiveLeadEmails"
                    defaultChecked={
                      provider.receiveLeadEmails
                    }
                    className="mt-1 h-5 w-5 shrink-0 accent-emerald-400"
                  />

                  <span>
                    <span className="block text-base font-bold">
                      E-Mail-Benachrichtigungen aktivieren
                    </span>

                    <span className="mt-1 block text-sm leading-6 text-white/45">
                      Ich möchte über neue Kundenanfragen per
                      E-Mail informiert werden.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-yellow-400/15 bg-yellow-400/[0.045] p-5 transition hover:bg-yellow-400/[0.075]">
                  <input
                    type="checkbox"
                    name="receiveAllLeadEmails"
                    defaultChecked={
                      provider.receiveAllLeadEmails
                    }
                    className="mt-1 h-5 w-5 shrink-0 accent-yellow-400"
                  />

                  <span>
                    <span className="block text-base font-bold text-yellow-100">
                      E-Mails für alle Leads erhalten
                    </span>

                    <span className="mt-1 block text-sm leading-6 text-yellow-100/50">
                      Auch Anfragen ausserhalb meiner
                      ausgewählten Kategorien und Regionen
                      per E-Mail erhalten.
                    </span>
                  </span>
                </label>
              </div>
            </section>

            <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[#081326]/95 p-4 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-5">
              <p className="max-w-xl text-sm leading-6 text-white/45">
                Deine bestehenden Käufe, Credits und
                Kundendaten werden durch diese Einstellungen
                nicht verändert.
              </p>

              <button
                type="submit"
                className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-7 text-sm font-black text-white shadow-[0_18px_50px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5"
              >
                Einstellungen speichern
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}