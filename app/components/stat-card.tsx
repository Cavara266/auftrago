// app/components/stat-card.tsx

type Props = {
  title: string;
  value: string;
  hint?: string;
  badge?: string;
  badgeTone?: "green" | "yellow" | "default";
};

export default function StatCard({
  title,
  value,
  hint,
  badge,
  badgeTone = "default",
}: Props) {
  const badgeClass =
    badgeTone === "green"
      ? "badge badge-green"
      : badgeTone === "yellow"
      ? "badge badge-yellow"
      : "badge";

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-white/60">{title}</div>
          <div className="mt-2 text-2xl font-bold tracking-tight">{value}</div>
          {hint ? <div className="mt-1 text-xs text-white/50">{hint}</div> : null}
        </div>

        {badge ? <span className={badgeClass}>{badge}</span> : null}
      </div>

      {/* mini bar */}
      <div className="mt-4 h-1.5 w-full rounded-full bg-white/10">
        <div className="h-1.5 w-[55%] rounded-full bg-indigo-500/70" />
      </div>
    </div>
  );
}