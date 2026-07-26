import Link from "next/link";

type CityFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  city?: {
    name: string;
    slug: string;
    canton: string;
    region: string | null;
    country: string;
    introduction: string | null;
    localContent: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    canonicalUrl: string | null;
    neighboringCities: string[];
    status: string;
    indexable: boolean;
    sortOrder: number;
  };
};

export default function CityForm({
  action,
  submitLabel,
  city,
}: CityFormProps) {
  return (
    <form action={action} className="city-form">
      <section className="city-form-card">
        <div className="city-form-head">
          <div>
            <span>Grunddaten</span>
            <h2>Stadtinformationen</h2>
          </div>
        </div>

        <div className="city-form-grid">
          <label>
            <span>Name *</span>
            <input
              name="name"
              required
              defaultValue={city?.name || ""}
              placeholder="Zürich"
            />
          </label>

          <label>
            <span>Slug</span>
            <input
              name="slug"
              defaultValue={city?.slug || ""}
              placeholder="zuerich"
            />
            <small>Leer lassen, damit der Slug automatisch erzeugt wird.</small>
          </label>

          <label>
            <span>Kanton *</span>
            <input
              name="canton"
              required
              defaultValue={city?.canton || ""}
              placeholder="ZH"
            />
          </label>

          <label>
            <span>Region</span>
            <input
              name="region"
              defaultValue={city?.region || ""}
              placeholder="Zürich"
            />
          </label>

          <label>
            <span>Land</span>
            <input
              name="country"
              defaultValue={city?.country || "Schweiz"}
            />
          </label>

          <label>
            <span>Sortierung</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={city?.sortOrder || 0}
            />
          </label>

          <label>
            <span>Status</span>
            <select name="status" defaultValue={city?.status || "DRAFT"}>
              <option value="DRAFT">Entwurf</option>
              <option value="ACTIVE">Aktiv</option>
              <option value="INACTIVE">Inaktiv</option>
              <option value="ARCHIVED">Archiviert</option>
            </select>
          </label>

          <label className="city-checkbox">
            <input
              name="indexable"
              type="checkbox"
              defaultChecked={city?.indexable ?? true}
            />
            <span>Für Google indexierbar</span>
          </label>
        </div>
      </section>

      <section className="city-form-card">
        <div className="city-form-head">
          <div>
            <span>Inhalte</span>
            <h2>Regionale Texte</h2>
          </div>
        </div>

        <div className="city-form-stack">
          <label>
            <span>Einleitung</span>
            <textarea
              name="introduction"
              rows={5}
              defaultValue={city?.introduction || ""}
              placeholder="Regionale Einleitung für die Stadt..."
            />
          </label>

          <label>
            <span>Lokaler Inhalt</span>
            <textarea
              name="localContent"
              rows={9}
              defaultValue={city?.localContent || ""}
              placeholder="Besonderheiten, Regionen, lokale Informationen..."
            />
          </label>

          <label>
            <span>Nachbarstädte</span>
            <input
              name="neighboringCities"
              defaultValue={city?.neighboringCities.join(", ") || ""}
              placeholder="Dietikon, Uster, Winterthur"
            />
            <small>Mit Komma trennen.</small>
          </label>
        </div>
      </section>

      <section className="city-form-card">
        <div className="city-form-head">
          <div>
            <span>Google</span>
            <h2>SEO-Metadaten</h2>
          </div>
        </div>

        <div className="city-form-stack">
          <label>
            <span>SEO-Titel</span>
            <input
              name="seoTitle"
              defaultValue={city?.seoTitle || ""}
              placeholder="Dienstleister in Zürich finden | Auftrago"
              maxLength={70}
            />
          </label>

          <label>
            <span>Meta Description</span>
            <textarea
              name="seoDescription"
              rows={4}
              defaultValue={city?.seoDescription || ""}
              placeholder="Finde geprüfte Dienstleister in Zürich..."
              maxLength={180}
            />
          </label>

          <label>
            <span>Canonical URL</span>
            <input
              name="canonicalUrl"
              defaultValue={city?.canonicalUrl || ""}
              placeholder="https://auftrago.ch/stadt/zuerich"
            />
          </label>
        </div>
      </section>

      <div className="city-form-actions">
        <Link href="/admin/seo/cities">Abbrechen</Link>
        <button type="submit">{submitLabel}</button>
      </div>

      <style>{`
        .city-form {
          display: grid;
          gap: 20px;
        }

        .city-form-card {
          padding: 26px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.045),
            rgba(8, 12, 25, 0.96)
          );
        }

        .city-form-head {
          margin-bottom: 22px;
        }

        .city-form-head span {
          display: block;
          margin-bottom: 7px;
          color: #60a5fa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .city-form-head h2 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
        }

        .city-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .city-form-stack {
          display: grid;
          gap: 18px;
        }

        .city-form label {
          display: grid;
          gap: 8px;
        }

        .city-form label > span {
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 800;
        }

        .city-form input,
        .city-form textarea,
        .city-form select {
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 13px;
          outline: none;
          background: rgba(3, 7, 18, 0.86);
          color: #ffffff;
          font: inherit;
        }

        .city-form input,
        .city-form select {
          min-height: 48px;
          padding: 0 14px;
        }

        .city-form textarea {
          padding: 14px;
          resize: vertical;
          line-height: 1.65;
        }

        .city-form input:focus,
        .city-form textarea:focus,
        .city-form select:focus {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
        }

        .city-form small {
          color: #64748b;
          font-size: 11px;
        }

        .city-checkbox {
          display: flex !important;
          align-items: center;
          align-self: end;
          min-height: 48px;
          padding: 0 14px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 13px;
          background: rgba(3, 7, 18, 0.5);
        }

        .city-checkbox input {
          width: 18px;
          min-height: auto;
          margin: 0 10px 0 0;
        }

        .city-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        .city-form-actions a,
        .city-form-actions button {
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

        .city-form-actions a {
          border: 1px solid rgba(148, 163, 184, 0.18);
          color: #cbd5e1;
        }

        .city-form-actions button {
          border: 0;
          cursor: pointer;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: #ffffff;
        }

        @media (max-width: 720px) {
          .city-form-grid {
            grid-template-columns: 1fr;
          }

          .city-form-card {
            padding: 20px;
          }

          .city-form-actions {
            flex-direction: column-reverse;
          }

          .city-form-actions a,
          .city-form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </form>
  );
}
