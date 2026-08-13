import { serviceProfiles } from "@/data/seo/service-profiles";
import { swissCities } from "@/data/seo-scale/swiss-cities";

const BASE_URL = "https://www.auftrago.ch";

const CHUNK_SIZE = 50000;
const SEO_LIMIT = 1000000;

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
  "service",
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
  "guenstig",
  "vergleichen",
  "anfragen",
  "buchen",
  "kosten",
  "preise",
  "offerte",
  "service",
  "experten",
  "anbieter",
  "regional",
  "professionell",
] as const;

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function getSeoUrl(globalIndex: number) {
  /*
    Reihenfolge bewusst:
    Stadt -> Service -> Modifier -> Audience -> Intent

    Dadurch werden schon in den ersten Chunks möglichst viele
    Gemeinden und Dienstleistungen abgedeckt.
  */

  let n = globalIndex;

  const cityIndex = n % swissCities.length;
  n = Math.floor(n / swissCities.length);

  const serviceIndex = n % serviceProfiles.length;
  n = Math.floor(n / serviceProfiles.length);

  const modifierIndex = n % modifiers.length;
  n = Math.floor(n / modifiers.length);

  const audienceIndex = n % audiences.length;
  n = Math.floor(n / audiences.length);

  const intentIndex = n % intents.length;

  const city = swissCities[cityIndex];
  const service = serviceProfiles[serviceIndex];

  if (!city?.slug || !service?.slug) {
    return null;
  }

  return (
    `${BASE_URL}/seo/` +
    `${service.slug}/` +
    `${city.slug}/` +
    `${intents[intentIndex]}/` +
    `${audiences[audienceIndex]}/` +
    `${modifiers[modifierIndex]}`
  );
}

export async function GET(
  request: Request,
  { params }: { params: { chunk: string } },
) {
  const chunk = Number(params.chunk);

  const maxChunks = Math.ceil(SEO_LIMIT / CHUNK_SIZE);

  if (
    !Number.isInteger(chunk) ||
    chunk < 1 ||
    chunk > maxChunks
  ) {
    return new Response("Sitemap not found", {
      status: 404,
    });
  }

  const start = (chunk - 1) * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, SEO_LIMIT);

  const urls: string[] = [];

  for (let index = start; index < end; index++) {
    const url = getSeoUrl(index);

    if (url) {
      urls.push(
        `<url><loc>${xmlEscape(url)}</loc>` +
        `<changefreq>weekly</changefreq>` +
        `<priority>0.7</priority></url>`,
      );
    }
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.join("") +
    `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
