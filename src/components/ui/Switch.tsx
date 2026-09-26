import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type SwitchProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "role">;

/** Checkbox nativo con apariencia de interruptor: funciona en formularios y controlado. */
export function Switch({ className, ...props }: SwitchProps) {
  return (
    <span className={cn("relative inline-flex h-6 w-11 shrink-0", className)}>
      <input
        type="checkbox"
        role="switch"
        className="peer absolute inset-0 z-10 m-0 cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed"
        {...props}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-glass-border bg-white/10 transition-colors peer-checked:border-accent/60 peer-checked:bg-accent/80 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:opacity-50"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 left-1 size-4 rounded-full bg-fg shadow transition-transform peer-checked:translate-x-5 peer-checked:bg-bg"
      />
    </span>
  );
}
