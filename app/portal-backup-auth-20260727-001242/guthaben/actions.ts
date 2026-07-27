"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const creditPackages = {
  starter: {
    title: "Starter",
    credits: 50,
    amount: 5000,
  },
  business: {
    title: "Business",
    credits: 120,
    amount: 10000,
  },
  pro: {
    title: "Pro",
    credits: 300,
    amount: 25000,
  },
};

export async function startCheckoutAction(formData: FormData) {
  const packageId = String(formData.get("packageId") || "").trim();

  const selectedPackage =
    creditPackages[packageId as keyof typeof creditPackages];

  if (!selectedPackage) {
    redirect("/portal/guthaben?error=invalid");
  }

  const cookieStore = await cookies();
  const providerId = cookieStore.get("auftrago_session")?.value;

  if (!providerId) {
    redirect("/login");
  }

  const provider = await prisma.provider.findUnique({
    where: {
      id: providerId,
    },
  });

  if (!provider) {
    redirect("/portal/guthaben?error=provider-missing");
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    customer_email: provider.email,

    success_url:
      `${siteUrl}/portal/guthaben?message=checkout-success`,

    cancel_url:
      `${siteUrl}/portal/guthaben?error=checkout-cancelled`,

    metadata: {
      providerId: provider.id,
      packageId,
      credits: String(selectedPackage.credits),
    },

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "chf",
          unit_amount: selectedPackage.amount,
          product_data: {
            name: `${selectedPackage.title} - ${selectedPackage.credits} Credits`,
          },
        },
      },
    ],
  });

  if (!session.url) {
    redirect("/portal/guthaben?error=stripe");
  }

  redirect(session.url);
}