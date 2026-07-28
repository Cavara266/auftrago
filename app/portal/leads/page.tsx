import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { buyLeadAction } from "./actions";
import { getLeadPricing } from "@/lib/lead-pricing";
import "./lead-center.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
    region?: string;
    category?: string;
  }>;
};

const regions = [
  "Aargau",
  "Appenzell Ausserrhoden",
  "Appenzell Innerrhoden",
  "Basel-Landschaft",
  "Basel-Stadt",
  "Bern",
  "Freiburg",
  "Genf",
  "Glarus",
  "Graubünden",
  "Jura",
  "Luzern",
  "Neuenburg",
  "Nidwalden",
  "Obwalden",
  "Schaffhausen",
  "Schwyz",
  "Solothurn",
  "St. Gallen",
  "Tessin",
  "Thurgau",
  "Uri",
  "Waadt",
  "Wallis",
  "Zug",
  "Zürich",
];

const categories = [
  "Hauswartung",
  "Facility Management",
  "Liegenschaftsunterhalt",
  "Technischer Hausdienst",
  "Reinigung",
  "Unterhaltsreinigung",
  "Büroreinigung",
  "Praxisreinigung",
  "Treppenhausreinigung",
  "Umzugsreinigung",
  "Endreinigung",
  "Grundreinigung",
  "Baureinigung",
  "Fensterreinigung",
  "Fassadenreinigung",
  "Teppichreinigung",
  "Polsterreinigung",
  "Hochdruckreinigung",
  "Desinfektionsreinigung",
  "Gartenpflege",
  "Gartenunterhalt",
  "Gartenbau",
  "Rasenpflege",
  "Heckenschnitt",
  "Baumschnitt",
  "Baumfällung",
  "Landschaftsbau",
  "Bewässerung",
  "Winterdienst",
  "Schneeräumung",
  "Maler",
  "Malerarbeiten",
  "Gipser",
  "Trockenbau",
  "Plattenleger",
  "Bodenleger",
  "Parkettleger",
  "Fliesenleger",
  "Maurer",
  "Betonarbeiten",
  "Fassadenarbeiten",
  "Dachdecker",
  "Spengler",
  "Gerüstbau",
  "Schreiner",
  "Zimmermann",
  "Küchenbau",
  "Fensterbau",
  "Türen und Tore",
  "Glaser",
  "Metallbau",
  "Schlosser",
  "Sanitär",
  "Heizung",
  "Lüftung",
  "Klima",
  "Wärmepumpen",
  "Boiler-Service",
  "Rohrreinigung",
  "Kanalreinigung",
  "Elektriker",
  "Elektroinstallation",
  "Photovoltaik",
  "Solaranlagen",
  "Smart Home",
  "Alarmanlagen",
  "Videoüberwachung",
  "Netzwerktechnik",
  "Umzug",
  "Privatumzug",
  "Firmenumzug",
  "Möbeltransport",
  "Klaviertransport",
  "Transport",
  "Kurierdienst",
  "Lieferdienst",
  "Möbelmontage",
  "Montageservice",
  "Entrümpelung",
  "Räumung",
  "Haushaltsauflösung",
  "Entsorgung",
  "Muldenservice",
  "Abbrucharbeiten",
  "Demontage",
  "Pest Control",
  "Schädlingsbekämpfung",
  "Hausräumung",
  "Hausmeisterservice",
  "Reparaturservice",
  "Allrounder",
];

function getErrorMessage(error?: string) {
  switch (error) {
    case "invalid-lead":
      return "Der Lead konnte nicht verarbeitet werden.";
    case "lead-not-found":
      return "Der ausgewählte Lead wurde nicht gefunden.";
    case "not-enough-credits":
      return "Nicht genügend Credits vorhanden. Bitte lade dein Guthaben auf.";
    default:
      return "";
  }
}

function getInfoMessage(message?: string) {
  switch (message) {
    case "purchased":
      return "Lead erfolgreich gekauft.";
    case "already-bought":
      return "Dieser Lead wurde bereits gekauft.";
    default:
      return "";
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatExecutionDate(
  date: Date | null,
  flexibleDate: boolean
) {
  if (flexibleDate && date) {
    return `Flexibel ab ${formatDate(date)}`;
  }

  if (flexibleDate) {
    return "Datum flexibel";
  }

  if (!date) {
    return "Nach Vereinbarung";
  }

  return formatDate(date);
}

function formatCurrency(
  amountInCents: number,
  currency = "CHF"
) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
}

function getShortTitle(title: string) {
  return title
    .replace("Umzugsreinigung - ", "")
    .replace("Grundreinigung - ", "")
    .replace("Fensterreinigung - ", "")
    .replace("Unterhaltsreinigung - ", "");
}

function isMatchingProvider(
  itemRegion: string | null,
  itemCategory: string,
  providerRegion: string | null,
  providerCategory: string | null
) {
  return (
    Boolean(
      itemRegion &&
        providerRegion &&
        itemRegion === providerRegion
    ) ||
    Boolean(
      itemCategory &&
        providerCategory &&
        itemCategory === providerCategory
    )
  );
}

function getMatchScore(
  regionMatches: boolean,
  categoryMatches: boolean,
  createdAt: Date
) {
  const ageInHours =
    (Date.now() - createdAt.getTime()) /
    (1000 * 60 * 60);

  let score = 61;

  if (regionMatches) score += 18;
  if (categoryMatches) score += 15;
  if (ageInHours <= 24) score += 5;

  return Math.min(score, 99);
}

function getFreshness(createdAt: Date) {
  const diffMs = Date.now() - createdAt.getTime();
  const minutes = Math.max(
    1,
    Math.floor(diffMs / 60000)
  );

  if (minutes < 60) {
    return `Vor ${minutes} Min.`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Vor ${hours} Std.`;
  }

  const days = Math.floor(hours / 24);

  return `Vor ${days} Tagen`;
}

export default async function PortalLeadsPage({
  searchParams,
}: PageProps) {
  const params = searchParams
    ? await searchParams
    : undefined;

  const selectedRegion = params?.region || "";
  const selectedCategory = params?.category || "";

  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    include: {
      purchases: {
        select: {
          leadId: true,
        },
      },
      providerServices: {
        where: {
          active: true,
        },
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
              category: {
                select: {
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const [leads, fixedOrders] = await Promise.all([
    prisma.lead.findMany({
      where: {
        ...(selectedRegion
          ? { region: selectedRegion }
          : {}),
        ...(selectedCategory
          ? { category: selectedCategory }
          : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.fixedOrder.findMany({
      where: {
        status: "OPEN",
        buyerId: null,
        ...(selectedRegion
          ? { region: selectedRegion }
          : {}),
        ...(selectedCategory
          ? { category: selectedCategory }
          : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        region: true,
        postalCode: true,
        city: true,
        executionDate: true,
        flexibleDate: true,
        orderValueCents: true,
        commissionPercent: true,
        commissionAmountCents: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const purchasedLeadIds = new Set(
    provider.purchases.map(
      (purchase) => purchase.leadId
    )
  );

  /*
   * Neue Kundenanfragen stehen immer zuerst.
   * Matching beeinflusst nur noch die Anzeige,
   * nicht mehr die Reihenfolge.
   */
  const sortedLeads = [...leads].sort(
    (a, b) =>
      b.createdAt.getTime() -
      a.createdAt.getTime()
  );

  const sortedFixedOrders = [...fixedOrders].sort(
    (a, b) => {
      const aMatch = isMatchingProvider(
        a.region,
        a.category,
        provider.region,
        provider.category
      );

      const bMatch = isMatchingProvider(
        b.region,
        b.category,
        provider.region,
        provider.category
      );

      if (aMatch === bMatch) {
        return (
          b.createdAt.getTime() -
          a.createdAt.getTime()
        );
      }

      return aMatch ? -1 : 1;
    }
  );

  const matchingLeadCount = sortedLeads.filter(
    (lead) =>
      isMatchingProvider(
        lead.region,
        lead.category,
        provider.region,
        provider.category
      )
  ).length;

  const matchingFixedOrderCount =
    sortedFixedOrders.filter((order) =>
      isMatchingProvider(
        order.region,
        order.category,
        provider.region,
        provider.category
      )
    ).length;

  const errorMessage = getErrorMessage(
    params?.error
  );

  const infoMessage = getInfoMessage(
    params?.message
  );

  return (
    <main className="lead-center">
      <div className="lead-center__orb lead-center__orb--one" />
      <div className="lead-center__orb lead-center__orb--two" />

      <div className="lead-center__container">
        <section className="lead-center__hero">
          <div className="lead-center__hero-copy">
            <div className="lead-center__live-label">
              <span />
              AUFTRAGO LEAD CENTER
            </div>

            <h1>
              Die besten Aufträge.
              <em>Für dein Unternehmen.</em>
            </h1>

            <p>
              Entdecke passende Kundenanfragen,
              übernimm bestätigte Fixaufträge und
              verwalte deine Chancen an einem Ort.
            </p>

            <div className="lead-center__hero-actions">
              <Link
                href="#normale-leads"
                className="lead-center__button lead-center__button--primary"
              >
                Leads entdecken
                <span>→</span>
              </Link>

              <Link
                href="/portal/fixed-orders"
                className="lead-center__button lead-center__button--ghost"
              >
                Fixaufträge ansehen
              </Link>
            </div>
          </div>

          <div className="lead-center__hero-panel">
            <span className="lead-center__panel-kicker">
              DEIN STATUS
            </span>

            <strong>{provider.credits}</strong>
            <p>Credits verfügbar</p>

            <div className="lead-center__credit-track">
              <span
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(6, provider.credits)
                  )}%`,
                }}
              />
            </div>

            <div className="lead-center__hero-panel-grid">
              <div>
                <b>{matchingLeadCount}</b>
                <small>Passende Leads</small>
              </div>

              <div>
                <b>{sortedFixedOrders.length}</b>
                <small>Fixaufträge</small>
              </div>
            </div>

            <Link
              href="/portal/guthaben"
              className="lead-center__button lead-center__button--primary"
            >
              Credits aufladen
              <span>→</span>
            </Link>
          </div>
        </section>

        {errorMessage ? (
          <div className="lead-center__alert lead-center__alert--error">
            {errorMessage}
          </div>
        ) : null}

        {infoMessage ? (
          <div className="lead-center__alert lead-center__alert--success">
            {infoMessage}
          </div>
        ) : null}

        <section className="lead-center__metrics">
          <article>
            <span>01</span>
            <strong>{sortedLeads.length}</strong>
            <p>Aktive Kundenanfragen</p>
          </article>

          <article>
            <span>02</span>
            <strong>
              {matchingLeadCount +
                matchingFixedOrderCount}
            </strong>
            <p>Passende Chancen</p>
          </article>

          <article>
            <span>03</span>
            <strong>{sortedFixedOrders.length}</strong>
            <p>Bestätigte Fixaufträge</p>
          </article>

          <article>
            <span>04</span>
            <strong>{provider.credits}</strong>
            <p>Verfügbare Credits</p>
          </article>
        </section>

        <section className="lead-center__filter-shell">
          <div>
            <span className="lead-center__section-kicker">
              SMART FILTER
            </span>

            <h2>Die richtigen Chancen finden</h2>
          </div>

          <form
            className="lead-center__filter"
            action="/portal/leads"
          >
            <label>
              <span>Region</span>

              <select
                name="region"
                defaultValue={selectedRegion}
              >
                <option value="">
                  Alle Regionen
                </option>

                {regions.map((region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Kategorie</span>

              <select
                name="category"
                defaultValue={selectedCategory}
              >
                <option value="">
                  Alle Kategorien
                </option>

                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="lead-center__button lead-center__button--primary"
            >
              Chancen filtern
            </button>

            <Link
              href="/portal/leads"
              className="lead-center__button lead-center__button--ghost"
            >
              Zurücksetzen
            </Link>
          </form>
        </section>

        {sortedFixedOrders.length > 0 ? (
          <section className="lead-center__fixed">
            <header className="lead-center__section-header">
              <div>
                <span className="lead-center__section-kicker lead-center__section-kicker--gold">
                  DIREKT ÜBERNEHMEN
                </span>

                <h2>Bestätigte Fixaufträge</h2>

                <p>
                  Der Kunde hat bereits zugesagt.
                  Diese Aufträge werden nur einmal
                  vergeben.
                </p>
              </div>

              <Link
                href="/portal/fixed-orders"
                className="lead-center__text-link lead-center__text-link--gold"
              >
                Alle anzeigen →
              </Link>
            </header>

            <div className="lead-center__fixed-grid">
              {sortedFixedOrders
                .slice(0, 3)
                .map((order) => {
                  const isMatching =
                    isMatchingProvider(
                      order.region,
                      order.category,
                      provider.region,
                      provider.category
                    );

                  return (
                    <article
                      key={order.id}
                      className="lead-center__fixed-card"
                    >
                      <div className="lead-center__fixed-card-top">
                        <span>FIXAUFTRAG</span>

                        {isMatching ? (
                          <b>✓ PASST ZU DIR</b>
                        ) : null}
                      </div>

                      <small>{order.category}</small>
                      <h3>{order.title}</h3>

                      <div className="lead-center__value-row">
                        <div>
                          <span>Auftragswert</span>
                          <strong>
                            {formatCurrency(
                              order.orderValueCents
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Übernahmepreis</span>
                          <strong>
                            {formatCurrency(
                              order.commissionAmountCents
                            )}
                          </strong>
                        </div>
                      </div>

                      <dl className="lead-center__details">
                        <div>
                          <dt>Ort</dt>
                          <dd>
                            {order.postalCode}{" "}
                            {order.city}
                          </dd>
                        </div>

                        <div>
                          <dt>Ausführung</dt>
                          <dd>
                            {formatExecutionDate(
                              order.executionDate,
                              order.flexibleDate
                            )}
                          </dd>
                        </div>
                      </dl>

                      <Link
                        href={`/portal/fixed-orders/${order.id}`}
                        className="lead-center__button lead-center__button--gold"
                      >
                        Auftrag ansehen
                        <span>→</span>
                      </Link>
                    </article>
                  );
                })}
            </div>
          </section>
        ) : null}

        <section
          id="normale-leads"
          className="lead-center__marketplace"
        >
          <header className="lead-center__section-header">
            <div>
              <span className="lead-center__section-kicker">
                LIVE MARKETPLACE
              </span>

              <h2>Neue Kundenanfragen</h2>

              <p>
                Passende Leads werden automatisch
                priorisiert und zuerst angezeigt.
              </p>
            </div>

            <div className="lead-center__result-count">
              <strong>{sortedLeads.length}</strong>
              <span>Leads verfügbar</span>
            </div>
          </header>

          {sortedLeads.length === 0 ? (
            <div className="lead-center__empty">
              <span>Keine Treffer</span>
              <h3>Keine Leads gefunden</h3>
              <p>
                Entferne die Filter oder prüfe später
                erneut die neuesten Anfragen.
              </p>

              <Link
                href="/portal/leads"
                className="lead-center__button lead-center__button--primary"
              >
                Filter entfernen
              </Link>
            </div>
          ) : (
            <div className="lead-center__lead-grid">
              {sortedLeads.map((lead) => {
                const isBought =
                  purchasedLeadIds.has(lead.id);

                const pricing = getLeadPricing(
                  lead.price,
                  lead.createdAt
                );

                const hasEnoughCredits =
                  provider.credits >=
                  pricing.currentPrice;

                const regionMatches =
                  Boolean(
                    lead.region &&
                      provider.region &&
                      lead.region ===
                        provider.region
                  );

                const categoryMatches =
                  Boolean(
                    lead.category &&
                      provider.category &&
                      lead.category ===
                        provider.category
                  );

                const isMatching =
                  regionMatches ||
                  categoryMatches;

                const matchScore = getMatchScore(
                  regionMatches,
                  categoryMatches,
                  lead.createdAt
                );

                return (
                  <article
                    key={lead.id}
                    className={[
                      "lead-center__lead-card",
                      isMatching
                        ? "lead-center__lead-card--match"
                        : "",
                    ].join(" ")}
                  >
                    <div className="lead-center__lead-card-head">
                      <div className="lead-center__badges">
                        <span className="lead-center__badge lead-center__badge--new">
                          {isBought
                            ? "Freigeschaltet"
                            : "Neu"}
                        </span>

                        <span className="lead-center__badge">
                          {lead.category}
                        </span>

                        {pricing.isDiscounted ? (
                          <span className="lead-center__badge lead-center__badge--discount">
                            −{pricing.discountPercent}%{" "}
                            {pricing.dealLabel}
                          </span>
                        ) : null}
                      </div>

                      <div className="lead-center__score">
                        <strong>{matchScore}%</strong>
                        <span>Match</span>
                      </div>
                    </div>

                    <div className="lead-center__lead-copy">
                      <span className="lead-center__lead-category">
                        {lead.category}
                      </span>

                      <h3>
                        {getShortTitle(lead.title)}
                      </h3>

                      <p>
                        Passende Kundenanfrage aus der
                        Region {lead.region}.
                      </p>
                    </div>

                    <div className="lead-center__lead-meta">
                      <div>
                        <span>Region</span>
                        <strong>{lead.region}</strong>
                      </div>

                      <div>
                        <span>Eingang</span>
                        <strong>
                          {getFreshness(
                            lead.createdAt
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>Kontakt</span>
                        <strong>
                          {isBought
                            ? "Freigeschaltet"
                            : "Geschützt"}
                        </strong>
                      </div>

                      <div>
                        <span>Verfügbarkeit</span>
                        <strong>Max. 4 Firmen</strong>
                      </div>
                    </div>

                    <div className="lead-center__match-box">
                      <div>
                        <span>
                          Persönliche Übereinstimmung
                        </span>

                        <strong>
                          {isMatching
                            ? "Sehr passend"
                            : "Neue Chance"}
                        </strong>
                      </div>

                      <div className="lead-center__match-track">
                        <span
                          style={{
                            width: `${matchScore}%`,
                          }}
                        />
                      </div>
                    </div>

                    <footer className="lead-center__lead-footer">
                      <div className="lead-center__lead-price">
                        <span>
                          {pricing.isDiscounted
                            ? `${pricing.dealLabel} · ${pricing.discountPercent}% günstiger`
                            : "Leadpreis"}
                        </span>

                        {pricing.isDiscounted ? (
                          <del>
                            {pricing.originalPrice} Credits
                          </del>
                        ) : null}

                        <strong>
                          {pricing.currentPrice} Credits
                        </strong>

                        <small>
                          {pricing.isDiscounted
                            ? "Automatisch reduzierter Preis"
                            : "Einmalige Freischaltung"}
                        </small>
                      </div>

                      {isBought ? (
                        <Link
                          href="/portal/meine-leads"
                          className="lead-center__button lead-center__button--ghost"
                        >
                          Kontakt ansehen
                        </Link>
                      ) : hasEnoughCredits ? (
                        <form action={buyLeadAction}>
                          <input
                            type="hidden"
                            name="leadId"
                            value={lead.id}
                          />

                          <button
                            type="submit"
                            className="lead-center__button lead-center__button--primary"
                          >
                            Freischalten
                            <span>→</span>
                          </button>
                        </form>
                      ) : (
                        <Link
                          href="/portal/guthaben"
                          className="lead-center__button lead-center__button--primary"
                        >
                          Credits aufladen
                          <span>→</span>
                        </Link>
                      )}
                    </footer>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
