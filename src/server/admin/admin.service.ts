import { prisma } from "@/server/db/prisma";

export async function getAdminAnalytics() {
  const [users, businessUsers, totalTasks, monthlyRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "BUSINESS" } }),
    prisma.aITask.count(),
    prisma.billingHistory.aggregate({ _sum: { amountUsd: true } })
  ]);

  return {
    users,
    businessUsers,
    totalTasks,
    revenueUsd: monthlyRevenue._sum.amountUsd ?? 0
  };
}
