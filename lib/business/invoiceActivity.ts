import { prisma } from "@/lib/prisma";

export async function addInvoiceActivity(
  invoiceId: string,
  type: string,
  message: string
) {
  try {
    return await prisma.businessInvoiceActivity.create({
      data: {
        invoiceId,
        type,
        message,
      },
    });
  } catch (error) {
    // Eine fehlgeschlagene Timeline darf die eigentliche
    // Rechnungsaktion niemals blockieren.
    console.error("INVOICE_ACTIVITY_ERROR", {
      invoiceId,
      type,
      message,
      error,
    });

    return null;
  }
}
