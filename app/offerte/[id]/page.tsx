import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuoteDecisionClient from "./QuoteDecisionClient";

const money = (cents: number) =>
  new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
  }).format(cents / 100);

export default async function PublicQuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const quote = await prisma.businessQuote.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!quote) notFound();

  const provider = await prisma.provider.findUnique({
    where: {
      id: quote.providerId,
    },
    select: {
      companyName: true,
      contactName: true,
      email: true,
      phone: true,
      website: true,
      address: true,
      postalCode: true,
      city: true,
      logoUrl: true,
    },
  });

  const providerName =
    provider?.companyName ||
    provider?.contactName ||
    "Ihr Dienstleister";

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 15% 10%, rgba(56,189,248,.16), transparent 30%), radial-gradient(circle at 85% 20%, rgba(124,58,237,.22), transparent 35%), linear-gradient(180deg,#020617,#071426 55%,#020617)",
        color: "#f8fafc",
        padding: "48px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 34,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(125,211,252,.18)",
              background: "rgba(14,165,233,.08)",
              color: "#7dd3fc",
              fontWeight: 900,
              fontSize: 12,
              letterSpacing: ".08em",
            }}
          >
            AUFTRAGO DIGITAL OFFER
          </div>

          <h1
            style={{
              fontSize: "clamp(38px,6vw,72px)",
              lineHeight: 1,
              margin: "20px 0 12px",
              letterSpacing: "-.04em",
            }}
          >
            {quote.title}
          </h1>

          <div
            style={{
              color: "#94a3b8",
              fontSize: 16,
            }}
          >
            Offerte {quote.quoteNumber}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginTop: 16,
              padding: "10px 15px",
              borderRadius: 999,
              background: "rgba(15,23,42,.58)",
              border: "1px solid rgba(148,163,184,.12)",
              color: "#cbd5e1",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            Erstellt von {providerName}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1fr) minmax(300px,380px)",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 18 }}>
            <section
              style={{
                ...card,
                background:
                  "linear-gradient(135deg,rgba(14,165,233,.08),rgba(124,58,237,.09),rgba(15,23,42,.78))",
                boxShadow:
                  "0 24px 70px rgba(2,6,23,.22)",
              }}
            >
              <div style={label}>ANBIETER</div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 12,
                }}
              >
                {provider?.logoUrl ? (
                  <img
                    src={provider.logoUrl}
                    alt={providerName}
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 16,
                      objectFit: "cover",
                      border:
                        "1px solid rgba(125,211,252,.20)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 16,
                      display: "grid",
                      placeItems: "center",
                      background:
                        "linear-gradient(135deg,#0ea5e9,#7c3aed)",
                      fontSize: 24,
                      fontWeight: 950,
                      boxShadow:
                        "0 10px 30px rgba(14,165,233,.18)",
                    }}
                  >
                    {providerName.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 950,
                    }}
                  >
                    {providerName}
                  </div>

                  <div
                    style={{
                      color: "#94a3b8",
                      marginTop: 4,
                      lineHeight: 1.6,
                    }}
                  >
                    {[provider?.address,
                      [provider?.postalCode, provider?.city]
                        .filter(Boolean)
                        .join(" ")]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 18,
                  color: "#94a3b8",
                  fontSize: 13,
                }}
              >
                {provider?.email && (
                  <span>✉ {provider.email}</span>
                )}

                {provider?.phone && (
                  <span>☎ {provider.phone}</span>
                )}

                {provider?.website && (
                  <span>⌁ {provider.website}</span>
                )}
              </div>
            </section>

            <section style={card}>
              <div style={label}>KUNDE</div>

              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  marginTop: 8,
                }}
              >
                {quote.customerName || "Kunde"}
              </div>

              {quote.customerEmail && (
                <div
                  style={{
                    color: "#94a3b8",
                    marginTop: 4,
                  }}
                >
                  {quote.customerEmail}
                </div>
              )}
            </section>

            <section style={card}>
              <div style={label}>LEISTUNGEN</div>

              <div
                style={{
                  display: "grid",
                  gap: 0,
                  marginTop: 10,
                }}
              >
                {quote.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr auto",
                      gap: 18,
                      padding: "18px 0",
                      borderBottom:
                        "1px solid rgba(148,163,184,.10)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 850,
                          fontSize: 17,
                        }}
                      >
                        {item.description}
                      </div>

                      <div
                        style={{
                          color: "#64748b",
                          fontSize: 13,
                          marginTop: 5,
                        }}
                      >
                        {item.quantity} × {item.unit}
                      </div>
                    </div>

                    <div
                      style={{
                        fontWeight: 900,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {money(item.totalCents)}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {quote.notes && (
              <section style={card}>
                <div style={label}>
                  BEMERKUNG / KONDITIONEN
                </div>

                <div
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    marginTop: 8,
                  }}
                >
                  {quote.notes}
                </div>
              </section>
            )}
          </div>

          <aside
            style={{
              ...card,
              position: "sticky",
              top: 24,
              background:
                "linear-gradient(145deg,rgba(15,23,42,.96),rgba(30,27,75,.82))",
              boxShadow:
                "0 30px 80px rgba(2,6,23,.45), 0 0 40px rgba(124,58,237,.08)",
            }}
          >
            <div style={label}>OFFERTENÜBERSICHT</div>

            <div style={row}>
              <span>Zwischensumme</span>
              <strong>
                {money(quote.subtotalCents)}
              </strong>
            </div>

            {quote.discountCents > 0 && (
              <div style={row}>
                <span>Rabatt</span>
                <strong>
                  - {money(quote.discountCents)}
                </strong>
              </div>
            )}

            <div style={row}>
              <span>MWST</span>
              <strong>
                {money(quote.vatCents)}
              </strong>
            </div>

            <div
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTop:
                  "1px solid rgba(148,163,184,.14)",
              }}
            >
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 12,
                  fontWeight: 900,
                }}
              >
                TOTAL
              </div>

              <div
                style={{
                  fontSize: 38,
                  fontWeight: 950,
                  marginTop: 6,
                  background:
                    "linear-gradient(90deg,#38bdf8,#a78bfa)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {money(quote.totalCents)}
              </div>
            </div>

            {quote.validUntil && (
              <div
                style={{
                  marginTop: 20,
                  padding: 15,
                  borderRadius: 14,
                  background: "rgba(56,189,248,.06)",
                  border:
                    "1px solid rgba(56,189,248,.14)",
                }}
              >
                <div
                  style={{
                    color: "#7dd3fc",
                    fontSize: 10,
                    fontWeight: 950,
                    letterSpacing: ".08em",
                  }}
                >
                  GÜLTIG BIS
                </div>

                <div
                  style={{
                    fontWeight: 900,
                    marginTop: 5,
                  }}
                >
                  {new Intl.DateTimeFormat("de-CH", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }).format(quote.validUntil)}
                </div>
              </div>
            )}

            <QuoteDecisionClient
              quoteId={quote.id}
              initialStatus={quote.status}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

const card = {
  padding: 24,
  borderRadius: 22,
  border: "1px solid rgba(148,163,184,.14)",
  background: "rgba(15,23,42,.74)",
  backdropFilter: "blur(18px)",
} as const;

const label = {
  color: "#7dd3fc",
  fontSize: 11,
  fontWeight: 950,
  letterSpacing: ".08em",
} as const;

const row = {
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  marginTop: 16,
  color: "#cbd5e1",
} as const;
