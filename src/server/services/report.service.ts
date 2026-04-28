import { startOfWeek, endOfWeek } from "@/server/utils/date";
import { prisma } from "@/server/db/prisma";

export async function generateWeeklyReport(userId: string) {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  const completedTasks = await prisma.aiTask.count({ where: { userId, status: "COMPLETED" } });
  const completedRefunds = await prisma.refundClaim.count({ where: { userId, status: "PAID" } });
  const removedSubscriptions = await prisma.subscription.count({ where: { userId, isActive: false } });

  const moneySavedUsd = completedRefunds * 40 + removedSubscriptions * 20 + completedTasks * 5;

  return prisma.weeklyReport.upsert({
    where: { userId_weekStart_weekEnd: { userId, weekStart, weekEnd } },
    create: {
      userId,
      weekStart,
      weekEnd,
      moneySavedUsd,
      refundsCompleted: completedRefunds,
      subscriptionsRemoved: removedSubscriptions,
      optimizationSummary: {
        insights: [
          "Reduce duplicate subscriptions",
          "Enable autonomous bill negotiation",
          "Use annual plans for low-volatility services"
        ]
      }
    },
    update: {
      moneySavedUsd,
      refundsCompleted: completedRefunds,
      subscriptionsRemoved: removedSubscriptions
    }
  });
}
