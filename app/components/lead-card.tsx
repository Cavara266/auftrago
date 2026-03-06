import Link from "next/link";

export default function LeadCard({
  id,
  service,
  location,
  title,
  status,
  createdAt,
}: {
  id: number | string;
  service?: string | null;
  location?: string | null;
  title?: string | null;
  status?: string | null;
  createdAt?: string | null;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs text-white/55">
            {service ?? "Service"} • {location ?? "Ort"}
          </div>
          <div className="mt-1 text-lg font-semibold text-white/90 truncate">
            {title ?? "Auftrag"}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
            {status ?? "Neu"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-white/45">
          {createdAt ? `Erstellt: ${createdAt}` : `ID: ${id}`}
        </div>
        <Link className="btn" href={`/leads/${id}`}>
          Details ansehen →
        </Link>
      </div>
    </div>
  );
}