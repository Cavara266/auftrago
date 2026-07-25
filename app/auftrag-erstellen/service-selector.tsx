"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  searchServices,
  serviceCategories,
  type ServiceCategory,
  type ServiceItem,
} from "@/lib/service-categories";
import styles from "./auftrag-erstellen.module.css";

type SelectedService = {
  category: ServiceCategory;
  service: ServiceItem;
};

export default function ServiceSelector() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);

  const searchResults = useMemo(() => {
    if (searchTerm.trim().length < 2) {
      return [];
    }

    return searchServices(searchTerm).slice(0, 12);
  }, [searchTerm]);

  function handleCategoryClick(category: ServiceCategory) {
    setSelectedCategory(category);
    setSelectedService(null);
    setSearchTerm("");

    window.setTimeout(() => {
      document
        .getElementById("services")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function handleServiceClick(
    category: ServiceCategory,
    service: ServiceItem
  ) {
    setSelectedService({
      category,
      service,
    });

    window.setTimeout(() => {
      document
        .getElementById("selection")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 50);
  }

  function handleContinue() {
    if (!selectedService) {
      return;
    }

    router.push(
      `/auftrag-erstellen/${selectedService.service.slug}`
    );
  }

  return (
    <section className={styles.selector}>
      <div className={styles.searchSection}>
        <div className={styles.searchHeading}>
          <span>01</span>

          <div>
            <small>DIENSTLEISTUNG FINDEN</small>
            <h2>Wonach suchst du?</h2>
          </div>
        </div>

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Zum Beispiel Umzug, Webdesign, Fotograf, Reinigung ..."
            aria-label="Dienstleistung suchen"
          />

          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className={styles.clearSearch}
              aria-label="Suche löschen"
            >
              ×
            </button>
          ) : null}
        </div>

        {searchTerm.trim().length >= 2 ? (
          <div className={styles.searchResults}>
            <div className={styles.resultsHeader}>
              <span>
                {searchResults.length} passende Dienstleistungen
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className={styles.resultsGrid}>
                {searchResults.map(({ category, service }) => (
                  <button
                    key={`${category.slug}-${service.slug}`}
                    type="button"
                    className={styles.resultCard}
                    onClick={() =>
                      handleServiceClick(category, service)
                    }
                  >
                    <span className={styles.resultIcon}>
                      {service.icon}
                    </span>

                    <span className={styles.resultCopy}>
                      <strong>{service.name}</strong>
                      <small>{category.name}</small>
                    </span>

                    <b>→</b>
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.emptySearch}>
                <span>🔎</span>

                <div>
                  <strong>
                    Keine passende Dienstleistung gefunden
                  </strong>

                  <p>
                    Wähle „Individuelle Anfrage“ und beschreibe
                    deinen Auftrag frei.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const category =
                      serviceCategories.find(
                        (item) => item.slug === "sonstiges"
                      );

                    const service =
                      category?.services.find(
                        (item) =>
                          item.slug === "individuelle-anfrage"
                      );

                    if (category && service) {
                      handleServiceClick(category, service);
                    }
                  }}
                >
                  Individuelle Anfrage
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className={styles.categorySection}>
        <div className={styles.sectionHeading}>
          <div>
            <span>02</span>

            <div>
              <small>HAUPTKATEGORIE</small>
              <h2>Wähle einen Bereich</h2>
            </div>
          </div>

          <p>
            {serviceCategories.length} Kategorien mit über{" "}
            {serviceCategories.reduce(
              (total, category) =>
                total + category.services.length,
              0
            )}{" "}
            Dienstleistungen
          </p>
        </div>

        <div className={styles.categoryGrid}>
          {serviceCategories.map((category) => {
            const active =
              selectedCategory?.slug === category.slug;

            return (
              <button
                type="button"
                key={category.slug}
                onClick={() =>
                  handleCategoryClick(category)
                }
                className={`${styles.categoryCard} ${
                  active ? styles.categoryCardActive : ""
                }`}
              >
                <span className={styles.categoryIcon}>
                  {category.icon}
                </span>

                <span className={styles.categoryCopy}>
                  <strong>{category.name}</strong>
                  <small>{category.description}</small>
                </span>

                <span className={styles.serviceCount}>
                  {category.services.length}
                </span>

                <b>→</b>
              </button>
            );
          })}
        </div>
      </div>

      {selectedCategory ? (
        <div
          id="services"
          className={styles.servicesSection}
        >
          <div className={styles.sectionHeading}>
            <div>
              <span>03</span>

              <div>
                <small>DIENSTLEISTUNG</small>
                <h2>{selectedCategory.name}</h2>
              </div>
            </div>

            <button
              type="button"
              className={styles.changeCategory}
              onClick={() => {
                setSelectedCategory(null);
                setSelectedService(null);
              }}
            >
              Kategorie ändern
            </button>
          </div>

          <div className={styles.serviceGrid}>
            {selectedCategory.services.map((service) => {
              const active =
                selectedService?.service.slug === service.slug;

              return (
                <button
                  type="button"
                  key={service.slug}
                  onClick={() =>
                    handleServiceClick(
                      selectedCategory,
                      service
                    )
                  }
                  className={`${styles.serviceCard} ${
                    active ? styles.serviceCardActive : ""
                  }`}
                >
                  <span className={styles.serviceIcon}>
                    {service.icon}
                  </span>

                  <span className={styles.serviceCopy}>
                    <strong>{service.name}</strong>
                    <small>{service.description}</small>
                  </span>

                  <span className={styles.selectIndicator}>
                    {active ? "✓" : "→"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {selectedService ? (
        <div
          id="selection"
          className={styles.selectionBar}
        >
          <div className={styles.selectionIcon}>
            {selectedService.service.icon}
          </div>

          <div className={styles.selectionCopy}>
            <small>AUSGEWÄHLTE DIENSTLEISTUNG</small>
            <strong>{selectedService.service.name}</strong>
            <span>{selectedService.category.name}</span>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className={styles.continueButton}
          >
            Auftrag beschreiben
            <b>→</b>
          </button>
        </div>
      ) : null}
    </section>
  );
}