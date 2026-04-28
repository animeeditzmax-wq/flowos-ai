import { prisma } from "@/server/db/prisma";

export async function analyzeSubscriptions(userId: string) {
  const subscriptions = await prisma.subscription.findMany({ where: { userId, isActive: true } });
  const monthlySpend = subscriptions.reduce((sum, s) => sum + s.monthlyCostUsd, 0);

  const suggestions = subscriptions
    .filter((s) => s.usageScore < 35 || s.cancellationScore > 60)
    .map((s) => ({
      subscriptionId: s.id,
      name: s.name,
      recommendation: "Consider cancellation or downgrade",
      potentialSavingsUsd: s.monthlyCostUsd
    }));

  return { monthlySpend, activeCount: subscriptions.length, suggestions };
}
