import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const options = [
  ["Lenovo ThinkBook 14", "$899", "Best value score 9.1/10", "$221 estimated 2-year savings"],
  ["ASUS Zenbook 14", "$949", "Battery champion 14h", "$170 estimated 2-year savings"],
  ["MacBook Air M2 (refurb)", "$999", "Highest resale stability", "$286 value retention upside"]
];

export function PurchaseAssistantPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 md:px-8">
      <Card className="space-y-3">
        <h1 className="text-2xl font-semibold">Smart Purchase Assistant</h1>
        <p className="text-sm text-slate-300">Goal: Find best laptop under $1000 with max long-term value. AI compares performance, reliability, warranty, and resale.</p>
        <Button variant="gradient" className="w-fit">Run Comparison Engine</Button>
      </Card>
      <section className="grid gap-4 md:grid-cols-3">
        {options.map(([name, price, note, savings]) => (
          <Card key={name}>
            <p className="text-base font-medium">{name}</p>
            <p className="mt-2 text-2xl">{price}</p>
            <p className="mt-2 text-sm text-slate-300">{note}</p>
            <p className="mt-2 text-xs text-indigo-100">{savings}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
