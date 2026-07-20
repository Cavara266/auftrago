import type { Metadata } from "next";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import ProviderCard from "@/components/provider/provider-card";
import ProviderFilters from "@/components/provider/provider-filters";
import ProviderPagination from "@/components/provider/provider-pagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Anbieter finden | Auftrago",
  description:
    "Finde geprüfte regionale Anbieter für Reinigung, Umzug, Hauswartung, Gartenpflege, Entsorgung und weitere Dienstleistungen.",
};

const PAGE_SIZE = 12;

const SERVICE_OPTIONS = [
  "Umzugsreinigung",
  "Unterhaltsreinigung",
  "Fensterreinigung",
  "Grundreinigung",
  "Büroreinigung",
  "Baureinigung",
  "Hauswartung",
  "Gartenpflege",
  "Winterdienst",
  "Umzug",
  "Räumung",
  "Entsorgung",
  "Transport",
  "Malerarbeiten",
];

const REGION_OPTIONS = [
  "Aargau",
  "Zürich",
  "Luzern",
  "Solothurn",
  "Zug",
  "Bern",
  "Basel-Stadt",
  "Basel-Landschaft",
  "Schwyz",
  "St. Gallen",
  "Thurgau",
  "Schaffhausen",
  "Nidwalden",
  "Obwalden",
  "Uri",
  "Glarus",
  "Freiburg",
  "Waadt",
  "Wallis",
  "Tessin",
];

type AnbieterFindenPageProps = {
  searchParams?: {
    q?: string;
    service?: string;
    region?: string;
    page?: string;
  };
};

function getSafePage(value?: string): number {
  const parsedPage = Number.parseInt(value ?? "1", 10);

  if (!Number.isFinite(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
}

export default async function AnbieterFindenPage({
  searchParams,
}: AnbieterFindenPageProps) {
  const query = searchParams?.q?.trim() ?? "";
  const selectedService = searchParams?.service?.trim() ?? "";
  const selectedRegion = searchParams?.region?.trim() ?? "";
  const requestedPage = getSafePage(searchParams?.page);

  const where: Prisma.ProviderWhereInput = {
    status: "APPROVED",
    slug: {
      not: null,
    },

    ...(selectedService
      ? {
          serviceCategories: {
            has: selectedService,
          },
        }
      : {}),

    ...(selectedRegion
      ? {
          serviceRegions: {
            has: selectedRegion,
          },
        }
      : {}),

    ...(query
      ? {
          OR: [
            {
              companyName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              contactName: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              city: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              postalCode: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              serviceCategories: {
                has: query,
              },
            },
            {
              serviceRegions: {
                has: query,
              },
            },
          ],
        }
      : {}),
  };

  const totalProviders = await prisma.provider.count({
    where,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(totalProviders / PAGE_SIZE)
  );

  const currentPage = Math.min(requestedPage, totalPages);

  const providers = await prisma.provider.findMany({
    where,
    select: {
      id: true,
      slug: true,
      companyName: true,
      logoUrl: true,
      description: true,
      postalCode: true,
      city: true,
      website: true,
      serviceCategories: true,
      serviceRegions: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [
      {
        updatedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const hasFilters = Boolean(
    query || selectedService || selectedRegion
  );

  return (
    <main className="min-h-screen bg-[#030816] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-40 h-[520px] w-[520px] rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Anbieter finden
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Finde den passenden Anbieter für dein Projekt
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-white/50 sm:text-lg">
            Vergleiche geprüfte regionale Unternehmen für Reinigung,
            Umzug, Hauswartung, Gartenpflege und weitere Arbeiten.
          </p>

          <div className="mt-10">
            <ProviderFilters
              query={query}
              selectedService={selectedService}
              selectedRegion={selectedRegion}
              serviceOptions={SERVICE_OPTIONS}
              regionOptions={REGION_OPTIONS}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-sky-200">
              {totalProviders}{" "}
              {totalProviders === 1
                ? "Anbieter gefunden"
                : "Anbieter gefunden"}
            </p>

            <h2 className="mt-2 text-3xl font-semibold">
              Passende Unternehmen
            </h2>
          </div>

          <p className="text-sm text-white/35">
            Seite {currentPage} von {totalPages}
          </p>
        </div>

        {providers.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                />
              ))}
            </div>

            <ProviderPagination
              currentPage={currentPage}
              totalPages={totalPages}
              query={query}
              selectedService={selectedService}
              selectedRegion={selectedRegion}
            />
          </>
        ) : (
          <div className="rounded-[30px] border border-white/10 bg-[#0a1325] px-6 py-16 text-center">
            <div className="text-5xl">🔎</div>

            <h2 className="mt-6 text-2xl font-semibold">
              Keine Anbieter gefunden
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/45">
              Für deine Auswahl wurden noch keine passenden Firmen
              gefunden. Ändere die Suche oder entferne einen Filter.
            </p>

            {hasFilters ? (
              <a
                href="/anbieter-finden"
                className="mt-7 inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-white px-6 text-sm font-black text-[#04101d] transition hover:bg-sky-100"
              >
                Alle Anbieter anzeigen
              </a>
            ) : (
              <a
                href="/anbieter"
                className="mt-7 inline-flex min-h-[50px] items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-6 text-sm font-black text-white transition hover:brightness-110"
              >
                Kostenlose Anfrage erstellen
              </a>
            )}
          </div>
        )}

        <div className="mt-16 rounded-[32px] border border-white/10 bg-gradient-to-br from-sky-400/10 via-[#0a1325] to-indigo-500/10 p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-200">
                Dein Auftrag
              </span>

              <h2 className="mt-3 text-3xl font-semibold">
                Noch keinen passenden Anbieter gefunden?
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-white/50">
                Erstelle kostenlos eine Anfrage. Passende regionale
                Firmen können dir anschliessend direkt ein Angebot
                unterbreiten.
              </p>
            </div>

            <a
              href="/anbieter"
              className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-white px-7 text-sm font-black text-[#04101d] transition hover:bg-sky-100"
            >
              Anfrage erstellen →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}