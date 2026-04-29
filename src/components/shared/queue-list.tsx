import { Card } from "@/components/ui/card";

type QueueItem = { name: string; status: string; progress: number };

export function QueueList({ items, title }: { items: QueueItem[]; title: string }) {
  return (
    <Card>
      <p className="text-sm text-slate-300">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-white">{item.name}</p>
              <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] text-indigo-100">{item.status}</span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/10">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-300 to-white" style={{ width: `${item.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
