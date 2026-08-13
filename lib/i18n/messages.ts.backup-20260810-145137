import de from "@/messages/de.json";
import fr from "@/messages/fr.json";
import it from "@/messages/it.json";
import en from "@/messages/en.json";
import type { Locale } from "./config";

const messages = {
  de,
  fr,
  it,
  en,
} as const;

export type Messages = typeof de;

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages.de;
}
