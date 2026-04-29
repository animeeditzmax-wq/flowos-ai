"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole, Orbit, ShieldCheck, Sparkles, Stars, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  { title: "Autonomous Execution", body: "FlowOS runs cancellations, refunds, and bookings end-to-end with your policy controls." },
  { title: "Financial Intelligence", body: "Continuously scans bills, subscriptions, and purchase patterns for savings opportunities." },
  { title: "AI Decision Layer", body: "Recommends actions with expected time and money ROI before each execution." },
  { title: "Trust Architecture", body: "Permission tiers, encrypted credentials, and auditable action logs by default." }
];

const pricing = [
  ["Personal", "$29/month", "AI assistant for personal life operations"],
  ["Pro", "$79/month", "Advanced automation + premium optimization engine"],
  ["Business", "$299/month", "Multi-user command center for teams and households"]
];

const testimonials = [
  "FlowOS recovered more money in month one than our entire annual software stack.",
  "This is the first AI product that feels like outcomes-as-a-service.",
  "Our family has a system now. Bills, bookings, and claims just happen."
];

export function LandingPage() {
  return (
    <main className="mx-auto max-w-7xl space-y-16 px-4 py-10 md:px-8 md:py-16">
      <section className="relative overflow-hidden rounded-[2rem] premium-glass premium-stroke p-8 md:p-12">
        <div className="pointer-events-none absolute -top-16 right-0 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-slate-200/10 blur-3xl" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="relative grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-100">
              <Stars className="h-3 w-3 text-indigo-200" /> AI Life Operating System
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
              People don&apos;t need more apps. <span className="bg-gradient-to-r from-indigo-100 to-slate-300 bg-clip-text text-transparent">They need outcomes.</span>
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              FlowOS AI is your autonomous executive assistant for life admin: reducing bills, recovering refunds, handling bookings, and orchestrating smarter purchasing decisions while you focus on leverage.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="gradient">Get Early Access <ArrowRight className="ml-2 h-4 w-4" /></Button>
              <Button asChild size="lg" variant="ghost"><Link href="/dashboard">Explore Product</Link></Button>
            </div>
            <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" />Avg. 8.4 hrs saved/week</p>
              <p className="flex items-center gap-2"><Zap className="h-4 w-4 text-indigo-200" />$420 median monthly savings</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-slate-200" />Policy-based approvals</p>
            </div>
          </div>

          <Card className="space-y-4 border-white/20 bg-black/30 p-7">
            <p className="text-sm text-slate-300">Live AI Operations Preview</p>
            {[
              ["Bill optimization", "Negotiated internet + utilities", "$58/mo saved"],
              ["Refund engine", "Submitted and escalated 3 claims", "$162 pending"],
              ["Service booking", "Booked cleaner + dentist", "Done"],
              ["Subscription cleanup", "Cancelled 2 unused plans", "$41/mo saved"]
            ].map(([title, action, outcome]) => (
              <motion.div whileHover={{ scale: 1.01 }} key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400">{title}</p>
                <p className="mt-1 text-sm text-white">{action}</p>
                <p className="mt-1 text-xs text-indigo-100">{outcome}</p>
              </motion.div>
            ))}
          </Card>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title} className="space-y-2">
            <p className="text-lg text-white">{feature.title}</p>
            <p className="text-sm text-slate-300">{feature.body}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { step: "Step 01", title: "Connect your digital life", desc: "Securely link email, banks, cards, subscriptions, and calendar in minutes.", Icon: LockKeyhole },
          { step: "Step 02", title: "Define operating policy", desc: "Set autonomous limits for spend, cancellation, booking, and approval thresholds.", Icon: Orbit },
          { step: "Step 03", title: "Watch AI execute", desc: "FlowOS continuously runs life operations and sends high-signal weekly ROI reports.", Icon: Sparkles }
        ].map(({ step, title, desc, Icon }) => (
          <Card key={title}>
            <p className="text-xs uppercase tracking-wider text-indigo-200">{step}</p>
            <div className="mt-2 flex items-center gap-2 text-white"><Icon className="h-4 w-4 text-indigo-100" />{title}</div>
            <p className="mt-2 text-sm text-slate-300">{desc}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {pricing.map(([name, price, desc]) => (
          <Card key={name} className="space-y-4">
            <p className="text-sm text-slate-300">{name}</p>
            <p className="text-3xl font-semibold text-white">{price}</p>
            <p className="text-sm text-slate-300">{desc}</p>
            <Button variant={name === "Pro" ? "gradient" : "ghost"} className="w-full">Choose {name}</Button>
          </Card>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {testimonials.map((quote, i) => (
          <Card key={quote}>
            <p className="text-sm text-slate-100">“{quote}”</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-slate-400">Operator testimonial {i + 1}</p>
          </Card>
        ))}
      </section>
    </main>
  );
}
