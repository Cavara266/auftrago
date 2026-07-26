import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { updateSeoService } from "../../actions";
import ServiceForm from "../../service-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSeoServicePage({
  params,
}: PageProps) {
  const { id } = await params;

  const service = await prisma.seoServicePage.findUnique({
    where: {
      id,
    },
  });

  if (!service) {
    notFound();
  }

  const updateAction = updateSeoService.bind(null, service.id);

  return (
    <main className="service-editor-page">
      <div className="service-editor-shell">
        <header>
          <Link href="/admin/seo/services">
            ← Zurück zu den Dienstleistungen
          </Link>

          <span>SEO Dienstleistung bearbeiten</span>
          <h1>{service.name}</h1>

          <p>
            Inhalte, Preise, Status und Google-Metadaten bearbeiten.
          </p>
        </header>

        <ServiceForm
          action={updateAction}
          submitLabel="Änderungen speichern"
          service={{
            name: service.name,
            slug: service.slug,
            shortName: service.shortName,
            description: service.description,
            content: service.content,

            priceMinCents: service.priceMinCents,
            priceMaxCents: service.priceMaxCents,
            priceUnit: service.priceUnit,

            seoTitle: service.seoTitle,
            seoDescription: service.seoDescription,
            canonicalUrl: service.canonicalUrl,

            benefits: service.benefits,
            relatedServices: service.relatedServices,

            status: service.status,
            indexable: service.indexable,
            sortOrder: service.sortOrder,
          }}
        />
      </div>

      <style>{`
        :global(body) {
          margin: 0;
          background: #050711;
        }

        .service-editor-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(124, 58, 237, 0.13),
              transparent 28%
            ),
            #050711;
          color: #ffffff;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .service-editor-shell {
          width: min(1100px, calc(100% - 32px));
          margin: 0 auto;
          padding: 36px 0 70px;
        }

        header {
          margin-bottom: 24px;
          padding: 28px;
          border: 1px solid rgba(148, 163, 184, 0.14);
          border-radius: 28px;
          background:
            linear-gradient(
              145deg,
              rgba(15, 23, 42, 0.94),
              rgba(6, 9, 20, 0.97)
            );
        }

        header a {
          display: inline-flex;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
        }

        header > span {
          display: block;
          margin-bottom: 9px;
          color: #a78bfa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        header h1 {
          margin: 0;
          font-size: clamp(40px, 6vw, 62px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        header p {
          margin: 15px 0 0;
          color: #94a3b8;
          line-height: 1.7;
        }

        @media (max-width: 560px) {
          .service-editor-shell {
            width: calc(100% - 20px);
            padding-top: 14px;
          }

          header {
            padding: 20px;
            border-radius: 22px;
          }
        }
      `}</style>
    </main>
  );
}
