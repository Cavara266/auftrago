import {
  NextRequest,
  NextResponse,
} from "next/server";

import { requireUser } from "@/lib/auth";

import {
  createProviderSubscriptionCheckout,
  getApplicationBaseUrl,
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
        new URL(
          "/login?redirect=/subscription-required",
          request.url,
        ),
        303,
      );
    }

    if (user.status === "BLOCKED") {
      return NextResponse.redirect(
        new URL(
          "/login?error=provider-blocked",
          request.url,
        ),
        303,
      );
    }

    const session =
      await createProviderSubscriptionCheckout(
        user.id,
        getApplicationBaseUrl(
          request.nextUrl.origin,
        ),
      );

    if (!session.url) {
      throw new Error(
        "STRIPE_CHECKOUT_URL_MISSING",
      );
    }

    return NextResponse.redirect(
      session.url,
      303,
    );
  } catch (error) {
    console.error(
      "PROVIDER SUBSCRIPTION CHECKOUT ERROR:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "UNKNOWN_ERROR";

    if (
      message ===
      "PROVIDER_SUBSCRIPTION_ALREADY_ACTIVE"
    ) {
      return NextResponse.redirect(
        new URL("/portal/abo", request.url),
        303,
      );
    }

    if (
      message ===
      "PROVIDER_SUBSCRIPTION_EXEMPT"
    ) {
      return NextResponse.redirect(
        new URL("/portal", request.url),
        303,
      );
    }

    if (message === "PROVIDER_BLOCKED") {
      return NextResponse.redirect(
        new URL(
          "/login?error=provider-blocked",
          request.url,
        ),
        303,
      );
    }

    return NextResponse.redirect(
      new URL(
        "/subscription-required?error=checkout",
        request.url,
      ),
      303,
    );
  }
}
