export type LeadPriceInput = {
  service: string;
  rooms?: number;
  area?: number;
  windows?: number;
  bathrooms?: number;
  distanceKm?: number;
  floor?: number;
  elevator?: boolean;
  balcony?: boolean;
  cellar?: boolean;
  handoverGuarantee?: boolean;
  urgency?: "normal" | "urgent";
};

export type LeadPriceEstimate = {
  min: number;
  max: number;
  recommended: number;
  currency: "CHF";
  notes: string[];
};

function roundToTen(value: number) {
  return Math.max(0, Math.round(value / 10) * 10);
}

function normalizeService(service: string) {
  return service.trim().toLowerCase();
}

export function estimateLeadPrice(
  input: LeadPriceInput
): LeadPriceEstimate {
  const service = normalizeService(input.service);
  const notes: string[] = [];

  let base = 350;

  if (service.includes("umzugsreinigung")) {
    base = 480;
    base += Math.max(0, (input.rooms ?? 2.5) - 2.5) * 110;
    base += Math.max(0, (input.area ?? 60) - 60) * 3.5;
    base += Math.max(0, (input.windows ?? 6) - 6) * 18;
    base += Math.max(0, (input.bathrooms ?? 1) - 1) * 90;

    if (input.balcony) {
      base += 60;
      notes.push("Balkon berücksichtigt");
    }

    if (input.cellar) {
      base += 50;
      notes.push("Keller berücksichtigt");
    }

    if (input.handoverGuarantee) {
      base += 90;
      notes.push("Abgabegarantie berücksichtigt");
    }
  } else if (service.includes("umzug")) {
    base = 650;
    base += Math.max(0, (input.rooms ?? 2.5) - 2.5) * 240;
    base += Math.max(0, input.distanceKm ?? 0) * 3.5;

    if ((input.floor ?? 0) > 1 && !input.elevator) {
      base += (input.floor ?? 0) * 80;
      notes.push("Etage ohne Lift berücksichtigt");
    }
  } else if (service.includes("fenster")) {
    base = 220;
    base += Math.max(0, input.windows ?? 5) * 25;
  } else if (service.includes("garten")) {
    base = 320;
    base += Math.max(0, (input.area ?? 100) - 100) * 1.4;
  } else if (
    service.includes("entsorgung") ||
    service.includes("räumung")
  ) {
    base = 550;
    base += Math.max(0, (input.rooms ?? 2.5) - 2.5) * 180;
    notes.push("Entsorgungskosten können nach Gewicht variieren");
  } else if (service.includes("maler")) {
    base = 700;
    base += Math.max(0, input.area ?? 50) * 14;
  } else if (
    service.includes("elektriker") ||
    service.includes("sanitär")
  ) {
    base = 260;
  }

  if (input.urgency === "urgent") {
    base *= 1.2;
    notes.push("Dringlichkeitszuschlag berücksichtigt");
  }

  const min = roundToTen(base * 0.88);
  const max = roundToTen(base * 1.15);
  const recommended = roundToTen((min + max) / 2);

  return {
    min,
    max,
    recommended,
    currency: "CHF",
    notes,
  };
}