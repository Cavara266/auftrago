// app/leads/[id]/page.tsx
import AppShell from "@/app/components/app-shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ContactCard from "./contact-card";
import UnlockButton from "./unlock-button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const sessionUser = await requireUser();

  const leadId = Number(params.id);
  if (!Number.isFinite(leadId)) {
    return (
      <AppShell active="leads">
        <div className="card p-6">Ungültige Lead-ID.</div>
      </AppShell>
    );
  }

  // User frisch laden (credits aktuell)
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, credits: true, email: true },
  });

  if (!user) {
    return (
      <AppShell active="leads">
        <div className="card p-6">User nicht gefunden.</div>
      </AppShell>
    );
  }

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
      createdAt: true,
    },
  });

  if (!lead) {
    return (
      <AppShell active="leads">
        <div className="card p-6">Lead nicht gefunden.</div>
      </AppShell>
    );
  }

  const unlocked = await prisma.leadUnlock.findUnique({
    where: {
      userId_leadId: {
        userId: user.id,
        leadId: lead.id,
      },
    },
    select: { id: true },
  });

  const isUnlocked = !!unlocked;
  const disabled = user.credits < lead.priceCredits;

  return (
    <AppShell active="leads">
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{lead.title}</h1>

            <div className="mt-1 text-sm text-white/60">
              {lead.category} • {lead.city}
            </div>

            <div className="mt-2 text-xs text-white/40">
              {new Date(lead.createdAt).toLocaleString("de-CH")}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm">
            Credits:
            <span className="ml-2 rounded-lg bg-white/10 px-2 py-0.5 font-semibold">
              {user.credits}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Beschreibung</div>
            <p className="mt-2 text-sm text-white/75">{lead.description}</p>
          </div>

          <div className="space-y-4">
            {!isUnlocked && (
              <UnlockButton
                leadId={lead.id}
                priceCredits={lead.priceCredits}
                disabled={disabled}
              />
            )}

            <ContactCard
              isUnlocked={isUnlocked}
              priceCredits={lead.priceCredits}
              contactName={lead.contactName}
              contactPhone={lead.contactPhone}
              contactEmail={lead.contactEmail}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}