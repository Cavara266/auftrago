import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import {
  getApplicationBaseUrl,
  getOrCreateStripeCustomer,
} from "@/lib/provider-subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(
  request: NextRequest,
) {
  try {
    const user = await requireUser();

    if (!user) {
      return NextResponse.redirect(
        new URL("/login", request.url),
        303,
      );
    }

    const provider =
      await prisma.provider.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          email: true,
          companyName: true,
          contactName: true,
          phone: true,
          status: true,
          subscriptionExempt: true,
          stripeCustomerId: true,
        },
      });

    if (!provider) {
      return NextResponse.redirect(
        new URL("/login", request.url),
        303,
      );
    }

    if (provider.status === "BLOCKED") {
      return NextResponse.redirect(
        new URL(
          "/login?error=provider-blocked",
          request.url,
        ),
        303,
      );
    }

    if (provider.subscriptionExempt) {
      return NextResponse.redirect(
        new URL("/portal/abo", request.url),
        303,
      );
    }

    const customerId =
      await getOrCreateStripeCustomer(
        provider,
      );

    const portalSession =
      await stripe.billingPortal.sessions.create({
        customer: customerId,

        return_url:
          `${getApplicationBaseUrl(
            request.nextUrl.origin,
          )}/portal/abo`,
      });

    return NextResponse.redirect(
      portalSession.url,
      303,
    );
  } catch (error) {
    console.error(
      "STRIPE CUSTOMER PORTAL ERROR:",
      error,
    );

    return NextResponse.redirect(
      new URL(
        "/portal/abo?error=customer-portal",
        request.url,
      ),
      303,
    );
  }
}
