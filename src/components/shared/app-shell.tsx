"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith("/auth");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="md:flex">
      <Sidebar />
      <div className="min-h-screen flex-1">{children}</div>
    </div>
  );
}
