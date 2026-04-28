import Stripe from "stripe";
import { env } from "@/server/config/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2025-03-31.basil" });

export const PLAN_PRICE_MAP: Record<string, string> = {
  PERSONAL: "price_personal_29",
  PRO: "price_pro_79",
  BUSINESS: "price_business_299"
};
