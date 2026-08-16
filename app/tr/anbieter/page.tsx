import AnbieterPage from "../../anbieter/page";
import ProviderPageAutoTranslate from "@/components/i18n/ProviderPageAutoTranslate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LocalizedAnbieterPage() {
  const page = await Promise.resolve(AnbieterPage());

  return (
    <>
      {page}
      <ProviderPageAutoTranslate />
    </>
  );
}
