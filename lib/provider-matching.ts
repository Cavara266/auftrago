export type MatchableProvider = {
  id: string;
  name: string;
  approved?: boolean;
  blocked?: boolean;
  categories?: string[];
  serviceSlugs?: string[];
  regions?: string[];
  postalCodes?: string[];
  rating?: number;
  completedJobs?: number;
  responseMinutes?: number;
  closeRate?: number;
  distanceKm?: number;
  available?: boolean;
  creditBalance?: number;
};

export type MatchableLead = {
  service: string;
  serviceSlug?: string;
  category?: string;
  postalCode?: string;
  city?: string;
  leadPrice?: number;
};

export type ProviderMatch = {
  provider: MatchableProvider;
  score: number;
  reasons: string[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function includesNormalized(values: string[] | undefined, target: string) {
  const normalizedTarget = target.trim().toLowerCase();

  return (values ?? []).some(
    (value) => value.trim().toLowerCase() === normalizedTarget
  );
}

export function scoreProviderForLead(
  provider: MatchableProvider,
  lead: MatchableLead
): ProviderMatch {
  const reasons: string[] = [];

  if (provider.blocked || provider.approved === false) {
    return {
      provider,
      score: 0,
      reasons: ["Anbieter ist nicht freigeschaltet"],
    };
  }

  let score = 0;

  const serviceMatch =
    (lead.serviceSlug &&
      includesNormalized(provider.serviceSlugs, lead.serviceSlug)) ||
    includesNormalized(provider.categories, lead.service) ||
    (lead.category &&
      includesNormalized(provider.categories, lead.category));

  if (serviceMatch) {
    score += 30;
    reasons.push("Passende Dienstleistung");
  }

  const regionMatch =
    (lead.postalCode &&
      includesNormalized(provider.postalCodes, lead.postalCode)) ||
    (lead.city && includesNormalized(provider.regions, lead.city));

  if (regionMatch) {
    score += 18;
    reasons.push("Passende Region");
  }

  const rating = clamp(provider.rating ?? 4, 0, 5);
  score += (rating / 5) * 15;

  if (rating >= 4.5) {
    reasons.push("Sehr gute Bewertung");
  }

  const closeRate = clamp(provider.closeRate ?? 50, 0, 100);
  score += (closeRate / 100) * 12;

  if (closeRate >= 70) {
    reasons.push("Hohe Abschlussquote");
  }

  const responseMinutes = Math.max(1, provider.responseMinutes ?? 120);
  const responseScore = clamp(1 - responseMinutes / 720, 0, 1) * 10;
  score += responseScore;

  if (responseMinutes <= 30) {
    reasons.push("Sehr schnelle Antwortzeit");
  }

  const completedJobs = Math.max(0, provider.completedJobs ?? 0);
  score += clamp(completedJobs / 50, 0, 1) * 6;

  const distanceKm = Math.max(0, provider.distanceKm ?? 30);
  score += clamp(1 - distanceKm / 80, 0, 1) * 6;

  if (distanceKm <= 15) {
    reasons.push("Kurze Distanz");
  }

  if (provider.available !== false) {
    score += 3;
    reasons.push("Aktuell verfügbar");
  }

  if (
    typeof lead.leadPrice === "number" &&
    typeof provider.creditBalance === "number" &&
    provider.creditBalance < lead.leadPrice
  ) {
    score -= 20;
    reasons.push("Zu wenig Credits");
  }

  return {
    provider,
    score: Math.round(clamp(score, 0, 100)),
    reasons,
  };
}

export function rankProvidersForLead(
  providers: MatchableProvider[],
  lead: MatchableLead,
  limit = 10
) {
  return providers
    .map((provider) => scoreProviderForLead(provider, lead))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}