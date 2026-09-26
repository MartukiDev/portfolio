import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type BadgeVariant = "default" | "accent" | "available";

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  default: "glass-flat text-fg",
  accent: "border border-accent/30 bg-accent/10 text-accent",
  available: "border border-success/30 bg-success/10 text-success",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    >
      {variant === "available" && (
        <span aria-hidden="true" className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-success" />
        </span>
      )}
      {children}
    </span>
  );
}
