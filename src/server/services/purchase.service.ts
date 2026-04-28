import OpenAI from "openai";
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

  let recommendation: unknown = { items: [], estimatedSavings: 0 };
  try {
    recommendation = JSON.parse(completion.output_text);
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
      recommendation,
      estimatedSaving: Number((recommendation as { estimatedSavings?: number }).estimatedSavings ?? 0),
      sourceCount: 3
    }
  });
}
