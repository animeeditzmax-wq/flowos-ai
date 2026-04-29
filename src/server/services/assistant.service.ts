import OpenAI from "openai";
import { prisma } from "@/server/db/prisma";
import { env } from "@/server/config/env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

const PERMISSION_PROVIDERS = {
  email: "gmail",
  bank: "plaid",
  notifications: "notifications",
  subscriptionTracking: "subscription_tracking",
  billingDetection: "billing_detection"
} as const;

export type AssistantPermissionKey = keyof typeof PERMISSION_PROVIDERS;

export async function getAssistantPermissions(userId: string) {
  const accounts = await prisma.connectedAccount.findMany({
    where: { userId, provider: { in: Object.values(PERMISSION_PROVIDERS) }, isActive: true }
  });

  const enabled = new Set(accounts.map((item) => item.provider));

  return {
    email: enabled.has(PERMISSION_PROVIDERS.email),
    bank: enabled.has(PERMISSION_PROVIDERS.bank),
    notifications: enabled.has(PERMISSION_PROVIDERS.notifications),
    subscriptionTracking: enabled.has(PERMISSION_PROVIDERS.subscriptionTracking),
    billingDetection: enabled.has(PERMISSION_PROVIDERS.billingDetection)
  };
}

export async function setAssistantPermission(userId: string, key: AssistantPermissionKey, granted: boolean) {
  const provider = PERMISSION_PROVIDERS[key];

  if (!granted) {
    await prisma.connectedAccount.updateMany({
      where: { userId, provider },
      data: { isActive: false }
    });
    return;
  }

  await prisma.connectedAccount.upsert({
    where: { id: `${userId}:${provider}` },
    update: { isActive: true, accountType: "permission" },
    create: {
      id: `${userId}:${provider}`,
      userId,
      provider,
      accountType: "permission",
      isActive: true,
      accessScope: "assistant"
    }
  });
}

function buildDataSummary(subscriptions: { name: string; monthlyCostUsd: number; usageScore: number; cancellationScore: number }[], billingRows: { amountUsd: number; status: string }[], refunds: { merchant: string; amountUsd: number; status: string }[]) {
  const totalMonthlySubscriptionSpend = subscriptions.reduce((sum, item) => sum + item.monthlyCostUsd, 0);
  const cancelCandidates = subscriptions
    .filter((item) => item.usageScore < 40 || item.cancellationScore > 70)
    .map((item) => ({ name: item.name, monthlyCostUsd: item.monthlyCostUsd }));

  const duplicateNames = subscriptions.reduce<Record<string, number>>((acc, item) => {
    const key = item.name.trim().toLowerCase();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const duplicates = Object.entries(duplicateNames)
    .filter(([, count]) => count > 1)
    .map(([name]) => name);

  const pendingRefunds = refunds.filter((item) => item.status !== "PAID" && item.status !== "REJECTED");
  const monthlyBillingTotal = billingRows.reduce((sum, item) => sum + item.amountUsd, 0);

  return {
    totalMonthlySubscriptionSpend,
    monthlyBillingTotal,
    cancelCandidates,
    duplicates,
    pendingRefunds
  };
}

export async function runAssistantQuery(userId: string, question: string) {
  const permissions = await getAssistantPermissions(userId);
  const missing = [
    !permissions.email ? "email receipts" : null,
    !permissions.subscriptionTracking ? "subscription tracking" : null,
    !permissions.billingDetection ? "billing detection" : null
  ].filter(Boolean);

  if (missing.length > 0) {
    return {
      blocked: true,
      message: `I need permission for ${missing.join(", ")} before I can provide account-specific recommendations.`,
      permissions
    };
  }

  const [subscriptions, billingRows, refunds] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId, isActive: true },
      select: { name: true, monthlyCostUsd: true, usageScore: true, cancellationScore: true }
    }),
    prisma.billingHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { amountUsd: true, status: true }
    }),
    prisma.refundClaim.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { merchant: true, amountUsd: true, status: true }
    })
  ]);

  if (subscriptions.length === 0 && billingRows.length === 0 && refunds.length === 0) {
    return {
      blocked: true,
      message:
        "I don’t have enough approved account data yet. Connect email or bank sources and sync subscriptions/billing to receive real recommendations.",
      permissions
    };
  }

  const summary = buildDataSummary(subscriptions, billingRows, refunds);

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are FlowOS AI, a concise executive assistant for life admin. Use only provided data. Never invent accounts or transactions. Include clear actions and savings estimates when possible."
      },
      {
        role: "user",
        content: `Question: ${question}\n\nApproved real data summary: ${JSON.stringify(summary)}`
      }
    ]
  });

  return {
    blocked: false,
    permissions,
    summary,
    answer: response.output_text
  };
}
