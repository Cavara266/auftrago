import Link from "next/link";

type SeoServiceFormValue = {
  name: string;
  slug: string;
  shortName: string | null;
  description: string | null;
  content: string | null;

  priceMinCents: number | null;
  priceMaxCents: number | null;
  priceUnit: string | null;

  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;

  benefits: string[];
  relatedServices: string[];

  status: string;
  indexable: boolean;
  sortOrder: number;
};

type ServiceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  service?: SeoServiceFormValue;
};

export default function ServiceForm({
  action,
  submitLabel,
  service,
}: ServiceFormProps) {
  return (
    <form action={action} className="service-form">
      <section className="service-form-card">
        <div className="service-form-head">
          <span>Grunddaten</span>
          <h2>Dienstleistung</h2>
        </div>

        <div className="service-form-grid">
          <label>
            <span>Name *</span>
            <input
              name="name"
              required
              defaultValue={service?.name || ""}
              placeholder="Fensterreinigung"
            />
          </label>

          <label>
            <span>Kurzname</span>
            <input
              name="shortName"
              defaultValue={service?.shortName || ""}
              placeholder="Fenster"
            />
          </label>

          <label>
            <span>Slug</span>
            <input
              name="slug"
              defaultValue={service?.slug || ""}
              placeholder="fensterreinigung"
            />
            <small>
              Leer lassen, damit der Slug automatisch erstellt wird.
            </small>
          </label>

          <label>
            <span>Sortierung</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={service?.sortOrder || 0}
            />
          </label>

          <label>
            <span>Status</span>
            <select
              name="status"
              defaultValue={service?.status || "DRAFT"}
            >
              <option value="DRAFT">Entwurf</option>
              <option value="ACTIVE">Aktiv</option>
              <option value="INACTIVE">Inaktiv</option>
              <option value="ARCHIVED">Archiviert</option>
            </select>
          </label>

          <label className="service-checkbox">
            <input
              name="indexable"
              type="checkbox"
              defaultChecked={service?.indexable ?? true}
            />
            <span>Für Google indexierbar</span>
          </label>
        </div>
      </section>

      <section className="service-form-card">
        <div className="service-form-head">
          <span>Inhalte</span>
          <h2>Beschreibung und Hauptinhalt</h2>
        </div>

        <div className="service-form-stack">
          <label>
            <span>Kurzbeschreibung</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={service?.description || ""}
              placeholder="Kurze Beschreibung der Dienstleistung..."
            />
          </label>

          <label>
            <span>Ausführlicher Inhalt</span>
            <textarea
              name="content"
              rows={10}
              defaultValue={service?.content || ""}
              placeholder="Leistungen, Ablauf, Vorteile und wichtige Informationen..."
            />
          </label>

          <label>
            <span>Vorteile</span>
            <input
              name="benefits"
              defaultValue={service?.benefits.join(", ") || ""}
              placeholder="Geprüfte Anbieter, kostenlose Anfrage, regionale Fachbetriebe"
            />
            <small>Einträge mit Komma trennen.</small>
          </label>

          <label>
            <span>Verwandte Dienstleistungen</span>
            <input
              name="relatedServices"
              defaultValue={
                service?.relatedServices.join(", ") || ""
              }
              placeholder="reinigung, umzugsreinigung, hauswartung"
            />
            <small>Service-Slugs mit Komma trennen.</small>
          </label>
        </div>
      </section>

      <section className="service-form-card">
        <div className="service-form-head">
          <span>Preise</span>
          <h2>Preisorientierung</h2>
        </div>

        <div className="service-form-grid">
          <label>
            <span>Mindestpreis in Rappen</span>
            <input
              name="priceMinCents"
              type="number"
              min="0"
              defaultValue={service?.priceMinCents ?? ""}
              placeholder="15000"
            />
            <small>15&apos;000 Rappen entsprechen CHF 150.–</small>
          </label>

          <label>
            <span>Höchstpreis in Rappen</span>
            <input
              name="priceMaxCents"
              type="number"
              min="0"
              defaultValue={service?.priceMaxCents ?? ""}
              placeholder="90000"
            />
          </label>

          <label>
            <span>Preiseinheit</span>
            <input
              name="priceUnit"
              defaultValue={service?.priceUnit || ""}
              placeholder="pro Auftrag"
            />
          </label>
        </div>
      </section>

      <section className="service-form-card">
        <div className="service-form-head">
          <span>Google</span>
          <h2>SEO-Metadaten</h2>
        </div>

        <div className="service-form-stack">
          <label>
            <span>SEO-Titel</span>
            <input
              name="seoTitle"
              maxLength={70}
              defaultValue={service?.seoTitle || ""}
              placeholder="Fensterreinigung in der Schweiz | Auftrago"
            />
          </label>

          <label>
            <span>Meta Description</span>
            <textarea
              name="seoDescription"
              rows={4}
              maxLength={180}
              defaultValue={service?.seoDescription || ""}
              placeholder="Finde regionale Anbieter für professionelle Fensterreinigung..."
            />
          </label>

          <label>
            <span>Canonical URL</span>
            <input
              name="canonicalUrl"
              defaultValue={service?.canonicalUrl || ""}
              placeholder="https://www.auftrago.ch/leistungen/fensterreinigung"
            />
          </label>
        </div>
      </section>

      <div className="service-form-actions">
        <Link href="/admin/seo/services">Abbrechen</Link>
        <button type="submit">{submitLabel}</button>
      </div>

      <style>{`
        .service-form {
          display: grid;
          gap: 20px;
        }

        .service-form-card {
          padding: 26px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.045),
              rgba(8, 12, 25, 0.96)
            );
        }

        .service-form-head {
          margin-bottom: 22px;
        }

        .service-form-head span {
          display: block;
          margin-bottom: 7px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .service-form-head h2 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
        }

        .service-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .service-form-stack {
          display: grid;
          gap: 18px;
        }

        .service-form label {
          display: grid;
          gap: 8px;
        }

        .service-form label > span {
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 800;
        }

        .service-form input,
        .service-form textarea,
        .service-form select {
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 13px;
          outline: none;
          background: rgba(3, 7, 18, 0.86);
          color: #ffffff;
          font: inherit;
        }

        .service-form input,
        .service-form select {
          min-height: 48px;
          padding: 0 14px;
        }

        .service-form textarea {
          padding: 14px;
          resize: vertical;
          line-height: 1.65;
        }

        .service-form input:focus,
        .service-form textarea:focus,
        .service-form select:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }

        .service-form small {
          color: #64748b;
          font-size: 11px;
        }

        .service-checkbox {
          display: flex !important;
          min-height: 48px;
          align-items: center;
          align-self: end;
          padding: 0 14px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 13px;
          background: rgba(3, 7, 18, 0.5);
        }

        .service-checkbox input {
          width: 18px;
          min-height: auto;
          margin: 0 10px 0 0;
        }

        .service-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .service-form-actions a,
        .service-form-actions button {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
          border-radius: 13px;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .service-form-actions a {
          border: 1px solid rgba(148, 163, 184, 0.18);
          color: #cbd5e1;
        }

        .service-form-actions button {
          border: 0;
          cursor: pointer;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #ffffff;
        }

        @media (max-width: 720px) {
          .service-form-grid {
            grid-template-columns: 1fr;
          }

          .service-form-card {
            padding: 20px;
          }

          .service-form-actions {
            flex-direction: column-reverse;
          }

          .service-form-actions a,
          .service-form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </form>
  );
}
