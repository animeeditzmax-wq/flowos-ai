"use client";

import { useEffect, useState } from "react";

type PermissionState = {
  email: boolean;
  bank: boolean;
  notifications: boolean;
  subscriptionTracking: boolean;
  billingDetection: boolean;
};

type ChatMessage = { role: "user" | "assistant"; content: string };

const permissionLabels: Record<keyof PermissionState, string> = {
  email: "Subscriptions & invoice email data",
  bank: "Bills and financial activity",
  notifications: "Task and renewal alerts",
  subscriptionTracking: "Recurring subscription detection",
  billingDetection: "Recurring payment and billing analysis"
};

export default function FlowPageClient() {
  const [permissions, setPermissions] = useState<PermissionState | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [purchaseInput, setPurchaseInput] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [purchaseResult, setPurchaseResult] = useState<string>("");
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/flow/permissions")
      .then((res) => res.json())
      .then((data) => setPermissions(data.permissions))
      .catch(() => setError("Unable to load permissions."));
  }, []);

  async function togglePermission(key: keyof PermissionState) {
    if (!permissions) return;
    const res = await fetch("/api/flow/permissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, granted: !permissions[key] })
    });
    const data = await res.json();
    setPermissions(data.permissions);
  }

  async function sendChat() {
    if (!chatInput.trim() || loadingChat) return;
    const question = chatInput.trim();
    setChatInput("");
    setChat((prev) => [...prev, { role: "user", content: question }]);
    setLoadingChat(true);
    setError(null);

    try {
      const res = await fetch("/api/flow/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat request failed");
      setChat((prev) => [...prev, { role: "assistant", content: data.blocked ? data.message : data.answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed");
    } finally {
      setLoadingChat(false);
    }
  }

  async function runPurchaseSearch() {
    if (!purchaseInput.trim() || loadingPurchase) return;
    setLoadingPurchase(true);
    setError(null);

    try {
      const res = await fetch("/api/flow/purchase-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: purchaseInput.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setPurchaseResult(data.answer);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Search failed");
    } finally {
      setLoadingPurchase(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/50 p-6">
        <h1 className="text-3xl font-semibold">FLOW</h1>
        <p className="mt-2 text-sm text-slate-300">Your AI executive operating layer for subscriptions, refunds, purchases, and life admin.</p>
        <p className="mt-2 text-xs text-indigo-200">We only analyze data after your approval.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Permissions</h2>
          <div className="mt-3 space-y-2">
            {permissions &&
              (Object.keys(permissionLabels) as (keyof PermissionState)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => togglePermission(key)}
                  className="flex w-full items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-left"
                >
                  <span className="text-xs text-slate-200">{permissionLabels[key]}</span>
                  <span className={`rounded px-2 py-1 text-xs ${permissions[key] ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-slate-300"}`}>
                    {permissions[key] ? "Approved" : "Not approved"}
                  </span>
                </button>
              ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">AI Chat Assistant</h2>
          <div className="mt-3 max-h-80 space-y-2 overflow-y-auto">
            {chat.length === 0 && <p className="text-sm text-slate-400">Ask: “What subscriptions should I cancel?”</p>}
            {chat.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`rounded-lg p-3 text-sm ${m.role === "assistant" ? "bg-indigo-500/10 text-indigo-100" : "bg-white/5 text-slate-100"}`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask FLOW"
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
            />
            <button onClick={sendChat} disabled={loadingChat} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60">
              {loadingChat ? "Running" : "Send"}
            </button>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-slate-900/40 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Smart Purchase Intelligence</h2>
        <p className="mt-2 text-xs text-slate-400">Find best price, seller, ratings, delivery estimate, and recommendation reason.</p>
        <div className="mt-3 flex gap-2">
          <input
            value={purchaseInput}
            onChange={(e) => setPurchaseInput(e.target.value)}
            placeholder="e.g. best laptop under $1000"
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm"
          />
          <button onClick={runPurchaseSearch} disabled={loadingPurchase} className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {loadingPurchase ? "Searching" : "Search"}
          </button>
        </div>
        {purchaseResult && <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-200">{purchaseResult}</pre>}
      </section>

      {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
    </main>
  );
}
