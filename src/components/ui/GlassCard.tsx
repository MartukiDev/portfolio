import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type GlassCardProps = ComponentPropsWithoutRef<"div"> & {
  /** Resalta al pasar el cursor (tarjetas clicables). */
  interactive?: boolean;
  /** `false` dentro de otra superficie de vidrio o en listas largas: evita anidar blur. */
  blur?: boolean;
};

export function GlassCard({
  interactive = false,
  blur = true,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 sm:p-6",
        blur ? "glass" : "glass-flat",
        interactive &&
          "transition-colors duration-200 hover:border-white/15 hover:bg-glass-hover",
        className,
      )}
      {...props}
    />
  );
}
