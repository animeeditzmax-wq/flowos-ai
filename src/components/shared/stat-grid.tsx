import { Card } from "@/components/ui/card";

type Stat = { title: string; value: string; delta: string; detail: string };

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <p className="text-xs uppercase tracking-wider text-slate-400">{stat.title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
          <p className="mt-2 text-sm text-indigo-100">{stat.delta}</p>
          <p className="text-xs text-slate-400">{stat.detail}</p>
        </Card>
      ))}
    </section>
  );
}
