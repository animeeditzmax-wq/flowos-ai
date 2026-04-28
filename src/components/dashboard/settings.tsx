import { Card } from "@/components/ui/card";

const controls = [
  "Connected accounts: Banks, cards, email, calendar",
  "Permission mode: AI drafts + executes low-risk actions automatically",
  "Privacy vault: Encrypted credentials + immutable action logs",
  "Payment controls: Spend cap and dual confirmation for high-risk transactions"
];

export function SettingsPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 md:px-8">
      <Card>
        <h1 className="text-2xl font-semibold">Settings & Permissions</h1>
        <p className="mt-2 text-sm text-slate-300">Trust-first controls built for safe autonomous execution.</p>
      </Card>
      <section className="grid gap-4 md:grid-cols-2">
        {controls.map((c) => (
          <Card key={c} className="text-sm text-slate-200">{c}</Card>
        ))}
      </section>
    </main>
  );
}
