import {
  NextRequest,
  NextResponse,
} from "next/server";

import bcrypt from "bcryptjs";

import {
  createSession,
  type AuthUser,
} from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import {
  createProviderSubscriptionCheckout,
  getApplicationBaseUrl,
} from "@/lib/provider-subscription";

import {
  sendProviderRegistrationAdminMail,
  sendProviderWelcomeMail,
} from "@/lib/provider-registration-mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function clean(value: unknown) {
  return String(value ?? "").trim();
}

function isValidEmail(email: string) {
  return (
    email.includes("@") &&
    email.includes(".") &&
    email.length <= 254
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const data =
      await request.json().catch(() => null);

    const email = clean(data?.email).toLowerCase();
    const password = String(data?.password || "");

    const companyName = clean(data?.companyName);
    const contactName = clean(data?.contactName);
    const phone = clean(data?.phone);

    const website = clean(data?.website);
    const region = clean(data?.region);

    const category = clean(
      data?.category || data?.services,
    );

    const description = clean(
      data?.description || data?.message,
    );

    if (
      !email ||
      !password ||
      !companyName ||
      !contactName ||
      !phone ||
      !region ||
      !category
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Bitte alle Pflichtfelder ausfüllen.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Bitte eine gültige E-Mail-Adresse eingeben.",
        },
        {
          status: 400,
        },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Das Passwort muss mindestens 8 Zeichen haben.",
        },
        {
          status: 400,
        },
      );
    }

    const existingProvider =
      await prisma.provider.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

    if (existingProvider) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Diese E-Mail-Adresse ist bereits registriert. Bitte verwende den Login.",
        },
        {
          status: 409,
        },
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const provider =
      await prisma.provider.create({
        data: {
          email,
          password: passwordHash,

          companyName,
          contactName,
          phone,

          website: website || null,
          region,
          category,
          description: description || null,

          credits: 0,
          status: "APPROVED",

          subscriptionExempt: false,
          subscriptionStatus: "INACTIVE",

          receiveLeadEmails: true,
          receiveAllLeadEmails: false,
        },

        select: {
          id: true,
          email: true,
          companyName: true,
          contactName: true,
          phone: true,
          website: true,
          region: true,
          category: true,
          description: true,
          credits: true,
          status: true,
        },
      });

    const user: AuthUser = {
      id: provider.id,
      email: provider.email,
      name: provider.contactName,
      companyName: provider.companyName,
      contactName: provider.contactName,
      role: "provider",
      credits: provider.credits,
      status: provider.status,
    };

    await createSession(user);

    const mailData = {
      providerId: provider.id,
      companyName: provider.companyName,
      contactName: provider.contactName,
      email: provider.email,
      phone: provider.phone,
      website: provider.website,
      region: provider.region || region,
      category: provider.category || category,
      description: provider.description,
    };

    const mailResults =
      await Promise.allSettled([
        sendProviderWelcomeMail(mailData),
        sendProviderRegistrationAdminMail(
          mailData,
        ),
      ]);

    for (const result of mailResults) {
      if (result.status === "rejected") {
        console.error(
          "PROVIDER REGISTRATION MAIL FAILED:",
          result.reason,
        );
      }
    }

    try {
      const checkoutSession =
        await createProviderSubscriptionCheckout(
          provider.id,
          getApplicationBaseUrl(
            request.nextUrl.origin,
          ),
        );

      if (!checkoutSession.url) {
        throw new Error(
          "STRIPE_CHECKOUT_URL_MISSING",
        );
      }

      return NextResponse.json(
        {
          ok: true,
          providerId: provider.id,
          status: provider.status,
          checkoutUrl: checkoutSession.url,
          welcomeMailSent:
            mailResults[0]?.status ===
            "fulfilled",
          adminMailSent:
            mailResults[1]?.status ===
            "fulfilled",
        },
        {
          status: 201,
        },
      );
    } catch (checkoutError) {
      console.error(
        "REGISTERED BUT CHECKOUT CREATION FAILED:",
        {
          providerId: provider.id,
          checkoutError,
        },
      );

      return NextResponse.json(
        {
          ok: true,
          providerId: provider.id,
          status: provider.status,
          redirectUrl:
            "/subscription-required?error=checkout",
          welcomeMailSent:
            mailResults[0]?.status ===
            "fulfilled",
          adminMailSent:
            mailResults[1]?.status ===
            "fulfilled",
        },
        {
          status: 201,
        },
      );
    }
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Registrierung fehlgeschlagen.",
      },
      {
        status: 500,
      },
    );
  }
}
