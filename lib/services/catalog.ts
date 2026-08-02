import {
  services as legacyServices,
} from "@/lib/services";

import type {
  ServiceDefinition,
} from "./types";

export const services: ServiceDefinition[] =
  legacyServices.map((service) => ({
    slug: service.slug,
    title: service.title,
    short: service.short,
    category: service.category,
    icon: service.icon,
    description: service.description,
    longDescription: service.longDescription,
    keywords: service.keywords,
    leadPrice: service.leadPrice,
    questions: service.questions,
    featured: service.featured,
  }));
