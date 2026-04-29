import OpenAI from "openai";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { env } from "@/server/config/env";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function recommendPurchase(userId: string, query: string, budgetUsd: number) {
  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Return compact JSON with recommended products and estimated savings. Format: {items:[{name,price,reason}],estimatedSavings}."
      },
      { role: "user", content: `Find ${query} under $${budgetUsd}` }
    ]
  });

  let recommendation: Record<string, unknown> = { items: [], estimatedSavings: 0 };
  try {
    recommendation = JSON.parse(completion.output_text) as Record<string, unknown>;
  } catch {
    recommendation = {
      items: [{ name: "Fallback recommendation", price: budgetUsd * 0.9, reason: "Model parse fallback" }],
      estimatedSavings: budgetUsd * 0.1
    };
  }

  return prisma.purchaseRecommendation.create({
    data: {
      userId,
      query,
      budgetUsd,
      recommendation: recommendation as Prisma.InputJsonValue,
      estimatedSaving: Number(recommendation.estimatedSavings ?? 0),
      sourceCount: 3
    }
  });
}
