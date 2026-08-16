import { HomePageContent } from "../home-page";

export { dynamic, metadata } from "../home-page";

export default async function LocalizedHomePage() {
  return HomePageContent({ locale: "en" });
}
