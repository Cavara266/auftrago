import { regions } from "@/lib/region-data";
import { serviceCatalog } from "@/lib/service-catalog";

export type InternalLink = {
  label: string;
  href: string;
  description?: string;
};

export type InternalLinksInput = {
  region?: string | null;
  service?: string | null;
  city?: string | null;
  relatedServiceLimit?: number;
  relatedRegionLimit?: number;
  cityLimit?: number;
  popularLimit?: number;
};

export type InternalLinksResult = {
  currentRegion: InternalLink | null;
  currentService: InternalLink | null;
  relatedRegions: InternalLink[];
  relatedCities: InternalLink[];
  relatedServices: InternalLink[];
  sameServiceOtherRegions: InternalLink[];
  popularLinks: InternalLink[];
};

function formatSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => {
      const normalizedPart =
        part === "ag"
          ? "AG"
          : part === "bl"
            ? "BL"
            : part === "bs"
              ? "BS"
              : part === "be"
                ? "BE"
                : part === "lu"
                  ? "LU"
                  : part === "zh"
                    ? "ZH"
                    : part;

      if (normalizedPart === normalizedPart.toUpperCase()) {
        return normalizedPart;
      }

      return (
        normalizedPart.charAt(0).toUpperCase() +
        normalizedPart.slice(1)
      );
    })
    .join(" ");
}

function uniqueLinks(links: InternalLink[]) {
  const unique = new Map<string, InternalLink>();

  for (const link of links) {
    if (!unique.has(link.href)) {
      unique.set(link.href, link);
    }
  }

  return Array.from(unique.values());
}

function normalizeLimit(
  value: number | undefined,
  fallback: number,
  maximum = 24,
) {
  if (
    value === undefined ||
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return fallback;
  }

  return Math.min(Math.floor(value), maximum);
}

export function getInternalLinks({
  region: regionSlug,
  service: serviceSlug,
  city: citySlug,
  relatedServiceLimit,
  relatedRegionLimit,
  cityLimit,
  popularLimit,
}: InternalLinksInput): InternalLinksResult {
  const selectedRegion =
    regions.find((region) => region.slug === regionSlug) ?? null;

  const selectedService =
    serviceCatalog.find(
      (service) => service.slug === serviceSlug,
    ) ?? null;

  const serviceLimit = normalizeLimit(relatedServiceLimit, 8);
  const regionLimit = normalizeLimit(relatedRegionLimit, 6);
  const selectedCityLimit = normalizeLimit(cityLimit, 12);
  const selectedPopularLimit = normalizeLimit(popularLimit, 12);

  const currentRegion: InternalLink | null = selectedRegion
    ? {
        label: selectedRegion.shortName,
        href: `/region/${selectedRegion.slug}`,
        description:
          `Dienstleistungen und Anbieter in ${selectedRegion.shortName} vergleichen.`,
      }
    : null;

  const currentService: InternalLink | null = selectedService
    ? {
        label: selectedService.name,
        href: `/leistungen/${selectedService.slug}`,
        description:
          `Informationen, Anbieter und Offerten für ${selectedService.name}.`,
      }
    : null;

  const relatedRegions = regions
    .filter((region) => region.slug !== selectedRegion?.slug)
    .slice(0, regionLimit)
    .map((region) => ({
      label: region.shortName,
      href: selectedService
        ? `/region/${region.slug}/${selectedService.slug}`
        : `/region/${region.slug}`,
      description: selectedService
        ? `${selectedService.name} in ${region.shortName} vergleichen.`
        : `Dienstleister in ${region.shortName} entdecken.`,
    }));

  const relatedCities = selectedRegion
    ? selectedRegion.cities
        .filter((city) => city !== citySlug)
        .slice(0, selectedCityLimit)
        .map((city) => ({
          label: selectedService
            ? `${selectedService.name} in ${formatSlug(city)}`
            : formatSlug(city),
          href: selectedService
            ? `/dienstleistung/${selectedService.slug}/${city}`
            : `/stadt/${city}`,
          description: selectedService
            ? `Regionale Anbieter für ${selectedService.name} in ${formatSlug(city)} vergleichen.`
            : `Dienstleistungen und Anbieter in ${formatSlug(city)} finden.`,
        }))
    : [];

  const relatedServices = selectedService
    ? serviceCatalog
        .filter(
          (service) =>
            service.slug !== selectedService.slug &&
            service.category === selectedService.category,
        )
        .slice(0, serviceLimit)
        .map((service) => ({
          label: selectedRegion
            ? `${service.name} in ${selectedRegion.shortName}`
            : service.name,
          href: selectedRegion
            ? `/region/${selectedRegion.slug}/${service.slug}`
            : `/leistungen/${service.slug}`,
          description: selectedRegion
            ? `${service.name} in ${selectedRegion.shortName} vergleichen.`
            : `Anbieter und Offerten für ${service.name} vergleichen.`,
        }))
    : [];

  const sameServiceOtherRegions = selectedService
    ? regions
        .filter((region) => region.slug !== selectedRegion?.slug)
        .slice(0, regionLimit)
        .map((region) => ({
          label: `${selectedService.name} in ${region.shortName}`,
          href: `/region/${region.slug}/${selectedService.slug}`,
          description:
            `Regionale Anbieter für ${selectedService.name} in ${region.shortName} vergleichen.`,
        }))
    : [];

  const popularServiceSlugs =
    selectedRegion?.popularServices?.length
      ? selectedRegion.popularServices
      : [
          "reinigung",
          "umzugsreinigung",
          "hauswartung",
          "umzug",
          "gartenpflege",
          "maler",
          "elektriker",
          "sanitaer",
        ];

  const popularLinks = uniqueLinks(
    popularServiceSlugs
      .map((popularServiceSlug) =>
        serviceCatalog.find(
          (service) => service.slug === popularServiceSlug,
        ),
      )
      .filter(
        (
          service,
        ): service is (typeof serviceCatalog)[number] =>
          Boolean(service),
      )
      .filter(
        (service) => service.slug !== selectedService?.slug,
      )
      .map((service) => ({
        label: selectedRegion
          ? `${service.name} in ${selectedRegion.shortName}`
          : service.name,
        href: selectedRegion
          ? `/region/${selectedRegion.slug}/${service.slug}`
          : `/leistungen/${service.slug}`,
        description: selectedRegion
          ? `${service.name} in ${selectedRegion.shortName} anfragen.`
          : `Passende Anbieter für ${service.name} finden.`,
      })),
  ).slice(0, selectedPopularLimit);

  return {
    currentRegion,
    currentService,
    relatedRegions: uniqueLinks(relatedRegions),
    relatedCities: uniqueLinks(relatedCities),
    relatedServices: uniqueLinks(relatedServices),
    sameServiceOtherRegions: uniqueLinks(
      sameServiceOtherRegions,
    ),
    popularLinks,
  };
}
