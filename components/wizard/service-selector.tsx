"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  getFeaturedServices,
  getServicesByCategory,
  searchServices,
  serviceCategories,
  type ServiceDefinition,
} from "@/lib/services/index";

type ServiceSelectorProps = {
  value?: string;
  onSelect: (
    service: ServiceDefinition,
  ) => void;
};

export default function ServiceSelector({
  value,
  onSelect,
}: ServiceSelectorProps) {
  const [query, setQuery] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const searchResults = useMemo(
    () =>
      query.trim()
        ? searchServices(query).slice(0, 12)
        : [],
    [query],
  );

  const categoryServices = useMemo(
    () =>
      selectedCategory
        ? getServicesByCategory(
            selectedCategory,
          )
        : [],
    [selectedCategory],
  );

  const featuredServices =
    useMemo(
      () => getFeaturedServices(8),
      [],
    );

  function chooseService(
    service: ServiceDefinition,
  ) {
    onSelect(service);
  }

  return (
    <div className="service-selector">
      <div className="service-search">
        <span>⌕</span>

        <input
          value={query}
          placeholder="Welche Dienstleistung suchst du?"
          autoComplete="off"
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedCategory("");
          }}
        />

        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Suche löschen"
          >
            ×
          </button>
        ) : null}
      </div>

      {query.trim() ? (
        <section className="selector-section">
          <div className="selector-heading">
            <div>
              <span>Suchergebnisse</span>

              <strong>
                {searchResults.length} passende
                Dienstleistungen
              </strong>
            </div>
          </div>

          {searchResults.length ? (
            <div className="selector-services">
              {searchResults.map((service) => (
                <ServiceButton
                  key={service.slug}
                  service={service}
                  selected={
                    value === service.title
                  }
                  onClick={() =>
                    chooseService(service)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <span>🔍</span>

              <strong>
                Keine passende Dienstleistung
                gefunden
              </strong>

              <p>
                Versuche einen allgemeineren
                Begriff oder wähle eine Kategorie.
              </p>
            </div>
          )}
        </section>
      ) : selectedCategory ? (
        <section className="selector-section">
          <button
            type="button"
            className="selector-back"
            onClick={() =>
              setSelectedCategory("")
            }
          >
            ← Alle Kategorien
          </button>

          <div className="selector-heading">
            <div>
              <span>Kategorie</span>

              <strong>
                {selectedCategory}
              </strong>
            </div>

            <small>
              {categoryServices.length} Angebote
            </small>
          </div>

          <div className="selector-services">
            {categoryServices.map(
              (service) => (
                <ServiceButton
                  key={service.slug}
                  service={service}
                  selected={
                    value === service.title
                  }
                  onClick={() =>
                    chooseService(service)
                  }
                />
              ),
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="selector-section">
            <div className="selector-heading">
              <div>
                <span>Kategorien</span>

                <strong>
                  Wähle zuerst einen Bereich
                </strong>
              </div>

              <small>
                {serviceCategories.length} Kategorien
              </small>
            </div>

            <div className="category-grid">
              {serviceCategories.map(
                (category) => (
                  <button
                    key={category.slug}
                    type="button"
                    className="category-card"
                    onClick={() =>
                      setSelectedCategory(
                        category.name,
                      )
                    }
                  >
                    <span className="category-icon">
                      {category.icon}
                    </span>

                    <div>
                      <strong>
                        {category.name}
                      </strong>

                      <small>
                        {category.description}
                      </small>
                    </div>

                    <i>
                      {category.serviceCount}
                    </i>

                    <b>→</b>
                  </button>
                ),
              )}
            </div>
          </section>

          <section className="selector-section popular-section">
            <div className="selector-heading">
              <div>
                <span>Beliebt</span>

                <strong>
                  Häufig gesuchte Dienstleistungen
                </strong>
              </div>
            </div>

            <div className="selector-services">
              {featuredServices.map(
                (service) => (
                  <ServiceButton
                    key={service.slug}
                    service={service}
                    selected={
                      value === service.title
                    }
                    onClick={() =>
                      chooseService(service)
                    }
                  />
                ),
              )}
            </div>
          </section>
        </>
      )}

      <style jsx>{`
        .service-selector {
          margin-top: 27px;
        }

        .service-search {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          min-height: 65px;
          padding: 0 18px;
          border: 1px solid rgba(125, 211, 252, 0.24);
          border-radius: 19px;
          background:
            linear-gradient(
              145deg,
              rgba(56,189,248,.07),
              rgba(99,102,241,.045)
            );
          box-shadow:
            0 18px 48px rgba(0,0,0,.18),
            inset 0 1px 0 rgba(255,255,255,.04);
        }

        .service-search > span {
          color: #7dd3fc;
          font-size: 25px;
        }

        .service-search input {
          width: 100%;
          min-height: 61px;
          padding: 0;
          border: 0 !important;
          outline: 0;
          color: white;
          background: transparent !important;
          box-shadow: none !important;
          font-size: 14px;
          font-weight: 700;
        }

        .service-search input::placeholder {
          color: #738096;
        }

        .service-search button {
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 50%;
          color: #94a3b8;
          background: rgba(255,255,255,.06);
          cursor: pointer;
        }

        .selector-section {
          margin-top: 24px;
        }

        .selector-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 13px;
        }

        .selector-heading > div {
          display: grid;
          gap: 4px;
        }

        .selector-heading span {
          color: #7dd3fc;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .selector-heading strong {
          color: white;
          font-size: 14px;
        }

        .selector-heading small {
          color: #64748b;
          font-size: 8px;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .category-card {
          position: relative;
          display: grid;
          min-height: 115px;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 13px;
          overflow: hidden;
          padding: 16px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 18px;
          color: white;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.04),
              rgba(255,255,255,.014)
            );
          text-align: left;
          cursor: pointer;
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease;
        }

        .category-card:hover {
          transform: translateY(-3px);
          border-color: rgba(125,211,252,.26);
          background: rgba(56,189,248,.055);
        }

        .category-icon {
          display: grid;
          width: 46px;
          height: 46px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 14px;
          background: rgba(0,0,0,.18);
          font-size: 22px;
        }

        .category-card > div {
          display: grid;
          gap: 5px;
          padding-right: 20px;
        }

        .category-card strong {
          font-size: 11px;
        }

        .category-card small {
          color: #718096;
          font-size: 8px;
          line-height: 1.45;
        }

        .category-card i {
          position: absolute;
          top: 12px;
          right: 13px;
          color: #536177;
          font-size: 8px;
          font-style: normal;
          font-weight: 900;
        }

        .category-card b {
          position: absolute;
          right: 14px;
          bottom: 13px;
          color: #7dd3fc;
          font-size: 12px;
        }

        .selector-services {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
        }

        .popular-section {
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,.065);
        }

        .selector-back {
          margin-bottom: 14px;
          padding: 0;
          border: 0;
          color: #7dd3fc;
          background: transparent;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .empty-results {
          display: grid;
          min-height: 210px;
          place-content: center;
          padding: 30px;
          border: 1px solid rgba(255,255,255,.075);
          border-radius: 18px;
          background: rgba(255,255,255,.02);
          text-align: center;
        }

        .empty-results > span {
          font-size: 28px;
        }

        .empty-results strong {
          margin-top: 12px;
          font-size: 13px;
        }

        .empty-results p {
          max-width: 330px;
          margin: 8px auto 0;
          color: #718096;
          font-size: 9px;
          line-height: 1.55;
        }

        @media (max-width: 560px) {
          .category-grid,
          .selector-services {
            grid-template-columns: 1fr;
          }

          .category-card {
            min-height: 105px;
          }
        }
      `}</style>
    </div>
  );
}

type ServiceButtonProps = {
  service: ServiceDefinition;
  selected: boolean;
  onClick: () => void;
};

function ServiceButton({
  service,
  selected,
  onClick,
}: ServiceButtonProps) {
  return (
    <button
      type="button"
      className={[
        "service-result",
        selected
          ? "service-result-selected"
          : "",
      ].join(" ")}
      onClick={onClick}
    >
      <span>{service.icon}</span>

      <div>
        <strong>{service.title}</strong>
        <small>{service.short}</small>
      </div>

      <i>
        {selected ? "✓" : "→"}
      </i>

      <style jsx>{`
        .service-result {
          display: grid;
          min-height: 88px;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 11px;
          padding: 13px;
          border: 1px solid rgba(255,255,255,.075);
          border-radius: 16px;
          color: white;
          background: rgba(255,255,255,.025);
          text-align: left;
          cursor: pointer;
          transition:
            transform 170ms ease,
            border-color 170ms ease,
            background 170ms ease;
        }

        .service-result:hover {
          transform: translateY(-2px);
          border-color: rgba(125,211,252,.25);
          background: rgba(56,189,248,.05);
        }

        .service-result > span {
          display: grid;
          width: 40px;
          height: 40px;
          place-items: center;
          border-radius: 12px;
          background: rgba(0,0,0,.18);
          font-size: 19px;
        }

        .service-result > div {
          display: grid;
          gap: 4px;
        }

        .service-result strong {
          font-size: 10px;
        }

        .service-result small {
          color: #718096;
          font-size: 8px;
        }

        .service-result i {
          color: #7dd3fc;
          font-size: 11px;
          font-style: normal;
          font-weight: 900;
        }

        .service-result-selected {
          border-color: rgba(74,222,128,.32);
          background: rgba(34,197,94,.07);
        }
      `}</style>
    </button>
  );
}
