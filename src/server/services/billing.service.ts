import { prisma } from "@/server/db/prisma";
import { PLAN_PRICE_MAP, stripe } from "@/server/billing/stripe";
import { env } from "@/server/config/env";

export async function createCheckoutSession(userId: string, planTier: "PERSONAL" | "PRO" | "BUSINESS") {
  const price = PLAN_PRICE_MAP[planTier];
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${env.APP_URL}/settings?billing=success`,
    cancel_url: `${env.APP_URL}/settings?billing=cancelled`,
    metadata: { userId, planTier }
  });

  return session;
}

export async function createBillingPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.APP_URL}/settings`
  });
}

export async function recordBillingEvent(userId: string, planId: string, amountUsd: number, status: string, stripeInvoiceId?: string) {
  return prisma.billingHistory.create({
    data: { userId, planId, amountUsd, status, stripeInvoiceId }
  });
}
