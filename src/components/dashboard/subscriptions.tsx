import { Card } from "@/components/ui/card";

const subs = [
  ["Netflix", "$22.99", "Low usage - Cancel suggested", "Potential save: $275/yr"],
  ["Spotify", "$10.99", "Healthy usage", "No action needed"],
  ["Adobe", "$54.99", "Downgrade available", "Potential save: $240/yr"],
  ["Gym", "$59.00", "No check-ins in 45 days", "Pause recommended"]
];

export function SubscriptionsPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 md:px-8">
      <Card>
        <h1 className="text-2xl font-semibold">Subscription Manager</h1>
        <p className="mt-2 text-sm text-slate-300">$147.97 monthly spend · $82 possible monthly savings · 4 optimization actions ready</p>
      </Card>
      <section className="grid gap-4 md:grid-cols-2">
        {subs.map(([name, cost, insight, impact]) => (
          <Card key={name}>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">{name}</p>
              <p className="text-sm text-slate-300">{cost}/month</p>
            </div>
            <p className="mt-3 text-sm text-indigo-100">{insight}</p>
            <p className="mt-2 text-xs text-slate-400">{impact}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
