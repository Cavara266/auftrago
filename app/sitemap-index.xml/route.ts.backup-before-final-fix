import {
  serviceProfiles,
} from "@/data/seo/service-profiles";
import {
  swissCities,
} from "@/data/seo-scale/swiss-cities";

const BASE_URL = "https://www.auftrago.ch";
const CHUNK_SIZE = 40000;

const INTENT_COUNT = 12;
const AUDIENCE_COUNT = 8;
const MODIFIER_COUNT = 10;

export async function GET() {
  const totalUrls =
    serviceProfiles.length *
    swissCities.length *
    INTENT_COUNT *
    AUDIENCE_COUNT *
    MODIFIER_COUNT;

  const chunks = Math.ceil(totalUrls / CHUNK_SIZE);

  const entries = Array.from(
    { length: chunks },
    (_, index) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/${index + 1}</loc>
  </sitemap>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
