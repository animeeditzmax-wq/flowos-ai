"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QueueItem = { name: string; status: string; progress: number };

const starterPrompts = [
  "Cancel my Netflix if unused this month",
  "Find me the best laptop under $1000",
  "Book a dermatologist appointment tomorrow",
  "Reduce monthly expenses by at least $150"
];

export function CommandCenterPage() {
  const [command, setCommand] = useState(starterPrompts[0]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function refreshQueue() {
    const res = await fetch("/api/dashboard/summary");
    const data = await res.json();
    setQueue(data.queue ?? []);
  }

  useEffect(() => {
    refreshQueue().catch(() => setQueue([]));
  }, []);

  async function executeCommand() {
    setLoading(true);
    try {
      await fetch("/api/ai/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command })
      });
      await refreshQueue();
    } finally {
      setLoading(false);
    }
  }

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
          {starterPrompts.map((prompt) => (
            <button key={prompt} onClick={() => setCommand(prompt)} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10">
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">          <Button variant="gradient" onClick={executeCommand} disabled={loading}>{loading ? "Executing..." : "Execute with AI"}</Button>
          <Button variant="ghost" onClick={refreshQueue}>Refresh queue</Button>
        </div>
      </Card>

      <Card>
        <p className="text-sm text-slate-300">Task Status</p>
        <div className="mt-4 space-y-3">
          {queue.length === 0 && <p className="text-xs text-slate-400">No live tasks yet.</p>}
          {queue.slice(0, 3).map((item) => (
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
