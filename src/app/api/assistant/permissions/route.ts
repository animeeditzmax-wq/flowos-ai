import { NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { getAssistantPermissions, setAssistantPermission, type AssistantPermissionKey } from "@/server/services/assistant.service";

export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const permissions = await getAssistantPermissions(auth.session.user.id);
  return NextResponse.json({ permissions });
}

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = (await req.json()) as { key?: AssistantPermissionKey; granted?: boolean };
  if (!body.key || typeof body.granted !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await setAssistantPermission(auth.session.user.id, body.key, body.granted);
  const permissions = await getAssistantPermissions(auth.session.user.id);
  return NextResponse.json({ permissions });
}
