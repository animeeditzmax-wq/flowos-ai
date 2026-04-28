import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/server/security/guard";
import { prisma } from "@/server/db/prisma";
import { createBillingPortalSession } from "@/server/services/billing.service";

export async function POST(_req: NextRequest) {
  const auth = await requireUser();
  if ("error" in auth) return auth.error;

  const account = await prisma.connectedAccount.findFirst({
    where: { userId: auth.session.user.id, provider: "stripe", isActive: true }
  });
  if (!account?.externalRef) return NextResponse.json({ error: "Stripe customer not connected" }, { status: 400 });

  const session = await createBillingPortalSession(account.externalRef);
  return NextResponse.json({ portalUrl: session.url });
}
