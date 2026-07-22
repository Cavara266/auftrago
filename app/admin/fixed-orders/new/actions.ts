"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type CreateFixedOrderState = {
  error?: string;
};

function getRequiredText(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Das Feld "${field}" ist erforderlich.`);
  }

  return value.trim();
}

function getOptionalText(formData: FormData, field: string) {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const cleanedValue = value.trim();

  return cleanedValue || null;
}

function parseMoneyToCents(value: string) {
  const normalizedValue = value
    .trim()
    .replace(/\s/g, "")
    .replace(/CHF/gi, "")
    .replace(/['’]/g, "")
    .replace(",", ".");

  const amount = Number(normalizedValue);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(
      "Bitte gib einen gültigen Auftragswert ein."
    );
  }

  return Math.round(amount * 100);
}

function parseExecutionDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Das Ausführungsdatum ist ungültig.");
  }

  return date;
}

export async function createFixedOrder(
  _previousState: CreateFixedOrderState,
  formData: FormData
): Promise<CreateFixedOrderState> {
  try {
    const title = getRequiredText(formData, "title");
    const category = getRequiredText(formData, "category");
    const description = getOptionalText(
      formData,
      "description"
    );
    const region = getOptionalText(formData, "region");

    const customerFirstName = getRequiredText(
      formData,
      "customerFirstName"
    );
    const customerLastName = getRequiredText(
      formData,
      "customerLastName"
    );
    const customerPhone = getRequiredText(
      formData,
      "customerPhone"
    );
    const customerEmail = getOptionalText(
      formData,
      "customerEmail"
    );

    const street = getRequiredText(formData, "street");
    const postalCode = getRequiredText(
      formData,
      "postalCode"
    );
    const city = getRequiredText(formData, "city");

    const orderValueInput = getRequiredText(
      formData,
      "orderValue"
    );

    const orderValueCents =
      parseMoneyToCents(orderValueInput);

    const commissionPercent = 25;

    const commissionAmountCents = Math.round(
      orderValueCents * (commissionPercent / 100)
    );

    const flexibleDate =
      formData.get("flexibleDate") === "on";

    const executionDateInput = getOptionalText(
      formData,
      "executionDate"
    );

    const executionDate = flexibleDate
      ? null
      : parseExecutionDate(executionDateInput);

    if (!flexibleDate && !executionDate) {
      throw new Error(
        "Bitte gib ein Ausführungsdatum ein oder markiere den Termin als flexibel."
      );
    }

    const customerConfirmed =
      formData.get("customerConfirmed") === "on";

    const termsConfirmed =
      formData.get("termsConfirmed") === "on";

    if (!customerConfirmed) {
      throw new Error(
        "Bitte bestätige, dass der Kunde den Auftrag verbindlich zugesagt hat."
      );
    }

    if (!termsConfirmed) {
      throw new Error(
        "Bitte bestätige die Prüfung der Auftragsangaben."
      );
    }

    await prisma.fixedOrder.create({
      data: {
        title,
        description,
        category,
        region,

        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhone,

        street,
        postalCode,
        city,

        executionDate,
        flexibleDate,

        orderValueCents,
        commissionPercent,
        commissionAmountCents,

        status: "OPEN",
      },
    });
  } catch (error) {
    console.error("CREATE FIXED ORDER FAILED", error);

    return {
      error:
        error instanceof Error
          ? error.message
          : "Der Fixauftrag konnte nicht erstellt werden.",
    };
  }

  revalidatePath("/admin/fixed-orders");
  redirect("/admin/fixed-orders");
}