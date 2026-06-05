import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

function getMessage(message?: string) {
  switch (message) {
    case "purchased":
      return "Lead erfolgreich gekauft. Die Kontaktdaten sind jetzt freigeschaltet.";
    case "already-bought":
      return "Dieser Lead wurde bereits gekauft und ist schon freigeschaltet.";
    default:
      return "";
  }
}

export default async function MeineLeadsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;
  const infoMessage = getMessage(params?.message);

  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
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

  if (!provider) {
    redirect("/login");
  }

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
            <Link href="/portal/leads" className="btn btn-primary">
              Neue Leads kaufen
            </Link>

            <Link href="/portal" className="btn btn-secondary">
              Dashboard
            </Link>
          </div>

          {infoMessage ? (
            <div className="meine-success">{infoMessage}</div>
          ) : null}

          <div className="meine-stats-grid">
            <div className="meine-stat-card">
              <strong>{provider.purchases.length}</strong>
              <span>Gekaufte Leads</span>
            </div>

            <div className="meine-stat-card">
              <strong>{provider.credits}</strong>
              <span>Verfügbare Credits</span>
            </div>

            <div className="meine-stat-card">
              <strong>{provider.companyName}</strong>
              <span>Firma</span>
            </div>

            <div className="meine-stat-card">
              <strong>{provider.region || "—"}</strong>
              <span>Region</span>
            </div>
          </div>
        </div>
      </section>

      <section className="meine-section">
        <div className="container">
          {provider.purchases.length === 0 ? (
            <div className="meine-empty">
              <span>Noch keine Käufe</span>

              <h2>Du hast noch keine Leads freigeschaltet.</h2>

              <p>
                Kaufe deinen ersten Lead, damit die Kontaktdaten hier
                erscheinen.
              </p>

              <Link href="/portal/leads" className="btn btn-primary">
                Leads ansehen
              </Link>
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
    </main>
  );
}