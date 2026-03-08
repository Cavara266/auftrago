import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import AppShell from "@/app/components/app-shell";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdmin();

  const [leadCount, userCount, unlockCount, transactionCount, latestLeads] =
    await Promise.all([
      prisma.lead.count(),
      prisma.user.count(),
      prisma.unlock.count(),
      prisma.transaction.count(),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          category: true,
          city: true,
          priceCredits: true,
          createdAt: true,
          contactName: true,
          contactEmail: true,
          contactPhone: true,
        },
      }),
    ]);

  return (
    <AppShell
      active="dashboard"
      credits={user.credits}
      title="Auftrago Admin"
      subtitle="Systemübersicht"
    >
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-white/60">
            Übersicht über Leads, Nutzer, Freischaltungen und Transaktionen.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/50">Leads gesamt</div>
            <div className="mt-2 text-3xl font-bold">{leadCount}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/50">Nutzer gesamt</div>
            <div className="mt-2 text-3xl font-bold">{userCount}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/50">Lead-Freischaltungen</div>
            <div className="mt-2 text-3xl font-bold">{unlockCount}</div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/50">Transaktionen</div>
            <div className="mt-2 text-3xl font-bold">{transactionCount}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Neueste Leads</h2>
              <p className="mt-1 text-sm text-white/60">
                Die letzten 10 Anfragen im System.
              </p>
            </div>

            <Link
              href="/leads"
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Zu den Leads
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {latestLeads.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/60">
                Noch keine Leads vorhanden.
              </div>
            ) : (
              latestLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="text-xl font-semibold">{lead.title}</div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                          {lead.category}
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                          {lead.city}
                        </span>
                        <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-200">
                          {lead.priceCredits} Credits
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-white/50">
                      {new Date(lead.createdAt).toLocaleString("de-CH")}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
                    <div>
                      <div className="text-xs text-white/45">Name</div>
                      <div className="mt-1 font-medium">{lead.contactName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/45">Telefon</div>
                      <div className="mt-1 font-medium">{lead.contactPhone}</div>
                    </div>
                    <div>
                      <div className="text-xs text-white/45">E-Mail</div>
                      <div className="mt-1 font-medium">{lead.contactEmail}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}