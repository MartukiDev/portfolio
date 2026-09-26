import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { fieldClasses } from "./field";

export function Input({
  className,
  type = "text",
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <input type={type} className={cn(fieldClasses, "h-11", className)} {...props} />
  );
}
