"use client";

import { signIn } from "next-auth/react";
import { StreamHero } from "@/components/auth/stream-hero";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EBDBC2] px-4 py-8">
      <StreamHero />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/50 bg-white/45 p-7 shadow-[0_20px_50px_rgba(56,79,93,0.16)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-600">FlowOS AI</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-800">Calm control for your financial life.</h1>
        <p className="mt-3 text-sm text-slate-600">
          FlowOS requests access to help analyze subscriptions, recurring payments, and financial optimization recommendations.
        </p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/onboarding/permissions" })}
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Continue with Google
        </button>

        <div className="mt-5 space-y-2 text-xs text-slate-600">
          <p>We ask explicit permission before profile analysis, subscription insights, and optimization recommendations.</p>
          <p>No account or device data is accessed until you approve each permission.</p>
        </div>
      </section>
    </main>
  );
}
