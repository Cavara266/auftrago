export type SeoQualityPage = {
  headline: string | null;
  introduction: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  customPriceMinCents: number | null;
  customPriceMaxCents: number | null;
  indexable: boolean;
  city: {
    status: string;
    indexable: boolean;
    introduction?: string | null;
    localContent?: string | null;
  };
  service: {
    status: string;
    indexable: boolean;
    priceMinCents?: number | null;
    priceMaxCents?: number | null;
    description?: string | null;
    faqs?: Array<{
      id: string;
    }>;
  };
};

export type SeoQualityCheck = {
  key: string;
  label: string;
  passed: boolean;
  points: number;
  detail: string;
};

function getWordCount(values: Array<string | null | undefined>) {
  return values
    .filter(Boolean)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function getSeoQualityChecks(
  page: SeoQualityPage
): SeoQualityCheck[] {
  const titleLength = page.seoTitle?.trim().length ?? 0;

  const descriptionLength =
    page.seoDescription?.trim().length ?? 0;

  const wordCount = getWordCount([
    page.introduction,
    page.content,
    page.city.introduction,
    page.city.localContent,
    page.service.description,
  ]);

  const hasPrice =
    (page.customPriceMinCents !== null &&
      page.customPriceMaxCents !== null) ||
    (page.service.priceMinCents !== null &&
      page.service.priceMaxCents !== null);

  const faqCount = page.service.faqs?.length ?? 0;

  return [
    {
      key: "title",
      label: "SEO-Titel",
      passed:
        titleLength >= 30 &&
        titleLength <= 65,
      points: 15,
      detail:
        titleLength === 0
          ? "SEO-Titel fehlt."
          : `${titleLength} Zeichen`,
    },
    {
      key: "description",
      label: "Meta Description",
      passed:
        descriptionLength >= 110 &&
        descriptionLength <= 170,
      points: 15,
      detail:
        descriptionLength === 0
          ? "Meta Description fehlt."
          : `${descriptionLength} Zeichen`,
    },
    {
      key: "canonical",
      label: "Canonical URL",
      passed: Boolean(
        page.canonicalUrl?.startsWith("https://")
      ),
      points: 10,
      detail: page.canonicalUrl
        ? "Canonical vorhanden."
        : "Canonical fehlt.",
    },
    {
      key: "headline",
      label: "H1-Überschrift",
      passed: Boolean(page.headline?.trim()),
      points: 10,
      detail: page.headline
        ? "Überschrift vorhanden."
        : "Überschrift fehlt.",
    },
    {
      key: "content",
      label: "Inhalt",
      passed: wordCount >= 120,
      points: 20,
      detail: `${wordCount} Wörter`,
    },
    {
      key: "price",
      label: "Preisbereich",
      passed: hasPrice,
      points: 10,
      detail: hasPrice
        ? "Preisbereich vorhanden."
        : "Preisbereich fehlt.",
    },
    {
      key: "faq",
      label: "FAQ",
      passed: faqCount >= 3,
      points: 10,
      detail: `${faqCount} FAQ vorhanden`,
    },
    {
      key: "parents",
      label: "Stadt und Leistung",
      passed:
        page.city.status === "ACTIVE" &&
        page.city.indexable &&
        page.service.status === "ACTIVE" &&
        page.service.indexable,
      points: 10,
      detail:
        page.city.status === "ACTIVE" &&
        page.city.indexable &&
        page.service.status === "ACTIVE" &&
        page.service.indexable
          ? "Stadt und Leistung sind aktiv."
          : "Stadt oder Leistung ist nicht aktiv.",
    },
  ];
}

export function getSeoQualityScore(
  page: SeoQualityPage
) {
  const checks = getSeoQualityChecks(page);

  return checks.reduce(
    (score, check) =>
      score + (check.passed ? check.points : 0),
    0
  );
}

export function canPublishSeoPage(
  page: SeoQualityPage,
  minimumScore = 70
) {
  const checks = getSeoQualityChecks(page);

  const score = checks.reduce(
    (total, check) =>
      total + (check.passed ? check.points : 0),
    0
  );

  return {
    score,
    minimumScore,
    allowed: score >= minimumScore,
    checks,
    failedChecks: checks.filter(
      (check) => !check.passed
    ),
  };
}
