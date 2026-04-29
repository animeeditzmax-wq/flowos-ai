import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { enforceRateLimit } from "@/server/security/http";
import { generateWeeklyReport } from "@/server/services/report.service";

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req);
  if (limited) return limited;

  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const report = await generateWeeklyReport(auth.session.user.id);
  return NextResponse.json({ report });
}
