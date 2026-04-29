"use client";

import { useEffect, useState } from "react";

type PermissionState = {
  email: boolean;
  bank: boolean;
  notifications: boolean;
  subscriptionTracking: boolean;
  billingDetection: boolean;
};

type Message = { role: "user" | "assistant"; content: string };

const permissionLabels: Record<keyof PermissionState, string> = {
  email: "Email access (invoices/subscriptions)",
  bank: "Bank statements access",
  notifications: "Notifications access",
  subscriptionTracking: "Subscription tracking access",
  billingDetection: "Billing/payment detection access"
};

export default function AIAssistantPage() {
  const [permissions, setPermissions] = useState<PermissionState | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/assistant/permissions")
      .then((res) => res.json())
      .then((data) => setPermissions(data.permissions))
      .catch(() => setError("Unable to load permissions. Please refresh."));
  }, []);

  async function updatePermission(key: keyof PermissionState, granted: boolean) {
    const res = await fetch("/api/assistant/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, granted })
    });

    const data = await res.json();
    setPermissions(data.permissions);
  }

  async function askAssistant() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError(null);

    const prompt = question.trim();
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setQuestion("");

    try {
      const res = await fetch("/api/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: prompt })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }

      const content = data.blocked ? data.message : data.answer;
      if (data.permissions) setPermissions(data.permissions);
      setMessages((prev) => [...prev, { role: "assistant", content }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const canUseAssistant = Boolean(permissions?.subscriptionTracking && permissions?.billingDetection);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 md:px-8">
      <section className="mb-8 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <h1 className="text-2xl font-semibold text-white">AI Assistant</h1>
        <p className="mt-2 text-sm text-slate-300">
          FlowOS AI uses only your approved data. No fabricated subscriptions, transactions, or recommendations.
        </p>
      </section>

      <section className="mb-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Permissions</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {permissions &&
            (Object.keys(permissionLabels) as (keyof PermissionState)[]).map((key) => (
              <div key={key} className="flex items-center justify-between rounded-xl border border-white/10 p-3">
                <span className="text-sm text-slate-200">{permissionLabels[key]}</span>
                <button
                  onClick={() => updatePermission(key, !permissions[key])}
                  className={`rounded-md px-3 py-1 text-xs font-medium ${permissions[key] ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}
                >
                  {permissions[key] ? "Granted" : "Grant"}
                </button>
              </div>
            ))}
        </div>
        {!canUseAssistant && <p className="mt-3 text-sm text-amber-300">Grant subscription tracking and billing detection to unlock personalized recommendations.</p>}
      </section>

      <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
        <div className="mb-4 space-y-3">
          {messages.length === 0 && <p className="text-sm text-slate-400">Ask: “What subscriptions should I cancel?” or “Where am I overspending?”</p>}
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`rounded-xl p-3 text-sm ${message.role === "assistant" ? "bg-indigo-500/10 text-indigo-100" : "bg-white/5 text-slate-100"}`}>
              {message.content}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask your AI assistant"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-indigo-400"
          />
          <button onClick={askAssistant} disabled={loading} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 disabled:opacity-60">
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      </section>
    </main>
  );
}
