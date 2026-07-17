import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createLeadAction, deleteLeadAction } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
    q?: string;
    region?: string;
    category?: string;
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
    case "created":
      return "Lead wurde erfolgreich erstellt.";
    case "deleted":
      return "Lead wurde erfolgreich gelöscht.";
    default:
      return "";
  }
}

function getError(error?: string) {
  switch (error) {
    case "missing-fields":
      return "Bitte alle Pflichtfelder ausfüllen.";
    case "invalid-price":
      return "Der Leadpreis muss mindestens 1 Credit betragen.";
    case "invalid-value":
      return "Der geschätzte Auftragswert muss mindestens CHF 1 betragen.";
    case "invalid-lead":
      return "Der Lead konnte nicht gefunden werden.";
    default:
      return "";
  }
}

function shortText(text: string | null, maxLength = 105) {
  if (!text) return "Keine Beschreibung vorhanden.";

  const cleaned = text
    .replace(/\s+/g, " ")
    .replaceAll("Nicht angegeben", "")
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength)}...`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;

  const successMessage = getMessage(params?.message);
  const errorMessage = getError(params?.error);
  const q = String(params?.q || "").trim();
  const regionFilter = String(params?.region || "ALL").trim();
  const categoryFilter = String(params?.category || "ALL").trim();

  const [leads, allLeads] = await Promise.all([
    prisma.lead.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                  { name: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                  { phone: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          regionFilter !== "ALL" ? { region: regionFilter } : {},
          categoryFilter !== "ALL" ? { category: categoryFilter } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        purchases: {
          select: {
            id: true,
            price: true,
            createdAt: true,
            provider: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        purchases: {
          select: {
            id: true,
            price: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  const now = Date.now();
  const last24Hours = now - 24 * 60 * 60 * 1000;
  const last7Days = now - 7 * 24 * 60 * 60 * 1000;

  const totalLeads = allLeads.length;
  const leadsLast24Hours = allLeads.filter(
    (lead) => lead.createdAt.getTime() >= last24Hours
  ).length;
  const leadsLast7Days = allLeads.filter(
    (lead) => lead.createdAt.getTime() >= last7Days
  ).length;
  const totalPurchases = allLeads.reduce(
    (sum, lead) => sum + lead.purchases.length,
    0
  );
  const totalCreditsUsed = allLeads.reduce(
    (sum, lead) =>
      sum + lead.purchases.reduce((purchaseSum, purchase) => purchaseSum + purchase.price, 0),
    0
  );
  const soldLeadCount = allLeads.filter((lead) => lead.purchases.length > 0).length;
  const conversionRate = totalLeads > 0 ? Math.round((soldLeadCount / totalLeads) * 100) : 0;
  const averageLeadPrice = totalLeads > 0
    ? Math.round(allLeads.reduce((sum, lead) => sum + lead.price, 0) / totalLeads)
    : 0;

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "10px 14px",
                borderRadius: 999,
                border: "1px solid rgba(56,189,248,0.35)",
                background: "rgba(14,165,233,0.10)",
                color: "#c4b5fd",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: ".14em",
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  background: "#22c55e",
                  boxShadow: "0 0 18px rgba(34,197,94,0.8)",
                }}
              />
              AUFTRAGO ADMINISTRATION
            </span>

            <h1
              style={{
                margin: "18px 0 0",
                fontSize: "clamp(42px, 6vw, 76px)",
                lineHeight: 0.98,
                letterSpacing: "-.055em",
              }}
            >
              Lead-Zentrale.
            </h1>

            <p style={{ margin: "18px 0 0", opacity: 0.68, fontSize: 18 }}>
              Kundenanfragen erfassen, filtern und verkaufen — kompakt wie in einem modernen CRM.
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/admin" className="btn btn-secondary">
              ← Dashboard
            </Link>
            <Link href="/admin/providers" className="btn btn-secondary">
              Anbieter verwalten
            </Link>
            <a href="#new-lead" className="btn btn-primary">
              + Neuer Lead
            </a>
          </div>
        </div>

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
            marginTop: 34,
          }}
        >
          {[
            ["LEADS", totalLeads, `+${leadsLast24Hours} in 24 Stunden`],
            ["NEU 7 TAGE", leadsLast7Days, "Aktuelle Nachfrage"],
            ["VERKÄUFE", totalPurchases, `${soldLeadCount} Leads verkauft`],
            ["CONVERSION", `${conversionRate}%`, "Leads mit mindestens 1 Kauf"],
            ["CREDITS", totalCreditsUsed, "Insgesamt eingesetzt"],
            ["Ø LEADPREIS", averageLeadPrice, "Credits pro Lead"],
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
              <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: ".12em", opacity: 0.55 }}>
                {label}
              </span>
              <strong style={{ display: "block", marginTop: 20, fontSize: 36, lineHeight: 1 }}>
                {value}
              </strong>
              <small style={{ display: "block", marginTop: 12, opacity: 0.48 }}>
                {sub}
              </small>
            </div>
          ))}
        </section>

        <section
          style={{
            marginTop: 26,
            padding: 18,
            borderRadius: 26,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(10,23,43,0.78)",
            boxShadow: "0 24px 65px rgba(0,0,0,0.24)",
          }}
        >
          <form
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(260px, 1fr) 190px 210px auto auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <input
              name="q"
              defaultValue={q}
              placeholder="Titel, Kunde, E-Mail, Telefon oder Beschreibung suchen ..."
            />
            <select name="region" defaultValue={regionFilter}>
              <option value="ALL">Alle Regionen</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <select name="category" defaultValue={categoryFilter}>
              <option value="ALL">Alle Kategorien</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">
              Suchen
            </button>
            <Link href="/admin/leads" className="btn btn-secondary">
              Zurücksetzen
            </Link>
          </form>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            margin: "28px 2px 12px",
            opacity: 0.62,
            fontSize: 14,
          }}
        >
          <span>{leads.length} Leads angezeigt</span>
          <span>Sortiert nach neuestem Eintrag</span>
        </div>

        <section
          style={{
            overflowX: "auto",
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(7,20,38,0.82)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.28)",
          }}
        >
          {leads.length === 0 ? (
            <div style={{ padding: 42, textAlign: "center" }}>
              <strong style={{ fontSize: 22 }}>Keine Leads gefunden</strong>
              <p style={{ opacity: 0.58 }}>Passe die Suche oder die Filter an.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1120 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {[
                    "LEAD",
                    "REGION / KATEGORIE",
                    "PREIS",
                    "KÄUFE",
                    "CREDITS-UMSATZ",
                    "ERSTELLT",
                    "AKTIONEN",
                  ].map((head) => (
                    <th
                      key={head}
                      style={{
                        padding: "18px 16px",
                        fontSize: 11,
                        letterSpacing: ".12em",
                        opacity: 0.48,
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const creditRevenue = lead.purchases.reduce(
                    (sum, purchase) => sum + purchase.price,
                    0
                  );

                  return (
                    <tr
                      key={lead.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <td style={{ padding: "18px 16px", verticalAlign: "top" }}>
                        <div style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              flex: "0 0 44px",
                              borderRadius: 14,
                              display: "grid",
                              placeItems: "center",
                              background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                              fontWeight: 900,
                            }}
                          >
                            L
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <strong style={{ display: "block", fontSize: 16 }}>{lead.title}</strong>
                            <span style={{ display: "block", marginTop: 5, opacity: 0.58, fontSize: 13 }}>
                              {lead.name} · {lead.email}
                            </span>
                            <span style={{ display: "block", marginTop: 5, opacity: 0.45, fontSize: 12 }}>
                              {shortText(lead.description)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "18px 16px", verticalAlign: "top" }}>
                        <strong style={{ display: "block", fontSize: 14 }}>{lead.region}</strong>
                        <span style={{ display: "block", marginTop: 6, opacity: 0.52, fontSize: 13 }}>
                          {lead.category}
                        </span>
                      </td>
                      <td style={{ padding: "18px 16px", verticalAlign: "top" }}>
                        <span style={{ color: "#fde68a", fontWeight: 900 }}>{lead.price}</span>
                        <span style={{ display: "block", opacity: 0.45, fontSize: 12 }}>Credits</span>
                      </td>
                      <td style={{ padding: "18px 16px", verticalAlign: "top", fontWeight: 900 }}>
                        {lead.purchases.length}
                      </td>
                      <td style={{ padding: "18px 16px", verticalAlign: "top", fontWeight: 900 }}>
                        {creditRevenue}
                      </td>
                      <td style={{ padding: "18px 16px", verticalAlign: "top", opacity: 0.62 }}>
                        {formatDate(lead.createdAt)}
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                        <details>
                          <summary
                            style={{
                              cursor: "pointer",
                              listStyle: "none",
                              display: "inline-flex",
                              padding: "10px 13px",
                              borderRadius: 13,
                              border: "1px solid rgba(255,255,255,0.12)",
                              background: "rgba(255,255,255,0.05)",
                              fontWeight: 800,
                            }}
                          >
                            Details
                          </summary>

                          <div
                            style={{
                              marginTop: 12,
                              width: 340,
                              padding: 18,
                              borderRadius: 18,
                              border: "1px solid rgba(255,255,255,0.10)",
                              background: "#0d1b30",
                              boxShadow: "0 22px 50px rgba(0,0,0,0.35)",
                            }}
                          >
                            <strong>{lead.title}</strong>
                            <p style={{ margin: "10px 0", opacity: 0.65, fontSize: 13 }}>
                              {lead.description || "Keine Beschreibung vorhanden."}
                            </p>
                            <div style={{ display: "grid", gap: 7, fontSize: 13, opacity: 0.72 }}>
                              <span>Telefon: {lead.phone}</span>
                              <span>E-Mail: {lead.email}</span>
                              <span>Kunde: {lead.name}</span>
                            </div>

                            {lead.purchases.length > 0 ? (
                              <div style={{ marginTop: 16 }}>
                                <span style={{ fontSize: 11, fontWeight: 900, opacity: 0.5 }}>
                                  GEKAUFT VON
                                </span>
                                <div style={{ display: "grid", gap: 7, marginTop: 9 }}>
                                  {lead.purchases.map((purchase) => (
                                    <div
                                      key={purchase.id}
                                      style={{
                                        padding: 10,
                                        borderRadius: 12,
                                        background: "rgba(255,255,255,0.05)",
                                        fontSize: 13,
                                      }}
                                    >
                                      {purchase.provider.companyName} · {purchase.price} Credits
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            <form action={deleteLeadAction} style={{ marginTop: 16 }}>
                              <input type="hidden" name="leadId" value={lead.id} />
                              <button
                                type="submit"
                                className="btn btn-secondary"
                                style={{
                                  width: "100%",
                                  borderColor: "rgba(239,68,68,0.32)",
                                  color: "#fecaca",
                                }}
                              >
                                Lead löschen
                              </button>
                            </form>
                          </div>
                        </details>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <section
          id="new-lead"
          style={{
            marginTop: 34,
            padding: "28px",
            borderRadius: 30,
            border: "1px solid rgba(255,255,255,0.10)",
            background:
              "radial-gradient(circle at top left, rgba(56,189,248,0.14), transparent 34%), linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,80,0.90))",
            boxShadow: "0 30px 80px rgba(0,0,0,0.30)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: ".12em", color: "#c4b5fd" }}>
                NEUER LEAD
              </span>
              <h2 style={{ margin: "7px 0 0", fontSize: 30 }}>Kundenanfrage erfassen</h2>
              <p style={{ margin: "8px 0 0", opacity: 0.58 }}>
                Der Leadpreis wird automatisch berechnet, sofern du ihn nicht manuell vorgibst.
              </p>
            </div>
            <div
              style={{
                padding: "13px 16px",
                borderRadius: 16,
                background: "rgba(250,204,21,0.10)",
                border: "1px solid rgba(250,204,21,0.22)",
                color: "#fde68a",
                fontWeight: 800,
              }}
            >
              Automatische Preislogik aktiv
            </div>
          </div>

          <form action={createLeadAction} style={{ display: "grid", gap: 14, marginTop: 24 }}>
            <input name="title" placeholder="Titel, z. B. Fensterreinigung Grafstal" required />
            <textarea
              name="description"
              placeholder="Beschreibung des Auftrags"
              required
              style={{ minHeight: 130 }}
            />

            <div className="form-row">
              <input name="name" placeholder="Kundenname" required />
              <input name="phone" placeholder="Telefon" required />
            </div>

            <input name="email" type="email" placeholder="E-Mail" required />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 14,
              }}
            >
              <select name="region" required defaultValue="">
                <option value="" disabled>
                  Region auswählen
                </option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>

              <select name="category" required defaultValue="">
                <option value="" disabled>
                  Kategorie auswählen
                </option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <input
                name="estimatedValue"
                type="number"
                min="1"
                placeholder="Auftragswert CHF"
                required
              />
            </div>

            <input
              name="price"
              type="number"
              min="1"
              placeholder="Leadpreis in Credits (optional)"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 10,
                padding: 16,
                borderRadius: 18,
                background: "rgba(255,255,255,0.045)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: 13,
              }}
            >
              <span>bis CHF 300 → 10 Credits</span>
              <span>CHF 301–700 → 20 Credits</span>
              <span>CHF 701–1'500 → 35 Credits</span>
              <span>CHF 1'501–3'000 → 55 Credits</span>
              <span>über CHF 3'000 → 80 Credits</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 4 }}>
              Lead erstellen
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}