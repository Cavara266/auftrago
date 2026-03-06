import { notFound, redirect } from "next/navigation";
import AppShell from "@/app/components/app-shell";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function LeadDetailPage({ params }: PageProps) {
  const user = await requireUser();
  if (!user) redirect("/login");

  const leadId = String(params.id);

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: {
      id: true,
      title: true,
      category: true,
      city: true,
      description: true,
      contactName: true,
      contactPhone: true,
      contactEmail: true,
      priceCredits: true,
    },
  });

  if (!lead) {
    notFound();
  }

  const unlock = await prisma.unlock.findUnique({
    where: {
      userId_leadId: {
        userId: user.id,
        leadId: lead.id,
      },
    },
    select: {
      id: true,
    },
  });

  const isUnlocked = Boolean(unlock);

  return (
    <AppShell active="leads" credits={user.credits}>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">{lead.title}</h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                  {lead.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                  {lead.city}
                </span>
                {isUnlocked ? (
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">
                    Unlocked
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">
                    Locked
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
              <div className="text-xs uppercase tracking-wide text-white/50">
                Credits
              </div>
              <div className="mt-1 text-2xl font-semibold text-white">
                {user.credits}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold text-white">Beschreibung</div>
            <p className="mt-3 text-white/75">{lead.description}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            {isUnlocked ? (
              <>
                <div className="text-sm font-semibold text-white">
                  Kontakt freigeschaltet
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <div className="text-sm text-white/50">Name</div>
                    <div className="mt-1 text-lg font-medium text-white">
                      {lead.contactName}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-white/50">Telefon</div>
                    <div className="mt-1 text-lg font-medium text-white">
                      {lead.contactPhone}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-white/50">E-Mail</div>
                    <div className="mt-1 text-lg font-medium text-white">
                      {lead.contactEmail}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-white">
                  Kontakt gesperrt
                </div>
                <p className="mt-2 text-white/60">
                  Freischalten kostet {lead.priceCredits} Credits.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}