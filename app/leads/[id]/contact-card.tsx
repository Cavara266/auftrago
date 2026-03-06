// app/leads/[id]/contact-card.tsx
export default function ContactCard({
  isUnlocked,
  priceCredits,
  contactName,
  contactPhone,
  contactEmail,
}: {
  isUnlocked: boolean;
  priceCredits: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Kontakt</div>
        <div className="rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5 text-xs">
          {priceCredits} Credits
        </div>
      </div>

      {!isUnlocked ? (
        <div className="mt-3 space-y-2 text-sm text-white/70">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            Name: <span className="text-white/40">••••••</span>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            Telefon: <span className="text-white/40">••••••</span>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            E-Mail: <span className="text-white/40">••••••</span>
          </div>

          <div className="mt-3 text-xs text-white/45">
            Freischalten zieht Credits ab und speichert den Unlock.
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2 text-sm">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            Name: <span className="text-white/85">{contactName}</span>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            Telefon: <span className="text-white/85">{contactPhone}</span>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
            E-Mail: <span className="text-white/85">{contactEmail}</span>
          </div>
        </div>
      )}
    </div>
  );
}