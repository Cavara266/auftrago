import { prisma } from "@/lib/prisma";

export type CandidateImportSource =
  | "CSV"
  | "PARTNER"
  | "EXTERNAL";

export type CandidateImportInput = {
  source: CandidateImportSource;
  externalId: string;

  sourceUrl?: string | null;

  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;

  title: string;
  category: string;

  canton: string;
  city?: string | null;
  postalCode?: string | null;

  radiusKm?: number | null;
  employmentPercent?: string | null;
  experienceYears?: number | null;

  languages?: string[];

  drivingLicense?: boolean;
  ownCar?: boolean;

  availableFrom?: string | null;
  description?: string | null;

  /**
   * Muss true sein, wenn die Quelle erlaubt, dass das Profil
   * im Auftraggo Talentpool angezeigt wird.
   */
  sourceConsent: boolean;

  /**
   * Kontaktdaten dürfen nur freigegeben werden, wenn die
   * notwendige Einwilligung / Rechtsgrundlage vorhanden ist.
   */
  contactConsent?: boolean;
};

function clean(value: string | null | undefined) {
  const result = value?.trim();
  return result || null;
}

function normalizeEmail(value: string | null | undefined) {
  return clean(value)?.toLowerCase() ?? null;
}

function normalizeLanguages(values?: string[]) {
  return Array.from(
    new Set(
      (values ?? [])
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

function safeDate(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

export async function importCandidate(
  input: CandidateImportInput
) {
  if (!input.source) {
    throw new Error("source fehlt");
  }

  if (!input.externalId?.trim()) {
    throw new Error("externalId fehlt");
  }

  if (!input.title?.trim()) {
    throw new Error("title fehlt");
  }

  if (!input.category?.trim()) {
    throw new Error("category fehlt");
  }

  if (!input.canton?.trim()) {
    throw new Error("canton fehlt");
  }

  if (input.sourceConsent !== true) {
    throw new Error(
      "Import abgelehnt: sourceConsent muss true sein."
    );
  }

  const source = input.source.trim().toUpperCase();
  const externalId = input.externalId.trim();
  const email = normalizeEmail(input.email);

  const commonData = {
    email,

    firstName: clean(input.firstName),
    lastName: clean(input.lastName),
    phone: input.contactConsent
      ? clean(input.phone)
      : null,

    title: input.title.trim(),
    category: input.category.trim(),

    canton: input.canton.trim(),
    city: clean(input.city),
    postalCode: clean(input.postalCode),

    radiusKm:
      typeof input.radiusKm === "number" &&
      Number.isFinite(input.radiusKm) &&
      input.radiusKm > 0
        ? Math.round(input.radiusKm)
        : 25,

    employmentPercent:
      clean(input.employmentPercent),

    experienceYears:
      typeof input.experienceYears === "number" &&
      Number.isFinite(input.experienceYears)
        ? Math.max(0, Math.round(input.experienceYears))
        : null,

    languages: normalizeLanguages(input.languages),

    drivingLicense: Boolean(input.drivingLicense),
    ownCar: Boolean(input.ownCar),

    availableFrom: safeDate(input.availableFrom),
    description: clean(input.description),

    status: "ACTIVE",
    isVisible: true,

    contactConsent:
      input.contactConsent === true,

    source,
    externalId,

    sourceUrl: clean(input.sourceUrl),
    sourceConsent: true,

    sourceLastSeenAt: new Date(),
  };

  const existingBySource =
    await prisma.candidateProfile.findFirst({
      where: {
        source,
        externalId,
      },
    });

  if (existingBySource) {
    return prisma.candidateProfile.update({
      where: {
        id: existingBySource.id,
      },
      data: commonData,
    });
  }

  // Zweite Dublettenprüfung über E-Mail,
  // falls die Quelle eine E-Mail liefern darf.
  if (email) {
    const existingByEmail =
      await prisma.candidateProfile.findUnique({
        where: {
          email,
        },
      });

    if (existingByEmail) {
      return prisma.candidateProfile.update({
        where: {
          id: existingByEmail.id,
        },
        data: {
          ...commonData,

          // Direkte Auftraggo-Profile niemals in ein
          // externes Profil umwandeln.
          source:
            existingByEmail.source === "DIRECT"
              ? existingByEmail.source
              : source,

          externalId:
            existingByEmail.source === "DIRECT"
              ? existingByEmail.externalId
              : externalId,

          sourceUrl:
            existingByEmail.source === "DIRECT"
              ? existingByEmail.sourceUrl
              : clean(input.sourceUrl),
        },
      });
    }
  }

  return prisma.candidateProfile.create({
    data: {
      ...commonData,
      importedAt: new Date(),
    },
  });
}

export async function importCandidates(
  candidates: CandidateImportInput[]
) {
  const results = [];
  const errors: {
    index: number;
    externalId?: string;
    error: string;
  }[] = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];

    try {
      results.push(
        await importCandidate(candidate)
      );
    } catch (error) {
      errors.push({
        index,
        externalId: candidate?.externalId,
        error:
          error instanceof Error
            ? error.message
            : "Unbekannter Fehler",
      });
    }
  }

  return {
    imported: results.length,
    failed: errors.length,
    errors,
  };
}
