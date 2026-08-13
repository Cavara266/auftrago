import type { MetadataRoute } from "next";

import { serviceProfiles } from "@/data/seo/service-profiles";
import { swissCities } from "@/data/seo-scale/swiss-cities";

const intents = [
  "kosten",
  "preise",
  "offerte",
  "anbieter",
  "firma",
  "vergleich",
  "guenstig",
  "schnell",
  "professionell",
  "regional",
  "kurzfristig",
  "beratung",
] as const;

const audiences = [
  "privat",
  "gewerbe",
  "verwaltung",
  "firma",
  "eigentuemer",
  "mieter",
  "buero",
  "immobilien",
] as const;

const modifiers = [
  "finden",
  "vergleichen",
  "anfragen",
  "buchen",
  "kosten",
  "preise",
  "offerte",
  "service",
  "experten",
  "anbieter",
] as const;

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.auftrago.ch";

const SITEMAP_CHUNK_SIZE = 40000;

function isPreferredCombination(
  intent: string,
  audience: string,
  modifier: string
) {
  const highIntent =
    intent === "preise" ||
    intent === "kosten" ||
    intent === "offerte" ||
    intent === "anbieter" ||
    intent === "vergleich";

  const usefulModifier =
    modifier === "finden" ||
    modifier === "vergleichen" ||
    modifier === "anfragen" ||
    modifier === "offerte" ||
    modifier === "anbieter";

  const usefulAudience =
    audience === "privat" ||
    audience === "gewerbe" ||
    audience === "verwaltung" ||
    audience === "firma";

  return highIntent && usefulModifier && usefulAudience;
}

function getSeoUrls() {
  const urls: string[] = [];

  for (const service of serviceProfiles) {
    if (!service || !service.slug) continue;
    if (!service || !service.slug) continue;
    for (const city of swissCities) {
      if (!city || !city.slug) continue;
      if (!city || !city.slug) continue;
      for (const intent of intents) {
        for (const audience of audiences) {
          for (const modifier of modifiers) {
            if (!isPreferredCombination(intent, audience, modifier)) {
              continue;
            }

            urls.push(
              `${BASE_URL}/seo/${service.slug}/${city.slug}/${intent}/${audience}/${modifier}`
            );
          }
        }
      }
    }
  }

  return urls;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/dienstleistung`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/region`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  for (const service of serviceProfiles) {
    if (!service || !service.slug) continue;
    if (!service || !service.slug) continue;
    staticEntries.push({
      url: `${BASE_URL}/leistungen/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const city of swissCities) {
      if (!city || !city.slug) continue;
      if (!city || !city.slug) continue;
    staticEntries.push({
      url: `${BASE_URL}/stadt/${city.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return staticEntries;
}

export function getSeoSitemapInfo() {
  const urls = getSeoUrls();

  return {
    count: urls.length,
    chunkSize: SITEMAP_CHUNK_SIZE,
    chunks: Math.ceil(urls.length / SITEMAP_CHUNK_SIZE),
  };
}
