"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type PermissionState = {
  email: boolean;
  bank: boolean;
  notifications: boolean;
  subscriptionTracking: boolean;
  billingDetection: boolean;
};

const labels: Record<keyof PermissionState, string> = {
  email: "Basic profile + Gmail receipts for subscriptions and bills",
  bank: "Optional financial account connection (approval only)",
  notifications: "Notification permission for reminders and booking alerts",
  subscriptionTracking: "Permission to analyze subscriptions and recurring payments",
  billingDetection: "Permission for financial optimization recommendations"
};

export default function FlowPermissionsPage() {
  const [permissions, setPermissions] = useState<PermissionState | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/flow/permissions")
      .then((res) => res.json())
      .then((data) => setPermissions(data.permissions));
  }, []);

  async function toggle(key: keyof PermissionState) {
    if (!permissions) return;
    const res = await fetch("/api/flow/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, granted: !permissions[key] })
    });
    const data = await res.json();
    setPermissions(data.permissions);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Permission-Based Onboarding</h1>
      <p className="mt-2 text-sm text-slate-300">Nothing is accessed until you approve it. You can revoke access anytime.</p>
      <div className="mt-6 space-y-3">
        {permissions &&
          (Object.keys(labels) as (keyof PermissionState)[]).map((key) => (
            <button key={key} onClick={() => toggle(key)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left">
              <span className="text-sm">{labels[key]}</span>
              <span className={`rounded px-2 py-1 text-xs ${permissions[key] ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}>{permissions[key] ? "Approved" : "Approve"}</span>
            </button>
          ))}
      </div>
      <button onClick={() => router.push("/")} className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900">Continue to Flow</button>
    </main>
  );
}
