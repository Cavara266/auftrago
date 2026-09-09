import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail/mail";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const decision = String(body.decision || "").toUpperCase();

    if (!["ACCEPTED", "DECLINED"].includes(decision)) {
      return NextResponse.json(
        { error: "Ungültige Entscheidung." },
        { status: 400 }
      );
    }

    const quote = await prisma.businessQuote.findUnique({
      where: { id },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Offerte nicht gefunden." },
        { status: 404 }
      );
    }

    const updated = await prisma.businessQuote.update({
      where: { id },
      data: {
        status: decision,
        acceptedAt:
          decision === "ACCEPTED" ? new Date() : null,
        declinedAt:
          decision === "DECLINED" ? new Date() : null,
      },
    });

    const provider = await prisma.provider.findUnique({
      where: {
        id: quote.providerId,
      },
      select: {
        email: true,
        companyName: true,
        contactName: true,
      },
    });

    if (provider?.email) {
      try {
        const accepted = decision === "ACCEPTED";

        await sendMail({
          to: provider.email,
          subject: accepted
            ? `✓ Offerte ${quote.quoteNumber} angenommen`
            : `Offerte ${quote.quoteNumber} abgelehnt`,
          html: `
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:auto;color:#101828;">
              <div style="background:#071426;padding:28px 30px;border-radius:14px 14px 0 0;">
                <div style="color:#38bdf8;font-size:12px;font-weight:800;letter-spacing:.08em;">
                  AUFTRAGO BUSINESS
                </div>
                <div style="font-size:25px;font-weight:900;color:#ffffff;margin-top:6px;">
                  ${
                    accepted
                      ? "Offerte angenommen"
                      : "Offerte abgelehnt"
                  }
                </div>
              </div>

              <div style="padding:28px 30px;border:1px solid #e2e8f0;border-top:0;">
                <p>
                  Die Offerte
                  <strong>${quote.quoteNumber}</strong>
                  wurde vom Kunden
                  <strong>${quote.customerName || "Kunde"}</strong>
                  ${
                    accepted
                      ? "angenommen."
                      : "abgelehnt."
                  }
                </p>

                <p>
                  <strong>${quote.title}</strong>
                </p>

                ${
                  accepted
                    ? `<div style="margin-top:20px;padding:15px;border-radius:10px;background:#ecfdf3;color:#067647;font-weight:800;">
                         ✓ Auftrag bestätigt
                       </div>`
                    : `<div style="margin-top:20px;padding:15px;border-radius:10px;background:#fef3f2;color:#b42318;font-weight:800;">
                         Offerte wurde abgelehnt
                       </div>`
                }
              </div>
            </div>
          `,
          text:
            `Offerte ${quote.quoteNumber}\n` +
            `${quote.customerName || "Kunde"} hat die Offerte ` +
            `${accepted ? "angenommen." : "abgelehnt."}`,
        });
      } catch (mailError) {
        console.error(
          "QUOTE DECISION NOTIFICATION ERROR",
          mailError
        );
      }
    }

    return NextResponse.json({
      ok: true,
      quote: updated,
    });
  } catch (error) {
    console.error("QUOTE DECISION ERROR", error);

    return NextResponse.json(
      { error: "Entscheidung konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}
