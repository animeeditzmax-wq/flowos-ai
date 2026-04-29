"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";

type PermissionState = {
  email: boolean;
  bank: boolean;
  notifications: boolean;
  subscriptionTracking: boolean;
  billingDetection: boolean;
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");
  const isPermissionRoute = pathname.startsWith("/permissions") || pathname.startsWith("/onboarding/permissions");
  const [permissions, setPermissions] = useState<PermissionState | null>(null);

  useEffect(() => {
    if (isAuthRoute) return;
    fetch("/api/flow/permissions")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPermissions(data?.permissions ?? null))
      .catch(() => setPermissions(null));
  }, [isAuthRoute]);

  const needsPermissions = useMemo(() => {
    if (!permissions) return false;
    return !permissions.email || !permissions.subscriptionTracking || !permissions.billingDetection;
  }, [permissions]);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="md:flex">
      <Sidebar />
      <div className="min-h-screen flex-1">
        {needsPermissions && !isPermissionRoute && (
          <div className="mx-4 mt-4 rounded-xl border border-amber-200/50 bg-amber-100/90 p-3 text-sm text-amber-900 md:mx-8">
            <p className="font-medium">Permission required before data analysis</p>
            <p className="mt-1">Approve profile, subscription, and billing permissions so FlowOS can gather real account data.</p>
            <Link href="/onboarding/permissions" className="mt-2 inline-block rounded-md bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white">
              Review permissions
            </Link>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
