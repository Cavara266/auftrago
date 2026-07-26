import Link from "next/link";

type RelatedService = {
  name: string;
  slug: string;
  description?: string;
};

export default function RelatedServices({
  services,
  citySlug,
}: {
  services: RelatedService[];
  citySlug?: string;
}) {
  if (services.length === 0) return null;

  return (
    <section className="premium-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Weitere Leistungen</span>
          <h2>Ähnliche Dienstleistungen entdecken</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const href = citySlug
              ? `/dienstleistung/${service.slug}/${citySlug}`
              : `/leistungen/${service.slug}`;

            return (
              <Link
                key={service.slug}
                href={href}
                className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-sky-300/20 hover:bg-white/[0.055]"
              >
                <h3 className="text-lg font-black text-white">
                  {service.name}
                </h3>

                {service.description ? (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {service.description}
                  </p>
                ) : null}

                <strong className="mt-5 inline-flex text-sm text-sky-300">
                  Mehr erfahren →
                </strong>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
