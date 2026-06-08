import { MetadataRoute } from "next";
import { generateSlugs, services } from "@/lib/seo-data";
import { regions } from "@/lib/region-data";
import { citiesSeo } from "@/lib/city-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.auftrago.ch";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/offerte-anfragen`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/anbieter`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/leistungen`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/region`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const regionPages: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${baseUrl}/region/${region.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const cityPages: MetadataRoute.Sitemap = citiesSeo.map((city) => ({
    url: `${baseUrl}/stadt/${city.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/leistungen/${service}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const seoPages: MetadataRoute.Sitemap = generateSlugs().map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...regionPages,
    ...cityPages,
    ...servicePages,
    ...seoPages,
  ];
}