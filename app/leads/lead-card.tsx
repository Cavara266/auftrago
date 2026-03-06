import ContactCard from "./contact-card";
import UnlockButton from "./unlock-button";

type Lead = {
  id: string;
  title: string;
  category: string;
  city: string;
  description: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  priceCredits: number;
  createdAt: Date;
  isUnlocked: boolean;
};

export default function LeadCard({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-white">{lead.title}</h3>

            <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/70 ring-1 ring-white/10">
              {lead.category}
            </span>

            <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/70 ring-1 ring-white/10">
              {lead.city}
            </span>

            {lead.isUnlocked ? (
              <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs text-emerald-200 ring-1 ring-emerald-500/25">
                Unlocked
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/15 px-2 py-1 text-xs text-amber-200 ring-1 ring-amber-500/25">
                Locked
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-white/70">{lead.description}</p>
        </div>

        {!lead.isUnlocked ? (
          <UnlockButton leadId={lead.id} priceCredits={lead.priceCredits} />
        ) : null}
      </div>

      <div className="mt-4">
        {lead.isUnlocked ? (
          <ContactCard
            name={lead.contactName}
            phone={lead.contactPhone}
            email={lead.contactEmail}
          />
        ) : (
          <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
            <div className="text-sm font-semibold text-white">Kontakt gesperrt</div>
            <div className="mt-1 text-sm text-white/60">
              Freischalten kostet <span className="font-semibold text-white">{lead.priceCredits}</span> Credits.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}