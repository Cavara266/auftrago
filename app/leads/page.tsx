import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import ProviderPageTracker from "@/components/provider-page-tracker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LeadsPage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const [leads, purchases] = await Promise.all([
    prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.leadPurchase.findMany({
      where: {
        providerId: user.id,
      },
      select: {
        leadId: true,
      },
    }),
  ]);

  const purchasedLeadIds = new Set(
    purchases.map((purchase) => purchase.leadId)
  );

  return (
    <main className="min-h-screen bg-[#030816] text-white">
      <ProviderPageTracker
        event="LEADS_VIEWED"
        page="/leads"
        description="Anbieter hat die Leadliste geöffnet"
        metadata={{
          availableLeads: leads.length,
          purchasedLeads: purchases.length,
          credits: user.credits,
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-sky-200">
              Kundenanfragen
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Aktuelle Aufträge
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/60">
              Prüfe Kategorie, Region und Auftragsbeschreibung. Vollständige
              Kontaktdaten werden erst nach der Freischaltung sichtbar.
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-5 py-4">
            <div className="text-xs uppercase tracking-[0.14em] text-yellow-100/60">
              Dein Guthaben
            </div>

            <div className="mt-1 text-2xl font-bold text-yellow-200">
              🪙 {user.credits} Credits
            </div>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
            <div className="text-4xl">📭</div>

            <h2 className="mt-4 text-2xl font-semibold">
              Aktuell keine offenen Aufträge
            </h2>

            <p className="mt-3 text-white/50">
              Neue Kundenanfragen werden hier automatisch angezeigt.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {leads.map((lead) => {
              const purchased = purchasedLeadIds.has(lead.id);
              const category = lead.category.toLowerCase();

              const categoryIcon = category.includes("reinigung")
                ? "🧹"
                : category.includes("umzug")
                  ? "🏠"
                  : category.includes("garten")
                    ? "🌿"
                    : "🛠️";

              return (
                <article
                  key={lead.id}
                  className="flex min-h-[420px] flex-col justify-between rounded-[28px] border border-white/10 bg-[#0b1427] p-6 transition hover:-translate-y-1 hover:border-sky-300/20"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-2xl">
                        {categoryIcon}
                      </div>

                      <div
                        className={
                          purchased
                            ? "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200"
                            : "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/60"
                        }
                      >
                        {purchased ? "Freigeschaltet" : "Aktiv"}
                      </div>
                    </div>

                    <h2 className="mt-5 text-2xl font-semibold leading-tight">
                      {lead.title}
                    </h2>

                    <p className="mt-4 line-clamp-5 text-sm leading-7 text-white/55">
                      {lead.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/70">
                        📍 {lead.region}
                      </span>

                      <span className="rounded-full bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/70">
                        🏷️ {lead.category}
                      </span>
                    </div>

                    {!purchased ? (
                      <div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-6 text-white/45">
                        🔒 Adresse, Telefonnummer und E-Mail sind nach der
                        Freischaltung sichtbar.
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100">
                        ✅ Dieser Kundenkontakt wurde bereits von dir
                        freigeschaltet.
                      </div>
                    )}
                  </div>

                  <div className="mt-7 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-3xl font-bold text-yellow-300">
                        {lead.price}
                      </div>

                      <div className="text-xs font-bold uppercase tracking-[0.12em] text-yellow-100/60">
                        Credits
                      </div>
                    </div>

                    <Link
                      href={`/leads/${lead.id}`}
                      className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#7EC8FF] px-5 py-3 text-sm font-bold text-[#04101d] transition hover:bg-[#91d2ff]"
                    >
                      {purchased
                        ? "Details ansehen"
                        : "Auftrag ansehen →"}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}