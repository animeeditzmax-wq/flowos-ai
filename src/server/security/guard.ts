import { NextResponse } from "next/server";
import { auth } from "@/server/auth/options";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { session };
}

export async function requireRole(roles: string[]) {
  const base = await requireUser();
  if ("error" in base) return base;
  if (!roles.includes(base.session.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return base;
}
