import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function createLeadAction(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const region = String(formData.get("region") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const price = Number(formData.get("price") || 0);

  if (!title || !description || !name || !email || !phone || !region || !category || !price) {
    return;
  }

  await prisma.lead.create({
    data: { title, description, name, email, phone, region, category, price },
  });

  redirect("/admin/leads");
}

export default async function AdminLeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="page">
      <section className="admin-leads-hero">
        <div className="container">
          <span className="eyebrow">Admin</span>

          <div className="admin-leads-head">
            <div>
              <h1>Leads verwalten.</h1>
              <p>
                Erstelle Kundenanfragen, verwalte bestehende Leads und stelle
                sie direkt im Anbieter-Portal bereit.
              </p>
            </div>

            <a href="/admin" className="btn btn-secondary">
              Anbieter ansehen
            </a>
          </div>

          <div className="admin-leads-grid">
            <form action={createLeadAction} className="admin-leads-form">
              <div className="admin-card-head">
                <span>Neuer Lead</span>
                <h2>Kundenanfrage erfassen</h2>
              </div>

              <input name="title" className="admin-input" placeholder="Titel z.B. Umzugsreinigung 4.5 Zimmer" required />

              <textarea name="description" className="admin-input admin-textarea" placeholder="Beschreibung des Auftrags" required />

              <div className="admin-two">
                <input name="name" className="admin-input" placeholder="Kundenname" required />
                <input name="phone" className="admin-input" placeholder="Telefon" required />
              </div>

              <input name="email" type="email" className="admin-input" placeholder="E-Mail" required />

              <div className="admin-three">
                <input name="region" className="admin-input" placeholder="Region z.B. Zürich" required />
                <input name="category" className="admin-input" placeholder="Kategorie z.B. Reinigung" required />
                <input name="price" type="number" min="1" className="admin-input" placeholder="Preis Credits" required />
              </div>

              <button type="submit" className="btn btn-primary admin-submit">
                Lead erstellen
              </button>
            </form>

            <div className="admin-leads-list">
              <div className="admin-card-head">
                <span>Übersicht</span>
                <h2>Bestehende Leads</h2>
              </div>

              {leads.length === 0 ? (
                <div className="admin-empty">
                  <strong>Noch keine Leads</strong>
                  <p>Erstelle den ersten Lead. Danach erscheint er automatisch hier und im Anbieter-Portal.</p>
                </div>
              ) : (
                <div className="admin-list-stack">
                  {leads.map((lead) => (
                    <article key={lead.id} className="admin-lead-item">
                      <div>
                        <div className="admin-tags">
                          <span>{lead.category}</span>
                          <span>{lead.region}</span>
                        </div>

                        <h3>{lead.title}</h3>
                        <p>{lead.description}</p>

                        <div className="admin-contact">
                          {lead.name} · {lead.email} · {lead.phone}
                        </div>
                      </div>

                      <div className="admin-price">
                        <span>Preis</span>
                        <strong>{lead.price}</strong>
                        <small>Credits</small>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .admin-leads-hero {
          padding: 74px 0 90px;
        }

        .admin-leads-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-top: 18px;
          margin-bottom: 34px;
        }

        .admin-leads-head h1 {
          color: white;
          font-size: clamp(3.2rem, 7vw, 6.6rem);
          line-height: 0.92;
          letter-spacing: -0.07em;
        }

        .admin-leads-head p {
          max-width: 720px;
          margin-top: 18px;
          color: rgba(245, 248, 255, 0.66);
          font-size: 1.15rem;
          line-height: 1.65;
        }

        .admin-leads-grid {
          display: grid;
          grid-template-columns: minmax(420px, 0.85fr) minmax(0, 1.15fr);
          gap: 24px;
          align-items: start;
        }

        .admin-leads-form,
        .admin-leads-list {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 34px;
          background:
            linear-gradient(135deg, rgba(45,88,125,0.22), rgba(15,18,35,0.94)),
            rgba(255,255,255,0.04);
          box-shadow: 0 30px 80px rgba(0,0,0,0.28);
          padding: 28px;
        }

        .admin-card-head {
          margin-bottom: 22px;
        }

        .admin-card-head span {
          color: rgba(245,248,255,0.52);
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
        }

        .admin-card-head h2 {
          margin-top: 8px;
          color: white;
          font-size: clamp(1.8rem, 3vw, 3rem);
          line-height: 1;
          letter-spacing: -0.06em;
        }

        .admin-leads-form {
          display: grid;
          gap: 14px;
        }

        .admin-input {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 18px;
          background: rgba(4,8,20,0.72);
          color: white;
          padding: 18px 18px;
          font-weight: 800;
          outline: none;
        }

        .admin-input::placeholder {
          color: rgba(245,248,255,0.38);
        }

        .admin-input:focus {
          border-color: rgba(91,144,255,0.65);
          box-shadow: 0 0 0 4px rgba(91,144,255,0.12);
        }

        .admin-textarea {
          min-height: 135px;
          resize: vertical;
        }

        .admin-two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .admin-three {
          display: grid;
          grid-template-columns: 1fr 1fr 0.75fr;
          gap: 14px;
        }

        .admin-submit {
          margin-top: 8px;
          width: fit-content;
        }

        .admin-empty {
          border: 1px dashed rgba(255,255,255,0.16);
          border-radius: 26px;
          padding: 28px;
          color: rgba(245,248,255,0.7);
        }

        .admin-empty strong {
          display: block;
          color: white;
          font-size: 1.3rem;
          margin-bottom: 8px;
        }

        .admin-list-stack {
          display: grid;
          gap: 14px;
        }

        .admin-lead-item {
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 26px;
          background: rgba(4,8,20,0.45);
          padding: 22px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: center;
        }

        .admin-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .admin-tags span {
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(245,248,255,0.82);
          padding: 7px 11px;
          font-size: 0.8rem;
          font-weight: 900;
        }

        .admin-lead-item h3 {
          color: white;
          font-size: 1.35rem;
          letter-spacing: -0.04em;
        }

        .admin-lead-item p {
          margin-top: 8px;
          color: rgba(245,248,255,0.6);
          line-height: 1.55;
        }

        .admin-contact {
          margin-top: 12px;
          color: rgba(245,248,255,0.46);
          font-size: 0.92rem;
        }

        .admin-price {
          text-align: right;
          min-width: 90px;
        }

        .admin-price span,
        .admin-price small {
          display: block;
          color: rgba(245,248,255,0.5);
          font-weight: 800;
        }

        .admin-price strong {
          display: block;
          color: white;
          font-size: 2rem;
          line-height: 1;
          margin: 6px 0;
        }

        @media (max-width: 1100px) {
          .admin-leads-grid {
            grid-template-columns: 1fr;
          }

          .admin-leads-head {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 720px) {
          .admin-leads-hero {
            padding: 48px 0 70px;
          }

          .admin-leads-form,
          .admin-leads-list {
            padding: 20px;
            border-radius: 26px;
          }

          .admin-two,
          .admin-three,
          .admin-lead-item {
            grid-template-columns: 1fr;
          }

          .admin-price {
            text-align: left;
          }
        }
      `}</style>
    </main>
  );
}