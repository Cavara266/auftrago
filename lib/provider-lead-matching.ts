export type MatchableProvider = {
  region?: string | null;
  category?: string | null;

  serviceRegions?: string[] | null;
  serviceCategories?: string[] | null;
  serviceCities?: string[] | null;
  servicePostalCodes?: string[] | null;

  receiveAllLeadEmails?: boolean | null;
};

export type MatchableLead = {
  category: string;
  region: string;
  city?: string | null;
  postalCode?: string | null;
};

export type LeadMatchResult = {
  matches: boolean;
  score: number;
  categoryMatch: boolean;
  locationMatch: boolean;
  regionMatch: boolean;
  cityMatch: boolean;
  postalCodeMatch: boolean;
  fallbackUsed: boolean;
  reasons: string[];
};

function normalize(
  value: string | null | undefined
) {
  return (value ?? "")
    .trim()
    .toLocaleLowerCase("de-CH")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueNormalized(
  values: Array<string | null | undefined>
) {
  return Array.from(
    new Set(
      values
        .map(normalize)
        .filter(
          (value): value is string =>
            Boolean(value)
        )
    )
  );
}

function splitLegacyValue(
  value: string | null | undefined
) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,;/|]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function containsFlexibleMatch(
  first: string,
  second: string
) {
  const normalizedFirst =
    normalize(first);

  const normalizedSecond =
    normalize(second);

  if (
    !normalizedFirst ||
    !normalizedSecond
  ) {
    return false;
  }

  return (
    normalizedFirst === normalizedSecond ||
    normalizedFirst.includes(
      normalizedSecond
    ) ||
    normalizedSecond.includes(
      normalizedFirst
    )
  );
}

function hasAnyFlexibleMatch(
  values: string[],
  target: string | null | undefined
) {
  if (!target) {
    return false;
  }

  return values.some((value) =>
    containsFlexibleMatch(
      value,
      target
    )
  );
}

function extractPostalCodes(
  value: string | null | undefined
) {
  if (!value) {
    return [];
  }

  return Array.from(
    value.matchAll(/\b\d{4}\b/g)
  ).map((match) => match[0]);
}

export function getProviderCategories(
  provider: MatchableProvider
) {
  return uniqueNormalized([
    ...(provider.serviceCategories ?? []),
    ...splitLegacyValue(
      provider.category
    ),
  ]);
}

export function getProviderRegions(
  provider: MatchableProvider
) {
  return uniqueNormalized([
    ...(provider.serviceRegions ?? []),
    ...splitLegacyValue(
      provider.region
    ),
  ]);
}

export function getProviderCities(
  provider: MatchableProvider
) {
  return uniqueNormalized([
    ...(provider.serviceCities ?? []),
  ]);
}

export function getProviderPostalCodes(
  provider: MatchableProvider
) {
  return uniqueNormalized([
    ...(provider.servicePostalCodes ?? []),
  ]);
}

export function getProviderLocations(
  provider: MatchableProvider
) {
  return uniqueNormalized([
    ...getProviderRegions(provider),
    ...getProviderCities(provider),
    ...getProviderPostalCodes(provider),
  ]);
}

export function providerHasConfiguredFilters(
  provider: MatchableProvider
) {
  return (
    getProviderCategories(provider)
      .length > 0 ||
    getProviderLocations(provider)
      .length > 0
  );
}

export function matchLeadToProvider(
  provider: MatchableProvider,
  lead: MatchableLead
): LeadMatchResult {
  if (
    provider.receiveAllLeadEmails
  ) {
    return {
      matches: true,
      score: 100,
      categoryMatch: true,
      locationMatch: true,
      regionMatch: true,
      cityMatch: true,
      postalCodeMatch: true,
      fallbackUsed: false,
      reasons: [
        "Anbieter erhält alle Leads",
      ],
    };
  }

  const categories =
    getProviderCategories(provider);

  const regions =
    getProviderRegions(provider);

  const cities =
    getProviderCities(provider);

  const postalCodes =
    getProviderPostalCodes(
      provider
    );

  const hasCategoryFilters =
    categories.length > 0;

  const hasRegionFilters =
    regions.length > 0;

  const hasCityFilters =
    cities.length > 0;

  const hasPostalCodeFilters =
    postalCodes.length > 0;

  const hasLocationFilters =
    hasRegionFilters ||
    hasCityFilters ||
    hasPostalCodeFilters;

  /*
   * Bestehende Anbieter ohne Einstellungen
   * sehen weiterhin alle Leads.
   */
  if (
    !hasCategoryFilters &&
    !hasLocationFilters
  ) {
    return {
      matches: true,
      score: 55,
      categoryMatch: true,
      locationMatch: true,
      regionMatch: true,
      cityMatch: true,
      postalCodeMatch: true,
      fallbackUsed: true,
      reasons: [
        "Noch keine Filter eingerichtet",
      ],
    };
  }

  const categoryMatch =
    !hasCategoryFilters ||
    hasAnyFlexibleMatch(
      categories,
      lead.category
    );

  const regionMatch =
    !hasRegionFilters ||
    hasAnyFlexibleMatch(
      regions,
      lead.region
    );

  const cityMatch =
    !hasCityFilters ||
    hasAnyFlexibleMatch(
      cities,
      lead.city
    ) ||
    hasAnyFlexibleMatch(
      cities,
      lead.region
    );

  const extractedPostalCodes =
    uniqueNormalized([
      lead.postalCode,
      ...extractPostalCodes(
        lead.region
      ),
    ]);

  const postalCodeMatch =
    !hasPostalCodeFilters ||
    extractedPostalCodes.some(
      (leadPostalCode) =>
        postalCodes.some(
          (providerPostalCode) =>
            containsFlexibleMatch(
              providerPostalCode,
              leadPostalCode
            )
        )
    );

  /*
   * Eine Standortübereinstimmung genügt.
   * Beispiel:
   * Anbieter hat Kanton Zürich gewählt,
   * aber keine einzelne Stadt.
   */
  const locationMatch =
    !hasLocationFilters ||
    regionMatch ||
    cityMatch ||
    postalCodeMatch;

  const matches =
    categoryMatch &&
    locationMatch;

  let score = 0;

  const reasons: string[] = [];

  if (categoryMatch) {
    score += hasCategoryFilters
      ? 50
      : 25;

    reasons.push(
      hasCategoryFilters
        ? "Kategorie passt"
        : "Keine Kategorie eingeschränkt"
    );
  }

  if (regionMatch) {
    score += hasRegionFilters
      ? 20
      : 0;

    if (hasRegionFilters) {
      reasons.push(
        "Region passt"
      );
    }
  }

  if (cityMatch) {
    score += hasCityFilters
      ? 20
      : 0;

    if (hasCityFilters) {
      reasons.push(
        "Stadt passt"
      );
    }
  }

  if (postalCodeMatch) {
    score += hasPostalCodeFilters
      ? 20
      : 0;

    if (hasPostalCodeFilters) {
      reasons.push(
        "Postleitzahl passt"
      );
    }
  }

  if (
    locationMatch &&
    !hasLocationFilters
  ) {
    score += 25;

    reasons.push(
      "Kein Einsatzgebiet eingeschränkt"
    );
  }

  if (
    categoryMatch &&
    locationMatch
  ) {
    score += 10;
  }

  return {
    matches,
    score: Math.min(
      100,
      score
    ),
    categoryMatch,
    locationMatch,
    regionMatch,
    cityMatch,
    postalCodeMatch,
    fallbackUsed: false,
    reasons,
  };
}

export function filterMatchingLeads<
  TLead extends MatchableLead
>(
  provider: MatchableProvider,
  leads: TLead[]
) {
  return leads
    .map((lead) => ({
      lead,
      match:
        matchLeadToProvider(
          provider,
          lead
        ),
    }))
    .filter(
      ({ match }) =>
        match.matches
    )
    .sort((first, second) => {
      if (
        second.match.score !==
        first.match.score
      ) {
        return (
          second.match.score -
          first.match.score
        );
      }

      const firstDate =
        "createdAt" in first.lead &&
        first.lead.createdAt instanceof
          Date
          ? first.lead.createdAt.getTime()
          : 0;

      const secondDate =
        "createdAt" in second.lead &&
        second.lead.createdAt instanceof
          Date
          ? second.lead.createdAt.getTime()
          : 0;

      return secondDate - firstDate;
    });
}