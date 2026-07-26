import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Auftrago – Offertenplattform Schweiz",
    short_name: "Auftrago",
    description:
      "Regionale Anbieter für Dienstleistungen und Handwerk in der Schweiz vergleichen.",
    start_url: "/",
    display: "standalone",
    background_color: "#030816",
    theme_color: "#030816",
    lang: "de-CH",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
