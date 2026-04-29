import OpenAI from "openai";
import { NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { env } from "@/server/config/env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = (await req.json()) as { query?: string };
  const query = body.query?.trim();
  if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Return strict JSON only with this shape: {results:[{productName,rating,bestPrice,seller,deliveryEstimate,recommendationReason}]}. Use web-available commercial knowledge and do not fabricate certainty; if unsure, say 'unknown'."
      },
      { role: "user", content: `Find best value options for: ${query}` }
    ]
  });

  return NextResponse.json({ answer: completion.output_text });
}
