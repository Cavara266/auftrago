import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProviderProfileAction } from "./actions";

export const dynamic = "force-dynamic";

type PageProps = {
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
  "Gartenpflege",
  "Maler",
  "Gipser",
  "Sanitär",
  "Elektriker",
  "Umzug",
  "Entsorgung",
];

export default async function ProviderProfilePage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;

  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    redirect("/login");
  }

  return (
    <main className="page">
      <section className="profile-hero">
        <div className="container">
          <span className="eyebrow">Firmenprofil</span>

          <div className="profile-head">
            <div>
              <h1>Profil bearbeiten.</h1>

              <p>
                Aktualisiere deine Firmendaten, Region, Kategorie und
                Kontaktinformationen. Diese Daten helfen später beim Matching
                mit passenden Leads.
              </p>
            </div>

            <div className="profile-actions">
              <Link href="/portal" className="btn btn-secondary">
                Dashboard
              </Link>

              <Link href="/portal/leads" className="btn btn-primary">
                Leads ansehen
              </Link>
            </div>
          </div>

          {params?.message === "saved" ? (
            <div className="profile-success">
              Profil wurde erfolgreich gespeichert.
            </div>
          ) : null}

          {params?.error === "missing-fields" ? (
            <div className="profile-error">
              Firmenname und Kontaktperson sind erforderlich.
            </div>
          ) : null}
        </div>
      </section>

      <section className="profile-section">
        <div className="container profile-layout">
          <form action={updateProviderProfileAction} className="profile-form">
            <div className="profile-form-head">
              <span>Basisdaten</span>
              <h2>Firmendaten</h2>
              <p>
                Diese Angaben werden für dein Anbieterprofil und das
                Lead-Matching verwendet.
              </p>
            </div>

            <div className="profile-grid">
              <label>
                Firmenname *
                <input
                  name="companyName"
                  defaultValue={provider.companyName}
                  required
                />
              </label>

              <label>
                Kontaktperson *
                <input
                  name="contactName"
                  defaultValue={provider.contactName}
                  required
                />
              </label>

              <label>
                E-Mail
                <input value={provider.email} disabled readOnly />
              </label>

              <label>
                Telefon
                <input name="phone" defaultValue={provider.phone || ""} />
              </label>

              <label>
                Region
                <select name="region" defaultValue={provider.region || ""}>
                  <option value="">Region auswählen</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Kategorie
                <select name="category" defaultValue={provider.category || ""}>
                  <option value="">Kategorie auswählen</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Webseite
                <input
                  name="website"
                  defaultValue={provider.website || ""}
                  placeholder="https://deine-firma.ch"
                />
              </label>

              <label>
                Adresse
                <input
                  name="address"
                  defaultValue={provider.address || ""}
                  placeholder="Musterstrasse 12"
                />
              </label>

              <label>
                PLZ
                <input
                  name="postalCode"
                  defaultValue={provider.postalCode || ""}
                  placeholder="8000"
                />
              </label>

              <label>
                Ort
                <input
                  name="city"
                  defaultValue={provider.city || ""}
                  placeholder="Zürich"
                />
              </label>
            </div>

            <label>
              Beschreibung
              <textarea
                name="description"
                defaultValue={provider.description || ""}
                placeholder="Beschreibe deine Firma, Leistungen, Erfahrung und Einsatzgebiet."
              />
            </label>

            <button type="submit" className="btn btn-primary profile-submit">
              Profil speichern
            </button>
          </form>

          <aside className="profile-sidebar">
            <div className="profile-card">
              <span>Status</span>
              <h2>Profilübersicht</h2>

              <div className="profile-tags">
                <strong>{provider.companyName}</strong>
                <span>{provider.region || "Region fehlt"}</span>
                <span>{provider.category || "Kategorie fehlt"}</span>
                <span>{provider.credits} Credits</span>
              </div>

              <p>
                Je vollständiger dein Profil ist, desto besser können Leads
                später nach Region und Kategorie zugeordnet werden.
              </p>
            </div>

            <div className="profile-card">
              <span>Nächste Schritte</span>
              <h2>Empfohlen</h2>

              <div className="profile-checklist">
                <div>Region auswählen</div>
                <div>Kategorie definieren</div>
                <div>Telefonnummer ergänzen</div>
                <div>Beschreibung schreiben</div>
                <div>Credits aufladen</div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}