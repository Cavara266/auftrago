import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { addInvoiceActivity } from "@/lib/business/invoiceActivity";

async function getInvoice(invoiceId: string, providerId: string) {
  return prisma.businessInvoice.findFirst({
    where: {
      id: invoiceId,
      providerId,
    },
    include: {
      payments: {
        orderBy: {
          paymentDate: "desc",
        },
      },
    },
  });
}

function calculatePaymentState(
  totalCents: number,
  payments: { amountCents: number }[]
) {
  const paidAmountCents = payments.reduce(
    (sum, payment) => sum + payment.amountCents,
    0
  );

  const remainingCents = Math.max(0, totalCents - paidAmountCents);

  let status = "OPEN";

  if (paidAmountCents >= totalCents && totalCents > 0) {
    status = "PAID";
  }

  return {
    paidAmountCents,
    remainingCents,
    status,
  };
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const amountCents = Number(body.amountCents);
    const note =
      typeof body.note === "string" && body.note.trim()
        ? body.note.trim()
        : null;

    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      return NextResponse.json(
        { error: "Ungültiger Zahlungsbetrag" },
        { status: 400 }
      );
    }

    const invoice = await getInvoice(id, user.id);

    if (!invoice) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    const currentPaid = invoice.payments.reduce(
      (sum, payment) => sum + payment.amountCents,
      0
    );

    const remaining = Math.max(0, invoice.totalCents - currentPaid);

    if (amountCents > remaining) {
      return NextResponse.json(
        {
          error: `Zahlung ist höher als der offene Betrag von CHF ${(
            remaining / 100
          ).toFixed(2)}`,
        },
        { status: 400 }
      );
    }

    await prisma.businessInvoicePayment.create({
      data: {
        invoiceId: invoice.id,
        amountCents,
        note,
      },
    });

    const updated = await getInvoice(id, user.id);

    if (!updated) {
      return NextResponse.json(
        { error: "Rechnung konnte nicht geladen werden" },
        { status: 500 }
      );
    }

    const state = calculatePaymentState(
      updated.totalCents,
      updated.payments
    );

    const savedInvoice = await prisma.businessInvoice.update({
      where: {
        id: updated.id,
      },
      data: {
        paidAmountCents: state.paidAmountCents,
        status: state.status,
        paidAt:
          state.status === "PAID"
            ? new Date()
            : null,
      },
      include: {
        payments: {
          orderBy: {
            paymentDate: "desc",
          },
        },
      },
    });

    await addInvoiceActivity(
      savedInvoice.id,
      "PAYMENT",
      `Zahlung über CHF ${(amountCents / 100).toFixed(2)} wurde erfasst.`
    );

    return NextResponse.json({
      ok: true,
      invoice: savedInvoice,
      paidAmountCents: state.paidAmountCents,
      remainingCents: state.remainingCents,
      status: state.status,
    });
  } catch (error) {
    console.error("PAYMENT CREATE ERROR", error);

    return NextResponse.json(
      { error: "Zahlung konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Nicht angemeldet" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const paymentId =
      typeof body.paymentId === "string" ? body.paymentId : "";

    if (!paymentId) {
      return NextResponse.json(
        { error: "Zahlung fehlt" },
        { status: 400 }
      );
    }

    const invoice = await getInvoice(id, user.id);

    if (!invoice) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    const payment = invoice.payments.find(
      (entry) => entry.id === paymentId
    );

    if (!payment) {
      return NextResponse.json(
        { error: "Zahlung nicht gefunden" },
        { status: 404 }
      );
    }

    await prisma.businessInvoicePayment.delete({
      where: {
        id: payment.id,
      },
    });

    const updated = await getInvoice(id, user.id);

    if (!updated) {
      return NextResponse.json(
        { error: "Rechnung konnte nicht geladen werden" },
        { status: 500 }
      );
    }

    const state = calculatePaymentState(
      updated.totalCents,
      updated.payments
    );

    const savedInvoice = await prisma.businessInvoice.update({
      where: {
        id: updated.id,
      },
      data: {
        paidAmountCents: state.paidAmountCents,
        status: state.status,
        paidAt:
          state.status === "PAID"
            ? new Date()
            : null,
      },
      include: {
        payments: {
          orderBy: {
            paymentDate: "desc",
          },
        },
      },
    });

    await addInvoiceActivity(
      savedInvoice.id,
      "PAYMENT_REMOVED",
      `Zahlung über CHF ${(payment.amountCents / 100).toFixed(2)} wurde rückgängig gemacht.`
    );

    return NextResponse.json({
      ok: true,
      invoice: savedInvoice,
      paidAmountCents: state.paidAmountCents,
      remainingCents: state.remainingCents,
      status: state.status,
    });
  } catch (error) {
    console.error("PAYMENT DELETE ERROR", error);

    return NextResponse.json(
      { error: "Zahlung konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
