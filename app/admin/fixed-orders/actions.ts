"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function cleanValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function getFixedOrderOrRedirect(fixedOrderId: string) {
  if (!fixedOrderId) {
    redirect("/admin/fixed-orders?error=invalid-order");
  }

  const fixedOrder = await prisma.fixedOrder.findUnique({
    where: {
      id: fixedOrderId,
    },
    select: {
      id: true,
      status: true,
      buyerId: true,
      stripeCheckoutSessionId: true,
      stripePaymentIntentId: true,
    },
  });

  if (!fixedOrder) {
    redirect("/admin/fixed-orders?error=invalid-order");
  }

  return fixedOrder;
}

function revalidateFixedOrderPages(fixedOrderId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/fixed-orders");
  revalidatePath(`/admin/fixed-orders/${fixedOrderId}`);

  revalidatePath("/portal");
  revalidatePath("/portal/fixed-orders");
  revalidatePath(`/portal/fixed-orders/${fixedOrderId}`);
  revalidatePath(`/portal/fixed-orders/${fixedOrderId}/customer`);
}

export async function releaseFixedOrderAction(formData: FormData) {
  const fixedOrderId = cleanValue(formData.get("fixedOrderId"));
  const fixedOrder = await getFixedOrderOrRedirect(fixedOrderId);

  if (fixedOrder.status !== "RESERVED") {
    redirect("/admin/fixed-orders?error=order-not-reserved");
  }

  await prisma.fixedOrder.update({
    where: {
      id: fixedOrder.id,
    },
    data: {
      status: "OPEN",
      buyerId: null,
      reservedAt: null,
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
    },
  });

  revalidateFixedOrderPages(fixedOrder.id);
  redirect("/admin/fixed-orders?message=reservation-released");
}

export async function completeFixedOrderAction(formData: FormData) {
  const fixedOrderId = cleanValue(formData.get("fixedOrderId"));
  const fixedOrder = await getFixedOrderOrRedirect(fixedOrderId);

  if (fixedOrder.status !== "SOLD") {
    redirect("/admin/fixed-orders?error=order-not-sold");
  }

  if (!fixedOrder.buyerId) {
    redirect("/admin/fixed-orders?error=buyer-missing");
  }

  await prisma.fixedOrder.update({
    where: {
      id: fixedOrder.id,
    },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      cancelledAt: null,
    },
  });

  revalidateFixedOrderPages(fixedOrder.id);
  redirect("/admin/fixed-orders?message=completed");
}

export async function reopenCompletedFixedOrderAction(formData: FormData) {
  const fixedOrderId = cleanValue(formData.get("fixedOrderId"));
  const fixedOrder = await getFixedOrderOrRedirect(fixedOrderId);

  if (fixedOrder.status !== "COMPLETED") {
    redirect("/admin/fixed-orders?error=order-not-completed");
  }

  if (!fixedOrder.buyerId) {
    redirect("/admin/fixed-orders?error=buyer-missing");
  }

  await prisma.fixedOrder.update({
    where: {
      id: fixedOrder.id,
    },
    data: {
      status: "SOLD",
      completedAt: null,
      cancelledAt: null,
    },
  });

  revalidateFixedOrderPages(fixedOrder.id);
  redirect("/admin/fixed-orders?message=reopened");
}

export async function cancelFixedOrderAction(formData: FormData) {
  const fixedOrderId = cleanValue(formData.get("fixedOrderId"));
  const fixedOrder = await getFixedOrderOrRedirect(fixedOrderId);

  if (
    fixedOrder.status === "SOLD" ||
    fixedOrder.status === "COMPLETED" ||
    fixedOrder.stripePaymentIntentId
  ) {
    redirect(
      "/admin/fixed-orders?error=paid-order-cannot-be-cancelled"
    );
  }

  await prisma.fixedOrder.update({
    where: {
      id: fixedOrder.id,
    },
    data: {
      status: "CANCELLED",
      buyerId: null,
      reservedAt: null,
      completedAt: null,
      cancelledAt: new Date(),
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
    },
  });

  revalidateFixedOrderPages(fixedOrder.id);
  redirect("/admin/fixed-orders?message=cancelled");
}

export async function reopenCancelledFixedOrderAction(formData: FormData) {
  const fixedOrderId = cleanValue(formData.get("fixedOrderId"));
  const fixedOrder = await getFixedOrderOrRedirect(fixedOrderId);

  if (fixedOrder.status !== "CANCELLED") {
    redirect("/admin/fixed-orders?error=order-not-cancelled");
  }

  await prisma.fixedOrder.update({
    where: {
      id: fixedOrder.id,
    },
    data: {
      status: "OPEN",
      buyerId: null,
      reservedAt: null,
      soldAt: null,
      completedAt: null,
      cancelledAt: null,
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
    },
  });

  revalidateFixedOrderPages(fixedOrder.id);
  redirect("/admin/fixed-orders?message=reopened");
}

export async function deleteFixedOrderAction(formData: FormData) {
  const fixedOrderId = cleanValue(formData.get("fixedOrderId"));
  const fixedOrder = await getFixedOrderOrRedirect(fixedOrderId);

  if (
    fixedOrder.status === "SOLD" ||
    fixedOrder.status === "COMPLETED" ||
    fixedOrder.stripePaymentIntentId
  ) {
    redirect(
      "/admin/fixed-orders?error=paid-order-cannot-be-deleted"
    );
  }

  await prisma.fixedOrder.delete({
    where: {
      id: fixedOrder.id,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/fixed-orders");
  revalidatePath("/portal");
  revalidatePath("/portal/fixed-orders");

  redirect("/admin/fixed-orders?message=deleted");
}
