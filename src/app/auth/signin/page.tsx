"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { StreamHero } from "@/components/auth/stream-hero";

type ProviderMap = Awaited<ReturnType<typeof getProviders>>;

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<ProviderMap>(null);

  useEffect(() => {
    getProviders().then(setProviders).catch(() => setProviders(null));
  }, []);

  const hasGoogle = Boolean(providers?.google);

  async function handleCredentialsSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/onboarding/permissions",
      redirect: false
    });

    if (!result || result.error) {
      setError("Login failed. Check your email/password or create an account first.");
      setLoading(false);
      return;
    }

    window.location.href = result.url ?? "/onboarding/permissions";
  }

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);

    const result = await signIn("google", {
      callbackUrl: "/onboarding/permissions",
      redirect: false
    });

    if (!result || result.error || !result.url) {
      setError("Google sign-in is unavailable right now. Use email/password or sign up.");
      setLoading(false);
      return;
    }

    window.location.href = result.url;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EBDBC2] px-4 py-8">
      <StreamHero />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/50 bg-white/45 p-7 shadow-[0_20px_50px_rgba(56,79,93,0.16)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-600">FlowOS AI</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-800">Login to continue</h1>
        <p className="mt-3 text-sm text-slate-600">
          FlowOS requests access to help analyze subscriptions, recurring payments, and financial optimization recommendations.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={!hasGoogle || loading}
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {hasGoogle ? "Continue with Google" : "Google login unavailable"}
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
          <span className="h-px flex-1 bg-slate-300" />OR<span className="h-px flex-1 bg-slate-300" />
        </div>

        <form className="space-y-3" onSubmit={handleCredentialsSignIn}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full rounded-lg border border-slate-300 bg-white/85 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full rounded-lg border border-slate-300 bg-white/85 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500" />
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in..." : "Login"}</button>
        </form>

        {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}

        <p className="mt-4 text-xs text-slate-600">
          Don&apos;t have an account? <Link href="/auth/signup" className="font-semibold text-slate-800 underline">Sign up</Link>
        </p>
      </section>
    </main>
  );
}
