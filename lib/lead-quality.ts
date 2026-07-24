export type LeadQualityInput = {
  title?: string | null;
  category?: string | null;
  region?: string | null;
  postalCode?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  message?: string | null;
  price?: number | null;
  createdAt?: Date | string | null;
};

export type LeadQualityResult = {
  score: number;
  label: "Schwach" | "Mittel" | "Gut" | "Sehr gut";
  reasons: string[];
};

function hasText(value: unknown, minimumLength = 1) {
  return typeof value === "string" && value.trim().length >= minimumLength;
}

export function calculateLeadQuality(
  lead: LeadQualityInput
): LeadQualityResult {
  let score = 0;
  const reasons: string[] = [];

  if (hasText(lead.title, 5)) {
    score += 15;
    reasons.push("Klarer Auftragstitel");
  }

  if (hasText(lead.category, 3)) {
    score += 10;
    reasons.push("Kategorie vorhanden");
  }

  if (
    hasText(lead.region, 2) ||
    hasText(lead.postalCode, 4) ||
    hasText(lead.city, 2)
  ) {
    score += 15;
    reasons.push("Region erfasst");
  }

  if (hasText(lead.phone, 8)) {
    score += 20;
    reasons.push("Telefonnummer vorhanden");
  }

  if (
    hasText(lead.email, 5) &&
    String(lead.email).includes("@")
  ) {
    score += 10;
    reasons.push("E-Mail vorhanden");
  }

  if (hasText(lead.message, 40)) {
    score += 20;
    reasons.push("Ausführliche Beschreibung");
  } else if (hasText(lead.message, 15)) {
    score += 10;
    reasons.push("Beschreibung vorhanden");
  }

  if (typeof lead.price === "number" && lead.price > 0) {
    score += 10;
    reasons.push("Leadpreis definiert");
  }

  const finalScore = Math.min(100, score);

  let label: LeadQualityResult["label"] = "Schwach";

  if (finalScore >= 85) {
    label = "Sehr gut";
  } else if (finalScore >= 65) {
    label = "Gut";
  } else if (finalScore >= 40) {
    label = "Mittel";
  }

  return {
    score: finalScore,
    label,
    reasons,
  };
}