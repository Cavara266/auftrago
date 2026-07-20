import Link from "next/link";

type ProviderCardProps = {
  provider: {
    id: string;
    slug: string | null;
    companyName: string;
    logoUrl: string | null;
    description: string | null;
    postalCode: string | null;
    city: string | null;
    website: string | null;
    serviceCategories: string[];
    serviceRegions: string[];
    createdAt: Date;
    updatedAt: Date;
  };
};

function getInitials(companyName: string): string {
  const words = companyName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return "AP";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function ProviderCard({
  provider,
}: ProviderCardProps) {
  if (!provider.slug) {
    return null;
  }

  const initials = getInitials(provider.companyName);
  const profileUrl = `/anbieter/${provider.slug}`;

  const location = [
    provider.postalCode,
    provider.city,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#0a1325] transition duration-300 hover:-translate-y-1 hover:border-sky-300/25 hover:shadow-2xl hover:shadow-sky-950/20">
      <div className="h-24 bg-gradient-to-r from-sky-400/20 via-indigo-500/20 to-cyan-400/10" />

      <div className="flex flex-1 flex-col px-6 pb-7">
        <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-[24px] border-4 border-[#0a1325] bg-gradient-to-br from-sky-400 to-indigo-500">
          {provider.logoUrl ? (
            <img
              src={provider.logoUrl}
              alt={`Logo von ${provider.companyName}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-black">
              {initials}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold leading-tight">
              {provider.companyName}
            </h3>

            <p className="mt-2 text-sm text-white/40">
              📍 {location || "Standort nicht angegeben"}
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-bold text-emerald-200">
            ✓ Geprüft
          </span>
        </div>

        <p className="mt-5 line-clamp-3 min-h-[72px] text-sm leading-6 text-white/50">
          {provider.description ||
            "Dieser Anbieter hat noch keine ausführliche Firmenbeschreibung hinterlegt."}
        </p>

        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-white/30">
            Dienstleistungen
          </p>

          {provider.serviceCategories.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {provider.serviceCategories
                .slice(0, 4)
                .map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-white/65"
                  >
                    {service}
                  </span>
                ))}

              {provider.serviceCategories.length > 4 ? (
                <span className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-white/45">
                  +{provider.serviceCategories.length - 4}
                </span>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-white/30">
              Noch keine Leistungen angegeben
            </p>
          )}
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-white/30">
            Einsatzgebiete
          </p>

          {provider.serviceRegions.length > 0 ? (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-emerald-100/70">
              {provider.serviceRegions
                .slice(0, 4)
                .join(", ")}

              {provider.serviceRegions.length > 4
                ? ` und ${
                    provider.serviceRegions.length - 4
                  } weitere`
                : ""}
            </p>
          ) : (
            <p className="mt-2 text-sm text-white/30">
              Noch keine Regionen angegeben
            </p>
          )}
        </div>

        <div className="mt-auto pt-7">
          <Link
            href={profileUrl}
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-[#04101d] transition group-hover:bg-sky-100"
          >
            Profil ansehen →
          </Link>
        </div>
      </div>
    </article>
  );
}