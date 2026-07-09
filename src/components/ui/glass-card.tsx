import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function GlassCard({
  className,
  children,
  as: Comp = "div",
}: {
  className?: string;
  children: ReactNode;
  as?: React.ElementType;
}) {
  return <Comp className={cn("glass rounded-2xl", className)}>{children}</Comp>;
}
