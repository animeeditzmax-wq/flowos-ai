import { redirect } from "next/navigation";
import { auth } from "@/server/auth/options";
import { getAssistantPermissions } from "@/server/services/assistant.service";
import FlowPageClient from "@/components/flow/flow-page-client";

export default async function FlowPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const permissions = await getAssistantPermissions(session.user.id);
  const hasCorePermissions = permissions.subscriptionTracking || permissions.billingDetection || permissions.email;
  if (!hasCorePermissions) redirect("/onboarding/permissions");

  return <FlowPageClient />;
}
