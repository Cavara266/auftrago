"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type SaveSmartPricingSettingsInput = {
  id: string;
  enabled: boolean;
  firstAfterDays: number;
  firstDiscountPercent: number;
  secondAfterDays: number;
  secondDiscountPercent: number;
  thirdAfterDays: number;
  thirdDiscountPercent: number;
  minimumPrice: number;
  resetAfterPurchase: boolean;
  label: string;
  showCountdown: boolean;
};

type SaveSmartPricingSettingsResult = {
  success: boolean;
  message: string;
};

function normalizeInteger(
  value: unknown,
  minimum: number,
  maximum: number,
): number | null {
  const parsedValue =
    typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsedValue)) {
    return null;
  }

  const normalizedValue = Math.round(parsedValue);

  if (
    normalizedValue < minimum ||
    normalizedValue > maximum
  ) {
    return null;
  }

  return normalizedValue;
}

export async function saveSmartPricingSettings(
  input: SaveSmartPricingSettingsInput,
): Promise<SaveSmartPricingSettingsResult> {
  try {
    const id =
      typeof input.id === "string" && input.id.trim()
        ? input.id.trim()
        : "default";

    const label =
      typeof input.label === "string"
        ? input.label.trim()
        : "";

    if (!label) {
      return {
        success: false,
        message:
          "Bitte gib einen Namen für das Smart-Deal-Badge ein.",
      };
    }

    if (label.length > 40) {
      return {
        success: false,
        message:
          "Der Badge-Name darf höchstens 40 Zeichen lang sein.",
      };
    }

    const firstAfterDays = normalizeInteger(
      input.firstAfterDays,
      1,
      365,
    );

    const secondAfterDays = normalizeInteger(
      input.secondAfterDays,
      2,
      365,
    );

    const thirdAfterDays = normalizeInteger(
      input.thirdAfterDays,
      3,
      365,
    );

    const firstDiscountPercent = normalizeInteger(
      input.firstDiscountPercent,
      1,
      95,
    );

    const secondDiscountPercent = normalizeInteger(
      input.secondDiscountPercent,
      1,
      95,
    );

    const thirdDiscountPercent = normalizeInteger(
      input.thirdDiscountPercent,
      1,
      95,
    );

    const minimumPrice = normalizeInteger(
      input.minimumPrice,
      1,
      10000,
    );

    if (
      firstAfterDays === null ||
      secondAfterDays === null ||
      thirdAfterDays === null
    ) {
      return {
        success: false,
        message:
          "Bitte prüfe die Anzahl Tage bei allen Rabattstufen.",
      };
    }

    if (
      firstDiscountPercent === null ||
      secondDiscountPercent === null ||
      thirdDiscountPercent === null
    ) {
      return {
        success: false,
        message:
          "Bitte prüfe die Rabattwerte bei allen Rabattstufen.",
      };
    }

    if (minimumPrice === null) {
      return {
        success: false,
        message:
          "Der Mindestpreis muss zwischen 1 und 10’000 Credits liegen.",
      };
    }

    if (secondAfterDays <= firstAfterDays) {
      return {
        success: false,
        message:
          "Die zweite Rabattstufe muss nach der ersten Rabattstufe beginnen.",
      };
    }

    if (thirdAfterDays <= secondAfterDays) {
      return {
        success: false,
        message:
          "Die dritte Rabattstufe muss nach der zweiten Rabattstufe beginnen.",
      };
    }

    if (
      secondDiscountPercent <= firstDiscountPercent
    ) {
      return {
        success: false,
        message:
          "Der Rabatt der zweiten Stufe muss höher als der Rabatt der ersten Stufe sein.",
      };
    }

    if (
      thirdDiscountPercent <= secondDiscountPercent
    ) {
      return {
        success: false,
        message:
          "Der Rabatt der dritten Stufe muss höher als der Rabatt der zweiten Stufe sein.",
      };
    }

    await prisma.smartPricingSettings.upsert({
      where: {
        id,
      },

      update: {
        enabled: Boolean(input.enabled),

        firstAfterDays,
        firstDiscountPercent,

        secondAfterDays,
        secondDiscountPercent,

        thirdAfterDays,
        thirdDiscountPercent,

        minimumPrice,

        resetAfterPurchase: Boolean(
          input.resetAfterPurchase,
        ),

        label,

        showCountdown: Boolean(input.showCountdown),
      },

      create: {
        id,

        enabled: Boolean(input.enabled),

        firstAfterDays,
        firstDiscountPercent,

        secondAfterDays,
        secondDiscountPercent,

        thirdAfterDays,
        thirdDiscountPercent,

        minimumPrice,

        resetAfterPurchase: Boolean(
          input.resetAfterPurchase,
        ),

        label,

        showCountdown: Boolean(input.showCountdown),
      },
    });

    revalidatePath("/admin/smart-pricing");
    revalidatePath("/leads");
    revalidatePath("/portal");

    return {
      success: true,
      message:
        "Die Smart-Pricing-Einstellungen wurden erfolgreich gespeichert.",
    };
  } catch (error) {
    console.error(
      "Fehler beim Speichern der Smart-Pricing-Einstellungen:",
      error,
    );

    return {
      success: false,
      message:
        "Die Einstellungen konnten nicht gespeichert werden. Bitte versuche es erneut.",
    };
  }
}