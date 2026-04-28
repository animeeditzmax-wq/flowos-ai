import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/shared/top-nav";

export const metadata: Metadata = {
  title: "FlowOS AI",
  description: "AI Life Operating System"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
