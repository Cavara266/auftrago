import { redirect } from "next/navigation";
import AppShell from "@/app/components/app-shell";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import UnlockButton from "./unlock-button";

export default async function LeadsPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unlocked = await prisma.unlock.findMany({
    where: { userId: user.id },
    select: { leadId: true },
  });

  const unlockedSet = new Set(unlocked.map((u) => u.leadId));

  return (
    <AppShell active="leads" credits={user.credits}>
      <div>
        <h1 className="text-3xl font-semibold">Leads</h1>
        <p className="mt-1 text-sm text-white/60">
          Kontakte freischalten und direkt übernehmen.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {leads.map((lead) => {
          const isUnlocked = unlockedSet.has(lead.id);

          return (
            <div
              key={lead.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-2xl font-semibold">{lead.title}</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                      {lead.category}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                      {lead.city}
                    </span>
                    <span
                      className={[
                        "rounded-full px-3 py-1 text-xs",
                        isUnlocked
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-amber-500/15 text-amber-200",
                      ].join(" ")}
                    >
                      {isUnlocked ? "Unlocked" : "Locked"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-white/70">{lead.description}</p>
                </div>

                <UnlockButton
                  leadId={lead.id}
                  priceCredits={lead.priceCredits}
                  isUnlocked={isUnlocked}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                {!isUnlocked ? (
                  <>
                    <div className="text-lg font-semibold">Kontakt gesperrt</div>
                    <div className="mt-1 text-sm text-white/60">
                      Freischalten kostet <b>{lead.priceCredits} Credits</b>.
                    </div>
                  </>
                ) : (
                  <div className="grid gap-3 md:grid-cols-3">
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
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}