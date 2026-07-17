import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import ProviderPageTracker from "@/components/provider-page-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const purchases = await prisma.leadPurchase.findMany({
    where: {
      providerId: user.id,
    },
    include: {
      lead: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#030816] text-white">
      <ProviderPageTracker
        event="DASHBOARD_VIEWED"
        page="/dashboard"
        description="Anbieter hat das Dashboard geöffnet"
        metadata={{
          credits: user.credits,
          unlockedLeads: purchases.length,
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-200">
              Anbieterbereich
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Willkommen, {user.companyName}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
              Hier findest du deinen Creditstand und alle von dir
              freigeschalteten Kundenanfragen.
            </p>
          </div>

          <Link
            href="/credits"
            className="inline-flex min-h-[52px] items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-3 font-bold text-[#171006]"
          >
            🪙 Credits aufladen
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-white/40">
              Aktueller Creditstand
            </div>

            <div className="mt-3 text-4xl font-bold text-yellow-300">
              {user.credits}
            </div>

            <div className="mt-1 text-sm text-white/50">
              verfügbare Credits
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-white/40">
              Freigeschaltete Aufträge
            </div>

            <div className="mt-3 text-4xl font-bold">
              {purchases.length}
            </div>

            <div className="mt-1 text-sm text-white/50">
              Kundenkontakte im Konto
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6">
            <div className="text-xs uppercase tracking-[0.16em] text-white/40">
              Neue Aufträge
            </div>

            <Link
              href="/leads"
              className="mt-4 inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#7EC8FF] px-5 py-3 font-bold text-[#04101d]"
            >
              Aufträge ansehen
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">
                Deine freigeschalteten Aufträge
              </h2>

              <p className="mt-2 text-sm text-white/50">
                Nur von dir gekaufte Kundenkontakte werden hier angezeigt.
              </p>
            </div>
          </div>

          {purchases.length === 0 ? (
            <div className="mt-6 rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] p-8 text-center sm:p-12">
              <div className="text-4xl">🔎</div>

              <h3 className="mt-4 text-2xl font-semibold">
                Noch keine Aufträge freigeschaltet
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
                Prüfe die aktuellen Kundenanfragen und schalte passende
                Aufträge mit deinen Credits frei.
              </p>

              <Link
                href="/leads"
                className="mt-6 inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-[#7EC8FF] px-6 py-3 font-bold text-[#04101d]"
              >
                Aktuelle Aufträge ansehen
              </Link>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {purchases.map((purchase) => (
                <article
                  key={purchase.id}
                  className="rounded-[28px] border border-white/10 bg-[#0b1427] p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                        Freigeschaltet
                      </div>

                      <h3 className="mt-2 text-2xl font-semibold">
                        {purchase.lead.title}
                      </h3>
                    </div>

                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
                      {purchase.price} Credits
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
                    <div>
                      <span className="text-white/40">
                        Kategorie:
                      </span>{" "}
                      {purchase.lead.category}
                    </div>

                    <div>
                      <span className="text-white/40">
                        Region:
                      </span>{" "}
                      {purchase.lead.region}
                    </div>

                    <div>
                      <span className="text-white/40">
                        Name:
                      </span>{" "}
                      {purchase.lead.name}
                    </div>

                    <div>
                      <span className="text-white/40">
                        Telefon:
                      </span>{" "}
                      {purchase.lead.phone}
                    </div>

                    <div className="sm:col-span-2">
                      <span className="text-white/40">
                        E-Mail:
                      </span>{" "}

                      <a
                        href={`mailto:${purchase.lead.email}`}
                        className="text-sky-300 hover:underline"
                      >
                        {purchase.lead.email}
                      </a>
                    </div>
                  </div>

                  <p className="mt-5 line-clamp-4 text-sm leading-7 text-white/55">
                    {purchase.lead.description}
                  </p>

                  <Link
                    href={`/leads/${purchase.lead.id}`}
                    className="mt-6 inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold transition hover:bg-white/10"
                  >
                    Auftragsdetails öffnen
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}