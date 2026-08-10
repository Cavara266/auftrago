import { getServerLocale } from "./server";
import { getMessages } from "./messages";

export async function getServerMessages() {
  const locale = await getServerLocale();

  return {
    locale,
    messages: getMessages(locale),
  };
}
