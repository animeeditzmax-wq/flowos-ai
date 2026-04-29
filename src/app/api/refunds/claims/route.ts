import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { enforceRateLimit } from "@/server/security/http";
import { refundClaimSchema } from "@/server/validation/schemas";
import { createRefundClaim } from "@/server/services/refund.service";

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req);
  if (limited) return limited;

  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = refundClaimSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const refund = await createRefundClaim(auth.session.user.id, parsed.data.merchant, parsed.data.amountUsd, parsed.data.reason);
  return NextResponse.json({ refund });
}
