import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

function toCents(value: string | null) {
  const amount = Number(value || "0");
  return Math.max(Math.round(amount * 100), 100);
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);

  const service = searchParams.get("service") || "Reinigung";
  const total = searchParams.get("total") || "0";
  const amountToday = searchParams.get("amount_today") || "0";
  const payment = searchParams.get("payment") || "deposit";

  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const objectType = searchParams.get("objectType") || "";
  const rooms = searchParams.get("rooms") || "";
  const area = searchParams.get("area") || "";

  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const street = searchParams.get("street") || "";
  const zip = searchParams.get("zip") || "";
  const city = searchParams.get("city") || "";
  const notes = searchParams.get("notes") || "";

  const label =
    payment === "full"
      ? `${service} - Sofortzahlung mit 10% Rabatt`
      : `${service} - 50% Anzahlung`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "twint"],
    mode: "payment",
    customer_email: email || undefined,
    line_items: [
      {
        price_data: {
          currency: "chf",
          product_data: {
            name: label,
            description: `${firstName} ${lastName} | ${street}, ${zip} ${city} | Termin: ${date} um ${time}`,
          },
          unit_amount: toCents(amountToday),
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "booking",
      status: "zu_pruefen",
      service,
      total,
      amount_today: amountToday,
      payment,
      date,
      time,
      objectType,
      rooms,
      area,
      firstName,
      lastName,
      email,
      phone,
      street,
      zip,
      city,
      notes,
    },
    success_url: `${origin}/danke?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/preisrechner`,
  });

  return NextResponse.redirect(session.url as string);
}