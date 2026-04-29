import { NextRequest, NextResponse } from "next/server";
import { analyzeSubscriptions } from "@/server/services/subscription.service";
import { requireUser } from "@/server/security/guard";
import { enforceRateLimit } from "@/server/security/http";

export async function GET(req: NextRequest) {
  const limited = enforceRateLimit(req);
  if (limited) return limited;

  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const result = await analyzeSubscriptions(auth.session.user.id);
  return NextResponse.json(result);
}
