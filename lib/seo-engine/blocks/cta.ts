import type { SeoBlock, SeoBuildContext } from "../builder";

export function buildCtaBlock(
  ctx: SeoBuildContext,
): SeoBlock {
  return {
    id: "cta",
    title: "Kostenlos Offerten vergleichen",
    content: `Starten Sie jetzt Ihre Anfrage für ${ctx.service.name.toLowerCase()} in ${ctx.city.name} und vergleichen Sie kostenlos passende Offerten.`,
  };
}
