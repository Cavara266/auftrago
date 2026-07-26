import Link from "next/link";

type RelatedCity = {
  name: string;
  slug: string;
};

export default function RelatedCities({
  cities,
  serviceSlug,
}: {
  cities: RelatedCity[];
  serviceSlug?: string;
}) {
  if (cities.length === 0) return null;

  return (
    <section className="premium-section">
      <div className="container premium-provider-card">
        <span className="eyebrow">Regionale Suche</span>
        <h2>Weitere Städte in der Schweiz</h2>
        <p>
          Entdecke regionale Anbieter und kostenlose Offerten in weiteren
          Schweizer Städten.
        </p>

        <div className="seo-link-grid">
          {cities.map((city) => {
            const href = serviceSlug
              ? `/dienstleistung/${serviceSlug}/${city.slug}`
              : `/stadt/${city.slug}`;

            return (
              <Link key={city.slug} href={href}>
                {serviceSlug
                  ? `Anbieter in ${city.name}`
                  : `Dienstleister in ${city.name}`}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
