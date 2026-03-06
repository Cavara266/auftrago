import { redirect } from "next/navigation";
import AppShell from "@/app/components/app-shell";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const unlocks = await prisma.unlock.findMany({
    where: { userId: user.id },
    include: { lead: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <AppShell active="dashboard" credits={user.credits}>
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-white/60">
          Überblick über Credits, Transaktionen und freigeschaltete Leads.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-sm font-semibold text-white">
            Letzte Transaktionen
          </div>

          <div className="mt-4 space-y-2">
            {transactions.length === 0 ? (
              <div className="text-sm text-white/50">
                Noch keine Transaktionen.
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium">{tx.type}</div>
                    <div className="text-xs text-white/45">
                      {new Date(tx.createdAt).toLocaleString("de-CH")}
                    </div>
                  </div>

                  <div className="text-sm font-semibold">
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="text-sm font-semibold text-white">
            Letzte Freischaltungen
          </div>

          <div className="mt-4 space-y-2">
            {unlocks.length === 0 ? (
              <div className="text-sm text-white/50">
                Noch keine Freischaltungen.
              </div>
            ) : (
              unlocks.map((u) => (
                <div
                  key={u.id}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                >
                  <div className="text-sm font-medium">{u.lead.title}</div>
                  <div className="text-xs text-white/45">
                    {u.lead.category} · {u.lead.city}
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