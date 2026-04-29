import { z } from "zod";

export const aiCommandSchema = z.object({
  command: z.string().min(8).max(500),
  context: z.record(z.any()).optional()
});

export const refundClaimSchema = z.object({
  merchant: z.string().min(2),
  amountUsd: z.number().positive(),
  reason: z.string().min(6)
});

export const purchaseRequestSchema = z.object({
  query: z.string().min(3),
  budgetUsd: z.number().positive().max(100000)
});

export const checkoutSchema = z.object({
  planTier: z.enum(["PERSONAL", "PRO", "BUSINESS"])
});

export const notificationSchema = z.object({
  userId: z.string().cuid(),
  title: z.string().min(2),
  body: z.string().min(2),
  type: z.enum(["APPROVAL_REQUEST", "TASK_UPDATE", "BILLING", "WEEKLY_REPORT", "SECURITY"])
});
