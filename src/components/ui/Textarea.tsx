import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { fieldClasses } from "./field";

export function Textarea({
  className,
  rows = 5,
  ...props
}: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(fieldClasses, "min-h-28 resize-y py-3", className)}
      {...props}
    />
  );
}
