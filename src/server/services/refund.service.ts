import { RefundStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export async function createRefundClaim(userId: string, merchant: string, amountUsd: number, reason: string) {
  return prisma.refundClaim.create({
    data: {
      userId,
      merchant,
      amountUsd,
      reason,
      status: RefundStatus.OPEN,
      followUpRequired: true,
      logs: { create: [{ note: "Claim created by AI engine" }] }
    },
    include: { logs: true }
  });
}

export async function runFollowUp(refundId: string) {
  return prisma.refundClaim.update({
    where: { id: refundId },
    data: {
      status: RefundStatus.FOLLOWUP,
      logs: { create: [{ note: "Automated follow-up sent to merchant" }] }
    },
    include: { logs: true }
  });
}
