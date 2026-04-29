import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/shared/sidebar";

export const metadata: Metadata = {
  title: "FlowOS AI",
  description: "AI Life Operating System"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white">
        <div className="md:flex">
          <Sidebar />
          <div className="min-h-screen flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
