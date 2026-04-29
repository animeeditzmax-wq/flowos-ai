"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

const links = [
  ["Flow", "/"],
  ["Dashboard", "/dashboard"],
  ["Refunds", "/refunds"],
  ["Purchase Intelligence", "/purchase-assistant"],
  ["Settings", "/settings"],
  ["Permissions", "/permissions"],
  ["Profile", "/profile"]
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/10 bg-slate-950/80 p-4 backdrop-blur md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
        <Sparkles className="h-4 w-4 text-indigo-300" /> FLOWOS AI
      </div>
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {links.map(([label, href]) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-lg border px-3 py-2 text-sm transition ${active ? "border-indigo-400/50 bg-indigo-500/20 text-white" : "border-white/10 text-slate-300 hover:bg-white/10"}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <p className="mt-4 text-xs text-slate-400">We only analyze data after your approval.</p>
    </aside>
  );
}
