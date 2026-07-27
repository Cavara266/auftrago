"use client";

import {
  FormEvent,
  KeyboardEvent,
  useMemo,
  useState,
} from "react";

type MatchingService = {
  id: string;
  name: string;
  categorySlug: string;
  categoryName: string;
};

type MatchingCenterProps = {
  action: (formData: FormData) => void | Promise<void>;
  saved: boolean;
  cantons: string[];
  services: MatchingService[];
  initialServiceIds: string[];
  initialRegions: string[];
  initialCities: string[];
  initialPostalCodes: string[];
  initialReceiveLeadEmails: boolean;
  initialReceiveAllLeadEmails: boolean;
};

const quickRegionGroups: Record<string, string[]> = {
  Deutschschweiz: [
    "Aargau",
    "Appenzell Ausserrhoden",
    "Appenzell Innerrhoden",
    "Basel-Landschaft",
    "Basel-Stadt",
    "Bern",
    "Glarus",
    "Graubünden",
    "Luzern",
    "Nidwalden",
    "Obwalden",
    "Schaffhausen",
    "Schwyz",
    "Solothurn",
    "St. Gallen",
    "Thurgau",
    "Uri",
    "Zug",
    "Zürich",
  ],
  Westschweiz: [
    "Bern",
    "Freiburg",
    "Genf",
    "Jura",
    "Neuenburg",
    "Waadt",
    "Wallis",
  ],
  Zentralschweiz: [
    "Luzern",
    "Nidwalden",
    "Obwalden",
    "Schwyz",
    "Uri",
    "Zug",
  ],
};

function uniqueValues(values: string[]) {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

export default function MatchingCenter({
  action,
  saved,
  cantons,
  services,
  initialServiceIds,
  initialRegions,
  initialCities,
  initialPostalCodes,
  initialReceiveLeadEmails,
  initialReceiveAllLeadEmails,
}: MatchingCenterProps) {
  const [selectedServices, setSelectedServices] = useState(
    new Set(initialServiceIds)
  );

  const [selectedRegions, setSelectedRegions] = useState(
    new Set(initialRegions)
  );

  const [cities, setCities] = useState(
    uniqueValues(initialCities)
  );

  const [postalCodes, setPostalCodes] = useState(
    uniqueValues(initialPostalCodes)
  );

  const [cityInput, setCityInput] = useState("");
  const [postalCodeInput, setPostalCodeInput] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [regionSearch, setRegionSearch] = useState("");

  const [receiveLeadEmails, setReceiveLeadEmails] =
    useState(initialReceiveLeadEmails);

  const [
    receiveAllLeadEmails,
    setReceiveAllLeadEmails,
  ] = useState(initialReceiveAllLeadEmails);

  const [openCategories, setOpenCategories] = useState<
    Set<string>
  >(
    new Set(
      services.map((service) => service.categorySlug)
    )
  );

  const groupedServices = useMemo(() => {
    const groups = new Map<
      string,
      {
        categoryName: string;
        services: MatchingService[];
      }
    >();

    const search = serviceSearch
      .trim()
      .toLocaleLowerCase("de-CH");

    services.forEach((service) => {
      if (
        search &&
        !service.name
          .toLocaleLowerCase("de-CH")
          .includes(search) &&
        !service.categoryName
          .toLocaleLowerCase("de-CH")
          .includes(search)
      ) {
        return;
      }

      const current = groups.get(service.categorySlug);

      if (current) {
        current.services.push(service);
      } else {
        groups.set(service.categorySlug, {
          categoryName: service.categoryName,
          services: [service],
        });
      }
    });

    return Array.from(groups.entries());
  }, [services, serviceSearch]);

  const filteredCantons = useMemo(() => {
    const search = regionSearch
      .trim()
      .toLocaleLowerCase("de-CH");

    if (!search) {
      return cantons;
    }

    return cantons.filter((canton) =>
      canton.toLocaleLowerCase("de-CH").includes(search)
    );
  }, [cantons, regionSearch]);

  const selectedServiceList = useMemo(
    () =>
      services.filter((service) =>
        selectedServices.has(service.id)
      ),
    [services, selectedServices]
  );

  const matchingScore = useMemo(() => {
    let score = 0;

    if (selectedServices.size > 0) {
      score += 35;
    }

    if (selectedServices.size >= 3) {
      score += 10;
    }

    if (selectedRegions.size > 0) {
      score += 30;
    }

    if (selectedRegions.size >= 3) {
      score += 10;
    }

    if (cities.length > 0) {
      score += 8;
    }

    if (postalCodes.length > 0) {
      score += 7;
    }

    return Math.min(score, 100);
  }, [
    selectedServices,
    selectedRegions,
    cities,
    postalCodes,
  ]);

  const estimatedLeadRange = useMemo(() => {
    if (
      selectedServices.size === 0 ||
      selectedRegions.size === 0
    ) {
      return "0";
    }

    const estimate =
      selectedServices.size *
        Math.max(selectedRegions.size, 1) *
        0.85 +
      cities.length * 0.8 +
      postalCodes.length * 0.35;

    return `≈ ${Math.max(4, Math.round(estimate))}`;
  }, [
    selectedServices,
    selectedRegions,
    cities,
    postalCodes,
  ]);

  function toggleService(serviceId: string) {
    setSelectedServices((current) => {
      const next = new Set(current);

      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }

      return next;
    });
  }

  function selectVisibleServices() {
    setSelectedServices((current) => {
      const next = new Set(current);

      groupedServices.forEach(([, group]) => {
        group.services.forEach((service) => {
          next.add(service.id);
        });
      });

      return next;
    });
  }

  function removeAllServices() {
    setSelectedServices(new Set());
  }

  function toggleRegion(canton: string) {
    setSelectedRegions((current) => {
      const next = new Set(current);

      if (next.has(canton)) {
        next.delete(canton);
      } else {
        next.add(canton);
      }

      return next;
    });
  }

  function applyRegionGroup(regions: string[]) {
    setSelectedRegions((current) => {
      const allSelected = regions.every((region) =>
        current.has(region)
      );

      const next = new Set(current);

      regions.forEach((region) => {
        if (allSelected) {
          next.delete(region);
        } else {
          next.add(region);
        }
      });

      return next;
    });
  }

  function toggleCategory(categorySlug: string) {
    setOpenCategories((current) => {
      const next = new Set(current);

      if (next.has(categorySlug)) {
        next.delete(categorySlug);
      } else {
        next.add(categorySlug);
      }

      return next;
    });
  }

  function addCity() {
    const value = cityInput.trim();

    if (!value) {
      return;
    }

    setCities((current) =>
      uniqueValues([...current, value])
    );

    setCityInput("");
  }

  function addPostalCode() {
    const value = postalCodeInput
      .replace(/[^\d]/g, "")
      .slice(0, 4);

    if (!value) {
      return;
    }

    setPostalCodes((current) =>
      uniqueValues([...current, value])
    );

    setPostalCodeInput("");
  }

  function handleTagKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    type: "city" | "postalCode"
  ) {
    if (event.key !== "Enter" && event.key !== ",") {
      return;
    }

    event.preventDefault();

    if (type === "city") {
      addCity();
    } else {
      addPostalCode();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (cityInput.trim()) {
      event.preventDefault();

      const nextCities = uniqueValues([
        ...cities,
        cityInput.trim(),
      ]);

      setCities(nextCities);
      setCityInput("");

      const form = event.currentTarget;

      requestAnimationFrame(() => {
        form.requestSubmit();
      });

      return;
    }

    if (postalCodeInput.trim()) {
      event.preventDefault();

      const normalized = postalCodeInput
        .replace(/[^\d]/g, "")
        .slice(0, 4);

      const nextPostalCodes = normalized
        ? uniqueValues([...postalCodes, normalized])
        : postalCodes;

      setPostalCodes(nextPostalCodes);
      setPostalCodeInput("");

      const form = event.currentTarget;

      requestAnimationFrame(() => {
        form.requestSubmit();
      });
    }
  }

  return (
    <main className="matching-center">
      <div className="matching-center__ambient matching-center__ambient--one" />
      <div className="matching-center__ambient matching-center__ambient--two" />

      <div className="matching-center__container">
        <section className="matching-center__hero">
          <div>
            <span className="matching-center__eyebrow">
              SMART MATCHING
            </span>

            <h1>
              Deine Aufträge.
              <em>Perfekt auf dich abgestimmt.</em>
            </h1>

            <p>
              Lege fest, welche Dienstleistungen und Regionen
              wirklich zu deinem Unternehmen passen. Auftrago
              priorisiert danach die relevantesten Kundenanfragen.
            </p>
          </div>

          <div className="matching-center__hero-score">
            <div
              className="matching-center__score-ring"
              style={{
                background: `conic-gradient(
                  #48caff 0%,
                  #6e76ff ${matchingScore}%,
                  rgba(255,255,255,.075) ${matchingScore}%,
                  rgba(255,255,255,.075) 100%
                )`,
              }}
            >
              <div>
                <strong>{matchingScore}%</strong>
                <span>Matching Score</span>
              </div>
            </div>

            <div className="matching-center__active-status">
              <span />
              Matching aktiv
            </div>
          </div>
        </section>

        {saved ? (
          <div className="matching-center__notice">
            <span>✓</span>

            <div>
              <strong>
                Einstellungen erfolgreich gespeichert
              </strong>

              <p>
                Neue Leads werden ab sofort anhand deiner
                aktuellen Auswahl zugeordnet.
              </p>
            </div>
          </div>
        ) : null}

        <section className="matching-center__metrics">
          <article>
            <span>DIENSTLEISTUNGEN</span>
            <strong>{selectedServices.size}</strong>
            <p>aktiv ausgewählt</p>
          </article>

          <article>
            <span>REGIONEN</span>
            <strong>{selectedRegions.size}</strong>
            <p>aktive Kantone</p>
          </article>

          <article>
            <span>STÄDTE & PLZ</span>
            <strong>
              {cities.length + postalCodes.length}
            </strong>
            <p>präzise Einsatzgebiete</p>
          </article>

          <article>
            <span>LEAD-POTENZIAL</span>
            <strong>{estimatedLeadRange}</strong>
            <p>mögliche Matches</p>
          </article>
        </section>

        <form
          action={action}
          onSubmit={handleSubmit}
          className="matching-center__workspace"
        >
          <div className="matching-center__main">
            <section className="matching-center__panel">
              <header className="matching-center__panel-head">
                <div>
                  <span className="matching-center__step">
                    SCHRITT 01
                  </span>

                  <h2>Dienstleistungen</h2>

                  <p>
                    Aktiviere alle Leistungen, für die du
                    Kundenanfragen erhalten möchtest.
                  </p>
                </div>

                <div className="matching-center__selection-count">
                  <strong>{selectedServices.size}</strong>
                  <span>ausgewählt</span>
                </div>
              </header>

              <div className="matching-center__toolbar">
                <label className="matching-center__search">
                  <span>⌕</span>

                  <input
                    value={serviceSearch}
                    onChange={(event) =>
                      setServiceSearch(event.target.value)
                    }
                    placeholder="Dienstleistung oder Kategorie suchen..."
                  />
                </label>

                <button
                  type="button"
                  onClick={selectVisibleServices}
                >
                  Sichtbare auswählen
                </button>

                <button
                  type="button"
                  onClick={removeAllServices}
                >
                  Auswahl leeren
                </button>
              </div>

              {selectedServiceList.length > 0 ? (
                <div className="matching-center__selected-services">
                  {selectedServiceList.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() =>
                        toggleService(service.id)
                      }
                    >
                      <span>✓</span>
                      {service.name}
                      <b>×</b>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="matching-center__empty-selection">
                  Noch keine Dienstleistung ausgewählt.
                </div>
              )}

              <div className="matching-center__categories">
                {groupedServices.map(
                  ([categorySlug, group]) => {
                    const isOpen =
                      openCategories.has(categorySlug);

                    const selectedInCategory =
                      group.services.filter((service) =>
                        selectedServices.has(service.id)
                      ).length;

                    return (
                      <article
                        key={categorySlug}
                        className="matching-center__category"
                      >
                        <button
                          type="button"
                          className="matching-center__category-head"
                          onClick={() =>
                            toggleCategory(categorySlug)
                          }
                        >
                          <span>
                            <strong>
                              {group.categoryName}
                            </strong>

                            <small>
                              {group.services.length} Leistungen
                              · {selectedInCategory} aktiv
                            </small>
                          </span>

                          <b>{isOpen ? "−" : "+"}</b>
                        </button>

                        {isOpen ? (
                          <div className="matching-center__service-grid">
                            {group.services.map((service) => {
                              const selected =
                                selectedServices.has(
                                  service.id
                                );

                              return (
                                <label
                                  key={service.id}
                                  className={
                                    selected
                                      ? "matching-center__service matching-center__service--selected"
                                      : "matching-center__service"
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    name="serviceIds"
                                    value={service.id}
                                    checked={selected}
                                    onChange={() =>
                                      toggleService(service.id)
                                    }
                                  />

                                  <span className="matching-center__checkbox">
                                    {selected ? "✓" : ""}
                                  </span>

                                  <span>
                                    <strong>
                                      {service.name}
                                    </strong>

                                    <small>
                                      {group.categoryName}
                                    </small>
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        ) : null}
                      </article>
                    );
                  }
                )}
              </div>
            </section>

            <section className="matching-center__panel">
              <header className="matching-center__panel-head">
                <div>
                  <span className="matching-center__step">
                    SCHRITT 02
                  </span>

                  <h2>Einsatzgebiete</h2>

                  <p>
                    Wähle Kantone und ergänze bei Bedarf
                    einzelne Städte oder Postleitzahlen.
                  </p>
                </div>

                <div className="matching-center__selection-count">
                  <strong>{selectedRegions.size}</strong>
                  <span>Regionen</span>
                </div>
              </header>

              <div className="matching-center__region-actions">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedRegions(new Set(cantons))
                  }
                >
                  Ganze Schweiz
                </button>

                {Object.entries(quickRegionGroups).map(
                  ([label, regions]) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        applyRegionGroup(regions)
                      }
                    >
                      {label}
                    </button>
                  )
                )}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedRegions(new Set())
                  }
                >
                  Alle entfernen
                </button>
              </div>

              <label className="matching-center__search matching-center__search--region">
                <span>⌕</span>

                <input
                  value={regionSearch}
                  onChange={(event) =>
                    setRegionSearch(event.target.value)
                  }
                  placeholder="Kanton suchen..."
                />
              </label>

              <div className="matching-center__region-grid">
                {filteredCantons.map((canton) => {
                  const selected =
                    selectedRegions.has(canton);

                  return (
                    <label
                      key={canton}
                      className={
                        selected
                          ? "matching-center__region matching-center__region--selected"
                          : "matching-center__region"
                      }
                    >
                      <input
                        type="checkbox"
                        name="regions"
                        value={canton}
                        checked={selected}
                        onChange={() =>
                          toggleRegion(canton)
                        }
                      />

                      <span>
                        {selected ? "✓" : ""}
                      </span>

                      <strong>{canton}</strong>
                    </label>
                  );
                })}
              </div>

              <div className="matching-center__location-grid">
                <div className="matching-center__tag-field">
                  <div className="matching-center__tag-head">
                    <span>STÄDTE</span>
                    <small>{cities.length} eingetragen</small>
                  </div>

                  <div className="matching-center__tag-input">
                    <input
                      value={cityInput}
                      onChange={(event) =>
                        setCityInput(event.target.value)
                      }
                      onKeyDown={(event) =>
                        handleTagKeyDown(event, "city")
                      }
                      placeholder="z. B. Zürich"
                    />

                    <button
                      type="button"
                      onClick={addCity}
                    >
                      Hinzufügen
                    </button>
                  </div>

                  <div className="matching-center__tags">
                    {cities.map((city) => (
                      <span key={city}>
                        {city}

                        <button
                          type="button"
                          onClick={() =>
                            setCities((current) =>
                              current.filter(
                                (entry) => entry !== city
                              )
                            )
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <input
                    type="hidden"
                    name="cities"
                    value={cities.join(", ")}
                  />
                </div>

                <div className="matching-center__tag-field">
                  <div className="matching-center__tag-head">
                    <span>POSTLEITZAHLEN</span>
                    <small>
                      {postalCodes.length} eingetragen
                    </small>
                  </div>

                  <div className="matching-center__tag-input">
                    <input
                      value={postalCodeInput}
                      inputMode="numeric"
                      onChange={(event) =>
                        setPostalCodeInput(
                          event.target.value
                            .replace(/[^\d]/g, "")
                            .slice(0, 4)
                        )
                      }
                      onKeyDown={(event) =>
                        handleTagKeyDown(
                          event,
                          "postalCode"
                        )
                      }
                      placeholder="z. B. 8000"
                    />

                    <button
                      type="button"
                      onClick={addPostalCode}
                    >
                      Hinzufügen
                    </button>
                  </div>

                  <div className="matching-center__tags">
                    {postalCodes.map((postalCode) => (
                      <span key={postalCode}>
                        {postalCode}

                        <button
                          type="button"
                          onClick={() =>
                            setPostalCodes((current) =>
                              current.filter(
                                (entry) =>
                                  entry !== postalCode
                              )
                            )
                          }
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <input
                    type="hidden"
                    name="postalCodes"
                    value={postalCodes.join(", ")}
                  />
                </div>
              </div>
            </section>

            <section className="matching-center__panel">
              <header className="matching-center__panel-head">
                <div>
                  <span className="matching-center__step">
                    SCHRITT 03
                  </span>

                  <h2>Benachrichtigungen</h2>

                  <p>
                    Bestimme, bei welchen neuen Leads du per
                    E-Mail informiert werden möchtest.
                  </p>
                </div>
              </header>

              <div className="matching-center__notification-grid">
                <label className="matching-center__notification">
                  <span className="matching-center__notification-icon">
                    ✉
                  </span>

                  <span>
                    <strong>
                      Passende Lead-E-Mails
                    </strong>

                    <small>
                      Benachrichtigung bei Anfragen, die deinen
                      Leistungen und Regionen entsprechen.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    name="receiveLeadEmails"
                    checked={receiveLeadEmails}
                    onChange={(event) =>
                      setReceiveLeadEmails(
                        event.target.checked
                      )
                    }
                  />

                  <i
                    className={
                      receiveLeadEmails
                        ? "matching-center__switch matching-center__switch--active"
                        : "matching-center__switch"
                    }
                  >
                    <b />
                  </i>
                </label>

                <label className="matching-center__notification">
                  <span className="matching-center__notification-icon">
                    ⚡
                  </span>

                  <span>
                    <strong>
                      Alle Lead-E-Mails
                    </strong>

                    <small>
                      Informiert dich über sämtliche neuen Leads,
                      unabhängig von deinem Matching.
                    </small>
                  </span>

                  <input
                    type="checkbox"
                    name="receiveAllLeadEmails"
                    checked={receiveAllLeadEmails}
                    onChange={(event) =>
                      setReceiveAllLeadEmails(
                        event.target.checked
                      )
                    }
                  />

                  <i
                    className={
                      receiveAllLeadEmails
                        ? "matching-center__switch matching-center__switch--active"
                        : "matching-center__switch"
                    }
                  >
                    <b />
                  </i>
                </label>
              </div>
            </section>
          </div>

          <aside className="matching-center__sidebar">
            <section className="matching-center__analysis">
              <span className="matching-center__eyebrow">
                MATCHING-ANALYSE
              </span>

              <div
                className="matching-center__analysis-ring"
                style={{
                  background: `conic-gradient(
                    #48caff 0%,
                    #7472ff ${matchingScore}%,
                    rgba(255,255,255,.065) ${matchingScore}%,
                    rgba(255,255,255,.065) 100%
                  )`,
                }}
              >
                <div>
                  <strong>{matchingScore}%</strong>
                  <span>Match-Qualität</span>
                </div>
              </div>

              <h2>
                {matchingScore >= 85
                  ? "Sehr starkes Matching"
                  : matchingScore >= 60
                    ? "Gutes Matching"
                    : matchingScore >= 30
                      ? "Matching ausbauen"
                      : "Auswahl erforderlich"}
              </h2>

              <p>
                Je genauer deine Auswahl ist, desto relevanter
                werden deine Lead-Empfehlungen.
              </p>

              <div className="matching-center__analysis-list">
                <div>
                  <span>Dienstleistungen</span>
                  <strong>
                    {selectedServices.size}
                  </strong>
                </div>

                <div>
                  <span>Regionen</span>
                  <strong>
                    {selectedRegions.size}
                  </strong>
                </div>

                <div>
                  <span>Städte</span>
                  <strong>{cities.length}</strong>
                </div>

                <div>
                  <span>Postleitzahlen</span>
                  <strong>
                    {postalCodes.length}
                  </strong>
                </div>
              </div>
            </section>

            <section className="matching-center__potential">
              <div>
                <span>GESCHÄTZTES POTENZIAL</span>

                <strong>{estimatedLeadRange}</strong>

                <p>passende Lead-Kombinationen</p>
              </div>

              <div className="matching-center__potential-bars">
                <span>
                  <i style={{ width: `${Math.max(8, Math.min(100, selectedServices.size * 5))}%` }} />
                </span>

                <span>
                  <i style={{ width: `${Math.max(8, Math.min(100, selectedRegions.size * 7))}%` }} />
                </span>

                <span>
                  <i style={{ width: `${Math.max(8, matchingScore)}%` }} />
                </span>
              </div>
            </section>

            <section className="matching-center__recommendations">
              <div className="matching-center__sidebar-head">
                <span>EMPFEHLUNGEN</span>
                <small>Live</small>
              </div>

              <div>
                <article>
                  <span
                    className={
                      selectedServices.size >= 3
                        ? "matching-center__recommendation-check matching-center__recommendation-check--done"
                        : "matching-center__recommendation-check"
                    }
                  >
                    {selectedServices.size >= 3 ? "✓" : "1"}
                  </span>

                  <p>
                    <strong>
                      Mehrere Leistungen aktivieren
                    </strong>

                    <small>
                      Mindestens drei Leistungen verbessern die
                      Trefferquote.
                    </small>
                  </p>
                </article>

                <article>
                  <span
                    className={
                      selectedRegions.size >= 2
                        ? "matching-center__recommendation-check matching-center__recommendation-check--done"
                        : "matching-center__recommendation-check"
                    }
                  >
                    {selectedRegions.size >= 2 ? "✓" : "2"}
                  </span>

                  <p>
                    <strong>
                      Einsatzgebiet erweitern
                    </strong>

                    <small>
                      Mehrere Kantone erhöhen das verfügbare
                      Lead-Volumen.
                    </small>
                  </p>
                </article>

                <article>
                  <span
                    className={
                      cities.length > 0 ||
                      postalCodes.length > 0
                        ? "matching-center__recommendation-check matching-center__recommendation-check--done"
                        : "matching-center__recommendation-check"
                    }
                  >
                    {cities.length > 0 ||
                    postalCodes.length > 0
                      ? "✓"
                      : "3"}
                  </span>

                  <p>
                    <strong>
                      Matching präzisieren
                    </strong>

                    <small>
                      Städte oder PLZ verbessern die lokale
                      Zuordnung.
                    </small>
                  </p>
                </article>
              </div>
            </section>
          </aside>

          <div className="matching-center__save-bar">
            <div>
              <span>SMART MATCHING</span>

              <strong>
                Änderungen für neue Leads übernehmen
              </strong>

              <small>
                Deine gespeicherten Einstellungen werden sofort
                für zukünftige Anfragen verwendet.
              </small>
            </div>

            <button type="submit">
              Einstellungen speichern
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
