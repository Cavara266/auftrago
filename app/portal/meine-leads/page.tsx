import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import "./crm-center.css";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

const statusLabels: Record<string, string> = {
  OPEN: "Offene Anfrage",
  CONTACTED: "Kontaktiert",
  APPOINTMENT_SET: "Termin abgemacht",
  OFFER_SENT: "Offerte geschickt",
  WON: "Auftrag gewonnen",
  LOST: "Auftrag verloren",
  NO_OFFER: "Kein Angebot",
};

const statusShortLabels: Record<string, string> = {
  OPEN: "Neu",
  CONTACTED: "Kontakt",
  APPOINTMENT_SET: "Termin",
  OFFER_SENT: "Offerte",
  WON: "Gewonnen",
  LOST: "Verloren",
  NO_OFFER: "Kein Angebot",
};

const statusFilters = [
  { value: "", label: "Alle Leads" },
  { value: "OPEN", label: "Offen" },
  { value: "CONTACTED", label: "Kontaktiert" },
  { value: "APPOINTMENT_SET", label: "Termin" },
  { value: "OFFER_SENT", label: "Offerte" },
  { value: "WON", label: "Gewonnen" },
  { value: "LOST", label: "Verloren" },
];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Zurich",
  }).format(date);
}

function formatRelativeDate(date: Date) {
  const difference =
    Date.now() - date.getTime();

  const minutes = Math.max(
    1,
    Math.floor(difference / 60000)
  );

  if (minutes < 60) {
    return `vor ${minutes} Min.`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `vor ${hours} Std.`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) {
    return "gestern";
  }

  if (days < 30) {
    return `vor ${days} Tagen`;
  }

  return formatDate(date);
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "K";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function getNextStep(status: string) {
  switch (status) {
    case "OPEN":
      return "Kunde jetzt kontaktieren";

    case "CONTACTED":
      return "Termin vereinbaren";

    case "APPOINTMENT_SET":
      return "Offerte vorbereiten";

    case "OFFER_SENT":
      return "Offerte nachfassen";

    case "WON":
      return "Ausführung planen";

    case "LOST":
      return "Abschluss dokumentieren";

    case "NO_OFFER":
      return "Entscheidung prüfen";

    default:
      return "Lead bearbeiten";
  }
}

function getProgress(status: string) {
  switch (status) {
    case "OPEN":
      return 14;

    case "CONTACTED":
      return 34;

    case "APPOINTMENT_SET":
      return 56;

    case "OFFER_SENT":
      return 78;

    case "WON":
      return 100;

    case "LOST":
    case "NO_OFFER":
      return 100;

    default:
      return 10;
  }
}

export default async function MeineLeadsPage({
  searchParams,
}: PageProps) {
  const params = searchParams
    ? await searchParams
    : undefined;

  const selectedStatus =
    params?.status || "";

  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const provider =
    await prisma.provider.findUnique({
      where: {
        id: user.id,
      },
      include: {
        purchases: {
          include: {
            lead: true,
            notes: {
              orderBy: {
                createdAt: "desc",
              },
            },
            messages: {
              orderBy: {
                createdAt: "desc",
              },
            },
            activities: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

  if (!provider) {
    redirect("/login");
  }

  const purchases = provider.purchases;

  const filteredPurchases =
    selectedStatus
      ? purchases.filter(
          (purchase) =>
            purchase.status ===
            selectedStatus
        )
      : purchases;

  const openCount = purchases.filter(
    (purchase) =>
      purchase.status === "OPEN" ||
      purchase.status === "CONTACTED"
  ).length;

  const appointmentCount =
    purchases.filter(
      (purchase) =>
        purchase.status ===
        "APPOINTMENT_SET"
    ).length;

  const offerCount = purchases.filter(
    (purchase) =>
      purchase.status === "OFFER_SENT"
  ).length;

  const wonCount = purchases.filter(
    (purchase) =>
      purchase.status === "WON"
  ).length;

  const lostCount = purchases.filter(
    (purchase) =>
      purchase.status === "LOST"
  ).length;

  const decidedCount =
    wonCount + lostCount;

  const conversionRate =
    decidedCount > 0
      ? Math.round(
          (wonCount / decidedCount) * 100
        )
      : 0;

  const totalNotes = purchases.reduce(
    (sum, purchase) =>
      sum + purchase.notes.length,
    0
  );

  const totalActivities =
    purchases.reduce(
      (sum, purchase) =>
        sum +
        purchase.activities.length,
      0
    );

  const activePipelineCount =
    openCount +
    appointmentCount +
    offerCount;

  return (
    <main className="crm-center">
      <div className="crm-center__glow crm-center__glow--one" />
      <div className="crm-center__glow crm-center__glow--two" />

      <div className="crm-center__container">
        <section className="crm-center__hero">
          <div className="crm-center__hero-copy">
            <span className="crm-center__eyebrow">
              AUFTRAGO SALES COMMAND CENTER
            </span>

            <h1>
              Dein persönliches
              <em>Lead-CRM.</em>
            </h1>

            <p>
              Organisiere Kundenkontakte,
              verfolge jeden Verkaufsschritt
              und verwandle neue Anfragen
              systematisch in Aufträge.
            </p>

            <div className="crm-center__hero-actions">
              <Link
                href="/portal/leads"
                className="crm-center__button crm-center__button--primary"
              >
                Neue Leads entdecken
                <span>→</span>
              </Link>

              <Link
                href="#pipeline"
                className="crm-center__button crm-center__button--ghost"
              >
                Pipeline ansehen
              </Link>
            </div>
          </div>

          <div className="crm-center__hero-score">
            <div className="crm-center__score-ring">
              <strong>
                {conversionRate}%
              </strong>

              <span>
                Abschlussquote
              </span>
            </div>

            <div className="crm-center__score-copy">
              <span>DEINE PERFORMANCE</span>

              <h2>
                {wonCount > 0
                  ? `${wonCount} Auftrag${
                      wonCount === 1
                        ? ""
                        : "e"
                    } gewonnen`
                  : "Dein CRM ist bereit"}
              </h2>

              <p>
                {decidedCount > 0
                  ? `${decidedCount} abgeschlossene Entscheidungen wurden ausgewertet.`
                  : "Bearbeite deine ersten Leads, um deine Verkaufsquote zu sehen."}
              </p>
            </div>
          </div>
        </section>

        <section className="crm-center__metrics">
          <article>
            <span className="crm-center__metric-icon">
              ◎
            </span>

            <div>
              <strong>
                {purchases.length}
              </strong>

              <p>Leads insgesamt</p>
            </div>

            <small>
              Gekaufte Kundenkontakte
            </small>
          </article>

          <article>
            <span className="crm-center__metric-icon">
              ↗
            </span>

            <div>
              <strong>
                {activePipelineCount}
              </strong>

              <p>Aktive Chancen</p>
            </div>

            <small>
              Noch im Verkaufsprozess
            </small>
          </article>

          <article>
            <span className="crm-center__metric-icon">
              ✓
            </span>

            <div>
              <strong>{wonCount}</strong>
              <p>Gewonnen</p>
            </div>

            <small>
              Erfolgreiche Abschlüsse
            </small>
          </article>

          <article>
            <span className="crm-center__metric-icon">
              ✦
            </span>

            <div>
              <strong>
                {totalActivities}
              </strong>

              <p>Aktivitäten</p>
            </div>

            <small>
              Dokumentierte Aktionen
            </small>
          </article>
        </section>

        <section
          id="pipeline"
          className="crm-center__pipeline"
        >
          <header className="crm-center__section-header">
            <div>
              <span className="crm-center__eyebrow">
                LIVE PIPELINE
              </span>

              <h2>
                Deine Verkaufsphasen
              </h2>

              <p>
                Behalte sofort im Blick,
                wo sich deine Kunden befinden.
              </p>
            </div>

            <div className="crm-center__pipeline-total">
              <strong>
                {activePipelineCount}
              </strong>

              <span>aktive Chancen</span>
            </div>
          </header>

          <div className="crm-center__pipeline-grid">
            <Link
              href="/portal/meine-leads?status=OPEN"
              className="crm-center__pipeline-step crm-center__pipeline-step--open"
            >
              <div>
                <span>01</span>
                <b>Neue Leads</b>
              </div>

              <strong>
                {
                  purchases.filter(
                    (purchase) =>
                      purchase.status ===
                      "OPEN"
                  ).length
                }
              </strong>

              <small>
                Jetzt kontaktieren
              </small>
            </Link>

            <Link
              href="/portal/meine-leads?status=CONTACTED"
              className="crm-center__pipeline-step crm-center__pipeline-step--contacted"
            >
              <div>
                <span>02</span>
                <b>Kontaktiert</b>
              </div>

              <strong>
                {
                  purchases.filter(
                    (purchase) =>
                      purchase.status ===
                      "CONTACTED"
                  ).length
                }
              </strong>

              <small>
                Im Gespräch
              </small>
            </Link>

            <Link
              href="/portal/meine-leads?status=APPOINTMENT_SET"
              className="crm-center__pipeline-step crm-center__pipeline-step--appointment"
            >
              <div>
                <span>03</span>
                <b>Termin</b>
              </div>

              <strong>
                {appointmentCount}
              </strong>

              <small>
                Termin vereinbart
              </small>
            </Link>

            <Link
              href="/portal/meine-leads?status=OFFER_SENT"
              className="crm-center__pipeline-step crm-center__pipeline-step--offer"
            >
              <div>
                <span>04</span>
                <b>Offerte</b>
              </div>

              <strong>
                {offerCount}
              </strong>

              <small>
                Entscheidung offen
              </small>
            </Link>

            <Link
              href="/portal/meine-leads?status=WON"
              className="crm-center__pipeline-step crm-center__pipeline-step--won"
            >
              <div>
                <span>05</span>
                <b>Gewonnen</b>
              </div>

              <strong>
                {wonCount}
              </strong>

              <small>
                Erfolgreich verkauft
              </small>
            </Link>
          </div>
        </section>

        <section className="crm-center__workspace">
          <header className="crm-center__workspace-header">
            <div>
              <span className="crm-center__eyebrow">
                KUNDEN & CHANCEN
              </span>

              <h2>
                Meine Leads
              </h2>

              <p>
                {filteredPurchases.length}{" "}
                {filteredPurchases.length === 1
                  ? "Lead"
                  : "Leads"}{" "}
                angezeigt
              </p>
            </div>

            <div className="crm-center__workspace-summary">
              <div>
                <strong>
                  {totalNotes}
                </strong>

                <span>Notizen</span>
              </div>

              <div>
                <strong>
                  {conversionRate}%
                </strong>

                <span>Quote</span>
              </div>
            </div>
          </header>

          <nav className="crm-center__filters">
            {statusFilters.map((filter) => {
              const active =
                selectedStatus ===
                filter.value;

              const href = filter.value
                ? `/portal/meine-leads?status=${filter.value}`
                : "/portal/meine-leads";

              return (
                <Link
                  key={filter.value}
                  href={href}
                  className={
                    active
                      ? "crm-center__filter crm-center__filter--active"
                      : "crm-center__filter"
                  }
                >
                  {filter.label}
                </Link>
              );
            })}
          </nav>

          {filteredPurchases.length > 0 ? (
            <div className="crm-center__lead-grid">
              {filteredPurchases.map(
                (purchase) => {
                  const lastActivity =
                    purchase.activities[0];

                  const progress =
                    getProgress(
                      purchase.status
                    );

                  return (
                    <article
                      key={purchase.id}
                      className={`crm-center__lead-card crm-center__lead-card--${purchase.status.toLowerCase()}`}
                    >
                      <div className="crm-center__lead-top">
                        <div className="crm-center__avatar">
                          {getInitials(
                            purchase.lead.name
                          )}
                        </div>

                        <div className="crm-center__lead-heading">
                          <div className="crm-center__lead-badges">
                            <span
                              className={`crm-center__status crm-center__status--${purchase.status.toLowerCase()}`}
                            >
                              {
                                statusLabels[
                                  purchase.status
                                ]
                              }
                            </span>

                            <span>
                              {
                                purchase.lead
                                  .category
                              }
                            </span>
                          </div>

                          <h3>
                            {
                              purchase.lead
                                .title
                            }
                          </h3>

                          <p>
                            {
                              purchase.lead
                                .name
                            }
                          </p>
                        </div>

                        <div className="crm-center__credits">
                          <strong>
                            {
                              purchase.price
                            }
                          </strong>

                          <span>Credits</span>
                        </div>
                      </div>

                      <div className="crm-center__contact-grid">
                        <a
                          href={`tel:${purchase.lead.phone}`}
                        >
                          <span>Telefon</span>
                          <strong>
                            {
                              purchase.lead
                                .phone
                            }
                          </strong>
                        </a>

                        <a
                          href={`mailto:${purchase.lead.email}`}
                        >
                          <span>E-Mail</span>
                          <strong>
                            {
                              purchase.lead
                                .email
                            }
                          </strong>
                        </a>

                        <div>
                          <span>Region</span>
                          <strong>
                            {
                              purchase.lead
                                .region
                            }
                          </strong>
                        </div>

                        <div>
                          <span>Gekauft</span>
                          <strong>
                            {formatRelativeDate(
                              purchase.createdAt
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="crm-center__progress">
                        <div className="crm-center__progress-head">
                          <span>
                            Verkaufsfortschritt
                          </span>

                          <strong>
                            {
                              statusShortLabels[
                                purchase.status
                              ]
                            }
                          </strong>
                        </div>

                        <div className="crm-center__progress-track">
                          <span
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="crm-center__lead-insights">
                        <div>
                          <span>
                            Nächster Schritt
                          </span>

                          <strong>
                            {getNextStep(
                              purchase.status
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Letzte Aktivität
                          </span>

                          <strong>
                            {lastActivity
                              ? formatRelativeDate(
                                  lastActivity.createdAt
                                )
                              : "Noch keine"}
                          </strong>
                        </div>

                        <div>
                          <span>CRM-Daten</span>

                          <strong>
                            {
                              purchase.notes
                                .length
                            }{" "}
                            Notizen ·{" "}
                            {
                              purchase.messages
                                .length
                            }{" "}
                            Nachrichten
                          </strong>
                        </div>
                      </div>

                      <footer className="crm-center__lead-footer">
                        <div className="crm-center__quick-actions">
                          <a
                            href={`tel:${purchase.lead.phone}`}
                            aria-label="Kunde anrufen"
                          >
                            ☎
                          </a>

                          <a
                            href={`mailto:${purchase.lead.email}`}
                            aria-label="E-Mail schreiben"
                          >
                            ✉
                          </a>

                          <a
                            href={`https://wa.me/${purchase.lead.phone.replace(
                              /\D/g,
                              ""
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label="WhatsApp öffnen"
                          >
                            ◉
                          </a>
                        </div>

                        <Link
                          href={`/portal/meine-leads/${purchase.id}`}
                          className="crm-center__button crm-center__button--primary"
                        >
                          Lead öffnen
                          <span>→</span>
                        </Link>
                      </footer>
                    </article>
                  );
                }
              )}
            </div>
          ) : (
            <div className="crm-center__empty">
              <span>CRM BEREIT</span>

              <h3>
                Keine Leads in dieser Phase
              </h3>

              <p>
                Wähle einen anderen Status oder
                entdecke neue Kundenanfragen im
                Marketplace.
              </p>

              <div>
                <Link
                  href="/portal/meine-leads"
                  className="crm-center__button crm-center__button--ghost"
                >
                  Alle Leads anzeigen
                </Link>

                <Link
                  href="/portal/leads"
                  className="crm-center__button crm-center__button--primary"
                >
                  Leads entdecken
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
