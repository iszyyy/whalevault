import Stripe from "stripe";
import type { PlanFeatures, UserPlan } from "@/types";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "stripe_key_not_configured",
  {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  }
);

export const PLANS: Record<UserPlan, PlanFeatures> = {
  free: {
    name: "Free",
    tier: "free",
    priceMonthly: 0,
    priceAnnual: 0,
    stripePriceId: null,
    limits: {
      walletWatches: 3,
      alertsPerDay: 10,
      apiRequestsPerDay: 100,
      historicalDataDays: 7,
      exchangeConnections: 0,
    },
    features: [
      "Track up to 3 whale wallets",
      "10 alerts per day",
      "7-day historical data",
      "Basic dashboard",
      "In-app notifications",
    ],
  },
  pro: {
    name: "Pro",
    tier: "pro",
    priceMonthly: 49,
    priceAnnual: 470,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    limits: {
      walletWatches: 50,
      alertsPerDay: 500,
      apiRequestsPerDay: 5_000,
      historicalDataDays: 90,
      exchangeConnections: 3,
    },
    features: [
      "Track up to 50 whale wallets",
      "500 alerts per day",
      "90-day historical data",
      "Email & Telegram notifications",
      "3 exchange connections",
      "API access",
      "Advanced analytics",
    ],
  },
  enterprise: {
    name: "Enterprise",
    tier: "enterprise",
    priceMonthly: 199,
    priceAnnual: 1_910,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID ?? null,
    limits: {
      walletWatches: -1, // unlimited
      alertsPerDay: -1,
      apiRequestsPerDay: 100_000,
      historicalDataDays: 365,
      exchangeConnections: -1,
    },
    features: [
      "Unlimited wallet tracking",
      "Unlimited alerts",
      "365-day historical data",
      "All notification channels",
      "Unlimited exchange connections",
      "Priority API access",
      "Custom webhooks",
      "Dedicated support",
      "Custom integrations",
    ],
  },
};

export function getPlanByTier(tier: string): PlanFeatures {
  return PLANS[(tier as UserPlan) in PLANS ? (tier as UserPlan) : "free"];
}

export async function createStripeCustomer(email: string, name?: string) {
  return stripe.customers.create({ email, name });
}

export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId: string;
  priceId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
  });
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
