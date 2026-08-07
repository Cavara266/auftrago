import { serviceProfiles } from "@/data/seo/service-profiles";
import { cityProfiles } from "@/data/seo/city-profiles";
import {
  seoAudiences,
  seoIntents,
  seoModifiers,
} from "./dimensions";

export const seoScaleStats = {
  services: serviceProfiles.length,
  cities: cityProfiles.length,
  intents: seoIntents.length,
  audiences: seoAudiences.length,
  modifiers: seoModifiers.length,
};

export function getSeoScalePotential() {
  const {
    services,
    cities,
    intents,
    audiences,
    modifiers,
  } = seoScaleStats;

  return {
    base: services * cities,
    serviceCityIntent:
      services * cities * intents,
    serviceCityAudience:
      services * cities * audiences,
    serviceCityModifier:
      services * cities * modifiers,
    fullPotential:
      services *
      cities *
      intents *
      audiences *
      modifiers,
  };
}
