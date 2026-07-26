import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const city = await prisma.seoCity.upsert({
    where: {
      slug: "zuerich",
    },
    update: {
      name: "Zürich",
      canton: "ZH",
      region: "Region Zürich",
      country: "Schweiz",
      introduction:
        "Zürich ist das wirtschaftliche Zentrum der Schweiz und bietet eine grosse Auswahl an regionalen Fachbetrieben und Dienstleistern.",
      localContent:
        "Auftrago hilft Privatpersonen, Unternehmen und Verwaltungen dabei, passende Anbieter in Zürich zu finden und regionale Angebote einfach zu vergleichen.",
      seoTitle: "Dienstleister in Zürich finden | Auftrago",
      seoDescription:
        "Finde geprüfte Dienstleister in Zürich. Anfrage kostenlos erstellen und Angebote regionaler Anbieter vergleichen.",
      canonicalUrl: "https://www.auftrago.ch/stadt/zuerich",
      neighboringCities: [
        "Dietikon",
        "Dübendorf",
        "Kloten",
        "Uster",
        "Winterthur",
      ],
      status: "ACTIVE",
      indexable: true,
    },
    create: {
      slug: "zuerich",
      name: "Zürich",
      canton: "ZH",
      region: "Region Zürich",
      country: "Schweiz",
      introduction:
        "Zürich ist das wirtschaftliche Zentrum der Schweiz und bietet eine grosse Auswahl an regionalen Fachbetrieben und Dienstleistern.",
      localContent:
        "Auftrago hilft Privatpersonen, Unternehmen und Verwaltungen dabei, passende Anbieter in Zürich zu finden und regionale Angebote einfach zu vergleichen.",
      seoTitle: "Dienstleister in Zürich finden | Auftrago",
      seoDescription:
        "Finde geprüfte Dienstleister in Zürich. Anfrage kostenlos erstellen und Angebote regionaler Anbieter vergleichen.",
      canonicalUrl: "https://www.auftrago.ch/stadt/zuerich",
      neighboringCities: [
        "Dietikon",
        "Dübendorf",
        "Kloten",
        "Uster",
        "Winterthur",
      ],
      status: "ACTIVE",
      indexable: true,
      sortOrder: 1,
    },
  });

  const service = await prisma.seoServicePage.upsert({
    where: {
      slug: "fensterreinigung",
    },
    update: {
      name: "Fensterreinigung",
      shortName: "Fenster",
      description:
        "Professionelle Fensterreinigung für Wohnungen, Häuser, Büros und Gewerbeobjekte.",
      content:
        "Vergleiche regionale Anbieter für Fensterreinigung. Je nach Auftrag können Fensterflächen, Rahmen, Falze, Storen, Lamellen und schwer erreichbare Glasflächen gereinigt werden.",
      priceMinCents: 15000,
      priceMaxCents: 90000,
      priceUnit: "pro Auftrag",
      seoTitle: "Fensterreinigung in der Schweiz | Auftrago",
      seoDescription:
        "Finde regionale Anbieter für professionelle Fensterreinigung. Jetzt kostenlos Anfrage erstellen und Angebote vergleichen.",
      canonicalUrl:
        "https://www.auftrago.ch/leistungen/fensterreinigung",
      benefits: [
        "Regionale Anbieter vergleichen",
        "Kostenlose Anfrage",
        "Unverbindliche Rückmeldungen",
      ],
      relatedServices: [
        "reinigung",
        "umzugsreinigung",
        "hauswartung",
      ],
      status: "ACTIVE",
      indexable: true,
    },
    create: {
      slug: "fensterreinigung",
      name: "Fensterreinigung",
      shortName: "Fenster",
      description:
        "Professionelle Fensterreinigung für Wohnungen, Häuser, Büros und Gewerbeobjekte.",
      content:
        "Vergleiche regionale Anbieter für Fensterreinigung. Je nach Auftrag können Fensterflächen, Rahmen, Falze, Storen, Lamellen und schwer erreichbare Glasflächen gereinigt werden.",
      priceMinCents: 15000,
      priceMaxCents: 90000,
      priceUnit: "pro Auftrag",
      seoTitle: "Fensterreinigung in der Schweiz | Auftrago",
      seoDescription:
        "Finde regionale Anbieter für professionelle Fensterreinigung. Jetzt kostenlos Anfrage erstellen und Angebote vergleichen.",
      canonicalUrl:
        "https://www.auftrago.ch/leistungen/fensterreinigung",
      benefits: [
        "Regionale Anbieter vergleichen",
        "Kostenlose Anfrage",
        "Unverbindliche Rückmeldungen",
      ],
      relatedServices: [
        "reinigung",
        "umzugsreinigung",
        "hauswartung",
      ],
      status: "ACTIVE",
      indexable: true,
      sortOrder: 1,
    },
  });

  const landingPage = await prisma.seoLandingPage.upsert({
    where: {
      cityId_serviceId: {
        cityId: city.id,
        serviceId: service.id,
      },
    },
    update: {
      slug: "fensterreinigung-zuerich",
      headline: "Fensterreinigung in Zürich",
      introduction:
        "Finde passende Anbieter für professionelle Fensterreinigung in Zürich und vergleiche unverbindlich regionale Angebote.",
      content:
        "Ob Wohnung, Einfamilienhaus, Büro oder Gewerbeobjekt: Über Auftrago kannst du deinen Auftrag beschreiben und geeignete Reinigungsfirmen aus Zürich und Umgebung erreichen.",
      seoTitle:
        "Fensterreinigung Zürich – Anbieter vergleichen | Auftrago",
      seoDescription:
        "Finde Anbieter für Fensterreinigung in Zürich. Anfrage kostenlos erstellen und regionale Angebote unverbindlich vergleichen.",
      canonicalUrl:
        "https://www.auftrago.ch/dienstleistung/fensterreinigung/zuerich",
      customPriceMinCents: 15000,
      customPriceMaxCents: 90000,
      status: "ACTIVE",
      indexable: true,
      publishedAt: new Date(),
    },
    create: {
      cityId: city.id,
      serviceId: service.id,
      slug: "fensterreinigung-zuerich",
      headline: "Fensterreinigung in Zürich",
      introduction:
        "Finde passende Anbieter für professionelle Fensterreinigung in Zürich und vergleiche unverbindlich regionale Angebote.",
      content:
        "Ob Wohnung, Einfamilienhaus, Büro oder Gewerbeobjekt: Über Auftrago kannst du deinen Auftrag beschreiben und geeignete Reinigungsfirmen aus Zürich und Umgebung erreichen.",
      seoTitle:
        "Fensterreinigung Zürich – Anbieter vergleichen | Auftrago",
      seoDescription:
        "Finde Anbieter für Fensterreinigung in Zürich. Anfrage kostenlos erstellen und regionale Angebote unverbindlich vergleichen.",
      canonicalUrl:
        "https://www.auftrago.ch/dienstleistung/fensterreinigung/zuerich",
      customPriceMinCents: 15000,
      customPriceMaxCents: 90000,
      status: "ACTIVE",
      indexable: true,
      publishedAt: new Date(),
    },
  });

  console.log("SEO-Stadt:", city.name);
  console.log("SEO-Dienstleistung:", service.name);
  console.log("Landingpage:", landingPage.slug);
  console.log(
    "URL: http://localhost:3000/dienstleistung/fensterreinigung/zuerich"
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
