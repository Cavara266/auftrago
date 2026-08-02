import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  categoryCatalog,
  getCategoryBySlug,
} from "@/lib/category-catalog";
import { seoConfig } from "@/lib/seo";
import { serviceCatalog } from "@/lib/service-catalog";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 3600;

export function generateStaticParams() {
  return categoryCatalog.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {};
  }

  const canonical = `${seoConfig.siteUrl}/kategorie/${category.slug}`;
  const title = `${category.name} | Offerten vergleichen | Auftrago`;

  return {
    title,
    description: category.metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: category.metaDescription,
      url: canonical,
      type: "website",
      siteName: "Auftrago",
    },
  };
}

export default async function CategoryPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const services = serviceCatalog
    .filter((service) => service.category === category.slug)
    .sort((a, b) => a.name.localeCompare(b.name, "de"));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: seoConfig.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Dienstleistungen",
        item: `${seoConfig.siteUrl}/dienstleistungen`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${seoConfig.siteUrl}/kategorie/${category.slug}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.metaDescription,
    url: `${seoConfig.siteUrl}/kategorie/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: services.length,
      itemListElement: services.slice(0, 100).map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.name,
        url: `${seoConfig.siteUrl}/leistungen/${service.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#07101f] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap gap-2 text-sm text-slate-400"
          >
            <Link href="/" className="hover:text-white">
              Startseite
            </Link>
            <span>/</span>
            <Link
              href="/dienstleistungen"
              className="hover:text-white"
            >
              Dienstleistungen
            </Link>
            <span>/</span>
            <span className="text-slate-200">
              {category.name}
            </span>
          </nav>

          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">
                {category.icon}
              </span>
              <span className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">
                {category.eyebrow}
              </span>
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              {category.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              {category.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/offerte-anfragen"
                className="rounded-xl bg-gradient-to-r from-sky-400 to-fuchsia-500 px-6 py-3 font-bold text-slate-950 transition hover:scale-[1.02]"
              >
                Kostenlos Offerten erhalten
              </Link>

              <Link
                href="/dienstleistungen"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Alle Kategorien
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              Dienstleistungen
            </span>
            <h2 className="mt-2 text-3xl font-black">
              {services.length} Angebote in {category.shortName}
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Wähle die passende Leistung aus und vergleiche anschliessend
            Anbieter und Offerten in deiner Region.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/leistungen/${service.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-sky-400/40 hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-white">
                  {service.name}
                </h3>

                <span
                  aria-hidden="true"
                  className="text-sky-300 transition group-hover:translate-x-1"
                >
                  →
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Anbieter finden und kostenlos passende Offerten
                vergleichen.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
            Weitere Bereiche
          </span>

          <h2 className="mt-2 text-3xl font-black">
            Weitere Kategorien entdecken
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCatalog
              .filter((item) => item.slug !== category.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/kategorie/${item.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-fuchsia-400/40 hover:bg-white/[0.07]"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {item.icon}
                  </span>

                  <h3 className="mt-3 font-bold">
                    {item.name}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
