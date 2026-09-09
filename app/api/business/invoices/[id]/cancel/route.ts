import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

    const invoice = await prisma.businessInvoice.findFirst({
      where: {
        id,
        providerId: user.id,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    if (invoice.status === "CANCELLED") {
      return NextResponse.json({
        ok: true,
        invoice,
      });
    }

    const updated = await prisma.businessInvoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        status: "CANCELLED",
        paidAt: null,
      },
    });

    return NextResponse.json({
      ok: true,
      invoice: updated,
    });
  } catch (error) {
    console.error("INVOICE CANCEL ERROR", error);

    return NextResponse.json(
      { error: "Rechnung konnte nicht storniert werden." },
      { status: 500 }
    );
  }
}
