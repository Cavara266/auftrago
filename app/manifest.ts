import type { MetadataRoute } from "next"

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://auftrago.ch"
}

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = getBaseUrl()

  return {
    name: "Auftrago",
    short_name: "Auftrago",
    description:
      "Vergleiche Offerten für Reinigung, Umzug, Entsorgung, Hauswartung und weitere Dienstleistungen in der Schweiz.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    lang: "de-CH",
    icons: [
      {
        src: `${baseUrl}/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: `${baseUrl}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: `${baseUrl}/apple-icon.png`,
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}