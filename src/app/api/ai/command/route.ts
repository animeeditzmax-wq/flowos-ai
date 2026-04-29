import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { enforceRateLimit } from "@/server/security/http";
import { aiCommandSchema } from "@/server/validation/schemas";
import { createAndClassifyTask } from "@/server/services/ai-command.service";

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req);
  if (limited) return limited;

  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = aiCommandSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const task = await createAndClassifyTask(auth.session.user.id, parsed.data.command);
  return NextResponse.json({ task });
}
