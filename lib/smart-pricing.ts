import { prisma } from "@/lib/prisma";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type SmartPricingLevel = {
  afterDays: number;
  discountPercent: number;
  label: string;
};

export type SmartPricingSettings = {
  enabled: boolean;
  minimumPrice: number;
  resetAfterPurchase: boolean;
  showCountdown: boolean;
  label: string;
  levels: SmartPricingLevel[];
};

export type CalculateSmartPriceInput = {
  originalPrice: number;
  createdAt: Date | string;
  lastPurchaseAt?: Date | string | null;
  now?: Date | string;
  settings?: SmartPricingSettings;
};

export type SmartPriceResult = {
  enabled: boolean;
  isDiscounted: boolean;

  originalPrice: number;
  currentPrice: number;

  discountPercent: number;
  discountAmount: number;

  ageInDays: number;
  pricingStartedAt: Date;

  label: string | null;

  nextDiscountAt: Date | null;
  nextDiscountPercent: number | null;
  nextPrice: number | null;

  showCountdown: boolean;
  minimumPrice: number;
};

export const DEFAULT_SMART_PRICING_SETTINGS: SmartPricingSettings = {
  enabled: true,
  minimumPrice: 10,
  resetAfterPurchase: true,
  showCountdown: true,
  label: "Smart Deal",

  levels: [
    {
      afterDays: 3,
      discountPercent: 15,
      label: "Smart Deal",
    },
    {
      afterDays: 5,
      discountPercent: 30,
      label: "Top Deal",
    },
    {
      afterDays: 7,
      discountPercent: 50,
      label: "Letzte Chance",
    },
  ],
};

/**
 * Alte Konstante bleibt aus Kompatibilitätsgründen erhalten.
 * Bestehende Imports von SMART_PRICING_RULES funktionieren dadurch weiter.
 */
export const SMART_PRICING_RULES = {
  minimumPrice: DEFAULT_SMART_PRICING_SETTINGS.minimumPrice,
  levels: DEFAULT_SMART_PRICING_SETTINGS.levels,
} as const;

function normalizeDate(
  value: Date | string | null | undefined,
  fallback: Date,
): Date {
  if (!value) {
    return fallback;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date;
}

function normalizeInteger(
  value: number,
  fallback: number,
  minimum: number,
): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(minimum, Math.round(value));
}

function normalizeDiscountPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(95, Math.max(0, Math.round(value)));
}

function sortLevels(
  levels: SmartPricingLevel[],
): SmartPricingLevel[] {
  return [...levels]
    .map((level) => ({
      afterDays: normalizeInteger(level.afterDays, 1, 0),
      discountPercent: normalizeDiscountPercent(
        level.discountPercent,
      ),
      label: level.label.trim() || "Smart Deal",
    }))
    .sort((firstLevel, secondLevel) => {
      return firstLevel.afterDays - secondLevel.afterDays;
    });
}

function calculateDiscountedPrice(
  originalPrice: number,
  discountPercent: number,
  minimumPrice: number,
): number {
  const discountedPrice = Math.round(
    originalPrice * (1 - discountPercent / 100),
  );

  return Math.max(
    minimumPrice,
    Math.min(originalPrice, discountedPrice),
  );
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

function getDifferenceInCompletedDays(
  startDate: Date,
  endDate: Date,
): number {
  const difference = endDate.getTime() - startDate.getTime();

  if (difference <= 0) {
    return 0;
  }

  return Math.floor(difference / DAY_IN_MS);
}

/**
 * Lädt die aktuell im Admin gespeicherten Smart-Pricing-Einstellungen.
 *
 * Falls noch kein Datensatz existiert, wird automatisch der Standarddatensatz
 * mit der ID "default" erstellt.
 *
 * Falls die Datenbank vorübergehend nicht erreichbar ist, werden sichere
 * Standardwerte zurückgegeben.
 */
export async function getSmartPricingSettings(): Promise<SmartPricingSettings> {
  try {
    const databaseSettings =
      await prisma.smartPricingSettings.upsert({
        where: {
          id: "default",
        },

        update: {},

        create: {
          id: "default",
          enabled:
            DEFAULT_SMART_PRICING_SETTINGS.enabled,

          firstAfterDays:
            DEFAULT_SMART_PRICING_SETTINGS.levels[0].afterDays,

          firstDiscountPercent:
            DEFAULT_SMART_PRICING_SETTINGS.levels[0]
              .discountPercent,

          secondAfterDays:
            DEFAULT_SMART_PRICING_SETTINGS.levels[1].afterDays,

          secondDiscountPercent:
            DEFAULT_SMART_PRICING_SETTINGS.levels[1]
              .discountPercent,

          thirdAfterDays:
            DEFAULT_SMART_PRICING_SETTINGS.levels[2].afterDays,

          thirdDiscountPercent:
            DEFAULT_SMART_PRICING_SETTINGS.levels[2]
              .discountPercent,

          minimumPrice:
            DEFAULT_SMART_PRICING_SETTINGS.minimumPrice,

          resetAfterPurchase:
            DEFAULT_SMART_PRICING_SETTINGS.resetAfterPurchase,

          label: DEFAULT_SMART_PRICING_SETTINGS.label,

          showCountdown:
            DEFAULT_SMART_PRICING_SETTINGS.showCountdown,
        },
      });

    return {
      enabled: databaseSettings.enabled,

      minimumPrice: normalizeInteger(
        databaseSettings.minimumPrice,
        DEFAULT_SMART_PRICING_SETTINGS.minimumPrice,
        1,
      ),

      resetAfterPurchase:
        databaseSettings.resetAfterPurchase,

      showCountdown: databaseSettings.showCountdown,

      label:
        databaseSettings.label.trim() ||
        DEFAULT_SMART_PRICING_SETTINGS.label,

      levels: sortLevels([
        {
          afterDays: databaseSettings.firstAfterDays,
          discountPercent:
            databaseSettings.firstDiscountPercent,
          label:
            databaseSettings.label.trim() ||
            "Smart Deal",
        },
        {
          afterDays: databaseSettings.secondAfterDays,
          discountPercent:
            databaseSettings.secondDiscountPercent,
          label: "Top Deal",
        },
        {
          afterDays: databaseSettings.thirdAfterDays,
          discountPercent:
            databaseSettings.thirdDiscountPercent,
          label: "Letzte Chance",
        },
      ]),
    };
  } catch (error) {
    console.error(
      "Smart-Pricing-Einstellungen konnten nicht geladen werden:",
      error,
    );

    return {
      ...DEFAULT_SMART_PRICING_SETTINGS,
      levels: [...DEFAULT_SMART_PRICING_SETTINGS.levels],
    };
  }
}

/**
 * Berechnet den Smart-Preis synchron.
 *
 * Diese Funktion bleibt synchron, damit bestehende Stellen wie
 * calculateSmartPrice({...}) nicht kaputtgehen.
 *
 * Für Einstellungen aus der Datenbank entweder:
 *
 * 1. settings übergeben, oder
 * 2. calculateSmartPriceFromDatabase verwenden.
 */
export function calculateSmartPrice({
  originalPrice,
  createdAt,
  lastPurchaseAt = null,
  now = new Date(),
  settings = DEFAULT_SMART_PRICING_SETTINGS,
}: CalculateSmartPriceInput): SmartPriceResult {
  const normalizedOriginalPrice = normalizeInteger(
    originalPrice,
    0,
    0,
  );

  const normalizedMinimumPrice = normalizeInteger(
    settings.minimumPrice,
    DEFAULT_SMART_PRICING_SETTINGS.minimumPrice,
    1,
  );

  const currentDate = normalizeDate(now, new Date());
  const leadCreatedAt = normalizeDate(
    createdAt,
    currentDate,
  );

  const normalizedLastPurchaseAt = lastPurchaseAt
    ? normalizeDate(lastPurchaseAt, leadCreatedAt)
    : null;

  let pricingStartedAt = leadCreatedAt;

  if (
    settings.resetAfterPurchase &&
    normalizedLastPurchaseAt &&
    normalizedLastPurchaseAt.getTime() >
      leadCreatedAt.getTime()
  ) {
    pricingStartedAt = normalizedLastPurchaseAt;
  }

  const ageInDays = getDifferenceInCompletedDays(
    pricingStartedAt,
    currentDate,
  );

  const levels = sortLevels(settings.levels);

  if (!settings.enabled || normalizedOriginalPrice <= 0) {
    return {
      enabled: settings.enabled,
      isDiscounted: false,

      originalPrice: normalizedOriginalPrice,
      currentPrice: normalizedOriginalPrice,

      discountPercent: 0,
      discountAmount: 0,

      ageInDays,
      pricingStartedAt,

      label: null,

      nextDiscountAt: null,
      nextDiscountPercent: null,
      nextPrice: null,

      showCountdown: settings.showCountdown,
      minimumPrice: normalizedMinimumPrice,
    };
  }

  let activeLevel: SmartPricingLevel | null = null;

  for (const level of levels) {
    if (ageInDays >= level.afterDays) {
      activeLevel = level;
    }
  }

  const nextLevel =
    levels.find((level) => ageInDays < level.afterDays) ??
    null;

  const discountPercent =
    activeLevel?.discountPercent ?? 0;

  const currentPrice = activeLevel
    ? calculateDiscountedPrice(
        normalizedOriginalPrice,
        discountPercent,
        normalizedMinimumPrice,
      )
    : normalizedOriginalPrice;

  const isDiscounted =
    discountPercent > 0 &&
    currentPrice < normalizedOriginalPrice;

  const nextDiscountAt = nextLevel
    ? addDays(pricingStartedAt, nextLevel.afterDays)
    : null;

  const nextDiscountPercent =
    nextLevel?.discountPercent ?? null;

  const nextPrice = nextLevel
    ? calculateDiscountedPrice(
        normalizedOriginalPrice,
        nextLevel.discountPercent,
        normalizedMinimumPrice,
      )
    : null;

  return {
    enabled: settings.enabled,
    isDiscounted,

    originalPrice: normalizedOriginalPrice,
    currentPrice,

    discountPercent: isDiscounted
      ? discountPercent
      : 0,

    discountAmount:
      normalizedOriginalPrice - currentPrice,

    ageInDays,
    pricingStartedAt,

    label: isDiscounted
      ? activeLevel?.label ||
        settings.label ||
        "Smart Deal"
      : null,

    nextDiscountAt,
    nextDiscountPercent,
    nextPrice,

    showCountdown: settings.showCountdown,
    minimumPrice: normalizedMinimumPrice,
  };
}

/**
 * Komfortfunktion für Server Components und API-Routen.
 *
 * Sie lädt zuerst die Admin-Einstellungen aus Prisma und berechnet danach
 * den tatsächlichen Preis.
 */
export async function calculateSmartPriceFromDatabase(
  input: Omit<CalculateSmartPriceInput, "settings">,
): Promise<SmartPriceResult> {
  const settings = await getSmartPricingSettings();

  return calculateSmartPrice({
    ...input,
    settings,
  });
}