import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  archiveLeadAction,
  duplicateLeadAction,
  extendLeadAction,
  updateLeadAction,
} from "../actions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    message?: string;
    error?: string;
  }>;
};

const regions = [
  "Aargau",
  "Zürich",
  "Bern",
  "Luzern",
  "Basel",
  "Solothurn",
  "Zug",
  "St. Gallen",
];

const categories = [
  "Hauswartung",
  "Reinigung",
  "Fensterreinigung",
  "Gartenpflege",
  "Maler",
  "Gipser",
  "Sanitär",
  "Elektriker",
  "Umzug",
  "Entsorgung",
];

function getMessage(message?: string) {
  switch (message) {
    case "updated":
      return "Lead wurde erfolgreich aktualisiert.";
    case "duplicated":
      return "Lead wurde erfolgreich dupliziert.";
    case "extended":
      return "Lead wurde erfolgreich um 7 Tage verlängert.";
    default:
      return "";
  }
}

function getError(error?: string) {
  switch (error) {
    case "missing-fields":
      return "Bitte alle Pflichtfelder vollständig ausfüllen.";
    case "invalid-price":
      return "Der Leadpreis muss mindestens 1 Credit betragen.";
    case "invalid-max-purchases":
      return "Die maximale Anzahl Käufer muss mindestens 1 betragen.";
    case "invalid-expiry":
      return "Bitte ein gültiges Ablaufdatum angeben.";
    case "max-purchases-below-sales":
      return "Das Kauflimit darf nicht kleiner als die bisherigen Verkäufe sein.";
    case "invalid-lead":
      return "Der Lead wurde nicht gefunden.";
    default:
      return "";
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function toDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getCountdown(expiresAt: Date) {
  const difference = expiresAt.getTime() - Date.now();

  if (difference <= 0) {
    return "Abgelaufen";
  }

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return days === 1 ? "Noch 1 Tag" : `Noch ${days} Tage`;
  }

  if (hours >= 1) {
    return hours === 1 ? "Noch 1 Stunde" : `Noch ${hours} Stunden`;
  }

  return minutes <= 1 ? "Weniger als 1 Minute" : `Noch ${minutes} Minuten`;
}

function getLeadStatus({
  expiresAt,
  purchaseCount,
  maxPurchases,
}: {
  expiresAt: Date;
  purchaseCount: number;
  maxPurchases: number;
}) {
  const now = Date.now();
  const remainingTime = expiresAt.getTime() - now;
  const oneDay = 24 * 60 * 60 * 1000;

  if (purchaseCount >= maxPurchases) {
    return {
      label: "Ausverkauft",
      color: "#e5e7eb",
      background: "rgba(148,163,184,0.14)",
      border: "rgba(148,163,184,0.28)",
    };
  }

  if (remainingTime <= 0) {
    return {
      label: "Abgelaufen",
      color: "#fecaca",
      background: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.28)",
    };
  }

  if (remainingTime <= oneDay) {
    return {
      label: "Läuft bald ab",
      color: "#fde68a",
      background: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.28)",
    };
  }

  return {
    label: "Aktiv",
    color: "#bbf7d0",
    background: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.28)",
  };
}

export default async function AdminLeadDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : undefined;

  const lead = await prisma.lead.findUnique({
    where: {
      id,
    },
    include: {
      purchases: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          price: true,
          status: true,
          createdAt: true,
          provider: {
            select: {
              id: true,
              companyName: true,
              contactName: true,
              email: true,
              phone: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!lead) {
    notFound();
  }

  const successMessage = getMessage(query?.message);
  const errorMessage = getError(query?.error);

  const expiresAt =
    lead.expiresAt ??
    new Date(lead.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);

  const maxPurchases =
    Number.isInteger(lead.maxPurchases) && lead.maxPurchases > 0
      ? lead.maxPurchases
      : 4;

  const purchaseCount = lead.purchases.length;
  const remainingSlots = Math.max(0, maxPurchases - purchaseCount);
  const totalCreditRevenue = lead.purchases.reduce(
    (sum, purchase) => sum + purchase.price,
    0
  );

  const progress = Math.min(
    100,
    Math.round((purchaseCount / maxPurchases) * 100)
  );

  const status = getLeadStatus({
    expiresAt,
    purchaseCount,
    maxPurchases,
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 0 72px",
        background:
          "radial-gradient(circle at 10% 0%, rgba(14,165,233,0.18), transparent 32%), radial-gradient(circle at 88% 6%, rgba(99,102,241,0.22), transparent 34%), #071426",
      }}
    >
      <div className="container">
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Link
              href="/admin/leads"
              style={{
                color: "#93c5fd",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              ← Zurück zur Lead-Zentrale
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 20,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  padding: "9px 13px",
                  borderRadius: 999,
                  border: `1px solid ${status.border}`,
                  background: status.background,
                  color: status.color,
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: ".08em",
                }}
              >
                {status.label.toUpperCase()}
              </span>

              {remainingSlots === 1 ? (
                <span
                  style={{
                    display: "inline-flex",
                    padding: "9px 13px",
                    borderRadius: 999,
                    border: "1px solid rgba(249,115,22,0.35)",
                    background: "rgba(249,115,22,0.13)",
                    color: "#fed7aa",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  🔥 LETZTER PLATZ
                </span>
              ) : null}
            </div>

            <h1
              style={{
                margin: "17px 0 0",
                fontSize: "clamp(36px, 5vw, 66px)",
                lineHeight: 1,
                letterSpacing: "-.045em",
              }}
            >
              {lead.title}
            </h1>

            <p
              style={{
                margin: "14px 0 0",
                opacity: 0.58,
                fontSize: 16,
              }}
            >
              Lead bearbeiten, verlängern, duplizieren oder archivieren.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <form action={extendLeadAction}>
              <input type="hidden" name="leadId" value={lead.id} />
              <button type="submit" className="btn btn-secondary">
                + 7 Tage verlängern
              </button>
            </form>

            <form action={duplicateLeadAction}>
              <input type="hidden" name="leadId" value={lead.id} />
              <button type="submit" className="btn btn-secondary">
                Lead duplizieren
              </button>
            </form>
          </div>
        </header>

        {successMessage ? (
          <div
            style={{
              marginTop: 24,
              padding: "16px 18px",
              borderRadius: 18,
              border: "1px solid rgba(34,197,94,0.28)",
              background: "rgba(34,197,94,0.12)",
              color: "#bbf7d0",
              fontWeight: 800,
            }}
          >
            ✓ {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div
            style={{
              marginTop: 24,
              padding: "16px 18px",
              borderRadius: 18,
              border: "1px solid rgba(239,68,68,0.28)",
              background: "rgba(239,68,68,0.12)",
              color: "#fecaca",
              fontWeight: 800,
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginTop: 30,
          }}
        >
          {[
            ["STATUS", status.label, getCountdown(expiresAt)],
            [
              "VERKÄUFE",
              `${purchaseCount} / ${maxPurchases}`,
              remainingSlots === 0
                ? "Keine Plätze mehr frei"
                : `${remainingSlots} Plätze frei`,
            ],
            ["LEADPREIS", lead.price, "Credits pro Freischaltung"],
            ["CREDITS-UMSATZ", totalCreditRevenue, "Bisheriger Gesamtumsatz"],
            ["ERSTELLT", formatDate(lead.createdAt), "Erstellungsdatum"],
            ["ABLAUF", formatDateTime(expiresAt), getCountdown(expiresAt)],
          ].map(([label, value, sub]) => (
            <div
              key={String(label)}
              style={{
                minHeight: 142,
                padding: 22,
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.10)",
                background:
                  "radial-gradient(circle at 100% 100%, rgba(255,255,255,0.08), transparent 34%), linear-gradient(135deg, rgba(20,38,64,0.96), rgba(37,45,92,0.82))",
                boxShadow: "0 22px 55px rgba(0,0,0,0.22)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: ".12em",
                  opacity: 0.55,
                }}
              >
                {label}
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: 20,
                  fontSize: 28,
                  lineHeight: 1.05,
                }}
              >
                {value}
              </strong>

              <small
                style={{
                  display: "block",
                  marginTop: 12,
                  opacity: 0.48,
                }}
              >
                {sub}
              </small>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 22,
            padding: 22,
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(10,23,43,0.78)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: ".12em",
                  opacity: 0.48,
                }}
              >
                VERKAUFSFORTSCHRITT
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: 8,
                  fontSize: 20,
                }}
              >
                {purchaseCount} von {maxPurchases} Plätzen verkauft
              </strong>
            </div>

            <strong
              style={{
                color: remainingSlots === 1 ? "#fdba74" : "#c4b5fd",
              }}
            >
              {progress} %
            </strong>
          </div>

          <div
            style={{
              height: 12,
              marginTop: 18,
              borderRadius: 999,
              overflow: "hidden",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  remainingSlots === 0
                    ? "linear-gradient(90deg, #94a3b8, #e2e8f0)"
                    : remainingSlots === 1
                      ? "linear-gradient(90deg, #f97316, #facc15)"
                      : "linear-gradient(90deg, #0ea5e9, #6366f1)",
                transition: "width .3s ease",
              }}
            />
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.5fr) minmax(320px, .8fr)",
            gap: 22,
            marginTop: 24,
            alignItems: "start",
          }}
        >
          <section
            style={{
              padding: 28,
              borderRadius: 30,
              border: "1px solid rgba(255,255,255,0.10)",
              background:
                "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 34%), linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,80,0.90))",
              boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: ".12em",
                color: "#c4b5fd",
              }}
            >
              LEAD BEARBEITEN
            </span>

            <h2
              style={{
                margin: "8px 0 0",
                fontSize: 30,
              }}
            >
              Angaben aktualisieren
            </h2>

            <form
              action={updateLeadAction}
              style={{
                display: "grid",
                gap: 15,
                marginTop: 24,
              }}
            >
              <input type="hidden" name="leadId" value={lead.id} />

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>
                  Titel
                </span>
                <input
                  name="title"
                  defaultValue={lead.title}
                  placeholder="Titel des Leads"
                  required
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>
                  Beschreibung
                </span>
                <textarea
                  name="description"
                  defaultValue={lead.description}
                  placeholder="Beschreibung des Auftrags"
                  required
                  style={{
                    minHeight: 170,
                    resize: "vertical",
                  }}
                />
              </label>

              <div className="form-row">
                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Kundenname
                  </span>
                  <input
                    name="name"
                    defaultValue={lead.name}
                    required
                  />
                </label>

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Telefonnummer
                  </span>
                  <input
                    name="phone"
                    defaultValue={lead.phone}
                    required
                  />
                </label>
              </div>

              <label style={{ display: "grid", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800 }}>
                  E-Mail-Adresse
                </span>
                <input
                  name="email"
                  type="email"
                  defaultValue={lead.email}
                  required
                />
              </label>

              <div className="form-row">
                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Postleitzahl
                  </span>
                  <input
                    name="postalCode"
                    defaultValue={lead.postalCode ?? ""}
                    placeholder="z. B. 8001"
                  />
                </label>

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Ort
                  </span>
                  <input
                    name="city"
                    defaultValue={lead.city ?? ""}
                    placeholder="z. B. Zürich"
                  />
                </label>
              </div>

              <div className="form-row">
                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Region
                  </span>
                  <select
                    name="region"
                    defaultValue={lead.region}
                    required
                  >
                    {!regions.includes(lead.region) ? (
                      <option value={lead.region}>{lead.region}</option>
                    ) : null}

                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Kategorie
                  </span>
                  <select
                    name="category"
                    defaultValue={lead.category}
                    required
                  >
                    {!categories.includes(lead.category) ? (
                      <option value={lead.category}>{lead.category}</option>
                    ) : null}

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: 14,
                }}
              >
                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Preis in Credits
                  </span>
                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={lead.price}
                    required
                  />
                </label>

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Max. Käufer
                  </span>
                  <input
                    name="maxPurchases"
                    type="number"
                    min={Math.max(1, purchaseCount)}
                    step="1"
                    defaultValue={maxPurchases}
                    required
                  />
                </label>

                <label style={{ display: "grid", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800 }}>
                    Ablaufdatum
                  </span>
                  <input
                    name="expiresAt"
                    type="datetime-local"
                    defaultValue={toDateTimeLocal(expiresAt)}
                    required
                  />
                </label>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 18,
                  border: "1px solid rgba(56,189,248,0.18)",
                  background: "rgba(14,165,233,0.08)",
                  color: "#bae6fd",
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                Das Kauflimit kann nicht unter die bisherige Anzahl Verkäufe
                gesetzt werden. Aktuell wurden {purchaseCount} Freischaltungen
                verkauft.
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  marginTop: 4,
                }}
              >
                Änderungen speichern
              </button>
            </form>
          </section>

          <aside
            style={{
              display: "grid",
              gap: 20,
            }}
          >
            <section
              style={{
                padding: 24,
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(10,23,43,0.84)",
                boxShadow: "0 24px 65px rgba(0,0,0,0.22)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: ".12em",
                  opacity: 0.48,
                }}
              >
                KÄUFER
              </span>

              <h2
                style={{
                  margin: "8px 0 0",
                  fontSize: 25,
                }}
              >
                {purchaseCount} Freischaltungen
              </h2>

              {lead.purchases.length === 0 ? (
                <div
                  style={{
                    marginTop: 18,
                    padding: 18,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.045)",
                    color: "rgba(255,255,255,0.58)",
                    fontSize: 14,
                  }}
                >
                  Dieser Lead wurde noch von keinem Anbieter gekauft.
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: 11,
                    marginTop: 18,
                  }}
                >
                  {lead.purchases.map((purchase) => (
                    <div
                      key={purchase.id}
                      style={{
                        padding: 16,
                        borderRadius: 17,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.045)",
                      }}
                    >
                      <strong
                        style={{
                          display: "block",
                          fontSize: 15,
                        }}
                      >
                        {purchase.provider.companyName}
                      </strong>

                      <span
                        style={{
                          display: "block",
                          marginTop: 5,
                          fontSize: 13,
                          opacity: 0.64,
                        }}
                      >
                        {purchase.provider.contactName}
                      </span>

                      <div
                        style={{
                          display: "grid",
                          gap: 4,
                          marginTop: 12,
                          fontSize: 12,
                          opacity: 0.52,
                        }}
                      >
                        <span>{purchase.provider.email}</span>

                        {purchase.provider.phone ? (
                          <span>{purchase.provider.phone}</span>
                        ) : null}

                        <span>
                          Gekauft: {formatDateTime(purchase.createdAt)}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          marginTop: 13,
                          paddingTop: 12,
                          borderTop: "1px solid rgba(255,255,255,0.07)",
                          fontSize: 13,
                        }}
                      >
                        <span style={{ opacity: 0.55 }}>
                          {purchase.status}
                        </span>

                        <strong style={{ color: "#fde68a" }}>
                          {purchase.price} Credits
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section
              style={{
                padding: 24,
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(10,23,43,0.84)",
                boxShadow: "0 24px 65px rgba(0,0,0,0.22)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: ".12em",
                  opacity: 0.48,
                }}
              >
                SCHNELLAKTIONEN
              </span>

              <div
                style={{
                  display: "grid",
                  gap: 10,
                  marginTop: 17,
                }}
              >
                <form action={extendLeadAction}>
                  <input type="hidden" name="leadId" value={lead.id} />

                  <button
                    type="submit"
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                  >
                    Ablauf um 7 Tage verlängern
                  </button>
                </form>

                <form action={duplicateLeadAction}>
                  <input type="hidden" name="leadId" value={lead.id} />

                  <button
                    type="submit"
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                  >
                    Lead duplizieren
                  </button>
                </form>

                <form action={archiveLeadAction}>
                  <input type="hidden" name="leadId" value={lead.id} />

                  <button
                    type="submit"
                    className="btn btn-secondary"
                    style={{
                      width: "100%",
                      borderColor: "rgba(245,158,11,0.32)",
                      color: "#fde68a",
                    }}
                  >
                    Lead archivieren
                  </button>
                </form>
              </div>

              <p
                style={{
                  margin: "16px 0 0",
                  opacity: 0.46,
                  fontSize: 12,
                  lineHeight: 1.55,
                }}
              >
                Beim Archivieren wird das Ablaufdatum auf jetzt gesetzt. Der
                Lead bleibt mit seiner Kaufhistorie im Adminbereich erhalten,
                kann von Anbietern aber nicht mehr gekauft werden.
              </p>
            </section>

            <section
              style={{
                padding: 24,
                borderRadius: 26,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(10,23,43,0.84)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: ".12em",
                  opacity: 0.48,
                }}
              >
                LEAD-INFORMATIONEN
              </span>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                  marginTop: 17,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <span style={{ opacity: 0.48 }}>Lead-ID</span>
                  <strong
                    style={{
                      maxWidth: 190,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {lead.id}
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <span style={{ opacity: 0.48 }}>Erstellt</span>
                  <strong>{formatDateTime(lead.createdAt)}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <span style={{ opacity: 0.48 }}>Aktualisiert</span>
                  <strong>{formatDateTime(lead.updatedAt)}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <span style={{ opacity: 0.48 }}>Region</span>
                  <strong>{lead.region}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <span style={{ opacity: 0.48 }}>Kategorie</span>
                  <strong>{lead.category}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <span style={{ opacity: 0.48 }}>Ablauf</span>
                  <strong>{formatDateTime(expiresAt)}</strong>
                </div>
              </div>
            </section>
          </aside>
        </div>

        <style>{`
          @media (max-width: 980px) {
            main .container > div[style*="grid-template-columns: minmax(0, 1.5fr)"] {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 720px) {
            .form-row {
              grid-template-columns: 1fr !important;
            }

            main form > div[style*="repeat(3, minmax(0, 1fr))"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </main>
  );
}