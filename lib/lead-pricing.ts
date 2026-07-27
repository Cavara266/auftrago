export const MINIMUM_LEAD_PRICE = 10;

/*
 * Automatischer Credit-Rabatt
 */

export type LeadPricing = {
  originalPrice: number;
  currentPrice: number;
  discountPercent: number;
  ageInDays: number;
  isDiscounted: boolean;
  dealLabel: string | null;
};

export function getLeadPricing(
  originalPrice: number,
  createdAt: Date,
  now = new Date()
): LeadPricing {
  const safeOriginalPrice = Math.max(
    MINIMUM_LEAD_PRICE,
    Math.floor(originalPrice)
  );

  const ageInMilliseconds = Math.max(
    0,
    now.getTime() - createdAt.getTime()
  );

  const ageInDays = Math.floor(
    ageInMilliseconds / (1000 * 60 * 60 * 24)
  );

  let discountPercent = 0;
  let dealLabel: string | null = null;

  if (ageInDays >= 7) {
    discountPercent = 50;
    dealLabel = "Letzte Chance";
  } else if (ageInDays >= 5) {
    discountPercent = 30;
    dealLabel = "Top Deal";
  } else if (ageInDays >= 3) {
    discountPercent = 15;
    dealLabel = "Smart Deal";
  }

  const discountedPrice = Math.ceil(
    safeOriginalPrice *
      (1 - discountPercent / 100)
  );

  const currentPrice = Math.max(
    MINIMUM_LEAD_PRICE,
    discountedPrice
  );

  const isDiscounted =
    discountPercent > 0 &&
    currentPrice < safeOriginalPrice;

  return {
    originalPrice: safeOriginalPrice,
    currentPrice,
    discountPercent: isDiscounted
      ? discountPercent
      : 0,
    ageInDays,
    isDiscounted,
    dealLabel: isDiscounted
      ? dealLabel
      : null,
  };
}

/*
 * KI-Preisberechnung für eingehende Aufträge
 */

export type LeadEstimateInput = {
  service: string;
  rooms?: number;
  area?: number;
  elevator?: boolean;
  balcony?: boolean;
  cellar?: boolean;
  handoverGuarantee?: boolean;
};

export type LeadPriceEstimate = {
  min: number;
  max: number;
  recommended: number;
  currency: "CHF";
  notes: string[];
};

function roundToTen(value: number) {
  return Math.max(
    0,
    Math.round(value / 10) * 10
  );
}

export function estimateLeadPrice(
  input: LeadEstimateInput
): LeadPriceEstimate {
  const service =
    input.service.trim().toLowerCase();

  const rooms =
    typeof input.rooms === "number" &&
    Number.isFinite(input.rooms)
      ? Math.max(0, input.rooms)
      : 0;

  const area =
    typeof input.area === "number" &&
    Number.isFinite(input.area)
      ? Math.max(0, input.area)
      : 0;

  let basePrice = 500;
  let minimumFactor = 0.82;
  let maximumFactor = 1.22;

  const notes: string[] = [];

  if (
    service.includes("umzugsreinigung") ||
    service.includes("endreinigung")
  ) {
    basePrice = 480;

    if (rooms > 0) {
      basePrice += rooms * 170;
      notes.push(
        `${rooms} Zimmer wurden berücksichtigt.`
      );
    }

    if (area > 0) {
      basePrice += area * 2.2;
      notes.push(
        `${area} m² Wohnfläche wurden berücksichtigt.`
      );
    }

    if (input.balcony) {
      basePrice += 90;
      notes.push(
        "Balkon oder Terrasse ist enthalten."
      );
    }

    if (input.cellar) {
      basePrice += 70;
      notes.push(
        "Keller oder Estrich ist enthalten."
      );
    }

    if (input.handoverGuarantee) {
      basePrice += 130;
      notes.push(
        "Abgabegarantie ist enthalten."
      );
    }
  } else if (
    service.includes("fenster")
  ) {
    basePrice = 320;

    if (area > 0) {
      basePrice += area * 2;
      notes.push(
        `${area} m² wurden berücksichtigt.`
      );
    }
  } else if (
    service.includes("umzug") ||
    service.includes("transport")
  ) {
    basePrice = 650;

    if (rooms > 0) {
      basePrice += rooms * 280;
      notes.push(
        `${rooms} Zimmer wurden berücksichtigt.`
      );
    }

    if (area > 0) {
      basePrice += area * 3.2;
      notes.push(
        `${area} m² wurden berücksichtigt.`
      );
    }

    if (input.elevator === false) {
      basePrice += 250;
      notes.push(
        "Kein Lift vorhanden."
      );
    }

    if (input.cellar) {
      basePrice += 120;
      notes.push(
        "Keller oder Estrich ist enthalten."
      );
    }
  } else if (
    service.includes("garten")
  ) {
    basePrice = 420;

    if (area > 0) {
      basePrice += area * 2.5;
      notes.push(
        `${area} m² Gartenfläche wurden berücksichtigt.`
      );
    }
  } else if (
    service.includes("hauswart")
  ) {
    basePrice = 550;

    if (area > 0) {
      basePrice += area * 1.5;
      notes.push(
        `${area} m² Objektfläche wurden berücksichtigt.`
      );
    }
  } else if (
    service.includes("entsorgung") ||
    service.includes("räumung")
  ) {
    basePrice = 750;

    if (rooms > 0) {
      basePrice += rooms * 240;
      notes.push(
        `${rooms} Räume wurden berücksichtigt.`
      );
    }

    if (area > 0) {
      basePrice += area * 4;
      notes.push(
        `${area} m² wurden berücksichtigt.`
      );
    }
  } else if (
    service.includes("maler")
  ) {
    basePrice = 850;

    if (rooms > 0) {
      basePrice += rooms * 420;
      notes.push(
        `${rooms} Zimmer wurden berücksichtigt.`
      );
    }

    if (area > 0) {
      basePrice += area * 12;
      notes.push(
        `${area} m² wurden berücksichtigt.`
      );
    }
  } else if (
    service.includes("elektriker") ||
    service.includes("sanitär")
  ) {
    basePrice = 350;

    if (area > 0) {
      basePrice += area * 1.4;
      notes.push(
        `${area} m² wurden berücksichtigt.`
      );
    }
  } else {
    notes.push(
      "Preis basiert auf einem allgemeinen Richtwert."
    );
  }

  if (rooms === 0 && area === 0) {
    notes.push(
      "Für eine genauere Schätzung werden Fläche oder Zimmerzahl benötigt."
    );

    minimumFactor = 0.72;
    maximumFactor = 1.35;
  }

  const min = roundToTen(
    basePrice * minimumFactor
  );

  const max = roundToTen(
    basePrice * maximumFactor
  );

  const recommended = roundToTen(
    basePrice
  );

  return {
    min,
    max,
    recommended,
    currency: "CHF",
    notes,
  };
}
