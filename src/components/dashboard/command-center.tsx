"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { executionQueue } from "@/lib/mock-data";

const starterPrompts = [
  "Cancel my Netflix if unused this month",
  "Find me the best laptop under $1000",
  "Book a dermatologist appointment tomorrow",
  "Reduce monthly expenses by at least $150"
];

export function CommandCenterPage() {
  const [command, setCommand] = useState(starterPrompts[0]);

  return (
    <main className="mx-auto grid max-w-7xl gap-5 px-4 py-8 md:grid-cols-3 md:px-8">
      <Card className="space-y-4 md:col-span-2">
        <p className="text-sm text-slate-300">AI Command Center</p>
        <h1 className="text-2xl font-semibold">Delegate outcomes to your AI executive assistant.</h1>

        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none"
        />

        <div className="flex flex-wrap gap-2">
          {starterPrompts.map((p) => (
            <button key={p} onClick={() => setCommand(p)} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10">
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="gradient">Execute with AI</Button>
          <Button variant="ghost">Show approvals</Button>
          <Button variant="ghost">Open guardrails</Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-slate-300">Task Status</p>
        <div className="mt-4 space-y-3">
          {executionQueue.slice(0, 3).map((item) => (
            <div key={item.name} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-sm text-slate-100">{item.name}</p>
              <p className="mt-1 text-xs text-indigo-100">{item.status}</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/10">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-300 to-white" style={{ width: `${item.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
