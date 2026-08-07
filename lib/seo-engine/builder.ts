import type { CityProfile } from "@/data/seo/city-profiles";
import type { ServiceProfile } from "@/data/seo/service-profiles";

export type SeoBlock = {
  id: string;
  title?: string;
  content: string | string[];
};

export type SeoBuildContext = {
  city: CityProfile;
  service: ServiceProfile;
};

export function buildBlocks(
  ...blocks: (SeoBlock | null | undefined)[]
): SeoBlock[] {
  return blocks.filter(Boolean) as SeoBlock[];
}
