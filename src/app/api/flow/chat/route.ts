import { NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { runAssistantQuery } from "@/server/services/assistant.service";

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = (await req.json()) as { question?: string };
  const question = body.question?.trim();
  if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

  const response = await runAssistantQuery(auth.session.user.id, question);
  return NextResponse.json(response);
}
