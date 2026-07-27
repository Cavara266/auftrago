import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { updateProviderProfileAction } from "./actions";
import "./profile-center.css";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams?: Promise<{
    message?: string;
    error?: string;
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
  "Abbrucharbeiten",
  "Alarmanlagen",
  "Allrounder",
  "Architektur",
  "Badezimmer renovieren",
  "Bauberatung",
  "Baureinigung",
  "Bauunternehmen",
  "Bodenleger",
  "Büroreinigung",
  "Carport",
  "Dachdecker",
  "Elektroinstallation",
  "Elektriker",
  "Endreinigung",
  "Entsorgung",
  "Fassadenbau",
  "Fassadenreinigung",
  "Fensterbau",
  "Fensterreinigung",
  "Fliesenleger",
  "Fotografie",
  "Gartenbau",
  "Gartenpflege",
  "Gebäudereinigung",
  "Gerüstbau",
  "Gipser",
  "Grafikdesign",
  "Grundreinigung",
  "Hausräumung",
  "Hauswartung",
  "Heizungsinstallation",
  "Heizungsservice",
  "Heckenschnitt",
  "Holzbau",
  "Immobilienbewertung",
  "Immobilienmakler",
  "Innenausbau",
  "IT-Support",
  "Kanalreinigung",
  "Kellerreinigung",
  "Klimaanlagen",
  "Küchenbau",
  "Landschaftsbau",
  "Lüftungsreinigung",
  "Maler",
  "Maurer",
  "Metallbau",
  "Möbelmontage",
  "Möbeltransport",
  "Parkettreinigung",
  "Parkettverlegung",
  "Photovoltaik",
  "Plattenleger",
  "Poolbau",
  "Poolreinigung",
  "Rasenpflege",
  "Räumung",
  "Renovation",
  "Reinigung",
  "Rohrreinigung",
  "Sanitär",
  "Schädlingsbekämpfung",
  "Schlosser",
  "Schneeräumung",
  "Schreiner",
  "Smart Home",
  "Solaranlagen",
  "Spengler",
  "Steinreinigung",
  "Steuerberatung",
  "Storenmontage",
  "Storenreinigung",
  "Tapezierarbeiten",
  "Teppichreinigung",
  "Terrassenbau",
  "Terrassenreinigung",
  "Transport",
  "Treppenhausreinigung",
  "Treuhand",
  "Trockenbau",
  "Umgebungspflege",
  "Umzug",
  "Umzugsreinigung",
  "Unterhaltsreinigung",
  "Versicherungsberatung",
  "Webdesign",
  "Wärmepumpen",
  "Winterdienst",
  "Wohnungsreinigung",
  "Zaunbau",
  "Zimmermann",
];

function getInitials(companyName: string) {
  const initials = companyName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return initials || "AP";
}

function getProfileCompletion(provider: {
  companyName: string;
  contactName: string;
  email: string;
  phone: string | null;
  region: string | null;
  category: string | null;
  website: string | null;
  description: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
}) {
  const fields = [
    Boolean(provider.companyName),
    Boolean(provider.contactName),
    Boolean(provider.email),
    Boolean(provider.phone),
    Boolean(provider.region),
    Boolean(provider.category),
    Boolean(provider.website),
    Boolean(provider.description),
    Boolean(provider.address),
    Boolean(provider.postalCode),
    Boolean(provider.city),
  ];

  const completed = fields.filter(Boolean).length;

  return Math.round((completed / fields.length) * 100);
}

function getDescriptionLength(description?: string | null) {
  return description?.trim().length || 0;
}

function getMissingRecommendations(provider: {
  phone: string | null;
  region: string | null;
  category: string | null;
  website: string | null;
  description: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
}) {
  const recommendations: string[] = [];

  if (!provider.phone) {
    recommendations.push("Telefonnummer ergänzen");
  }

  if (!provider.region) {
    recommendations.push("Einsatzregion auswählen");
  }

  if (!provider.category) {
    recommendations.push("Hauptdienstleistung definieren");
  }

  if (!provider.website) {
    recommendations.push("Webseite hinterlegen");
  }

  if (!provider.description) {
    recommendations.push("Firmenbeschreibung verfassen");
  }

  if (!provider.address || !provider.postalCode || !provider.city) {
    recommendations.push("Firmenadresse vervollständigen");
  }

  return recommendations;
}

export default async function ProviderProfilePage({
  searchParams,
}: PageProps) {
  const params = searchParams ? await searchParams : undefined;

  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  if (user.status !== "APPROVED") {
    redirect("/login?error=provider-not-approved");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: user.id,
    },
    include: {
      purchases: {
        select: {
          id: true,
          status: true,
          price: true,
        },
      },
      creditPurchases: {
        select: {
          id: true,
          credits: true,
          status: true,
        },
      },
    },
  });

  if (!provider) {
    redirect("/login");
  }

  const completion = getProfileCompletion(provider);
  const recommendations = getMissingRecommendations(provider);
  const initials = getInitials(provider.companyName);

  const wonLeads = provider.purchases.filter(
    (purchase) => purchase.status === "WON"
  ).length;

  const purchasedLeads = provider.purchases.length;

  const successRate =
    purchasedLeads > 0
      ? Math.round((wonLeads / purchasedLeads) * 100)
      : 0;

  const totalCreditsPurchased = provider.creditPurchases
    .filter((purchase) => purchase.status.toLowerCase() === "paid")
    .reduce((sum, purchase) => sum + purchase.credits, 0);

  const profileStrength =
    completion >= 85
      ? "Sehr stark"
      : completion >= 65
        ? "Gut"
        : completion >= 40
          ? "Ausbaufähig"
          : "Unvollständig";

  const matchingStrength =
    provider.region && provider.category
      ? provider.description
        ? "Optimal vorbereitet"
        : "Gut vorbereitet"
      : "Matching verbessern";

  const descriptionLength = getDescriptionLength(provider.description);

  return (
    <main className="provider-profile">
      <div className="provider-profile__ambient provider-profile__ambient--one" />
      <div className="provider-profile__ambient provider-profile__ambient--two" />

      <div className="provider-profile__container">
        <section className="provider-profile__hero">
          <div className="provider-profile__identity">
            <div className="provider-profile__avatar">
              <span>{initials}</span>

              <div className="provider-profile__verified">
                ✓
              </div>
            </div>

            <div className="provider-profile__identity-copy">
              <span className="provider-profile__eyebrow">
                ANBIETERPROFIL
              </span>

              <div className="provider-profile__title-row">
                <h1>{provider.companyName}</h1>

                <span className="provider-profile__status-badge">
                  Verifiziert
                </span>
              </div>

              <p>
                Optimiere dein Firmenprofil und erhöhe die Qualität
                deiner Lead-Empfehlungen.
              </p>

              <div className="provider-profile__hero-tags">
                <span>
                  {provider.category || "Dienstleistung fehlt"}
                </span>

                <span>
                  {provider.region || "Region fehlt"}
                </span>

                <span>{provider.credits} Credits</span>
              </div>
            </div>
          </div>

          <div className="provider-profile__hero-actions">
            <Link
              href="/portal"
              className="provider-profile__button provider-profile__button--secondary"
            >
              Dashboard
            </Link>

            <Link
              href="/portal/leads"
              className="provider-profile__button provider-profile__button--primary"
            >
              Neue Leads
              <span>→</span>
            </Link>
          </div>
        </section>

        {params?.message === "saved" ? (
          <div className="provider-profile__notice provider-profile__notice--success">
            <span>✓</span>

            <div>
              <strong>Profil erfolgreich gespeichert</strong>
              <p>
                Deine Änderungen werden ab sofort für das
                Lead-Matching berücksichtigt.
              </p>
            </div>
          </div>
        ) : null}

        {params?.error === "missing-fields" ? (
          <div className="provider-profile__notice provider-profile__notice--error">
            <span>!</span>

            <div>
              <strong>Pflichtfelder fehlen</strong>
              <p>
                Firmenname und Kontaktperson müssen ausgefüllt sein.
              </p>
            </div>
          </div>
        ) : null}

        <section className="provider-profile__metrics">
          <article>
            <div className="provider-profile__metric-head">
              <span>PROFILQUALITÄT</span>
              <small>01</small>
            </div>

            <strong>{completion}%</strong>

            <h2>Profil vollständig</h2>

            <div className="provider-profile__metric-track">
              <span style={{ width: `${completion}%` }} />
            </div>
          </article>

          <article>
            <div className="provider-profile__metric-head">
              <span>LEAD-ERFOLG</span>
              <small>02</small>
            </div>

            <strong>{wonLeads}</strong>

            <h2>Aufträge gewonnen</h2>

            <p>
              {successRate}% Erfolgsquote bei {purchasedLeads} Leads
            </p>
          </article>

          <article>
            <div className="provider-profile__metric-head">
              <span>GUTHABEN</span>
              <small>03</small>
            </div>

            <strong>{provider.credits}</strong>

            <h2>Verfügbare Credits</h2>

            <p>{totalCreditsPurchased} Credits total geladen</p>
          </article>

          <article>
            <div className="provider-profile__metric-head">
              <span>MATCHING</span>
              <small>04</small>
            </div>

            <strong>
              {provider.region && provider.category ? "2/2" : "1/2"}
            </strong>

            <h2>Matching-Faktoren</h2>

            <p>{matchingStrength}</p>
          </article>
        </section>

        <form
          action={updateProviderProfileAction}
          className="provider-profile__workspace"
        >
          <div className="provider-profile__main">
            <section className="provider-profile__form-card">
              <header className="provider-profile__section-header">
                <div>
                  <span className="provider-profile__eyebrow">
                    UNTERNEHMEN
                  </span>

                  <h2>Firmendaten</h2>

                  <p>
                    Diese Daten bilden die Grundlage deines
                    öffentlichen Anbieterprofils.
                  </p>
                </div>

                <span className="provider-profile__section-number">
                  01
                </span>
              </header>

              <div className="provider-profile__fields">
                <label className="provider-profile__field">
                  <span>
                    Firmenname
                    <em>Pflichtfeld</em>
                  </span>

                  <div className="provider-profile__input-wrap">
                    <i>🏢</i>

                    <input
                      name="companyName"
                      defaultValue={provider.companyName}
                      placeholder="Name deines Unternehmens"
                      required
                    />
                  </div>
                </label>

                <label className="provider-profile__field">
                  <span>
                    Kontaktperson
                    <em>Pflichtfeld</em>
                  </span>

                  <div className="provider-profile__input-wrap">
                    <i>👤</i>

                    <input
                      name="contactName"
                      defaultValue={provider.contactName}
                      placeholder="Vor- und Nachname"
                      required
                    />
                  </div>
                </label>

                <label className="provider-profile__field">
                  <span>E-Mail-Adresse</span>

                  <div className="provider-profile__input-wrap provider-profile__input-wrap--disabled">
                    <i>✉️</i>

                    <input
                      value={provider.email}
                      disabled
                      readOnly
                    />
                  </div>

                  <small>
                    Die Login-E-Mail kann hier nicht geändert werden.
                  </small>
                </label>

                <label className="provider-profile__field">
                  <span>Telefonnummer</span>

                  <div className="provider-profile__input-wrap">
                    <i>📞</i>

                    <input
                      name="phone"
                      defaultValue={provider.phone || ""}
                      placeholder="+41 79 000 00 00"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="provider-profile__form-card">
              <header className="provider-profile__section-header">
                <div>
                  <span className="provider-profile__eyebrow">
                    LEAD-MATCHING
                  </span>

                  <h2>Region und Leistung</h2>

                  <p>
                    Auf dieser Basis werden dir passende
                    Kundenanfragen angezeigt.
                  </p>
                </div>

                <span className="provider-profile__section-number">
                  02
                </span>
              </header>

              <div className="provider-profile__fields">
                <label className="provider-profile__field">
                  <span>Hauptregion</span>

                  <div className="provider-profile__input-wrap">
                    <i>📍</i>

                    <select
                      name="region"
                      defaultValue={provider.region || ""}
                    >
                      <option value="">Region auswählen</option>

                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="provider-profile__field">
                  <span>Hauptkategorie</span>

                  <div className="provider-profile__input-wrap">
                    <i>🧰</i>

                    <select
                      name="category"
                      defaultValue={provider.category || ""}
                    >
                      <option value="">Kategorie auswählen</option>

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>

              <div className="provider-profile__matching-preview">
                <div>
                  <span>Aktuelles Matching</span>

                  <strong>
                    {provider.category || "Keine Kategorie"}
                  </strong>

                  <small>
                    in {provider.region || "keiner Region"}
                  </small>
                </div>

                <div className="provider-profile__matching-status">
                  <span
                    className={
                      provider.region && provider.category
                        ? "provider-profile__matching-dot provider-profile__matching-dot--active"
                        : "provider-profile__matching-dot"
                    }
                  />

                  {provider.region && provider.category
                    ? "Matching aktiv"
                    : "Angaben ergänzen"}
                </div>
              </div>
            </section>

            <section className="provider-profile__form-card">
              <header className="provider-profile__section-header">
                <div>
                  <span className="provider-profile__eyebrow">
                    STANDORT
                  </span>

                  <h2>Adresse</h2>

                  <p>
                    Vervollständige deinen Firmenstandort für mehr
                    Vertrauen.
                  </p>
                </div>

                <span className="provider-profile__section-number">
                  03
                </span>
              </header>

              <div className="provider-profile__fields">
                <label className="provider-profile__field provider-profile__field--full">
                  <span>Strasse und Hausnummer</span>

                  <div className="provider-profile__input-wrap">
                    <i>🏠</i>

                    <input
                      name="address"
                      defaultValue={provider.address || ""}
                      placeholder="Musterstrasse 12"
                    />
                  </div>
                </label>

                <label className="provider-profile__field">
                  <span>Postleitzahl</span>

                  <div className="provider-profile__input-wrap">
                    <i>📮</i>

                    <input
                      name="postalCode"
                      defaultValue={provider.postalCode || ""}
                      placeholder="8000"
                    />
                  </div>
                </label>

                <label className="provider-profile__field">
                  <span>Ort</span>

                  <div className="provider-profile__input-wrap">
                    <i>🌆</i>

                    <input
                      name="city"
                      defaultValue={provider.city || ""}
                      placeholder="Zürich"
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="provider-profile__form-card">
              <header className="provider-profile__section-header">
                <div>
                  <span className="provider-profile__eyebrow">
                    AUSSENDARSTELLUNG
                  </span>

                  <h2>Webseite und Beschreibung</h2>

                  <p>
                    Zeige potenziellen Kunden, warum dein Unternehmen
                    die richtige Wahl ist.
                  </p>
                </div>

                <span className="provider-profile__section-number">
                  04
                </span>
              </header>

              <label className="provider-profile__field provider-profile__field--full">
                <span>Webseite</span>

                <div className="provider-profile__input-wrap">
                  <i>🌐</i>

                  <input
                    name="website"
                    defaultValue={provider.website || ""}
                    placeholder="https://deine-firma.ch"
                  />
                </div>
              </label>

              <label className="provider-profile__field provider-profile__field--full provider-profile__description-field">
                <span>
                  Firmenbeschreibung
                  <em>{descriptionLength} Zeichen</em>
                </span>

                <textarea
                  name="description"
                  defaultValue={provider.description || ""}
                  placeholder="Beschreibe deine Firma, Leistungen, Erfahrung und dein Einsatzgebiet."
                />

                <small>
                  Empfehlung: mindestens 150 Zeichen für ein
                  überzeugendes Anbieterprofil.
                </small>
              </label>
            </section>

            <section className="provider-profile__save-card">
              <div>
                <span className="provider-profile__eyebrow">
                  ÄNDERUNGEN SPEICHERN
                </span>

                <h2>Profil jetzt aktualisieren</h2>

                <p>
                  Deine Änderungen werden direkt für dein
                  Anbieterprofil und das Lead-Matching übernommen.
                </p>
              </div>

              <button
                type="submit"
                className="provider-profile__button provider-profile__button--primary provider-profile__submit"
              >
                Profil speichern
                <span>→</span>
              </button>
            </section>
          </div>

          <aside className="provider-profile__sidebar">
            <section className="provider-profile__score-card">
              <div className="provider-profile__score-circle">
                <div
                  className="provider-profile__score-ring"
                  style={{
                    background: `conic-gradient(
                      #48c9ff 0%,
                      #6d73ff ${completion}%,
                      rgba(255,255,255,0.07) ${completion}%,
                      rgba(255,255,255,0.07) 100%
                    )`,
                  }}
                >
                  <div>
                    <strong>{completion}%</strong>
                    <span>vollständig</span>
                  </div>
                </div>
              </div>

              <span className="provider-profile__eyebrow">
                PROFILE SCORE
              </span>

              <h2>{profileStrength}</h2>

              <p>
                Vollständige Profile erhalten präzisere
                Lead-Empfehlungen und wirken professioneller.
              </p>
            </section>

            <section className="provider-profile__preview-card">
              <div className="provider-profile__card-label">
                <span>PROFILVORSCHAU</span>
                <small>Für Kunden</small>
              </div>

              <div className="provider-profile__preview-head">
                <div>{initials}</div>

                <span>✓ Verifiziert</span>
              </div>

              <h2>{provider.companyName}</h2>

              <p>
                {provider.description ||
                  "Füge eine Firmenbeschreibung hinzu, damit Kunden mehr über dein Unternehmen erfahren."}
              </p>

              <div className="provider-profile__preview-tags">
                <span>
                  {provider.category || "Keine Kategorie"}
                </span>

                <span>{provider.region || "Keine Region"}</span>
              </div>

              <div className="provider-profile__preview-details">
                <div>
                  <span>Standort</span>
                  <strong>
                    {[provider.postalCode, provider.city]
                      .filter(Boolean)
                      .join(" ") || "Nicht angegeben"}
                  </strong>
                </div>

                <div>
                  <span>Kontakt</span>
                  <strong>
                    {provider.phone || "Nicht angegeben"}
                  </strong>
                </div>
              </div>
            </section>

            <section className="provider-profile__trust-card">
              <div className="provider-profile__card-label">
                <span>VERTRAUENSCENTER</span>
                <small>Profilprüfung</small>
              </div>

              <div className="provider-profile__trust-list">
                <div>
                  <span className="provider-profile__check provider-profile__check--done">
                    ✓
                  </span>

                  <p>
                    <strong>E-Mail-Adresse</strong>
                    <small>Login und Kommunikation aktiv</small>
                  </p>
                </div>

                <div>
                  <span
                    className={
                      provider.phone
                        ? "provider-profile__check provider-profile__check--done"
                        : "provider-profile__check"
                    }
                  >
                    {provider.phone ? "✓" : "!"}
                  </span>

                  <p>
                    <strong>Telefonnummer</strong>
                    <small>
                      {provider.phone
                        ? "Kontaktmöglichkeit vorhanden"
                        : "Noch nicht hinterlegt"}
                    </small>
                  </p>
                </div>

                <div>
                  <span
                    className={
                      provider.website
                        ? "provider-profile__check provider-profile__check--done"
                        : "provider-profile__check"
                    }
                  >
                    {provider.website ? "✓" : "!"}
                  </span>

                  <p>
                    <strong>Webseite</strong>
                    <small>
                      {provider.website
                        ? "Unternehmensseite hinterlegt"
                        : "Noch nicht hinterlegt"}
                    </small>
                  </p>
                </div>

                <div>
                  <span
                    className={
                      provider.description
                        ? "provider-profile__check provider-profile__check--done"
                        : "provider-profile__check"
                    }
                  >
                    {provider.description ? "✓" : "!"}
                  </span>

                  <p>
                    <strong>Firmenbeschreibung</strong>
                    <small>
                      {provider.description
                        ? "Profiltext vorhanden"
                        : "Noch nicht ausgefüllt"}
                    </small>
                  </p>
                </div>
              </div>
            </section>

            <section className="provider-profile__recommendation-card">
              <div className="provider-profile__card-label">
                <span>NÄCHSTE SCHRITTE</span>

                <small>
                  {recommendations.length} offen
                </small>
              </div>

              {recommendations.length === 0 ? (
                <div className="provider-profile__all-complete">
                  <span>✓</span>

                  <div>
                    <strong>Profil vollständig</strong>

                    <p>
                      Alle wichtigen Angaben wurden ergänzt.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="provider-profile__recommendations">
                  {recommendations.map((recommendation, index) => (
                    <div key={recommendation}>
                      <span>{String(index + 1).padStart(2, "0")}</span>

                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              )}

              <Link
                href="/portal/guthaben"
                className="provider-profile__credit-link"
              >
                <span>
                  <strong>Credits aufladen</strong>
                  <small>Neue Leads sofort freischalten</small>
                </span>

                <b>→</b>
              </Link>
            </section>
          </aside>
        </form>
      </div>
    </main>
  );
}
