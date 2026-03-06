import Link from "next/link";
import UnlockButton from "@/app/leads/unlock-button";

type LeadCardProps = {
  lead: {
    id: string;
    title: string;
    category: string;
    city: string;
    description: string;
    priceCredits: number;
    isUnlocked: boolean;
  };
};

export default function LeadCard({ lead }: LeadCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">{lead.title}</h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
              {lead.category}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
              {lead.city}
            </span>
            {lead.isUnlocked ? (
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">
                Unlocked
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">
                Locked
              </span>
            )}
          </div>

          <p className="mt-4 text-white/70">{lead.description}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          <Link
            href={`/leads/${lead.id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Details ansehen
          </Link>

          {!lead.isUnlocked ? (
            <UnlockButton
              leadId={lead.id}
              priceCredits={lead.priceCredits}
              isUnlocked={lead.isUnlocked}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}