import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const credits = Number(session.metadata?.credits || 0);

    // TODO: hier Credits zum User hinzufügen
    // Beispiel:
    // await addCreditsToUser(userId, credits)

    return NextResponse.json({
      success: true,
      creditsAdded: credits,
      alreadyProcessed: false,
    });
  } catch (error) {
    console.error("Finalize error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}