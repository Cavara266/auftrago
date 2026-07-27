import { prisma } from "../lib/db";

type ServiceSeed = {
  name: string;
  slug: string;
  leadPrice?: number;
  requiresLocation?: boolean;
  requiresDate?: boolean;
};

type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  services: ServiceSeed[];
};

const categories: CategorySeed[] = [
  {
    name: "Reinigung",
    slug: "reinigung",
    description: "Reinigungsarbeiten für Privatkunden und Unternehmen.",
    icon: "sparkles",
    services: [
      { name: "Umzugsreinigung", slug: "umzugsreinigung", leadPrice: 35, requiresDate: true },
      { name: "Wohnungsreinigung", slug: "wohnungsreinigung" },
      { name: "Hausreinigung", slug: "hausreinigung" },
      { name: "Unterhaltsreinigung", slug: "unterhaltsreinigung" },
      { name: "Büroreinigung", slug: "bueroreinigung" },
      { name: "Fensterreinigung", slug: "fensterreinigung" },
      { name: "Storenreinigung", slug: "storenreinigung" },
      { name: "Fassadenreinigung", slug: "fassadenreinigung" },
      { name: "Grundreinigung", slug: "grundreinigung" },
      { name: "Baureinigung", slug: "baureinigung" },
      { name: "Treppenhausreinigung", slug: "treppenhausreinigung" },
      { name: "Praxisreinigung", slug: "praxisreinigung" },
      { name: "Restaurantreinigung", slug: "restaurantreinigung" },
      { name: "Industriereinigung", slug: "industriereinigung" },
      { name: "Teppichreinigung", slug: "teppichreinigung" },
      { name: "Polsterreinigung", slug: "polsterreinigung" },
      { name: "Wintergartenreinigung", slug: "wintergartenreinigung" },
      { name: "Solaranlagenreinigung", slug: "solaranlagenreinigung" },
      { name: "Hochdruckreinigung", slug: "hochdruckreinigung" },
      { name: "Spezialreinigung", slug: "spezialreinigung" },
    ],
  },
  {
    name: "Hauswartung",
    slug: "hauswartung",
    description: "Hauswartung, Gebäudeunterhalt und technische Dienste.",
    icon: "building",
    services: [
      { name: "Hauswartung", slug: "hauswartung-komplett", leadPrice: 35 },
      { name: "Liegenschaftsbetreuung", slug: "liegenschaftsbetreuung" },
      { name: "Technischer Hausdienst", slug: "technischer-hausdienst" },
      { name: "Gebäudeunterhalt", slug: "gebaeudeunterhalt" },
      { name: "Kontrollgänge", slug: "kontrollgaenge" },
      { name: "Ferienvertretung Hauswartung", slug: "ferienvertretung-hauswartung" },
      { name: "Kleinreparaturen", slug: "kleinreparaturen" },
      { name: "Glühbirnen und Leuchtmittel ersetzen", slug: "leuchtmittel-ersetzen" },
      { name: "Briefkastenanlage warten", slug: "briefkastenanlage-warten" },
      { name: "Abwartdienst", slug: "abwartdienst" },
      { name: "Kehrichtbereitstellung", slug: "kehrichtbereitstellung" },
      { name: "Waschküchenbetreuung", slug: "waschkuechenbetreuung" },
    ],
  },
  {
    name: "Umzug & Transport",
    slug: "umzug-transport",
    description: "Umzüge, Transporte und Logistikdienstleistungen.",
    icon: "truck",
    services: [
      { name: "Privatumzug", slug: "privatumzug", leadPrice: 35, requiresDate: true },
      { name: "Firmenumzug", slug: "firmenumzug", leadPrice: 35, requiresDate: true },
      { name: "Kleintransport", slug: "kleintransport", leadPrice: 25 },
      { name: "Möbeltransport", slug: "moebeltransport", leadPrice: 25 },
      { name: "Klaviertransport", slug: "klaviertransport", leadPrice: 35 },
      { name: "Möbelmontage", slug: "moebelmontage" },
      { name: "Möbeldemontage", slug: "moebeldemontage" },
      { name: "Verpackungsservice", slug: "verpackungsservice" },
      { name: "Umzugshelfer", slug: "umzugshelfer" },
      { name: "Lagerung", slug: "lagerung" },
      { name: "Seniorenumzug", slug: "seniorenumzug" },
      { name: "Internationaler Umzug", slug: "internationaler-umzug", leadPrice: 35 },
      { name: "Expresskurier", slug: "expresskurier", leadPrice: 25 },
      { name: "Lieferdienst", slug: "lieferdienst", leadPrice: 25 },
    ],
  },
  {
    name: "Entsorgung & Räumung",
    slug: "entsorgung-raeumung",
    description: "Räumungen, Entsorgung und Haushaltsauflösungen.",
    icon: "trash",
    services: [
      { name: "Entsorgung", slug: "entsorgung", leadPrice: 25 },
      { name: "Wohnungsräumung", slug: "wohnungsraeumung", leadPrice: 25 },
      { name: "Hausräumung", slug: "hausraeumung", leadPrice: 25 },
      { name: "Kellerräumung", slug: "kellerraeumung", leadPrice: 25 },
      { name: "Estrichräumung", slug: "estrichraeumung", leadPrice: 25 },
      { name: "Garagenräumung", slug: "garagenraeumung", leadPrice: 25 },
      { name: "Haushaltsauflösung", slug: "haushaltsaufloesung", leadPrice: 25 },
      { name: "Geschäftsauflösung", slug: "geschaeftsaufloesung", leadPrice: 25 },
      { name: "Sperrgutentsorgung", slug: "sperrgutentsorgung", leadPrice: 25 },
      { name: "Möbelentsorgung", slug: "moebelentsorgung", leadPrice: 25 },
      { name: "Bauschuttentsorgung", slug: "bauschuttentsorgung", leadPrice: 25 },
      { name: "Grüngutentsorgung", slug: "gruengutentsorgung", leadPrice: 25 },
    ],
  },
  {
    name: "Garten & Aussenbereich",
    slug: "garten-aussenbereich",
    description: "Gartenpflege und Arbeiten rund um Aussenanlagen.",
    icon: "leaf",
    services: [
      { name: "Gartenpflege", slug: "gartenpflege" },
      { name: "Rasenmähen", slug: "rasenmaehen" },
      { name: "Heckenschnitt", slug: "heckenschnitt" },
      { name: "Baumschnitt", slug: "baumschnitt" },
      { name: "Baumfällung", slug: "baumfaellung" },
      { name: "Unkraut entfernen", slug: "unkraut-entfernen" },
      { name: "Laubarbeiten", slug: "laubarbeiten" },
      { name: "Bepflanzung", slug: "bepflanzung" },
      { name: "Gartengestaltung", slug: "gartengestaltung" },
      { name: "Terrassenreinigung", slug: "terrassenreinigung" },
      { name: "Sitzplatzreinigung", slug: "sitzplatzreinigung" },
      { name: "Gartenunterhalt", slug: "gartenunterhalt" },
      { name: "Bewässerungssystem", slug: "bewaesserungssystem" },
      { name: "Zaunbau", slug: "zaunbau" },
      { name: "Winterdienst", slug: "winterdienst" },
      { name: "Schneeräumung", slug: "schneeraeumung" },
      { name: "Salzen und Glatteisbekämpfung", slug: "salzen-glatteis" },
    ],
  },
  {
    name: "Maler & Gipser",
    slug: "maler-gipser",
    description: "Malerarbeiten, Gipserarbeiten und Renovationen.",
    icon: "paintbrush",
    services: [
      { name: "Malerarbeiten innen", slug: "malerarbeiten-innen", leadPrice: 35 },
      { name: "Malerarbeiten aussen", slug: "malerarbeiten-aussen", leadPrice: 35 },
      { name: "Wohnung streichen", slug: "wohnung-streichen", leadPrice: 35 },
      { name: "Fassade streichen", slug: "fassade-streichen", leadPrice: 35 },
      { name: "Gipserarbeiten", slug: "gipserarbeiten", leadPrice: 35 },
      { name: "Verputzarbeiten", slug: "verputzarbeiten", leadPrice: 35 },
      { name: "Tapeten entfernen", slug: "tapeten-entfernen" },
      { name: "Tapezieren", slug: "tapezieren" },
      { name: "Schimmelbehandlung", slug: "schimmelbehandlung" },
      { name: "Lackierarbeiten", slug: "lackierarbeiten" },
      { name: "Renovationsarbeiten", slug: "renovationsarbeiten", leadPrice: 35 },
    ],
  },
  {
    name: "Sanitär & Heizung",
    slug: "sanitaer-heizung",
    description: "Sanitär-, Heizungs- und Installationsarbeiten.",
    icon: "droplets",
    services: [
      { name: "Sanitärarbeiten", slug: "sanitaerarbeiten", leadPrice: 25 },
      { name: "Rohrreinigung", slug: "rohrreinigung", leadPrice: 25 },
      { name: "Abflussreinigung", slug: "abflussreinigung", leadPrice: 25 },
      { name: "Wasserhahn reparieren", slug: "wasserhahn-reparieren", leadPrice: 25 },
      { name: "WC reparieren", slug: "wc-reparieren", leadPrice: 25 },
      { name: "Dusche montieren", slug: "dusche-montieren", leadPrice: 25 },
      { name: "Badrenovation", slug: "badrenovation", leadPrice: 35 },
      { name: "Heizungsservice", slug: "heizungsservice", leadPrice: 25 },
      { name: "Heizung reparieren", slug: "heizung-reparieren", leadPrice: 25 },
      { name: "Wärmepumpe installieren", slug: "waermepumpe-installieren", leadPrice: 35 },
      { name: "Boiler ersetzen", slug: "boiler-ersetzen", leadPrice: 25 },
      { name: "Bodenheizung", slug: "bodenheizung", leadPrice: 35 },
    ],
  },
  {
    name: "Elektro",
    slug: "elektro",
    description: "Elektrische Installationen und Reparaturen.",
    icon: "zap",
    services: [
      { name: "Elektriker", slug: "elektriker", leadPrice: 25 },
      { name: "Elektroinstallation", slug: "elektroinstallation", leadPrice: 25 },
      { name: "Steckdose montieren", slug: "steckdose-montieren", leadPrice: 25 },
      { name: "Lampe montieren", slug: "lampe-montieren", leadPrice: 25 },
      { name: "Sicherungskasten", slug: "sicherungskasten", leadPrice: 25 },
      { name: "Elektrokontrolle", slug: "elektrokontrolle", leadPrice: 25 },
      { name: "Smart Home Installation", slug: "smart-home-installation", leadPrice: 25 },
      { name: "Ladestation Elektroauto", slug: "ladestation-elektroauto", leadPrice: 35 },
      { name: "Solaranlage installieren", slug: "solaranlage-installieren", leadPrice: 35 },
      { name: "Photovoltaik Beratung", slug: "photovoltaik-beratung", leadPrice: 35 },
    ],
  },
  {
    name: "Handwerk & Renovation",
    slug: "handwerk-renovation",
    description: "Handwerkliche Arbeiten und Renovationsprojekte.",
    icon: "hammer",
    services: [
      { name: "Schreinerarbeiten", slug: "schreinerarbeiten", leadPrice: 35 },
      { name: "Bodenleger", slug: "bodenleger", leadPrice: 35 },
      { name: "Parkett verlegen", slug: "parkett-verlegen", leadPrice: 35 },
      { name: "Laminat verlegen", slug: "laminat-verlegen", leadPrice: 35 },
      { name: "Plattenleger", slug: "plattenleger", leadPrice: 35 },
      { name: "Küchenmontage", slug: "kuechenmontage", leadPrice: 35 },
      { name: "Türen montieren", slug: "tueren-montieren", leadPrice: 25 },
      { name: "Fenster montieren", slug: "fenster-montieren", leadPrice: 35 },
      { name: "Trockenbau", slug: "trockenbau", leadPrice: 35 },
      { name: "Maurerarbeiten", slug: "maurerarbeiten", leadPrice: 35 },
      { name: "Dachdecker", slug: "dachdecker", leadPrice: 35 },
      { name: "Allround-Handwerker", slug: "allround-handwerker", leadPrice: 25 },
      { name: "Möbelmontage Handwerker", slug: "moebelmontage-handwerker", leadPrice: 25 },
      { name: "Balkonsanierung", slug: "balkonsanierung", leadPrice: 35 },
    ],
  },
  {
    name: "IT & Technik",
    slug: "it-technik",
    description: "IT-Support, Webseiten und technische Dienstleistungen.",
    icon: "monitor",
    services: [
      { name: "IT-Support", slug: "it-support" },
      { name: "Computer Reparatur", slug: "computer-reparatur" },
      { name: "Netzwerk einrichten", slug: "netzwerk-einrichten" },
      { name: "WLAN einrichten", slug: "wlan-einrichten" },
      { name: "Datenrettung", slug: "datenrettung" },
      { name: "Webseite erstellen", slug: "webseite-erstellen" },
      { name: "Onlineshop erstellen", slug: "onlineshop-erstellen" },
      { name: "SEO Optimierung", slug: "seo-optimierung" },
      { name: "Social Media Betreuung", slug: "social-media-betreuung" },
      { name: "Softwareentwicklung", slug: "softwareentwicklung" },
      { name: "Videoüberwachung", slug: "videoueberwachung" },
      { name: "Alarmanlage", slug: "alarmanlage" },
    ],
  },
  {
    name: "Business & Beratung",
    slug: "business-beratung",
    description: "Geschäftliche Beratung und professionelle Dienstleistungen.",
    icon: "briefcase",
    services: [
      { name: "Treuhand", slug: "treuhand", leadPrice: 35 },
      { name: "Buchhaltung", slug: "buchhaltung", leadPrice: 35 },
      { name: "Steuerberatung", slug: "steuerberatung", leadPrice: 35 },
      { name: "Versicherungsberatung", slug: "versicherungsberatung", leadPrice: 35 },
      { name: "Immobilienmakler", slug: "immobilienmakler", leadPrice: 35 },
      { name: "Finanzberatung", slug: "finanzberatung", leadPrice: 35 },
      { name: "Unternehmensberatung", slug: "unternehmensberatung", leadPrice: 35 },
      { name: "Rechtsberatung", slug: "rechtsberatung", leadPrice: 35 },
      { name: "Personalvermittlung", slug: "personalvermittlung", leadPrice: 35 },
      { name: "Marketingberatung", slug: "marketingberatung", leadPrice: 35 },
    ],
  },
];

async function main() {
  console.log("Dienstleistungen werden angelegt...");

  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
    const categoryData = categories[categoryIndex];

    const category = await prisma.serviceCategory.upsert({
      where: {
        slug: categoryData.slug,
      },
      update: {
        name: categoryData.name,
        description: categoryData.description,
        icon: categoryData.icon,
        sortOrder: categoryIndex,
      },
      create: {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        icon: categoryData.icon,
        sortOrder: categoryIndex,
      },
    });

    for (
      let serviceIndex = 0;
      serviceIndex < categoryData.services.length;
      serviceIndex++
    ) {
      const service = categoryData.services[serviceIndex];

      await prisma.service.upsert({
        where: {
          slug: service.slug,
        },
        update: {
          categoryId: category.id,
          name: service.name,
          leadPrice: service.leadPrice ?? 20,
          requiresLocation: service.requiresLocation ?? true,
          requiresDate: service.requiresDate ?? false,
          sortOrder: serviceIndex,
        },
        create: {
          categoryId: category.id,
          slug: service.slug,
          name: service.name,
          leadPrice: service.leadPrice ?? 20,
          requiresLocation: service.requiresLocation ?? true,
          requiresDate: service.requiresDate ?? false,
          allowsFiles: true,
          maxPurchases: 4,
          lifetimeDays: 7,
          sortOrder: serviceIndex,
        },
      });
    }

    console.log(
      `✓ ${categoryData.name}: ${categoryData.services.length} Dienstleistungen`
    );
  }

  const categoryCount = await prisma.serviceCategory.count();
  const serviceCount = await prisma.service.count();

  console.log("");
  console.log(`Fertig: ${categoryCount} Kategorien`);
  console.log(`Fertig: ${serviceCount} Dienstleistungen`);
}

main()
  .catch((error) => {
    console.error("Service-Seed fehlgeschlagen:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
