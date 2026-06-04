import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEMO_PROVIDER_EMAIL =
  process.env.DEMO_PROVIDER_EMAIL?.trim().toLowerCase() ||
  "info@cavara-hauswartung.ch";

export default async function MeineLeadsPage() {
  const provider = await prisma.provider.findUnique({
    where: {
      email: DEMO_PROVIDER_EMAIL,
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          lead: true,
        },
      },
    },
  });

  return (
    <main className="page">
      <section className="meine-hero">
        <div className="container">
          <span className="eyebrow">Meine Leads</span>

          <h1>Gekaufte Kontakte.</h1>

          <p>
            Hier findest du alle Leads, die du freigeschaltet hast – inklusive
            Name, E-Mail und Telefonnummer.
          </p>

          <div className="meine-actions">
            <a href="/portal/leads" className="btn btn-primary">
              Neue Leads kaufen
            </a>

            <a href="/portal" className="btn btn-secondary">
              Dashboard
            </a>
          </div>

          <div className="meine-stats-grid">
            <div className="meine-stat-card">
              <strong>{provider?.purchases.length ?? 0}</strong>
              <span>Gekaufte Leads</span>
            </div>

            <div className="meine-stat-card">
              <strong>{provider?.credits ?? 0}</strong>
              <span>Verfügbare Credits</span>
            </div>

            <div className="meine-stat-card">
              <strong>{provider?.companyName || "—"}</strong>
              <span>Firma</span>
            </div>

            <div className="meine-stat-card">
              <strong>{provider?.region || "—"}</strong>
              <span>Region</span>
            </div>
          </div>
        </div>
      </section>

      <section className="meine-section">
        <div className="container">
          {!provider ? (
            <div className="meine-empty">
              <span>Wichtig</span>
              <h2>Anbieter-Profil fehlt</h2>
              <p>
                Es wurde kein Anbieter mit der E-Mail{" "}
                <strong>{DEMO_PROVIDER_EMAIL}</strong> gefunden.
              </p>
            </div>
          ) : provider.purchases.length === 0 ? (
            <div className="meine-empty">
              <span>Noch keine Käufe</span>
              <h2>Du hast noch keine Leads freigeschaltet.</h2>
              <p>
                Kaufe deinen ersten Lead, damit die Kontaktdaten hier
                erscheinen.
              </p>

              <a href="/portal/leads" className="btn btn-primary">
                Leads ansehen
              </a>
            </div>
          ) : (
            <div className="meine-grid">
              {provider.purchases.map((purchase) => (
                <article key={purchase.id} className="meine-card">
                  <div className="meine-card-top">
                    <div>
                      <div className="meine-badges">
                        <span>{purchase.lead.category}</span>
                        <span>{purchase.lead.region}</span>
                        <span>Freigeschaltet</span>
                      </div>

                      <h2>{purchase.lead.title}</h2>
                      <p>{purchase.lead.description}</p>
                    </div>

                    <div className="meine-price">
                      <span>Bezahlt</span>
                      <strong>{purchase.price}</strong>
                      <small>Credits</small>
                    </div>
                  </div>

                  <div className="meine-contact-box">
                    <span>Kontaktdaten</span>

                    <div className="meine-contact-grid">
                      <div>
                        <small>Name</small>
                        <strong>{purchase.lead.name}</strong>
                      </div>

                      <div>
                        <small>E-Mail</small>
                        <strong>{purchase.lead.email}</strong>
                      </div>

                      <div>
                        <small>Telefon</small>
                        <strong>{purchase.lead.phone}</strong>
                      </div>

                      <div>
                        <small>Gekauft am</small>
                        <strong>
                          {new Intl.DateTimeFormat("de-CH").format(
                            purchase.createdAt
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .meine-hero {
          padding: 72px 0 32px;
        }

        .meine-hero h1 {
          max-width: 900px;
          margin-top: 18px;
          color: white;
          font-size: clamp(3.2rem, 8vw, 7rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }

        .meine-hero p {
          max-width: 760px;
          margin-top: 22px;
          color: rgba(245, 248, 255, 0.68);
          font-size: 1.2rem;
          line-height: 1.65;
        }

        .meine-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .meine-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .meine-stat-card {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(45, 88, 125, 0.22), rgba(15, 18, 35, 0.92)),
            rgba(255, 255, 255, 0.04);
          padding: 24px;
          min-height: 120px;
        }

        .meine-stat-card strong {
          display: block;
          color: white;
          font-size: 1.8rem;
          line-height: 1.1;
          letter-spacing: -0.04em;
          word-break: break-word;
        }

        .meine-stat-card span {
          display: block;
          margin-top: 10px;
          color: rgba(245, 248, 255, 0.62);
          font-weight: 800;
        }

        .meine-section {
          padding: 32px 0 90px;
        }

        .meine-grid {
          display: grid;
          gap: 18px;
        }

        .meine-card,
        .meine-empty {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 34px;
          background:
            linear-gradient(135deg, rgba(45,88,125,0.22), rgba(15,18,35,0.94)),
            rgba(255,255,255,0.04);
          box-shadow: 0 30px 80px rgba(0,0,0,0.28);
          padding: 30px;
        }

        .meine-empty {
          max-width: 900px;
        }

        .meine-empty span,
        .meine-contact-box > span {
          color: rgba(245,248,255,0.52);
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .meine-empty h2 {
          margin-top: 10px;
          color: white;
          font-size: clamp(2rem, 4vw, 4rem);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .meine-empty p {
          margin-top: 16px;
          margin-bottom: 22px;
          color: rgba(245,248,255,0.66);
          font-size: 1.1rem;
          line-height: 1.65;
        }

        .meine-card-top {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: start;
        }

        .meine-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .meine-badges span {
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(245,248,255,0.82);
          padding: 7px 11px;
          font-size: 0.8rem;
          font-weight: 900;
        }

        .meine-card h2 {
          color: white;
          font-size: clamp(1.7rem, 3vw, 3rem);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .meine-card p {
          margin-top: 12px;
          color: rgba(245,248,255,0.62);
          line-height: 1.6;
          max-width: 760px;
        }

        .meine-price {
          text-align: right;
          min-width: 110px;
        }

        .meine-price span,
        .meine-price small {
          display: block;
          color: rgba(245,248,255,0.5);
          font-weight: 800;
        }

        .meine-price strong {
          display: block;
          color: white;
          font-size: 2.2rem;
          line-height: 1;
          margin: 6px 0;
        }

        .meine-contact-box {
          margin-top: 24px;
          border-radius: 26px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(4,8,20,0.46);
          padding: 22px;
        }

        .meine-contact-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 16px;
        }

        .meine-contact-grid div {
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
          padding: 16px;
          min-width: 0;
        }

        .meine-contact-grid small {
          display: block;
          color: rgba(245,248,255,0.45);
          font-weight: 800;
          margin-bottom: 8px;
        }

        .meine-contact-grid strong {
          display: block;
          color: white;
          font-size: 1rem;
          word-break: break-word;
        }

        @media (max-width: 1000px) {
          .meine-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .meine-card-top,
          .meine-contact-grid {
            grid-template-columns: 1fr;
          }

          .meine-price {
            text-align: left;
          }
        }

        @media (max-width: 640px) {
          .meine-hero {
            padding-top: 46px;
          }

          .meine-stats-grid {
            grid-template-columns: 1fr;
          }

          .meine-card,
          .meine-empty {
            padding: 22px;
            border-radius: 26px;
          }
        }
      `}</style>
    </main>
  );
}