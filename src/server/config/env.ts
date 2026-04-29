import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  APP_URL: z.string().url(),
  RATE_LIMIT_MAX: z.coerce.number().default(120),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000)
});

const rawEnv = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://flowos:flowos@localhost:5432/flowos",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ?? "dev-nextauth-secret",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "openai-placeholder",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "sk_test_placeholder",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "whsec_placeholder",
  APP_URL: process.env.APP_URL ?? "http://localhost:3000"
};

export const env = envSchema.parse(rawEnv);
