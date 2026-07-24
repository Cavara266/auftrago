import { estimateLeadPrice } from "@/lib/lead-pricing";

export type ParsedLead = {
  service?: string;
  rooms?: string;
  area?: string;
  postalCodes: string[];
  date?: string;
  lift?: boolean;
  balcony?: boolean;
  cellar?: boolean;
  handoverGuarantee?: boolean;
  moving?: boolean;
  cleaning?: boolean;
  raw: string;
  estimatedPrice?: {
    min: number;
    max: number;
    recommended: number;
    currency: "CHF";
    notes: string[];
  };
};

const roomRegex =
  /\b([1-9](?:[.,][05])?)\s*(?:zimmer|zi\.?|zimmerwohnung)\b/i;

const squareRegex =
  /\b(\d{2,4})\s*(?:m²|qm|m2)\b/i;

const postalRegex = /\b\d{4}\b/g;

const dateRegex =
  /\b\d{1,2}[./-]\d{1,2}(?:[./-]\d{2,4})?\b/g;

export function parseLead(text: string): ParsedLead {
  const value = text.toLowerCase();

  const result: ParsedLead = {
    postalCodes: [],
    raw: text,
  };

  if (
    value.includes("umzugsreinigung") ||
    value.includes("endreinigung") ||
    value.includes("wohnungsabgabe") ||
    value.includes("abgabereinigung")
  ) {
    result.service = "Umzugsreinigung";
    result.cleaning = true;
  } else if (
    value.includes("umzug") ||
    value.includes("zügel") ||
    value.includes("transport")
  ) {
    result.service = "Umzug";
    result.moving = true;
  } else if (
    value.includes("fenster") ||
    value.includes("storen") ||
    value.includes("glasreinigung")
  ) {
    result.service = "Fensterreinigung";
  } else if (
    value.includes("garten") ||
    value.includes("hecke") ||
    value.includes("rasen")
  ) {
    result.service = "Gartenpflege";
  } else if (
    value.includes("hauswart") ||
    value.includes("hausmeister") ||
    value.includes("liegenschaft")
  ) {
    result.service = "Hauswartung";
  } else if (
    value.includes("entsorgung") ||
    value.includes("sperrgut") ||
    value.includes("räumung") ||
    value.includes("entrümpel")
  ) {
    result.service = "Entsorgung";
  } else if (
    value.includes("maler") ||
    value.includes("streichen")
  ) {
    result.service = "Malerarbeiten";
  } else if (
    value.includes("elektriker") ||
    value.includes("steckdose") ||
    value.includes("strom")
  ) {
    result.service = "Elektriker";
  } else if (
    value.includes("sanitär") ||
    value.includes("wasserleitung") ||
    value.includes("armatur")
  ) {
    result.service = "Sanitär";
  }

  if (value.includes("lift") || value.includes("aufzug")) {
    result.lift = true;
  }

  if (value.includes("kein lift") || value.includes("ohne lift")) {
    result.lift = false;
  }

  if (value.includes("balkon") || value.includes("terrasse")) {
    result.balcony = true;
  }

  if (value.includes("kein balkon") || value.includes("ohne balkon")) {
    result.balcony = false;
  }

  if (value.includes("keller") || value.includes("estrich")) {
    result.cellar = true;
  }

  if (value.includes("kein keller") || value.includes("ohne keller")) {
    result.cellar = false;
  }

  if (
    value.includes("abgabegarantie") ||
    value.includes("mit garantie")
  ) {
    result.handoverGuarantee = true;
  }

  const room = text.match(roomRegex);

  if (room) {
    result.rooms = room[1].replace(",", ".");
  }

  const area = text.match(squareRegex);

  if (area) {
    result.area = area[1];
  }

  const postalCodes = text.match(postalRegex);

  if (postalCodes) {
    result.postalCodes = Array.from(new Set(postalCodes));
  }

  const dates = text.match(dateRegex);

  if (dates?.length) {
    result.date = dates[0];
  }

  if (result.service) {
    result.estimatedPrice = estimateLeadPrice({
      service: result.service,
      rooms: result.rooms ? Number(result.rooms) : undefined,
      area: result.area ? Number(result.area) : undefined,
      elevator: result.lift,
      balcony: result.balcony,
      cellar: result.cellar,
      handoverGuarantee: result.handoverGuarantee,
    });
  }

  return result;
}