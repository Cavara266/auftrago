import { getServiceProfile } from "@/data/seo/services";
import { getSwissCity } from "@/data/seo/locations";
import {
  seoIntents,
  seoAudiences,
  seoModifiers,
} from "@/data/seo/dimensions";

export function isValidSeoCombination(input: {
  service: string;
  city: string;
  intent?: string;
  audience?: string;
  modifier?: string;
}) {
  if (!getServiceProfile(input.service)) {
    return false;
  }

  if (!getSwissCity(input.city)) {
    return false;
  }

  if (
    input.intent &&
    !seoIntents.includes(
      input.intent as (typeof seoIntents)[number]
    )
  ) {
    return false;
  }

  if (
    input.audience &&
    !seoAudiences.includes(
      input.audience as (typeof seoAudiences)[number]
    )
  ) {
    return false;
  }

  if (
    input.modifier &&
    !seoModifiers.includes(
      input.modifier as (typeof seoModifiers)[number]
    )
  ) {
    return false;
  }

  return true;
}
