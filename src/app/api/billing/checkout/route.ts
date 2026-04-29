import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { checkoutSchema } from "@/server/validation/schemas";
import { createCheckoutSession } from "@/server/services/billing.service";

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const session = await createCheckoutSession(auth.session.user.id, parsed.data.planTier);
  return NextResponse.json({ checkoutUrl: session.url });
}
