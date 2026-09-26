import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { fieldClasses } from "./field";

export function Select({
  className,
  ...props
}: ComponentPropsWithoutRef<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          fieldClasses,
          "h-11 cursor-pointer appearance-none pr-10 [&>option]:bg-surface",
          className,
        )}
        {...props}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted"
      >
        <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
