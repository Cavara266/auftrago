import {
  CATEGORY_META,
  createCategorySlug,
} from "./category-meta";

import {
  services,
} from "./catalog";

import type {
  ServiceCategoryDefinition,
  ServiceDefinition,
} from "./types";

export type {
  ServiceCategoryDefinition,
  ServiceDefinition,
  ServiceQuestion,
  ServiceQuestionType,
} from "./types";

export {
  services,
};

export const serviceCategories: ServiceCategoryDefinition[] =
  Array.from(
    new Set(
      services.map((service) => service.category),
    ),
  )
    .map((categoryName) => {
      const meta = CATEGORY_META[categoryName];

      return {
        slug: createCategorySlug(categoryName),
        name: categoryName,
        icon: meta?.icon || "➕",
        description:
          meta?.description ||
          "Weitere Dienstleistungen und regionale Fachbetriebe.",
        serviceCount: services.filter(
          (service) =>
            service.category === categoryName,
        ).length,
      };
    })
    .sort((first, second) =>
      first.name.localeCompare(
        second.name,
        "de-CH",
      ),
    );

export function getServicesByCategory(
  category: string,
): ServiceDefinition[] {
  return services
    .filter(
      (service) =>
        service.category === category,
    )
    .sort((first, second) =>
      first.title.localeCompare(
        second.title,
        "de-CH",
      ),
    );
}

export function getServiceBySlug(
  slug: string,
): ServiceDefinition | undefined {
  const normalizedSlug =
    slug.trim().toLowerCase();

  return services.find(
    (service) =>
      service.slug.toLowerCase() ===
      normalizedSlug,
  );
}

export function getServiceByTitle(
  title: string,
): ServiceDefinition | undefined {
  const normalizedTitle =
    title.trim().toLowerCase();

  return services.find(
    (service) =>
      service.title.trim().toLowerCase() ===
      normalizedTitle,
  );
}

export function searchServices(
  query: string,
): ServiceDefinition[] {
  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return services;
  }

  const queryWords =
    normalizedQuery
      .split(/\s+/)
      .filter(Boolean);

  return services
    .map((service) => {
      const searchableContent = [
        service.slug,
        service.title,
        service.short,
        service.category,
        service.description,
        service.longDescription,
        ...service.keywords,
      ]
        .join(" ")
        .toLowerCase();

      const score = queryWords.reduce(
        (currentScore, word) => {
          if (
            service.title
              .toLowerCase()
              .includes(word)
          ) {
            return currentScore + 8;
          }

          if (
            service.keywords.some(
              (keyword) =>
                keyword
                  .toLowerCase()
                  .includes(word),
            )
          ) {
            return currentScore + 5;
          }

          if (
            searchableContent.includes(word)
          ) {
            return currentScore + 2;
          }

          return currentScore;
        },
        0,
      );

      return {
        service,
        score,
      };
    })
    .filter((result) => result.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score,
    )
    .map((result) => result.service);
}

export function getFeaturedServices(
  limit = 8,
): ServiceDefinition[] {
  const safeLimit = Math.max(
    0,
    Math.floor(limit),
  );

  const featured = services.filter(
    (service) => service.featured,
  );

  const remaining = services.filter(
    (service) => !service.featured,
  );

  return [
    ...featured,
    ...remaining,
  ].slice(0, safeLimit);
}
