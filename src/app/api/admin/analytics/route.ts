import { NextResponse } from "next/server";
import { requireRole } from "@/server/security/guard";
import { getAdminAnalytics } from "@/server/admin/admin.service";

export async function GET() {
  const auth = await requireRole(["ADMIN"]);
  if ("error" in auth) return auth.error;

  const analytics = await getAdminAnalytics();
  return NextResponse.json({ analytics });
}
