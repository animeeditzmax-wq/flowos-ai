import { Card } from "@/components/ui/card";
import { dashboardStats, executionQueue, weeklyTimeline } from "@/lib/mock-data";
import { QueueList } from "@/components/shared/queue-list";
import { SavingsChart } from "@/components/shared/savings-chart";
import { StatGrid } from "@/components/shared/stat-grid";

export function DashboardOverview() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-8">
      <StatGrid stats={dashboardStats} />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-sm text-slate-300">Executive Briefing</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">The AI is running your life operations in the background.</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            <li>• 42 completed tasks this week across refunds, bookings, and billing.</li>
            <li>• 4 proactive recommendations ready for one-click approval.</li>
            <li>• Monthly savings forecast updated to <span className="text-indigo-100">$1,912 annualized</span>.</li>
          </ul>
        </Card>
        <SavingsChart points={weeklyTimeline} />
      </section>

      <QueueList items={executionQueue} title="Live Automation Queue" />
    </main>
  );
}
