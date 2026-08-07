import type { SeoBlock, SeoBuildContext } from "../builder";

export function buildIntroBlock(
  ctx: SeoBuildContext,
): SeoBlock {
  return {
    id: "intro",
    title: `${ctx.service.name} in ${ctx.city.name}`,
    content: `Vergleichen Sie regionale Anbieter für ${ctx.service.name.toLowerCase()} in ${ctx.city.name}. Beschreiben Sie Ihr Projekt kostenlos und erhalten Sie passende Offerten von qualifizierten Unternehmen.`,
  };
}
