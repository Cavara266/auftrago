import { serviceProfiles } from "@/data/seo/services";
import { swissCities } from "@/data/seo/locations";
import {
  seoIntents,
  seoAudiences,
  seoModifiers,
} from "@/data/seo/dimensions";

export const seoCatalog = {
  services: serviceProfiles,
  cities: swissCities,
  intents: seoIntents,
  audiences: seoAudiences,
  modifiers: seoModifiers,
};

export function getSeoCatalogStats() {
  const services = serviceProfiles.length;
  const cities = swissCities.length;
  const intents = seoIntents.length;
  const audiences = seoAudiences.length;
  const modifiers = seoModifiers.length;

  return {
    services,
    cities,
    intents,
    audiences,
    modifiers,

    basePages:
      services * cities,

    intentPages:
      services *
      cities *
      intents,

    audiencePages:
      services *
      cities *
      audiences,

    fullPotential:
      services *
      cities *
      intents *
      audiences *
      modifiers,
  };
}
