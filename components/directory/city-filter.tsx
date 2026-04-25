"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type City = {
  name: string;
  slug: string;
};

type Service = {
  name: string;
  slug: string;
};

type CityFilterProps = {
  cities: City[];
  services: Service[];
};

export default function CityFilter({ cities, services }: CityFilterProps) {
  const [search, setSearch] = useState("");

  const filteredCities = useMemo(() => {
    return cities.filter((city) =>
      city.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [cities, search]);

  return (
    <section className="directory-filter">
      <div className="container">
        <div className="directory-filter-head">
          <span className="eyebrow">Standorte</span>
          <h2>Finde Anbieter in deiner Region.</h2>
          <p>
            Wähle deinen Standort und starte direkt eine passende Anfrage für
            Reinigung, Hauswartung, Umzug oder weitere lokale Dienstleistungen.
          </p>
        </div>

        <input
          className="directory-search"
          type="text"
          placeholder="Stadt suchen..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="directory-city-grid">
          {filteredCities.map((city) => (
            <article className="directory-city-card" key={city.slug}>
              <h3>{city.name}</h3>

              <div className="directory-service-links">
                {services.map((service) => (
                  <Link
                    key={`${city.slug}-${service.slug}`}
                    href={`/${service.slug}/${city.slug}`}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}