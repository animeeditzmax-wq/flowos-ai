"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  ["Identity & profile", "Verify core details and goals", true],
  ["Accounts & subscriptions", "Connect financial and digital services", true],
  ["Permission matrix", "Choose autonomous and approval-only actions", false],
  ["Launch automation", "Start weekly reports and background execution", false]
] as const;

export function OnboardingPage() {
  const completed = steps.filter(([, , done]) => done).length;
  const pct = Math.round((completed / steps.length) * 100);

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-8 md:px-8">
      <Card>
        <p className="text-sm text-slate-300">Welcome to FlowOS AI</p>
        <h1 className="mt-2 text-3xl font-semibold">Your executive assistant setup</h1>
        <div className="mt-4 h-2 rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-gradient-to-r from-indigo-300 to-white" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-400">{pct}% complete</p>
      </Card>

      <section className="space-y-3">
        {steps.map(([title, desc, done]) => (
          <Card key={title} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white">{title}</p>
              <p className="text-sm text-slate-300">{desc}</p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-indigo-100">{done ? "Completed" : "Pending"}</span>
          </Card>
        ))}
      </section>

      <div className="flex gap-2">
        <Button variant="gradient">Continue setup</Button>
        <Button variant="ghost">Do it later</Button>
      </div>
    </main>
  );
}
