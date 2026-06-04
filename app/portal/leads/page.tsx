import { prisma } from "@/lib/prisma";
import { buyLeadAction } from "./actions";

type PageProps = {
  searchParams?: Promise<{
    error?: string;
    message?: string;
  }>;
};

const DEMO_PROVIDER_EMAIL =
  process.env.DEMO_PROVIDER_EMAIL?.trim().toLowerCase() ||
  "info@cavara-hauswartung.ch";

function getErrorMessage(error?: string) {
  switch (error) {
    case "invalid-lead":
      return "Der Lead konnte nicht verarbeitet werden.";
    case "provider-missing":
      return "Es wurde noch kein Anbieter-Profil für den Kaufprozess gefunden.";
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
      return "Lead erfolgreich gekauft. Die Kontaktdaten sind jetzt freigeschaltet.";
    case "already-bought":
      return "Dieser Lead wurde bereits gekauft und ist schon freigeschaltet.";
    default:
      return "";
  }
}

export default async function PortalLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const errorMessage = getErrorMessage(params?.error);
  const infoMessage = getInfoMessage(params?.message);

  const provider = await prisma.provider.findUnique({
    where: {
      email: DEMO_PROVIDER_EMAIL,
    },
    include: {
      purchases: {
        select: {
          leadId: true,
        },
      },
    },
  });

  const leads = await prisma.lead.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const purchasedLeadIds = new Set(
    provider?.purchases.map((purchase) => purchase.leadId) || []
  );

  return (
    <main className="page">
      <section className="hero" style={{ paddingBottom: "10px" }}>
        <div className="container">
          <span className="eyebrow">Lead-Marketplace</span>

          <h1 style={{ maxWidth: "12ch" }}>
            Neue Leads einkaufen.
          </h1>

          <p className="lead" style={{ maxWidth: "70ch" }}>
            Hier sehen Anbieter neue Anfragen, prüfen Preis und Relevanz und
            schalten nach dem Kauf die vollständigen Kontaktdaten frei.
          </p>

          <div className="hero-actions">
            <a href="/portal" className="btn btn-secondary">
              Zum Dashboard
            </a>

            <a href="/portal/guthaben" className="btn btn-primary">
              Guthaben aufladen
            </a>
          </div>

          <div className="stats-grid" style={{ marginTop: "22px" }}>
            <div className="stat-card">
              <strong>{provider?.credits ?? 0}</strong>
              <span>Verfügbare Credits</span>
            </div>

            <div className="stat-card">
              <strong>{leads.length}</strong>
              <span>Aktive Leads</span>
            </div>

            <div className="stat-card">
              <strong>{purchasedLeadIds.size}</strong>
              <span>Bereits gekauft</span>
            </div>

            <div className="stat-card">
              <strong>{provider?.region || "—"}</strong>
              <span>Aktive Hauptregion</span>
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                border: "1px solid rgba(244,63,94,0.25)",
                background: "rgba(244,63,94,0.12)",
                color: "#ffe4e6",
              }}
            >
              {errorMessage}
            </div>
          )}

          {infoMessage && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                border: "1px solid rgba(125,211,252,0.22)",
                background: "rgba(125,211,252,0.12)",
                color: "#e0f2fe",
              }}
            >
              {infoMessage}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!provider && (
            <div className="panel pad-lg" style={{ marginBottom: "22px" }}>
              <div className="section-head" style={{ marginBottom: 0 }}>
                <span className="section-kicker">Wichtig</span>
                <h2>Anbieter-Profil fehlt</h2>
                <p>
                  Damit der Kaufprozess funktioniert, muss ein Provider-Datensatz
                  mit der E-Mail <strong>{DEMO_PROVIDER_EMAIL}</strong> existieren.
                </p>
              </div>
            </div>
          )}

          <div
            className="leads-layout-live"
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: "22px",
            }}
          >
            <div className="providers">
              {leads.length === 0 ? (
                <div className="panel pad-lg">
                  <div className="section-head" style={{ marginBottom: 0 }}>
                    <span className="section-kicker">Keine Leads</span>
                    <h2>Aktuell sind noch keine Leads vorhanden</h2>
                    <p>
                      Sobald neue Anfragen in der Datenbank angelegt werden,
                      erscheinen sie hier automatisch.
                    </p>
                  </div>
                </div>
              ) : (
                leads.map((lead) => {
                  const isBought = purchasedLeadIds.has(lead.id);

                  return (
                    <article key={lead.id} className="panel provider-card">
                      <div className="provider-top">
                        <span className={`badge ${isBought ? "white" : "soft"}`}>
                          {isBought ? "Freigeschaltet" : "Neu"}
                        </span>
                        <span className="badge soft">{lead.category}</span>
                        <span className="badge soft">{lead.region}</span>
                      </div>

                      <div className="provider-layout">
                        <div>
                          <h3>{lead.title}</h3>
                          <p>{lead.description}</p>

                          <div className="tag-list">
                            <span className="tag">
                              Preis: {lead.price} Credits
                            </span>
                            <span className="tag">
                              Erstellt:{" "}
                              {new Intl.DateTimeFormat("de-CH").format(
                                lead.createdAt
                              )}
                            </span>
                            <span className="tag">
                              Status:{" "}
                              {isBought
                                ? "Kontaktdaten sichtbar"
                                : "Kontaktdaten gesperrt"}
                            </span>
                          </div>

                          <div
                            style={{
                              marginTop: "18px",
                              padding: "18px",
                              borderRadius: "22px",
                              border: "1px solid rgba(255,255,255,0.08)",
                              background: "rgba(255,255,255,0.04)",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "0.82rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.16em",
                                color: "rgba(245,248,255,0.5)",
                              }}
                            >
                              Kontaktdaten
                            </div>

                            {isBought ? (
                              <div style={{ marginTop: "12px", lineHeight: 1.9 }}>
                                <div>
                                  <strong>Name:</strong> {lead.name}
                                </div>
                                <div>
                                  <strong>E-Mail:</strong> {lead.email}
                                </div>
                                <div>
                                  <strong>Telefon:</strong> {lead.phone}
                                </div>
                              </div>
                            ) : (
                              <div
                                style={{
                                  marginTop: "12px",
                                  color: "rgba(245,248,255,0.7)",
                                }}
                              >
                                Nach dem Kauf werden Name, E-Mail und
                                Telefonnummer freigeschaltet.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="rating-box">
                          <div className="meta">Leadpreis</div>
                          <div className="value">{lead.price}</div>
                          <div className="reviews">Credits</div>

                          <div className="actions">
                            {isBought ? (
                              <button
                                className="btn btn-secondary btn-block"
                                disabled
                              >
                                Bereits gekauft
                              </button>
                            ) : provider ? (
                              <form action={buyLeadAction}>
                                <input type="hidden" name="leadId" value={lead.id} />
                                <button
                                  type="submit"
                                  className="btn btn-primary btn-block"
                                >
                                  Lead kaufen
                                </button>
                              </form>
                            ) : (
                              <button
                                className="btn btn-secondary btn-block"
                                disabled
                              >
                                Anbieter fehlt
                              </button>
                            )}

                            <a
                              href="/portal/guthaben"
                              className="btn btn-secondary btn-block"
                            >
                              Credits aufladen
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div style={{ display: "grid", gap: "22px" }}>
              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "14px" }}>
                  <span className="section-kicker">Dein Konto</span>
                  <h2 style={{ fontSize: "2rem" }}>Anbieterstatus</h2>
                </div>

                <div className="stats-grid" style={{ gridTemplateColumns: "1fr" }}>
                  <div className="stat-card">
                    <strong>{provider?.credits ?? 0}</strong>
                    <span>Aktuelle Credits</span>
                  </div>

                  <div className="stat-card">
                    <strong>{provider?.companyName || "Nicht vorhanden"}</strong>
                    <span>Firma</span>
                  </div>
                </div>
              </div>

              <div className="panel pad-lg">
                <div className="section-head" style={{ marginBottom: "10px" }}>
                  <span className="section-kicker">So funktioniert’s</span>
                  <h2 style={{ fontSize: "2rem" }}>Lead-Kauf Flow</h2>
                </div>

                <div className="benefits" style={{ marginTop: 0 }}>
                  <div className="panel benefit-card" style={{ padding: "18px" }}>
                    <h3 style={{ fontSize: "1.12rem" }}>1. Lead prüfen</h3>
                    <p>Region, Kategorie und Preis vor dem Kauf ansehen.</p>
                  </div>

                  <div className="panel benefit-card" style={{ padding: "18px" }}>
                    <h3 style={{ fontSize: "1.12rem" }}>2. Credits einsetzen</h3>
                    <p>
                      Beim Kauf werden Credits automatisch vom Anbieter-Konto
                      abgezogen.
                    </p>
                  </div>

                  <div className="panel benefit-card" style={{ padding: "18px" }}>
                    <h3 style={{ fontSize: "1.12rem" }}>3. Kontakt erhalten</h3>
                    <p>
                      Nach erfolgreichem Kauf werden alle Kontaktdaten sichtbar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="footer-space" />

      <style>{`
        @media (max-width: 1100px) {
          .leads-layout-live {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}