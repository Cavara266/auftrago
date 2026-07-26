import { cityProfiles } from "@/data/seo/city-profiles";
import {
  getServiceProfile,
  serviceProfiles,
} from "@/data/seo/service-profiles";

export function getRelatedServiceLinks(
  currentServiceSlug: string,
  citySlug: string,
  limit = 8
) {
  const current = getServiceProfile(currentServiceSlug);
  const preferred = current?.related || [];

  const ordered = [
    ...preferred,
    ...serviceProfiles.map((service) => service.slug),
  ];

  return [...new Set(ordered)]
    .filter((slug) => slug !== currentServiceSlug)
    .map((slug) => getServiceProfile(slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service))
    .slice(0, limit)
    .map((service) => ({
      label: `${service.name}`,
      href: `/dienstleistung/${service.slug}/${citySlug}`,
    }));
}

export function getNearbyCityLinks(
  currentCitySlug: string,
  serviceSlug: string,
  fallbackLimit = 10
) {
  const current = cityProfiles.find((city) => city.slug === currentCitySlug);
  const preferred = current?.nearby || [];

  const ordered = [
    ...preferred,
    ...cityProfiles.map((city) => city.slug),
  ];

  return [...new Set(ordered)]
    .filter((slug) => slug !== currentCitySlug)
    .map((slug) => cityProfiles.find((city) => city.slug === slug))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))
    .slice(0, fallbackLimit)
    .map((city) => ({
      label: city.name,
      href: `/dienstleistung/${serviceSlug}/${city.slug}`,
    }));
}
