import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/server/security/rate-limit";
import { env } from "@/server/config/env";

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip") ?? "unknown";
}

export function enforceRateLimit(req: NextRequest) {
  const key = `${getClientIp(req)}:${req.nextUrl.pathname}`;
  const result = checkRateLimit(key, env.RATE_LIMIT_MAX, env.RATE_LIMIT_WINDOW_MS);
  if (!result.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  return null;
}
