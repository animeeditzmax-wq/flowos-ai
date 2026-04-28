import { Card } from "@/components/ui/card";

const claims = [
  ["Amazon damaged item", "$89", "Follow-up sent · waiting seller response"],
  ["Airline delay compensation", "$140", "Documentation submitted"],
  ["Food delivery refund", "$26", "Approved"]
];

export function RefundsPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 md:px-8">
      <Card>
        <h1 className="text-2xl font-semibold">Refund & Claims Center</h1>
        <p className="mt-2 text-sm text-slate-300">Automated follow-up engine active. AI escalates unresolved claims based on confidence score.</p>
      </Card>
      <section className="grid gap-4 md:grid-cols-3">
        {claims.map(([title, amount, status]) => (
          <Card key={title}>
            <p className="text-base text-white">{title}</p>
            <p className="mt-1 text-2xl font-semibold">{amount}</p>
            <p className="mt-2 text-xs text-slate-300">{status}</p>
          </Card>
        ))}
      </section>
      <Card>
        <p className="text-sm text-slate-300">Premium empty-state behavior</p>
        <p className="mt-2 text-sm text-slate-200">When there are no pending claims, FlowOS shows a “financial hygiene clear” state with prevention tips and monitoring confidence.</p>
      </Card>
    </main>
  );
}
