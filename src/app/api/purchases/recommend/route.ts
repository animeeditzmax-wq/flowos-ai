import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { enforceRateLimit } from "@/server/security/http";
import { purchaseRequestSchema } from "@/server/validation/schemas";
import { recommendPurchase } from "@/server/services/purchase.service";

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req);
  if (limited) return limited;

  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = purchaseRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const rec = await recommendPurchase(auth.session.user.id, parsed.data.query, parsed.data.budgetUsd);
  return NextResponse.json({ recommendation: rec });
}
