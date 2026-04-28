import { Card } from "@/components/ui/card";

type Day = { day: string; savings: number };

export function SavingsChart({ points }: { points: Day[] }) {
  const max = Math.max(...points.map((p) => p.savings));

  return (
    <Card>
      <p className="text-sm text-slate-300">Weekly AI Savings Pulse</p>
      <div className="mt-4 flex h-40 items-end gap-2">
        {points.map((p) => (
          <div key={p.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-md bg-gradient-to-t from-indigo-300/60 to-white/80" style={{ height: `${(p.savings / max) * 100}%` }} />
            <span className="text-xs text-slate-400">{p.day}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
