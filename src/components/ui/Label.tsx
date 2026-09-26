import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function Label({
  className,
  ...props
}: ComponentPropsWithoutRef<"label">) {
  return (
    <label
      className={cn("block text-sm font-medium text-fg", className)}
      {...props}
    />
  );
}
