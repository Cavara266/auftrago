export function generateSeoText(service: string, city: string) {
  return `
${service} in ${city} – Anbieter vergleichen

Wenn Sie eine professionelle ${service.toLowerCase()} in ${city} suchen,
können Sie über Auftrago schnell mehrere Offerten erhalten.

Unsere Plattform verbindet Kunden mit lokalen Dienstleistern aus ${city}.
Vergleichen Sie Anbieter, Bewertungen und Preise.

So funktioniert es:

1. Anfrage erstellen
2. Offerten erhalten
3. Anbieter vergleichen

Starten Sie jetzt Ihre Anfrage für ${service.toLowerCase()} in ${city}.
`
}