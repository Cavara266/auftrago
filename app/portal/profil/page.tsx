import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const DEMO_PROVIDER_EMAIL =
  process.env.DEMO_PROVIDER_EMAIL?.trim().toLowerCase() ||
  "info@cavara-hauswartung.ch";

async function updateProfileAction(formData: FormData) {
  "use server";

  const companyName = String(formData.get("companyName") || "").trim();
  const contactName = String(formData.get("contactName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const category = String(formData.get("category") || "").trim();

  await prisma.provider.update({
    where: {
      email: DEMO_PROVIDER_EMAIL,
    },
    data: {
      companyName,
      contactName,
      phone,
      region,
      category,
    },
  });

  redirect("/portal/profil?message=saved");
}

export default async function ProfilPage({
  searchParams,
}: {
  searchParams?: Promise<{ message?: string }>;
}) {
  const params = await searchParams;

  const provider = await prisma.provider.findUnique({
    where: {
      email: DEMO_PROVIDER_EMAIL,
    },
  });

  if (!provider) {
    return (
      <main className="page">
        <section className="profil-hero">
          <div className="container">
            <div className="profil-empty">
              <span>Profil fehlt</span>
              <h1>Kein Anbieter gefunden.</h1>
              <p>
                Es wurde kein Anbieter mit der E-Mail{" "}
                <strong>{DEMO_PROVIDER_EMAIL}</strong> gefunden.
              </p>
              <a href="/anbieter-registrieren" className="btn btn-primary">
                Anbieter registrieren
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="profil-hero">
        <div className="container">
          <span className="eyebrow">Firmenprofil</span>

          <div className="profil-head">
            <div>
              <h1>Profil bearbeiten.</h1>
              <p>
                Aktualisiere Firmendaten, Kontaktperson, Region und Kategorie.
                Diese Angaben werden später für Matching und Lead-Zuordnung
                verwendet.
              </p>
            </div>

            <div className="profil-actions">
              <a href="/portal" className="btn btn-secondary">
                Dashboard
              </a>
              <a href="/portal/leads" className="btn btn-primary">
                Leads ansehen
              </a>
            </div>
          </div>

          {params?.message === "saved" && (
            <div className="profil-success">
              Profil wurde erfolgreich gespeichert.
            </div>
          )}

          <div className="profil-layout">
            <form action={updateProfileAction} className="profil-form-card">
              <div className="profil-card-head">
                <span>Bearbeiten</span>
                <h2>Firmendaten</h2>
              </div>

              <div className="profil-grid">
                <label>
                  <span>Firma</span>
                  <input
                    name="companyName"
                    defaultValue={provider.companyName}
                    required
                  />
                </label>

                <label>
                  <span>Kontaktperson</span>
                  <input
                    name="contactName"
                    defaultValue={provider.contactName}
                    required
                  />
                </label>

                <label>
                  <span>E-Mail</span>
                  <input value={provider.email} disabled />
                </label>

                <label>
                  <span>Telefon</span>
                  <input
                    name="phone"
                    defaultValue={provider.phone || ""}
                    placeholder="Telefonnummer"
                  />
                </label>

                <label>
                  <span>Region</span>
                  <input
                    name="region"
                    defaultValue={provider.region || ""}
                    placeholder="z.B. Zürich, Aargau"
                  />
                </label>

                <label>
                  <span>Kategorie / Leistungen</span>
                  <input
                    name="category"
                    defaultValue={provider.category || ""}
                    placeholder="z.B. Reinigung, Umzug, Hauswartung"
                  />
                </label>
              </div>

              <button type="submit" className="btn btn-primary profil-submit">
                Profil speichern
              </button>
            </form>

            <aside className="profil-side">
              <div className="profil-side-card">
                <span>Account</span>
                <h2>{provider.companyName}</h2>

                <div className="profil-mini-list">
                  <div>
                    <small>Kontakt</small>
                    <strong>{provider.contactName}</strong>
                  </div>

                  <div>
                    <small>E-Mail</small>
                    <strong>{provider.email}</strong>
                  </div>

                  <div>
                    <small>Credits</small>
                    <strong>{provider.credits}</strong>
                  </div>

                  <div>
                    <small>Region</small>
                    <strong>{provider.region || "Nicht gesetzt"}</strong>
                  </div>

                  <div>
                    <small>Kategorie</small>
                    <strong>{provider.category || "Nicht gesetzt"}</strong>
                  </div>
                </div>
              </div>

              <div className="profil-side-card">
                <span>Hinweis</span>
                <h2>Matching vorbereiten</h2>
                <p>
                  Region und Kategorie bestimmen später, welche Leads dir
                  bevorzugt angezeigt werden. Halte diese Angaben aktuell.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <style>{`
        .profil-hero {
          padding: 72px 0 90px;
        }

        .profil-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-top: 18px;
          margin-bottom: 28px;
        }

        .profil-head h1,
        .profil-empty h1 {
          color: white;
          font-size: clamp(3.2rem, 8vw, 7rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }

        .profil-head p,
        .profil-empty p {
          max-width: 760px;
          margin-top: 22px;
          color: rgba(245, 248, 255, 0.68);
          font-size: 1.15rem;
          line-height: 1.65;
        }

        .profil-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .profil-success {
          margin: 22px 0;
          width: fit-content;
          border: 1px solid rgba(34,197,94,0.24);
          background: rgba(34,197,94,0.12);
          color: #dcfce7;
          border-radius: 18px;
          padding: 14px 18px;
          font-weight: 900;
        }

        .profil-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
          gap: 24px;
          align-items: start;
        }

        .profil-form-card,
        .profil-side-card,
        .profil-empty {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 34px;
          background:
            linear-gradient(135deg, rgba(45,88,125,0.22), rgba(15,18,35,0.94)),
            rgba(255,255,255,0.04);
          box-shadow: 0 30px 80px rgba(0,0,0,0.28);
          padding: 30px;
        }

        .profil-card-head,
        .profil-side-card > span,
        .profil-empty > span {
          margin-bottom: 22px;
        }

        .profil-card-head span,
        .profil-side-card > span,
        .profil-empty > span {
          display: block;
          color: rgba(245,248,255,0.52);
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .profil-card-head h2,
        .profil-side-card h2 {
          color: white;
          font-size: clamp(2rem, 4vw, 3.8rem);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .profil-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 24px;
        }

        .profil-grid label {
          display: grid;
          gap: 8px;
        }

        .profil-grid label span {
          color: rgba(245,248,255,0.58);
          font-weight: 900;
          font-size: 0.9rem;
        }

        .profil-grid input {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          background: rgba(4,8,20,0.72);
          color: white;
          padding: 18px;
          font-weight: 800;
          outline: none;
        }

        .profil-grid input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .profil-grid input:focus {
          border-color: rgba(91,144,255,0.65);
          box-shadow: 0 0 0 4px rgba(91,144,255,0.12);
        }

        .profil-submit {
          margin-top: 22px;
        }

        .profil-side {
          display: grid;
          gap: 24px;
        }

        .profil-mini-list {
          display: grid;
          gap: 12px;
          margin-top: 22px;
        }

        .profil-mini-list div {
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 16px;
        }

        .profil-mini-list small {
          display: block;
          color: rgba(245,248,255,0.45);
          font-weight: 900;
          margin-bottom: 8px;
        }

        .profil-mini-list strong {
          display: block;
          color: white;
          word-break: break-word;
        }

        .profil-side-card p {
          margin-top: 18px;
          color: rgba(245,248,255,0.66);
          line-height: 1.7;
        }

        @media (max-width: 1050px) {
          .profil-head,
          .profil-layout {
            grid-template-columns: 1fr;
          }

          .profil-head {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 680px) {
          .profil-hero {
            padding: 46px 0 70px;
          }

          .profil-grid {
            grid-template-columns: 1fr;
          }

          .profil-form-card,
          .profil-side-card,
          .profil-empty {
            padding: 22px;
            border-radius: 26px;
          }
        }
      `}</style>
    </main>
  );
}