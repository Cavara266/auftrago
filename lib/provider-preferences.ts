export const SERVICE_CATEGORIES = [
  "Umzugsreinigung",
  "Unterhaltsreinigung",
  "Grundreinigung",
  "Fensterreinigung",
  "Baureinigung",
  "Büroreinigung",
  "Hauswartung",
  "Umzug",
  "Transport",
  "Entsorgung",
  "Räumung",
  "Gartenpflege",
  "Malerarbeiten",
  "Bodenarbeiten",
  "Sanitär",
  "Elektriker",
  "Schreiner",
  "Montage",
  "Winterdienst",
] as const;

export const SWISS_REGIONS = [
  "Aargau",
  "Appenzell Ausserrhoden",
  "Appenzell Innerrhoden",
  "Basel-Landschaft",
  "Basel-Stadt",
  "Bern",
  "Freiburg",
  "Genf",
  "Glarus",
  "Graubünden",
  "Jura",
  "Luzern",
  "Neuenburg",
  "Nidwalden",
  "Obwalden",
  "Schaffhausen",
  "Schwyz",
  "Solothurn",
  "St. Gallen",
  "Tessin",
  "Thurgau",
  "Uri",
  "Waadt",
  "Wallis",
  "Zug",
  "Zürich",
] as const;

export type ServiceCategory =
  (typeof SERVICE_CATEGORIES)[number];

export type SwissRegion =
  (typeof SWISS_REGIONS)[number];