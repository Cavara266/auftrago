export type ServiceCategory =
  | "haus-reinigung"
  | "handwerk"
  | "umzug-transport"
  | "garten-aussenbereich"
  | "immobilien"
  | "energie-technik"
  | "it-digital"
  | "finanzen-beratung";

export type ServiceCatalogItem = {
  slug: string;
  name: string;
  category: ServiceCategory;
  keywords?: string[];
};

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    slug: "reinigung",
    name: "Reinigung",
    category: "haus-reinigung",
  },
  {
    slug: "umzugsreinigung",
    name: "Umzugsreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "hauswartung",
    name: "Hauswartung",
    category: "haus-reinigung",
  },
  {
    slug: "treppenhausreinigung",
    name: "Treppenhausreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "bueroreinigung",
    name: "Büroreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "gartenpflege",
    name: "Gartenpflege",
    category: "garten-aussenbereich",
  },
  {
    slug: "umzug",
    name: "Umzug",
    category: "umzug-transport",
  },
  {
    slug: "transport",
    name: "Transport",
    category: "haus-reinigung",
  },
  {
    slug: "entsorgung",
    name: "Entsorgung",
    category: "umzug-transport",
  },
  {
    slug: "maler",
    name: "Maler",
    category: "handwerk",
  },
  {
    slug: "bodenleger",
    name: "Bodenleger",
    category: "handwerk",
  },
  {
    slug: "elektriker",
    name: "Elektriker",
    category: "handwerk",
  },
  {
    slug: "sanitaer",
    name: "Sanitär",
    category: "handwerk",
  },
  {
    slug: "fensterreinigung",
    name: "Fensterreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "baureinigung",
    name: "Baureinigung",
    category: "haus-reinigung",
  },
  {
    slug: "end-reinigung",
    name: "End Reinigung",
    category: "haus-reinigung",
  },
  {
    slug: "gebaeudereinigung",
    name: "Gebäudereinigung",
    category: "haus-reinigung",
  },
  {
    slug: "winterdienst",
    name: "Winterdienst",
    category: "garten-aussenbereich",
  },
  {
    slug: "kellerraeumung",
    name: "Kellerräumung",
    category: "umzug-transport",
  },
  {
    slug: "moebeltransport",
    name: "Möbeltransport",
    category: "umzug-transport",
  },
  {
    slug: "wohnungsreinigung",
    name: "Wohnungsreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "unterhaltsreinigung",
    name: "Unterhaltsreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "praxisreinigung",
    name: "Praxisreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "fassadenreinigung",
    name: "Fassadenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "heckenschnitt",
    name: "Heckenschnitt",
    category: "garten-aussenbereich",
  },
  {
    slug: "rasenpflege",
    name: "Rasenpflege",
    category: "garten-aussenbereich",
  },
  {
    slug: "liegenschaftsunterhalt",
    name: "Liegenschaftsunterhalt",
    category: "haus-reinigung",
  },
  {
    slug: "hausmeisterservice",
    name: "Hausmeisterservice",
    category: "haus-reinigung",
  },
  {
    slug: "raeumung",
    name: "Räumung",
    category: "umzug-transport",
  },
  {
    slug: "estrichraeumung",
    name: "Estrichräumung",
    category: "umzug-transport",
  },
  {
    slug: "hauswartfirma",
    name: "Hauswartfirma",
    category: "haus-reinigung",
  },
  {
    slug: "hauswartservice",
    name: "Hauswartservice",
    category: "haus-reinigung",
  },
  {
    slug: "hauswartarbeiten",
    name: "Hauswartarbeiten",
    category: "haus-reinigung",
  },
  {
    slug: "gartenunterhalt",
    name: "Gartenunterhalt",
    category: "garten-aussenbereich",
  },
  {
    slug: "baumschnitt",
    name: "Baumschnitt",
    category: "garten-aussenbereich",
  },
  {
    slug: "entruempelung",
    name: "Entrümpelung",
    category: "umzug-transport",
  },
  {
    slug: "haushaltsaufloesung",
    name: "Haushaltsauflösung",
    category: "umzug-transport",
  },
  {
    slug: "glasreinigung",
    name: "Glasreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "storenreinigung",
    name: "Storenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "wintergartenreinigung",
    name: "Wintergartenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "kleintransport",
    name: "Kleintransport",
    category: "umzug-transport",
  },
  {
    slug: "firmenumzug",
    name: "Firmenumzug",
    category: "umzug-transport",
  },
  {
    slug: "privatumzug",
    name: "Privatumzug",
    category: "umzug-transport",
  },
  {
    slug: "dachreinigung",
    name: "Dachreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "dachwartung",
    name: "Dachwartung",
    category: "handwerk",
  },
  {
    slug: "sanitaerservice",
    name: "Sanitärservice",
    category: "handwerk",
  },
  {
    slug: "heizungsservice",
    name: "Heizungsservice",
    category: "handwerk",
  },
  {
    slug: "elektroinstallationen",
    name: "Elektroinstallationen",
    category: "handwerk",
  },
  {
    slug: "elektroservice",
    name: "Elektroservice",
    category: "handwerk",
  },
  {
    slug: "parkettlegen",
    name: "Parkettlegen",
    category: "handwerk",
  },
  {
    slug: "laminat-verlegen",
    name: "Laminat verlegen",
    category: "handwerk",
  },
  {
    slug: "objektbetreuung",
    name: "Objektbetreuung",
    category: "haus-reinigung",
  },
  {
    slug: "bueroumzug",
    name: "Büroumzug",
    category: "umzug-transport",
  },
  {
    slug: "lagerraeumung",
    name: "Lagerräumung",
    category: "umzug-transport",
  },
  {
    slug: "schneeraeumung",
    name: "Schneeräumung",
    category: "garten-aussenbereich",
  },
  {
    slug: "salzdienst",
    name: "Salzdienst",
    category: "garten-aussenbereich",
  },
  {
    slug: "endreinigung",
    name: "Endreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "abgabereinigung",
    name: "Abgabereinigung",
    category: "haus-reinigung",
  },
  {
    slug: "hausreinigung",
    name: "Hausreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "grundreinigung",
    name: "Grundreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "schulhausreinigung",
    name: "Schulhausreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "kindergartenreinigung",
    name: "Kindergartenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "hotelreinigung",
    name: "Hotelreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "restaurantreinigung",
    name: "Restaurantreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "kuechenreinigung",
    name: "Küchenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "badreinigung",
    name: "Badreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "industriereinigung",
    name: "Industriereinigung",
    category: "haus-reinigung",
  },
  {
    slug: "produktionsreinigung",
    name: "Produktionsreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "lagerreinigung",
    name: "Lagerreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "garagenreinigung",
    name: "Garagenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "tiefgaragenreinigung",
    name: "Tiefgaragenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "baugrobreinigung",
    name: "Baugrobreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "baufeinreinigung",
    name: "Baufeinreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "bauschlussreinigung",
    name: "Bauschlussreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "schaufensterreinigung",
    name: "Schaufensterreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "lamellenstorenreinigung",
    name: "Lamellenstorenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "solarpanelreinigung",
    name: "Solarpanelreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "photovoltaikreinigung",
    name: "Photovoltaikreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "teppichreinigung",
    name: "Teppichreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "polsterreinigung",
    name: "Polsterreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "sofareinigung",
    name: "Sofareinigung",
    category: "haus-reinigung",
  },
  {
    slug: "matratzenreinigung",
    name: "Matratzenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "vorhangreinigung",
    name: "Vorhangreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "bodenreinigung",
    name: "Bodenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "parkettreinigung",
    name: "Parkettreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "natursteinreinigung",
    name: "Natursteinreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "plattenreinigung",
    name: "Plattenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "hochdruckreinigung",
    name: "Hochdruckreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "dampfreinigung",
    name: "Dampfreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "desinfektionsreinigung",
    name: "Desinfektionsreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "hygienereinigung",
    name: "Hygienereinigung",
    category: "haus-reinigung",
  },
  {
    slug: "spezialreinigung",
    name: "Spezialreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "brandschadenreinigung",
    name: "Brandschadenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "wasserschadenreinigung",
    name: "Wasserschadenreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "graffitientfernung",
    name: "Graffitientfernung",
    category: "haus-reinigung",
  },
  {
    slug: "kaugummientfernung",
    name: "Kaugummientfernung",
    category: "haus-reinigung",
  },
  {
    slug: "schimmelentfernung",
    name: "Schimmelentfernung",
    category: "haus-reinigung",
  },
  {
    slug: "geruchsbeseitigung",
    name: "Geruchsbeseitigung",
    category: "haus-reinigung",
  },
  {
    slug: "messie-reinigung",
    name: "Messie Reinigung",
    category: "haus-reinigung",
  },
  {
    slug: "tatortreinigung",
    name: "Tatortreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "reinigung-privathaushalt",
    name: "Reinigung Privathaushalt",
    category: "haus-reinigung",
  },
  {
    slug: "reinigung-gewerbe",
    name: "Reinigung Gewerbe",
    category: "haus-reinigung",
  },
  {
    slug: "reinigung-industrie",
    name: "Reinigung Industrie",
    category: "haus-reinigung",
  },
  {
    slug: "reinigung-nach-renovation",
    name: "Reinigung nach Renovation",
    category: "haus-reinigung",
  },
  {
    slug: "reinigung-nach-umbau",
    name: "Reinigung nach Umbau",
    category: "haus-reinigung",
  },
  {
    slug: "ferienwohnungsreinigung",
    name: "Ferienwohnungsreinigung",
    category: "haus-reinigung",
  },
  {
    slug: "airbnb-reinigung",
    name: "Airbnb Reinigung",
    category: "haus-reinigung",
  },
  {
    slug: "gebaeudeunterhalt",
    name: "Gebäudeunterhalt",
    category: "haus-reinigung",
  },
  {
    slug: "kontrollgaenge",
    name: "Kontrollgänge",
    category: "haus-reinigung",
  },
  {
    slug: "technischer-hausdienst",
    name: "Technischer Hausdienst",
    category: "haus-reinigung",
  },
  {
    slug: "reinigungsabonnement",
    name: "Reinigungsabonnement",
    category: "haus-reinigung",
  },
  {
    slug: "putzfrau",
    name: "Putzfrau",
    category: "haus-reinigung",
  },
  {
    slug: "putzmann",
    name: "Putzmann",
    category: "haus-reinigung",
  },
  {
    slug: "reinigungskraft",
    name: "Reinigungskraft",
    category: "haus-reinigung",
  },
  {
    slug: "malerarbeiten",
    name: "Malerarbeiten",
    category: "handwerk",
  },
  {
    slug: "innenmaler",
    name: "Innenmaler",
    category: "handwerk",
  },
  {
    slug: "fassadenmaler",
    name: "Fassadenmaler",
    category: "handwerk",
  },
  {
    slug: "tapezierer",
    name: "Tapezierer",
    category: "handwerk",
  },
  {
    slug: "spritzlackierer",
    name: "Spritzlackierer",
    category: "handwerk",
  },
  {
    slug: "gipser",
    name: "Gipser",
    category: "handwerk",
  },
  {
    slug: "gipserarbeiten",
    name: "Gipserarbeiten",
    category: "handwerk",
  },
  {
    slug: "trockenbau",
    name: "Trockenbau",
    category: "handwerk",
  },
  {
    slug: "deckenbau",
    name: "Deckenbau",
    category: "handwerk",
  },
  {
    slug: "trennwandbau",
    name: "Trennwandbau",
    category: "handwerk",
  },
  {
    slug: "verputzarbeiten",
    name: "Verputzarbeiten",
    category: "handwerk",
  },
  {
    slug: "maurer",
    name: "Maurer",
    category: "handwerk",
  },
  {
    slug: "maurerarbeiten",
    name: "Maurerarbeiten",
    category: "handwerk",
  },
  {
    slug: "betonarbeiten",
    name: "Betonarbeiten",
    category: "handwerk",
  },
  {
    slug: "kernbohrung",
    name: "Kernbohrung",
    category: "handwerk",
  },
  {
    slug: "abbrucharbeiten",
    name: "Abbrucharbeiten",
    category: "handwerk",
  },
  {
    slug: "rueckbau",
    name: "Rückbau",
    category: "handwerk",
  },
  {
    slug: "renovation",
    name: "Renovation",
    category: "handwerk",
  },
  {
    slug: "sanierung",
    name: "Sanierung",
    category: "handwerk",
  },
  {
    slug: "umbau",
    name: "Umbau",
    category: "handwerk",
  },
  {
    slug: "wohnungsumbau",
    name: "Wohnungsumbau",
    category: "handwerk",
  },
  {
    slug: "badumbau",
    name: "Badumbau",
    category: "handwerk",
  },
  {
    slug: "kuechenumbau",
    name: "Küchenumbau",
    category: "handwerk",
  },
  {
    slug: "schreiner",
    name: "Schreiner",
    category: "handwerk",
  },
  {
    slug: "schreinerarbeiten",
    name: "Schreinerarbeiten",
    category: "handwerk",
  },
  {
    slug: "moebelmontage",
    name: "Möbelmontage",
    category: "handwerk",
  },
  {
    slug: "moebelbau",
    name: "Möbelbau",
    category: "handwerk",
  },
  {
    slug: "einbauschrank",
    name: "Einbauschrank",
    category: "handwerk",
  },
  {
    slug: "kuechenmontage",
    name: "Küchenmontage",
    category: "handwerk",
  },
  {
    slug: "tuerenmontage",
    name: "Türenmontage",
    category: "handwerk",
  },
  {
    slug: "fenstermontage",
    name: "Fenstermontage",
    category: "handwerk",
  },
  {
    slug: "zimmermann",
    name: "Zimmermann",
    category: "handwerk",
  },
  {
    slug: "holzbau",
    name: "Holzbau",
    category: "handwerk",
  },
  {
    slug: "dachdecker",
    name: "Dachdecker",
    category: "handwerk",
  },
  {
    slug: "dachsanierung",
    name: "Dachsanierung",
    category: "handwerk",
  },
  {
    slug: "flachdacharbeiten",
    name: "Flachdacharbeiten",
    category: "handwerk",
  },
  {
    slug: "spengler",
    name: "Spengler",
    category: "handwerk",
  },
  {
    slug: "spenglerarbeiten",
    name: "Spenglerarbeiten",
    category: "handwerk",
  },
  {
    slug: "fassadenbau",
    name: "Fassadenbau",
    category: "handwerk",
  },
  {
    slug: "geruestbau",
    name: "Gerüstbau",
    category: "handwerk",
  },
  {
    slug: "bodenbelaege",
    name: "Bodenbeläge",
    category: "handwerk",
  },
  {
    slug: "parkettschleifen",
    name: "Parkettschleifen",
    category: "handwerk",
  },
  {
    slug: "vinylboden-verlegen",
    name: "Vinylboden verlegen",
    category: "handwerk",
  },
  {
    slug: "teppichboden-verlegen",
    name: "Teppichboden verlegen",
    category: "handwerk",
  },
  {
    slug: "linoleum-verlegen",
    name: "Linoleum verlegen",
    category: "handwerk",
  },
  {
    slug: "plattenleger",
    name: "Plattenleger",
    category: "handwerk",
  },
  {
    slug: "fliesenleger",
    name: "Fliesenleger",
    category: "handwerk",
  },
  {
    slug: "natursteinleger",
    name: "Natursteinleger",
    category: "handwerk",
  },
  {
    slug: "fugenarbeiten",
    name: "Fugenarbeiten",
    category: "handwerk",
  },
  {
    slug: "elektroreparatur",
    name: "Elektroreparatur",
    category: "handwerk",
  },
  {
    slug: "stromanschluss",
    name: "Stromanschluss",
    category: "handwerk",
  },
  {
    slug: "steckdosen-installieren",
    name: "Steckdosen installieren",
    category: "handwerk",
  },
  {
    slug: "beleuchtung-installieren",
    name: "Beleuchtung installieren",
    category: "handwerk",
  },
  {
    slug: "smart-home-installation",
    name: "Smart Home Installation",
    category: "handwerk",
  },
  {
    slug: "netzwerkinstallation",
    name: "Netzwerkinstallation",
    category: "handwerk",
  },
  {
    slug: "alarmanlage-installieren",
    name: "Alarmanlage installieren",
    category: "handwerk",
  },
  {
    slug: "videoueberwachung-installieren",
    name: "Videoüberwachung installieren",
    category: "handwerk",
  },
  {
    slug: "sanitaerinstallation",
    name: "Sanitärinstallation",
    category: "handwerk",
  },
  {
    slug: "sanitaerreparatur",
    name: "Sanitärreparatur",
    category: "handwerk",
  },
  {
    slug: "rohrreinigung",
    name: "Rohrreinigung",
    category: "handwerk",
  },
  {
    slug: "abflussreinigung",
    name: "Abflussreinigung",
    category: "handwerk",
  },
  {
    slug: "kanalsanierung",
    name: "Kanalsanierung",
    category: "handwerk",
  },
  {
    slug: "leckortung",
    name: "Leckortung",
    category: "handwerk",
  },
  {
    slug: "wasserleitung-reparieren",
    name: "Wasserleitung reparieren",
    category: "handwerk",
  },
  {
    slug: "boiler-ersetzen",
    name: "Boiler ersetzen",
    category: "handwerk",
  },
  {
    slug: "armaturen-montieren",
    name: "Armaturen montieren",
    category: "handwerk",
  },
  {
    slug: "wc-reparieren",
    name: "WC reparieren",
    category: "handwerk",
  },
  {
    slug: "heizungsinstallation",
    name: "Heizungsinstallation",
    category: "handwerk",
  },
  {
    slug: "heizungswartung",
    name: "Heizungswartung",
    category: "handwerk",
  },
  {
    slug: "heizungsreparatur",
    name: "Heizungsreparatur",
    category: "handwerk",
  },
  {
    slug: "bodenheizung",
    name: "Bodenheizung",
    category: "handwerk",
  },
  {
    slug: "radiatoren-ersetzen",
    name: "Radiatoren ersetzen",
    category: "handwerk",
  },
  {
    slug: "lueftungsanlage",
    name: "Lüftungsanlage",
    category: "handwerk",
  },
  {
    slug: "lueftungsreinigung",
    name: "Lüftungsreinigung",
    category: "handwerk",
  },
  {
    slug: "klimatechnik",
    name: "Klimatechnik",
    category: "handwerk",
  },
  {
    slug: "klimaanlage-installieren",
    name: "Klimaanlage installieren",
    category: "handwerk",
  },
  {
    slug: "klimaanlage-warten",
    name: "Klimaanlage warten",
    category: "handwerk",
  },
  {
    slug: "glaser",
    name: "Glaser",
    category: "handwerk",
  },
  {
    slug: "glasbruch-reparieren",
    name: "Glasbruch reparieren",
    category: "handwerk",
  },
  {
    slug: "fenster-reparieren",
    name: "Fenster reparieren",
    category: "handwerk",
  },
  {
    slug: "rollladen-reparieren",
    name: "Rollladen reparieren",
    category: "handwerk",
  },
  {
    slug: "storen-reparieren",
    name: "Storen reparieren",
    category: "handwerk",
  },
  {
    slug: "schlosser",
    name: "Schlosser",
    category: "handwerk",
  },
  {
    slug: "schluesseldienst",
    name: "Schlüsseldienst",
    category: "handwerk",
  },
  {
    slug: "metallbau",
    name: "Metallbau",
    category: "handwerk",
  },
  {
    slug: "schweissarbeiten",
    name: "Schweissarbeiten",
    category: "handwerk",
  },
  {
    slug: "gelaenderbau",
    name: "Geländerbau",
    category: "handwerk",
  },
  {
    slug: "zaunbau",
    name: "Zaunbau",
    category: "handwerk",
  },
  {
    slug: "garagentor-reparieren",
    name: "Garagentor reparieren",
    category: "handwerk",
  },
  {
    slug: "haushaltsgeraete-reparatur",
    name: "Haushaltsgeräte Reparatur",
    category: "handwerk",
  },
  {
    slug: "waschmaschine-reparatur",
    name: "Waschmaschine Reparatur",
    category: "handwerk",
  },
  {
    slug: "geschirrspueler-reparatur",
    name: "Geschirrspüler Reparatur",
    category: "handwerk",
  },
  {
    slug: "kuehlschrank-reparatur",
    name: "Kühlschrank Reparatur",
    category: "handwerk",
  },
  {
    slug: "backofen-reparatur",
    name: "Backofen Reparatur",
    category: "handwerk",
  },
  {
    slug: "handwerker",
    name: "Handwerker",
    category: "handwerk",
  },
  {
    slug: "allrounder",
    name: "Allrounder",
    category: "handwerk",
  },
  {
    slug: "montageservice",
    name: "Montageservice",
    category: "handwerk",
  },
  {
    slug: "reparaturservice",
    name: "Reparaturservice",
    category: "handwerk",
  },
  {
    slug: "seniorenumzug",
    name: "Seniorenumzug",
    category: "umzug-transport",
  },
  {
    slug: "studentenumzug",
    name: "Studentenumzug",
    category: "umzug-transport",
  },
  {
    slug: "auslandsumzug",
    name: "Auslandsumzug",
    category: "umzug-transport",
  },
  {
    slug: "internationaler-umzug",
    name: "Internationaler Umzug",
    category: "umzug-transport",
  },
  {
    slug: "wohnungsumzug",
    name: "Wohnungsumzug",
    category: "umzug-transport",
  },
  {
    slug: "hausumzug",
    name: "Hausumzug",
    category: "umzug-transport",
  },
  {
    slug: "warentransport",
    name: "Warentransport",
    category: "umzug-transport",
  },
  {
    slug: "express-transport",
    name: "Express Transport",
    category: "umzug-transport",
  },
  {
    slug: "kurierdienst",
    name: "Kurierdienst",
    category: "umzug-transport",
  },
  {
    slug: "lieferdienst",
    name: "Lieferdienst",
    category: "umzug-transport",
  },
  {
    slug: "lastwagen-transport",
    name: "Lastwagen Transport",
    category: "umzug-transport",
  },
  {
    slug: "transport-mit-lieferwagen",
    name: "Transport mit Lieferwagen",
    category: "umzug-transport",
  },
  {
    slug: "palettentransport",
    name: "Palettentransport",
    category: "umzug-transport",
  },
  {
    slug: "spezialtransport",
    name: "Spezialtransport",
    category: "umzug-transport",
  },
  {
    slug: "klaviertransport",
    name: "Klaviertransport",
    category: "umzug-transport",
  },
  {
    slug: "tresortransport",
    name: "Tresortransport",
    category: "umzug-transport",
  },
  {
    slug: "maschinentransport",
    name: "Maschinentransport",
    category: "umzug-transport",
  },
  {
    slug: "motorradtransport",
    name: "Motorradtransport",
    category: "umzug-transport",
  },
  {
    slug: "fahrradtransport",
    name: "Fahrradtransport",
    category: "umzug-transport",
  },
  {
    slug: "moebellift",
    name: "Möbellift",
    category: "umzug-transport",
  },
  {
    slug: "umzugshilfe",
    name: "Umzugshilfe",
    category: "umzug-transport",
  },
  {
    slug: "umzugshelfer",
    name: "Umzugshelfer",
    category: "umzug-transport",
  },
  {
    slug: "moebelpacker",
    name: "Möbelpacker",
    category: "umzug-transport",
  },
  {
    slug: "einpackservice",
    name: "Einpackservice",
    category: "umzug-transport",
  },
  {
    slug: "auspackservice",
    name: "Auspackservice",
    category: "umzug-transport",
  },
  {
    slug: "umzugskartons",
    name: "Umzugskartons",
    category: "umzug-transport",
  },
  {
    slug: "moebel-demontieren",
    name: "Möbel demontieren",
    category: "umzug-transport",
  },
  {
    slug: "moebel-montieren",
    name: "Möbel montieren",
    category: "umzug-transport",
  },
  {
    slug: "zwischenlagerung",
    name: "Zwischenlagerung",
    category: "umzug-transport",
  },
  {
    slug: "moebellagerung",
    name: "Möbellagerung",
    category: "umzug-transport",
  },
  {
    slug: "lagerung",
    name: "Lagerung",
    category: "umzug-transport",
  },
  {
    slug: "self-storage",
    name: "Self Storage",
    category: "umzug-transport",
  },
  {
    slug: "wohnungsraeumung",
    name: "Wohnungsräumung",
    category: "umzug-transport",
  },
  {
    slug: "hausraeumung",
    name: "Hausräumung",
    category: "umzug-transport",
  },
  {
    slug: "garagenraeumung",
    name: "Garagenräumung",
    category: "umzug-transport",
  },
  {
    slug: "bueroraeumung",
    name: "Büroräumung",
    category: "umzug-transport",
  },
  {
    slug: "geschaeftsraeumung",
    name: "Geschäftsräumung",
    category: "umzug-transport",
  },
  {
    slug: "nachlassraeumung",
    name: "Nachlassräumung",
    category: "umzug-transport",
  },
  {
    slug: "sperrgutentsorgung",
    name: "Sperrgutentsorgung",
    category: "umzug-transport",
  },
  {
    slug: "moebelentsorgung",
    name: "Möbelentsorgung",
    category: "umzug-transport",
  },
  {
    slug: "elektroentsorgung",
    name: "Elektroentsorgung",
    category: "umzug-transport",
  },
  {
    slug: "bauschuttentsorgung",
    name: "Bauschuttentsorgung",
    category: "umzug-transport",
  },
  {
    slug: "muldenservice",
    name: "Muldenservice",
    category: "umzug-transport",
  },
  {
    slug: "recyclingservice",
    name: "Recyclingservice",
    category: "umzug-transport",
  },
  {
    slug: "gartenservice",
    name: "Gartenservice",
    category: "garten-aussenbereich",
  },
  {
    slug: "gaertner",
    name: "Gärtner",
    category: "garten-aussenbereich",
  },
  {
    slug: "landschaftsgaertner",
    name: "Landschaftsgärtner",
    category: "garten-aussenbereich",
  },
  {
    slug: "gartenbau",
    name: "Gartenbau",
    category: "garten-aussenbereich",
  },
  {
    slug: "gartengestaltung",
    name: "Gartengestaltung",
    category: "garten-aussenbereich",
  },
  {
    slug: "gartenplanung",
    name: "Gartenplanung",
    category: "garten-aussenbereich",
  },
  {
    slug: "rasen-maehen",
    name: "Rasen mähen",
    category: "garten-aussenbereich",
  },
  {
    slug: "rasen-vertikutieren",
    name: "Rasen vertikutieren",
    category: "garten-aussenbereich",
  },
  {
    slug: "rollrasen-verlegen",
    name: "Rollrasen verlegen",
    category: "garten-aussenbereich",
  },
  {
    slug: "rasen-neu-anlegen",
    name: "Rasen neu anlegen",
    category: "garten-aussenbereich",
  },
  {
    slug: "hecke-pflanzen",
    name: "Hecke pflanzen",
    category: "garten-aussenbereich",
  },
  {
    slug: "strauchschnitt",
    name: "Strauchschnitt",
    category: "garten-aussenbereich",
  },
  {
    slug: "baumpflege",
    name: "Baumpflege",
    category: "garten-aussenbereich",
  },
  {
    slug: "baumfaellung",
    name: "Baumfällung",
    category: "garten-aussenbereich",
  },
  {
    slug: "wurzelstock-entfernen",
    name: "Wurzelstock entfernen",
    category: "garten-aussenbereich",
  },
  {
    slug: "obstbaumschnitt",
    name: "Obstbaumschnitt",
    category: "garten-aussenbereich",
  },
  {
    slug: "bepflanzung",
    name: "Bepflanzung",
    category: "garten-aussenbereich",
  },
  {
    slug: "beetpflege",
    name: "Beetpflege",
    category: "garten-aussenbereich",
  },
  {
    slug: "unkraut-entfernen",
    name: "Unkraut entfernen",
    category: "garten-aussenbereich",
  },
  {
    slug: "laub-entfernen",
    name: "Laub entfernen",
    category: "garten-aussenbereich",
  },
  {
    slug: "gruenabfuhr",
    name: "Grünabfuhr",
    category: "garten-aussenbereich",
  },
  {
    slug: "bewaesserungsanlage",
    name: "Bewässerungsanlage",
    category: "garten-aussenbereich",
  },
  {
    slug: "gartenbewaesserung",
    name: "Gartenbewässerung",
    category: "garten-aussenbereich",
  },
  {
    slug: "teichbau",
    name: "Teichbau",
    category: "garten-aussenbereich",
  },
  {
    slug: "teichpflege",
    name: "Teichpflege",
    category: "garten-aussenbereich",
  },
  {
    slug: "poolbau",
    name: "Poolbau",
    category: "garten-aussenbereich",
  },
  {
    slug: "poolreinigung",
    name: "Poolreinigung",
    category: "garten-aussenbereich",
  },
  {
    slug: "poolpflege",
    name: "Poolpflege",
    category: "garten-aussenbereich",
  },
  {
    slug: "terrassenbau",
    name: "Terrassenbau",
    category: "garten-aussenbereich",
  },
  {
    slug: "terrassenreinigung",
    name: "Terrassenreinigung",
    category: "garten-aussenbereich",
  },
  {
    slug: "sitzplatz-bauen",
    name: "Sitzplatz bauen",
    category: "garten-aussenbereich",
  },
  {
    slug: "pflasterarbeiten",
    name: "Pflasterarbeiten",
    category: "garten-aussenbereich",
  },
  {
    slug: "natursteinmauer",
    name: "Natursteinmauer",
    category: "garten-aussenbereich",
  },
  {
    slug: "gartenmauer",
    name: "Gartenmauer",
    category: "garten-aussenbereich",
  },
  {
    slug: "zaunmontage",
    name: "Zaunmontage",
    category: "garten-aussenbereich",
  },
  {
    slug: "sichtschutz-montieren",
    name: "Sichtschutz montieren",
    category: "garten-aussenbereich",
  },
  {
    slug: "pergola-bauen",
    name: "Pergola bauen",
    category: "garten-aussenbereich",
  },
  {
    slug: "gartenhaus-montieren",
    name: "Gartenhaus montieren",
    category: "garten-aussenbereich",
  },
  {
    slug: "spielplatzmontage",
    name: "Spielplatzmontage",
    category: "garten-aussenbereich",
  },
  {
    slug: "balkonbepflanzung",
    name: "Balkonbepflanzung",
    category: "garten-aussenbereich",
  },
  {
    slug: "dachbegruenung",
    name: "Dachbegrünung",
    category: "garten-aussenbereich",
  },
  {
    slug: "fassadenbegruenung",
    name: "Fassadenbegrünung",
    category: "garten-aussenbereich",
  },
  {
    slug: "glatteisbekaempfung",
    name: "Glatteisbekämpfung",
    category: "garten-aussenbereich",
  },
  {
    slug: "schneeraeumung-privat",
    name: "Schneeräumung Privat",
    category: "garten-aussenbereich",
  },
  {
    slug: "schneeraeumung-gewerbe",
    name: "Schneeräumung Gewerbe",
    category: "garten-aussenbereich",
  },
  {
    slug: "aussenreinigung",
    name: "Aussenreinigung",
    category: "garten-aussenbereich",
  },
  {
    slug: "vorplatzreinigung",
    name: "Vorplatzreinigung",
    category: "garten-aussenbereich",
  },
  {
    slug: "parkplatzreinigung",
    name: "Parkplatzreinigung",
    category: "garten-aussenbereich",
  },
  {
    slug: "strassenreinigung",
    name: "Strassenreinigung",
    category: "garten-aussenbereich",
  },
  {
    slug: "kehrdienst",
    name: "Kehrdienst",
    category: "garten-aussenbereich",
  },
  {
    slug: "immobilienmakler",
    name: "Immobilienmakler",
    category: "immobilien",
  },
  {
    slug: "immobilienverkauf",
    name: "Immobilienverkauf",
    category: "immobilien",
  },
  {
    slug: "immobilienkauf",
    name: "Immobilienkauf",
    category: "immobilien",
  },
  {
    slug: "wohnung-verkaufen",
    name: "Wohnung verkaufen",
    category: "immobilien",
  },
  {
    slug: "haus-verkaufen",
    name: "Haus verkaufen",
    category: "immobilien",
  },
  {
    slug: "grundstueck-verkaufen",
    name: "Grundstück verkaufen",
    category: "immobilien",
  },
  {
    slug: "wohnung-kaufen",
    name: "Wohnung kaufen",
    category: "immobilien",
  },
  {
    slug: "haus-kaufen",
    name: "Haus kaufen",
    category: "immobilien",
  },
  {
    slug: "immobilienbewertung",
    name: "Immobilienbewertung",
    category: "immobilien",
  },
  {
    slug: "hausbewertung",
    name: "Hausbewertung",
    category: "immobilien",
  },
  {
    slug: "wohnungsbewertung",
    name: "Wohnungsbewertung",
    category: "immobilien",
  },
  {
    slug: "grundstueckbewertung",
    name: "Grundstückbewertung",
    category: "immobilien",
  },
  {
    slug: "verkehrswertschaetzung",
    name: "Verkehrswertschätzung",
    category: "immobilien",
  },
  {
    slug: "immobilienberatung",
    name: "Immobilienberatung",
    category: "immobilien",
  },
  {
    slug: "kaufberatung-immobilie",
    name: "Kaufberatung Immobilie",
    category: "immobilien",
  },
  {
    slug: "verkaufsberatung-immobilie",
    name: "Verkaufsberatung Immobilie",
    category: "immobilien",
  },
  {
    slug: "immobilienverwaltung",
    name: "Immobilienverwaltung",
    category: "immobilien",
  },
  {
    slug: "liegenschaftsverwaltung",
    name: "Liegenschaftsverwaltung",
    category: "immobilien",
  },
  {
    slug: "mietliegenschaftsverwaltung",
    name: "Mietliegenschaftsverwaltung",
    category: "immobilien",
  },
  {
    slug: "stockwerkeigentumsverwaltung",
    name: "Stockwerkeigentumsverwaltung",
    category: "immobilien",
  },
  {
    slug: "mietverwaltung",
    name: "Mietverwaltung",
    category: "immobilien",
  },
  {
    slug: "vermietungsservice",
    name: "Vermietungsservice",
    category: "immobilien",
  },
  {
    slug: "wohnung-vermieten",
    name: "Wohnung vermieten",
    category: "immobilien",
  },
  {
    slug: "haus-vermieten",
    name: "Haus vermieten",
    category: "immobilien",
  },
  {
    slug: "gewerbeimmobilie-vermieten",
    name: "Gewerbeimmobilie vermieten",
    category: "immobilien",
  },
  {
    slug: "mietersuche",
    name: "Mietersuche",
    category: "immobilien",
  },
  {
    slug: "mietvertrag-erstellen",
    name: "Mietvertrag erstellen",
    category: "immobilien",
  },
  {
    slug: "wohnungsuebergabe",
    name: "Wohnungsübergabe",
    category: "immobilien",
  },
  {
    slug: "wohnungsabnahme",
    name: "Wohnungsabnahme",
    category: "immobilien",
  },
  {
    slug: "uebergabeprotokoll",
    name: "Übergabeprotokoll",
    category: "immobilien",
  },
  {
    slug: "maengelaufnahme",
    name: "Mängelaufnahme",
    category: "immobilien",
  },
  {
    slug: "bauabnahme",
    name: "Bauabnahme",
    category: "immobilien",
  },
  {
    slug: "bauherrenberatung",
    name: "Bauherrenberatung",
    category: "immobilien",
  },
  {
    slug: "bauleitung",
    name: "Bauleitung",
    category: "immobilien",
  },
  {
    slug: "projektleitung-bau",
    name: "Projektleitung Bau",
    category: "immobilien",
  },
  {
    slug: "architekt",
    name: "Architekt",
    category: "immobilien",
  },
  {
    slug: "innenarchitekt",
    name: "Innenarchitekt",
    category: "immobilien",
  },
  {
    slug: "raumplanung",
    name: "Raumplanung",
    category: "immobilien",
  },
  {
    slug: "bauplanung",
    name: "Bauplanung",
    category: "immobilien",
  },
  {
    slug: "bauberatung",
    name: "Bauberatung",
    category: "immobilien",
  },
  {
    slug: "baueingabe",
    name: "Baueingabe",
    category: "immobilien",
  },
  {
    slug: "energieausweis-gebaeude",
    name: "Energieausweis Gebäude",
    category: "immobilien",
  },
  {
    slug: "immobilienfotografie",
    name: "Immobilienfotografie",
    category: "immobilien",
  },
  {
    slug: "drohnenaufnahmen-immobilie",
    name: "Drohnenaufnahmen Immobilie",
    category: "immobilien",
  },
  {
    slug: "home-staging",
    name: "Home Staging",
    category: "immobilien",
  },
  {
    slug: "facility-management",
    name: "Facility Management",
    category: "immobilien",
  },
  {
    slug: "immobilienservice",
    name: "Immobilienservice",
    category: "immobilien",
  },
  {
    slug: "relocation-service",
    name: "Relocation Service",
    category: "immobilien",
  },
  {
    slug: "solaranlage",
    name: "Solaranlage",
    category: "energie-technik",
  },
  {
    slug: "photovoltaikanlage",
    name: "Photovoltaikanlage",
    category: "energie-technik",
  },
  {
    slug: "solaranlage-installieren",
    name: "Solaranlage installieren",
    category: "energie-technik",
  },
  {
    slug: "solaranlage-planen",
    name: "Solaranlage planen",
    category: "energie-technik",
  },
  {
    slug: "solaranlage-warten",
    name: "Solaranlage warten",
    category: "energie-technik",
  },
  {
    slug: "solaranlage-reparieren",
    name: "Solaranlage reparieren",
    category: "energie-technik",
  },
  {
    slug: "solarberatung",
    name: "Solarberatung",
    category: "energie-technik",
  },
  {
    slug: "solarstromspeicher",
    name: "Solarstromspeicher",
    category: "energie-technik",
  },
  {
    slug: "batteriespeicher",
    name: "Batteriespeicher",
    category: "energie-technik",
  },
  {
    slug: "wallbox-installieren",
    name: "Wallbox installieren",
    category: "energie-technik",
  },
  {
    slug: "ladestation-installieren",
    name: "Ladestation installieren",
    category: "energie-technik",
  },
  {
    slug: "elektromobilitaet-beratung",
    name: "Elektromobilität Beratung",
    category: "energie-technik",
  },
  {
    slug: "waermepumpe",
    name: "Wärmepumpe",
    category: "energie-technik",
  },
  {
    slug: "waermepumpe-installieren",
    name: "Wärmepumpe installieren",
    category: "energie-technik",
  },
  {
    slug: "waermepumpe-warten",
    name: "Wärmepumpe warten",
    category: "energie-technik",
  },
  {
    slug: "waermepumpe-reparieren",
    name: "Wärmepumpe reparieren",
    category: "energie-technik",
  },
  {
    slug: "erdsondenbohrung",
    name: "Erdsondenbohrung",
    category: "energie-technik",
  },
  {
    slug: "pelletheizung",
    name: "Pelletheizung",
    category: "energie-technik",
  },
  {
    slug: "holzheizung",
    name: "Holzheizung",
    category: "energie-technik",
  },
  {
    slug: "gasheizung",
    name: "Gasheizung",
    category: "energie-technik",
  },
  {
    slug: "oelheizung-ersetzen",
    name: "Ölheizung ersetzen",
    category: "energie-technik",
  },
  {
    slug: "fernwaermeanschluss",
    name: "Fernwärmeanschluss",
    category: "energie-technik",
  },
  {
    slug: "heizungsersatz",
    name: "Heizungsersatz",
    category: "energie-technik",
  },
  {
    slug: "energieberatung",
    name: "Energieberatung",
    category: "energie-technik",
  },
  {
    slug: "gebaeudeenergieberatung",
    name: "Gebäudeenergieberatung",
    category: "energie-technik",
  },
  {
    slug: "energieoptimierung",
    name: "Energieoptimierung",
    category: "energie-technik",
  },
  {
    slug: "energieaudit",
    name: "Energieaudit",
    category: "energie-technik",
  },
  {
    slug: "stromberatung",
    name: "Stromberatung",
    category: "energie-technik",
  },
  {
    slug: "stromanbieter-vergleichen",
    name: "Stromanbieter vergleichen",
    category: "energie-technik",
  },
  {
    slug: "smart-meter",
    name: "Smart Meter",
    category: "energie-technik",
  },
  {
    slug: "gebaeudeautomation",
    name: "Gebäudeautomation",
    category: "energie-technik",
  },
  {
    slug: "smart-home",
    name: "Smart Home",
    category: "energie-technik",
  },
  {
    slug: "knx-installation",
    name: "KNX Installation",
    category: "energie-technik",
  },
  {
    slug: "sicherheitstechnik",
    name: "Sicherheitstechnik",
    category: "energie-technik",
  },
  {
    slug: "alarmanlage",
    name: "Alarmanlage",
    category: "energie-technik",
  },
  {
    slug: "brandmeldeanlage",
    name: "Brandmeldeanlage",
    category: "energie-technik",
  },
  {
    slug: "zutrittskontrolle",
    name: "Zutrittskontrolle",
    category: "energie-technik",
  },
  {
    slug: "videoueberwachung",
    name: "Videoüberwachung",
    category: "energie-technik",
  },
  {
    slug: "gegensprechanlage",
    name: "Gegensprechanlage",
    category: "energie-technik",
  },
  {
    slug: "glasfaserinstallation",
    name: "Glasfaserinstallation",
    category: "energie-technik",
  },
  {
    slug: "internetanschluss",
    name: "Internetanschluss",
    category: "energie-technik",
  },
  {
    slug: "satellitenanlage",
    name: "Satellitenanlage",
    category: "energie-technik",
  },
  {
    slug: "antennenanlage",
    name: "Antennenanlage",
    category: "energie-technik",
  },
  {
    slug: "blitzschutz",
    name: "Blitzschutz",
    category: "energie-technik",
  },
  {
    slug: "notstromanlage",
    name: "Notstromanlage",
    category: "energie-technik",
  },
  {
    slug: "usv-anlage",
    name: "USV Anlage",
    category: "energie-technik",
  },
  {
    slug: "energie-management-system",
    name: "Energie Management System",
    category: "energie-technik",
  },
  {
    slug: "lueftungstechnik",
    name: "Lüftungstechnik",
    category: "energie-technik",
  },
  {
    slug: "kaeltetechnik",
    name: "Kältetechnik",
    category: "energie-technik",
  },
  {
    slug: "it-support",
    name: "IT Support",
    category: "it-digital",
  },
  {
    slug: "computer-support",
    name: "Computer Support",
    category: "it-digital",
  },
  {
    slug: "pc-reparatur",
    name: "PC Reparatur",
    category: "it-digital",
  },
  {
    slug: "mac-reparatur",
    name: "Mac Reparatur",
    category: "it-digital",
  },
  {
    slug: "laptop-reparatur",
    name: "Laptop Reparatur",
    category: "it-digital",
  },
  {
    slug: "drucker-reparatur",
    name: "Drucker Reparatur",
    category: "it-digital",
  },
  {
    slug: "smartphone-reparatur",
    name: "Smartphone Reparatur",
    category: "it-digital",
  },
  {
    slug: "tablet-reparatur",
    name: "Tablet Reparatur",
    category: "it-digital",
  },
  {
    slug: "datenrettung",
    name: "Datenrettung",
    category: "it-digital",
  },
  {
    slug: "datensicherung",
    name: "Datensicherung",
    category: "it-digital",
  },
  {
    slug: "cloud-backup",
    name: "Cloud Backup",
    category: "it-digital",
  },
  {
    slug: "server-wartung",
    name: "Server Wartung",
    category: "it-digital",
  },
  {
    slug: "server-installation",
    name: "Server Installation",
    category: "it-digital",
  },
  {
    slug: "netzwerk-support",
    name: "Netzwerk Support",
    category: "it-digital",
  },
  {
    slug: "wlan-installation",
    name: "WLAN Installation",
    category: "it-digital",
  },
  {
    slug: "cyber-security",
    name: "Cyber Security",
    category: "it-digital",
  },
  {
    slug: "it-sicherheit",
    name: "IT Sicherheit",
    category: "it-digital",
  },
];

export const services = serviceCatalog.map(
  (service) => service.slug,
);

export const serviceLabels: Record<string, string> =
  Object.fromEntries(
    serviceCatalog.map((service) => [
      service.slug,
      service.name,
    ]),
  );

export const serviceCategoryBySlug: Record<
  string,
  ServiceCategory
> = Object.fromEntries(
  serviceCatalog.map((service) => [
    service.slug,
    service.category,
  ]),
) as Record<string, ServiceCategory>;

export function getServiceCatalogItem(slug: string) {
  return serviceCatalog.find(
    (service) => service.slug === slug,
  );
}
