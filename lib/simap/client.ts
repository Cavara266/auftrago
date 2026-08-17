export type SimapTender = {
  id: string;
  publicationId: string;
  title: string;
  authority: string;
  canton: string;
  location: string;
  published: string;
  deadline: string | null;
  category: string;
  status: "Neu" | "Offen";
};

const SIMAP_BASE = "https://www.simap.ch/api/publications";

type UnknownRecord = Record<string, any>;

function text(value: unknown): string {
  if (typeof value === "string") return value.trim();

  if (value && typeof value === "object") {
    const item = value as UnknownRecord;

    for (const language of ["de", "fr", "it", "en"]) {
      if (typeof item[language] === "string" && item[language].trim()) {
        return item[language].trim();
      }
    }
  }

  return "";
}

function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getCategory(value: UnknownRecord): string {
  const rawHaystack = [
    text(value.title),
    text(value.procOfficeName),
    text(value.projectType),
    text(value.projectSubtype),
    text(value.constructionType),
    text(value.constructionCategory),
    text(value.orderType),
    text(value.orderDescription),
    text(value.description),
    text(value.shortDescription),
    text(value.reference),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("de-CH")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let jsonHaystack = "";

  try {
    jsonHaystack = JSON.stringify(value)
      .toLocaleLowerCase("de-CH")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  } catch {
    jsonHaystack = "";
  }

  const haystack = `${rawHaystack} ${jsonHaystack}`;

  const hasAny = (...terms: string[]) =>
    terms.some((term) => haystack.includes(term));

  /*
   * Spezifische Kategorien zuerst.
   * Dadurch wird z.B. Fensterreinigung nicht schon als
   * allgemeine Reinigung klassifiziert.
   */

  if (
    hasAny(
      "fensterreinigung",
      "glasreinigung",
      "fenster reinigen",
      "fensterreinig",
      "window cleaning",
      "nettoyage des vitres",
      "nettoyage vitres",
      "pulizia vetri",
      "lavaggio vetri"
    )
  ) {
    return "Fensterreinigung";
  }

  if (
    hasAny(
      "umzugsreinigung",
      "end of tenancy cleaning",
      "end cleaning",
      "nettoyage de demenagement",
      "nettoyage déménagement",
      "pulizia trasloco"
    )
  ) {
    return "Umzugsreinigung";
  }

  if (
    hasAny(
      "baureinigung",
      "bauendreinigung",
      "bauschlussreinigung",
      "construction cleaning",
      "nettoyage de chantier",
      "nettoyage chantier",
      "pulizia cantiere"
    )
  ) {
    return "Baureinigung";
  }

  if (
    hasAny(
      "unterhaltsreinigung",
      "regelmassige reinigung",
      "regelmaessige reinigung",
      "maintenance cleaning",
      "nettoyage d'entretien",
      "nettoyage entretien",
      "pulizia di manutenzione"
    )
  ) {
    return "Unterhaltsreinigung";
  }

  if (
    hasAny(
      "spezialreinigung",
      "grundreinigung",
      "fassadenreinigung",
      "hochdruckreinigung",
      "industriereinigung",
      "graffitientfernung",
      "sonderreinigung"
    )
  ) {
    return "Spezialreinigung";
  }

  if (
    hasAny(
      "gebaudereinigung",
      "gebäudereinigung",
      "reinigung gebaude",
      "reinigung gebäude",
      "nettoyage des locaux",
      "nettoyage locaux",
      "nettoyage batiment",
      "nettoyage bâtiment",
      "pulizia edifici",
      "pulizia locali",
      "cleaning services",
      "cleaning service"
    )
  ) {
    return "Gebäudereinigung";
  }

  if (
    hasAny(
      "reinigung",
      "reinigungsarbeiten",
      "reinigungsdienst",
      "cleaning",
      "nettoyage",
      "pulizia",
      "entretien des locaux"
    )
  ) {
    return "Reinigung";
  }

  if (
    hasAny(
      "hauswartung",
      "hauswart",
      "hausdienst",
      "facility management",
      "facility-management",
      "facility service",
      "facilityservice",
      "conciergerie",
      "concierge",
      "caretaking",
      "gebäudeunterhalt",
      "gebaeudeunterhalt"
    )
  ) {
    return "Hauswartung";
  }

  if (
    hasAny(
      "winterdienst",
      "schneeraumung",
      "schneeräumung",
      "schneeraeumung",
      "salzen",
      "streudienst",
      "service hivernal",
      "deneigement",
      "déneigement",
      "sgombero neve"
    )
  ) {
    return "Winterdienst";
  }

  if (
    hasAny(
      "gartenpflege",
      "grunpflege",
      "grünpflege",
      "pflege grunanlagen",
      "pflege grünanlagen",
      "pflege von grunanlagen",
      "pflege von grünanlagen",
      "gartenunterhalt",
      "grunanlagen",
      "grünanlagen",
      "espaces verts",
      "entretien paysager",
      "entretien des espaces verts",
      "manutenzione verde",
      "cura del verde"
    )
  ) {
    return "Gartenpflege";
  }

  if (
    hasAny(
      "garten",
      "landschaft",
      "landschaftsbau",
      "gartner",
      "gärtner",
      "gartenbau",
      "paysagiste",
      "paysager",
      "paesagg",
      "giardin"
    )
  ) {
    return "Garten & Umgebung";
  }

  if (
    hasAny(
      "sanitar",
      "sanitär",
      "sanitaire",
      "sanitario",
      "sanitari",
      "wasserleitung",
      "wasserleitungen",
      "abwasserleitung",
      "abwasserleitungen",
      "sanitarinstallation",
      "sanitärinstallation"
    )
  ) {
    return "Sanitär";
  }

  if (
    hasAny(
      "heizung",
      "heizungsanlage",
      "heizungsanlagen",
      "chauffage",
      "riscaldamento",
      "warmepumpe",
      "wärmepumpe",
      "waermepumpe"
    )
  ) {
    return "Heizung";
  }

  if (
    hasAny(
      "luftung",
      "lüftung",
      "lueftung",
      "ventilation",
      "ventilazione"
    )
  ) {
    return "Lüftung";
  }

  if (
    hasAny(
      "klimaanlage",
      "klimatechnik",
      "klimatisierung",
      "climatisation",
      "climatizzazione",
      "hvac"
    )
  ) {
    return "Klima";
  }

  if (
    hasAny(
      "elektroinstallation",
      "elektroinstallationen",
      "elektriker",
      "elektrotechnik",
      "elektrische installation",
      "electrical installation",
      "installations electriques",
      "installations électriques",
      "impianti elettrici",
      "installatore elettricista",
      "starkstrom",
      "schwachstrom",
      "schaltanlage",
      "schaltanlagen"
    )
  ) {
    return "Elektro";
  }

  if (
    hasAny(
      "malerarbeiten",
      "maler",
      "malerei",
      "peinture",
      "peintre",
      "pittore",
      "tinteggiatura"
    )
  ) {
    return "Maler";
  }

  if (
    hasAny(
      "schreiner",
      "schreinerarbeiten",
      "schreinerei",
      "tischler",
      "menuiserie",
      "menuisier",
      "falegname",
      "falegnameria"
    )
  ) {
    return "Schreiner";
  }

  if (
    hasAny(
      "bodenbelag",
      "bodenbeläge",
      "bodenbelage",
      "bodenarbeiten",
      "parkett",
      "flooring",
      "revetement de sol",
      "revêtement de sol",
      "pavimentazione",
      "pavimenti"
    )
  ) {
    return "Bodenbeläge";
  }

  if (
    hasAny(
      "umzug",
      "umzugsdienst",
      "umzugsdienstleistung",
      "umzugsdienstleistungen",
      "umzugsarbeiten",
      "relocation",
      "demenagement",
      "déménagement",
      "trasloco"
    )
  ) {
    return "Umzug";
  }

  if (
    hasAny(
      "entsorgung",
      "abfallentsorgung",
      "abfall",
      "kehricht",
      "recycling",
      "dechets",
      "déchets",
      "elimination des dechets",
      "élimination des déchets",
      "smaltimento",
      "rifiuti"
    )
  ) {
    return "Entsorgung";
  }

  if (
    hasAny(
      "transport",
      "transporte",
      "transportdienst",
      "transportdienstleistung",
      "logistik",
      "logistique",
      "logistica"
    )
  ) {
    return "Transport";
  }

  if (
    hasAny(
      "unterhalt",
      "instandhaltung",
      "instandsetzung",
      "wartung",
      "maintenance",
      "reparatur",
      "reparation",
      "réparation",
      "riparazione",
      "bauarbeiten",
      "construction",
      "bauwerk",
      "sanierung"
    )
  ) {
    return "Handwerk";
  }

  return "Weitere";
}

export async function getTenderDetails(
  projectId: string,
  publicationId: string,
): Promise<UnknownRecord | null> {
  try {
    const response = await fetch(
      `${SIMAP_BASE}/v1/project/${encodeURIComponent(
        projectId,
      )}/publication-details/${encodeURIComponent(publicationId)}`,
      {
        next: {
          revalidate: 1800,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as UnknownRecord;
  } catch (error) {
    console.error("SIMAP detail request failed:", error);
    return null;
  }
}

export async function getSimapTenders(): Promise<SimapTender[]> {
  try {
    const MAX_TENDERS = 200;
    const CONCURRENCY = 8;
    const MAX_SEARCH_PAGES = 20;

    const collectedProjects: UnknownRecord[] = [];
    const seenIds = new Set<string>();

    let lastItem: string | null = null;

    /*
     * SIMAP liefert aktuell 20 Projekte pro Request.
     * Mit lastItem holen wir automatisch die nächsten Seiten.
     */
    for (let page = 0; page < MAX_SEARCH_PAGES; page += 1) {
      const params = new URLSearchParams({
        orderAddressCountryOnlySwitzerland: "true",
      });

      if (lastItem) {
        params.set("lastItem", lastItem);
      }

      const response = await fetch(
        `${SIMAP_BASE}/v2/project/project-search?${params.toString()}`,
        {
          next: {
            revalidate: 1800,
          },
        },
      );

      if (!response.ok) {
        console.error(
          `SIMAP search page ${page + 1} failed: ${response.status}`,
        );
        break;
      }

      const data = (await response.json()) as UnknownRecord;

      const projects = Array.isArray(data.projects)
        ? (data.projects as UnknownRecord[])
        : [];

      if (projects.length === 0) {
        break;
      }

      for (const project of projects) {
        const id = String(project?.id ?? "");

        if (!id || seenIds.has(id)) {
          continue;
        }

        seenIds.add(id);

        if (
          project?.pubType === "tender" &&
          project?.processType === "open" &&
          project?.publicationId
        ) {
          collectedProjects.push(project);
        }

        if (collectedProjects.length >= MAX_TENDERS) {
          break;
        }
      }

      if (collectedProjects.length >= MAX_TENDERS) {
        break;
      }

      const pagination =
        data.pagination &&
        typeof data.pagination === "object"
          ? (data.pagination as UnknownRecord)
          : null;

      const nextLastItem =
        pagination && typeof pagination.lastItem === "string"
          ? pagination.lastItem
          : "";

      if (!nextLastItem || nextLastItem === lastItem) {
        break;
      }

      lastItem = nextLastItem;
    }

    const selectedTenders = collectedProjects.slice(0, MAX_TENDERS);

    console.log(
      `SIMAP: ${selectedTenders.length} offene Ausschreibungen gefunden.`,
    );

    const tenders: SimapTender[] = [];

    /*
     * Detail-Anfragen bewusst in kleinen Batches,
     * damit SIMAP nicht mit 200 Requests gleichzeitig belastet wird.
     */
    for (
      let i = 0;
      i < selectedTenders.length;
      i += CONCURRENCY
    ) {
      const batch = selectedTenders.slice(i, i + CONCURRENCY);

      const batchResults = await Promise.all(
        batch.map(async (project: UnknownRecord) => {
          try {
            const projectId = String(project.id);
            const publicationId = String(project.publicationId);

            const details = await getTenderDetails(
              projectId,
              publicationId,
            );

            const projectInfo =
              details?.["project-info"] ??
              details?.projectInfo ??
              {};

            const address =
              projectInfo?.procOfficeAddress ??
              details?.procurementRecipientAddress ??
              project?.orderAddress ??
              {};

            const canton =
              text(address?.cantonId) ||
              text(project?.orderAddress?.cantonId);

            const location =
              text(address?.city) ||
              text(project?.orderAddress?.city);

            const authority =
              text(projectInfo?.procOfficeName) ||
              text(address?.name) ||
              text(project?.procOfficeName) ||
              "Öffentliche Auftraggeberin";

            const deadline =
              details?.dates?.offerDeadline ?? null;

            const publicationDate =
              details?.dates?.publicationDate ??
              project?.publicationDate ??
              "";

            const title =
              text(project?.title) ||
              text(details?.base?.title) ||
              "Öffentliche Ausschreibung";

            const tender: SimapTender = {
              id: projectId,
              publicationId,
              title,
              authority,
              canton,
              location,
              published: formatDate(publicationDate),
              deadline: deadline ? formatDate(deadline) : null,
              category: getCategory(project),
              status: "Offen",
            };

            return tender;
          } catch (error) {
            console.error(
              `SIMAP Detailfehler bei ${String(project?.id ?? "")}:`,
              error,
            );

            return null;
          }
        }),
      );

      for (const tender of batchResults) {
        if (tender) {
          tenders.push(tender);
        }
      }
    }

    const parseSwissDate = (value: string) => {
      const [day, month, year] = value.split(".");
      return `${year ?? ""}-${month ?? ""}-${day ?? ""}`;
    };

    return tenders
      .filter((tender) => tender.title)
      .sort((a, b) =>
        parseSwissDate(b.published).localeCompare(
          parseSwissDate(a.published),
        ),
      );
  } catch (error) {
    console.error("SIMAP request failed:", error);
    return [];
  }
}
