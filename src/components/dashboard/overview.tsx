"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { QueueList } from "@/components/shared/queue-list";
import { SavingsChart } from "@/components/shared/savings-chart";
import { StatGrid } from "@/components/shared/stat-grid";

type Stat = { title: string; value: string; delta: string; detail: string };
type QueueItem = { name: string; status: string; progress: number };
type Point = { day: string; savings: number };

export function DashboardOverview() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [weeklySeries, setWeeklySeries] = useState<Point[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats ?? []);
        setQueue(data.queue ?? []);
        setWeeklySeries(data.weeklySeries ?? []);
        setMessage(data.message ?? null);
      })
      .catch(() => {
        setStats([]);
        setQueue([]);
        setWeeklySeries([]);
      });
  }, []);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <StatGrid stats={stats.length > 0 ? stats : [{ title: "Status", value: "Waiting", delta: "Connect data", detail: "Authorize data sources to populate metrics" }]} />
      {message && <p className="text-sm text-amber-300">{message}</p>}

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-sm text-slate-300">Executive Briefing</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Your AI operations center is active.</h2>
          <p className="mt-4 text-sm text-slate-200">Insights shown here are generated only from your authorized account data.</p>
        </Card>
        <SavingsChart points={weeklySeries} />
      </section>

      <QueueList items={queue} title="Live Automation Queue" />
    </main>
  );
}
