const BASE_URL = "https://www.auftrago.ch";

const SEO_LIMIT = 1000000;
const CHUNK_SIZE = 50000;

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const chunks = Math.ceil(SEO_LIMIT / CHUNK_SIZE);

  const entries = [
    `<sitemap><loc>${BASE_URL}/sitemap.xml</loc></sitemap>`,
  ];

  for (let chunk = 1; chunk <= chunks; chunk++) {
    entries.push(
      `<sitemap><loc>${BASE_URL}/sitemaps/${chunk}</loc></sitemap>`,
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries.join("") +
    `</sitemapindex>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400",
    },
  });
}
