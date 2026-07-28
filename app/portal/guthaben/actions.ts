"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

import { requireUser } from "@/lib/auth";
const creditPackages = {
  starter: {
    title: "Starter",
    credits: 20,
    amount: 2900,
  },
  pro: {
    title: "Pro",
    credits: 50,
    amount: 6900,
  },
  business: {
    title: "Business",
    credits: 100,
    amount: 12900,
  },
  growth: {
    title: "Growth",
    credits: 250,
    amount: 24900,
  },
  premium: {
    title: "Premium",
    credits: 600,
    amount: 52900,
  },
  enterprise: {
    title: "Enterprise",
    credits: 1200,
    amount: 99900,
  },
} as const;

export async function startCheckoutAction(formData: FormData) {
  const packageId = String(formData.get("packageId") || "").trim();

  const selectedPackage =
    creditPackages[packageId as keyof typeof creditPackages];

  if (!selectedPackage) {
    redirect("/portal/guthaben?error=invalid");
  }

  
  const user = await requireUser();

  if (!user) {
    redirect("/login");
  }

  const providerId = user.id;


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