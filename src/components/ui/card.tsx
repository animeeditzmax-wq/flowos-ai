import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "premium-glass premium-stroke rounded-3xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-white/20",
        className
      )}
      {...props}
    />
  );
}
