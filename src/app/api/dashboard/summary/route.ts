import { NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { prisma } from "@/server/db/prisma";
import { getAssistantPermissions } from "@/server/services/assistant.service";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const userId = auth.session.user.id;

  const permissions = await getAssistantPermissions(userId);
  const allowed = permissions.email && permissions.subscriptionTracking && permissions.billingDetection;
  if (!allowed) {
    return NextResponse.json({
      blocked: true,
      message: "Grant email, subscription tracking, and billing detection permissions to gather dashboard insights.",
      stats: [],
      weeklySeries: [],
      queue: []
    });
  }

  const [activeSubscriptions, pendingRefunds, completedTasks, tasks, recentBilling] = await Promise.all([
    prisma.subscription.count({ where: { userId, isActive: true } }),
    prisma.refundClaim.count({ where: { userId, status: { in: ["OPEN", "FOLLOWUP", "APPROVED"] } } }),
    prisma.aITask.count({ where: { userId, status: "COMPLETED" } }),
    prisma.aITask.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { command: true, status: true, expectedSavings: true }
    }),
    prisma.billingHistory.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 8, select: { createdAt: true, amountUsd: true } })
  ]);

  const moneySavedUsd = tasks.reduce((sum, t) => sum + (t.expectedSavings ?? 0), 0);

  const weeklySeries = recentBilling
    .map((row) => ({ day: row.createdAt.toISOString().slice(5, 10), savings: Math.max(0, row.amountUsd) }))
    .reverse();

  const queue = tasks.map((t, index) => ({
    name: t.command,
    status: t.status,
    progress: t.status === "COMPLETED" ? 100 : Math.max(10, 80 - index * 15)
  }));

  return NextResponse.json({
    stats: [
      { title: "Money saved", value: `$${moneySavedUsd.toFixed(0)}`, delta: "From approved automations", detail: "Expected savings from recent AI tasks" },
      { title: "Active subscriptions", value: String(activeSubscriptions), delta: "Live recurring services", detail: "Detected from authorized data" },
      { title: "Pending refunds", value: String(pendingRefunds), delta: "Claims in progress", detail: "Open, follow-up, or approved" },
      { title: "Completed AI tasks", value: String(completedTasks), delta: "Completed workflows", detail: "Tasks executed by FlowOS" }
    ],
    weeklySeries,
    queue
  });
}
