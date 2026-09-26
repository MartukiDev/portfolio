import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

type EmptyStateProps = {
  command: string;
  output: string;
  message: string;
  action?: ReactNode;
};

/** Estado vacío con estética de terminal. */
export function EmptyState({ command, output, message, action }: EmptyStateProps) {
  return (
    <GlassCard className="flex flex-col gap-4">
      <div aria-hidden="true" className="font-mono text-sm">
        <p>
          <span className="text-accent">$</span> {command}
        </p>
        <p className="mt-1 text-muted">{output}</p>
      </div>
      <p className="text-muted">{message}</p>
      {action}
    </GlassCard>
  );
}
