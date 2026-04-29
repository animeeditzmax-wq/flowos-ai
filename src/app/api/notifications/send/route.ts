import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/security/guard";
import { notificationSchema } from "@/server/validation/schemas";
import { createNotification } from "@/server/notifications/notification.service";

export async function POST(req: NextRequest) {
  const auth = await requireRole(["ADMIN", "BUSINESS"]);
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = notificationSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const notification = await createNotification(
    parsed.data.userId,
    parsed.data.type,
    parsed.data.title,
    parsed.data.body
  );

  return NextResponse.json({ notification });
}
