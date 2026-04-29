"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password })
      });

      const raw = await response.text();
      const data = (raw ? JSON.parse(raw) : {}) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      const loginResult = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        callbackUrl: "/onboarding/permissions",
        redirect: false
      });

      if (!loginResult || loginResult.error) {
        setError("Account created, but auto-login failed. Please sign in manually.");
        return;
      }

      window.location.href = loginResult.url ?? "/onboarding/permissions";
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message.includes("JSON") ? "Unexpected server response. Please retry." : error.message);
      } else {
        setError("Unexpected error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#EBDBC2] px-4">
      <section className="w-full max-w-md rounded-2xl border border-white/60 bg-white/50 p-6 backdrop-blur-xl">
        <h1 className="text-2xl font-semibold text-slate-800">Create your FlowOS account</h1>
        <form className="mt-4 space-y-3" onSubmit={handleSignUp}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required className="w-full rounded-lg border border-slate-300 bg-white/85 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full rounded-lg border border-slate-300 bg-white/85 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" minLength={8} required className="w-full rounded-lg border border-slate-300 bg-white/85 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500" />
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</button>
        </form>
        {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
        <p className="mt-4 text-xs text-slate-700">Already have an account? <Link href="/auth/signin" className="underline">Login</Link></p>
      </section>
    </main>
  );
}
