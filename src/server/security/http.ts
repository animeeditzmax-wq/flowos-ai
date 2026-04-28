import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/server/security/rate-limit";
import { env } from "@/server/config/env";

export function enforceRateLimit(req: NextRequest) {
  const key = `${req.ip ?? "unknown"}:${req.nextUrl.pathname}`;
  const result = checkRateLimit(key, env.RATE_LIMIT_MAX, env.RATE_LIMIT_WINDOW_MS);
  if (!result.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  return null;
}
