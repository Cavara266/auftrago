export type SeoBreadcrumb = {
  name: string;
  path: string;
};

export function homeBreadcrumb(): SeoBreadcrumb {
  return {
    name: "Startseite",
    path: "/",
  };
}

export function serviceBreadcrumbs(
  serviceName: string,
  serviceSlug: string
): SeoBreadcrumb[] {
  return [
    homeBreadcrumb(),
    {
      name: "Dienstleistungen",
      path: "/dienstleistungen",
    },
    {
      name: serviceName,
      path: `/leistungen/${serviceSlug}`,
    },
  ];
}

export function cityBreadcrumbs(
  cityName: string,
  citySlug: string
): SeoBreadcrumb[] {
  return [
    homeBreadcrumb(),
    {
      name: "Städte",
      path: "/stadt",
    },
    {
      name: cityName,
      path: `/stadt/${citySlug}`,
    },
  ];
}

export function regionBreadcrumbs(
  regionName: string,
  regionSlug: string
): SeoBreadcrumb[] {
  return [
    homeBreadcrumb(),
    {
      name: "Regionen",
      path: "/region",
    },
    {
      name: regionName,
      path: `/region/${regionSlug}`,
    },
  ];
}

export function serviceCityBreadcrumbs({
  serviceName,
  serviceSlug,
  cityName,
  citySlug,
}: {
  serviceName: string;
  serviceSlug: string;
  cityName: string;
  citySlug: string;
}): SeoBreadcrumb[] {
  return [
    homeBreadcrumb(),
    {
      name: "Dienstleistungen",
      path: "/dienstleistungen",
    },
    {
      name: serviceName,
      path: `/leistungen/${serviceSlug}`,
    },
    {
      name: cityName,
      path: `/dienstleistung/${serviceSlug}/${citySlug}`,
    },
  ];
}
