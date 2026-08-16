import { notFound } from "next/navigation";

import AnbieterRegistrierenPage from "../../anbieter-registrieren/page";

const supportedLocales = [
  "de",
  "fr",
  "it",
  "en",
  "sq",
  "tr",
  "pt",
  "es",
] as const;

type Locale = (typeof supportedLocales)[number];

function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

type PageProps = {
  params: {
    slug: string;
  };
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LocalizedAnbieterRegistrierenPage({
  params,
}: PageProps) {
  if (!isLocale(params.slug)) {
    notFound();
  }

  return <AnbieterRegistrierenPage />;
}
