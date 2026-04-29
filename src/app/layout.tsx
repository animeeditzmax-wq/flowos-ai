import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/shared/app-shell";

export const metadata: Metadata = {
  title: "FlowOS AI",
  description: "AI Life Operating System"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
