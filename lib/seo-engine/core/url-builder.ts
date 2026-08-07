export type SeoUrlInput = {
  service: string;
  city: string;
  intent?: string;
  audience?: string;
  modifier?: string;
};

export function buildSeoUrl(input: SeoUrlInput) {
  const {
    service,
    city,
    intent,
    audience,
    modifier,
  } = input;

  if (
    intent &&
    audience &&
    modifier
  ) {
    return `/seo/${service}/${city}/${intent}/${audience}/${modifier}`;
  }

  return `/${service}/${city}`;
}
