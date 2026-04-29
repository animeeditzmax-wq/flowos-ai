import Link from "next/link";
import { Sparkles } from "lucide-react";

const links = [
  ["Onboarding", "/onboarding"],
  ["Dashboard", "/dashboard"],
  ["Command", "/command-center"],
  ["AI Assistant", "/ai-assistant"],
  ["Subscriptions", "/subscriptions"],
  ["Refunds", "/refunds"],
  ["Purchase", "/purchase-assistant"],
  ["Settings", "/settings"]
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
          <Sparkles className="h-4 w-4 text-indigo-300" />
          FLOWOS AI
        </Link>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 md:px-8">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
