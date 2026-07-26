#!/usr/bin/env node

const baseUrl = process.argv[2] || "http://localhost:3000";
const paths = (process.argv.slice(3).length
  ? process.argv.slice(3)
  : [
      "/",
      "/dienstleistungen",
      "/offerte-anfragen",
      "/dienstleistung/reinigung/zuerich",
    ]);

function extract(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || "";
}

let failed = false;

for (const path of paths) {
  const url = new URL(path, baseUrl).toString();

  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "Auftrago-SEO-Audit/1.0",
      },
    });

    const html = await response.text();
    const title = extract(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = extract(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i
    );
    const canonical = extract(
      html,
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i
    );
    const h1Count = (html.match(/<h1(?:\s|>)/gi) || []).length;
    const jsonLdCount = (
      html.match(/type=["']application\/ld\+json["']/gi) || []
    ).length;
    const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);

    const problems = [];

    if (!response.ok) problems.push(`HTTP ${response.status}`);
    if (!title) problems.push("Titel fehlt");
    if (title.length > 65) problems.push(`Titel zu lang (${title.length})`);
    if (!description) problems.push("Description fehlt");
    if (description.length > 165)
      problems.push(`Description zu lang (${description.length})`);
    if (!canonical) problems.push("Canonical fehlt");
    if (h1Count !== 1) problems.push(`${h1Count} H1 gefunden`);
    if (!jsonLdCount) problems.push("JSON-LD fehlt");
    if (noindex) problems.push("noindex aktiv");

    const status = problems.length ? "FEHLER" : "OK";
    console.log(`\n[${status}] ${url}`);
    console.log(`  Title: ${title || "-"}`);
    console.log(`  Description: ${description || "-"}`);
    console.log(`  Canonical: ${canonical || "-"}`);
    console.log(`  H1: ${h1Count}, JSON-LD: ${jsonLdCount}`);

    for (const problem of problems) {
      console.log(`  - ${problem}`);
    }

    if (problems.length) failed = true;
  } catch (error) {
    failed = true;
    console.error(`\n[FEHLER] ${url}`);
    console.error(`  ${error instanceof Error ? error.message : error}`);
  }
}

process.exitCode = failed ? 1 : 0;