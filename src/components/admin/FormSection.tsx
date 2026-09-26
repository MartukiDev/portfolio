import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Heading } from "@/components/ui/Heading";

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <GlassCard className="flex flex-col gap-5">
      <Heading level={2} size={4}>
        {title}
      </Heading>
      {children}
    </GlassCard>
  );
}

/** Barra inferior fija con el botón de guardar. */
export function FormActions({ children }: { children: ReactNode }) {
  return (
    <div className="glass sticky bottom-4 z-20 flex flex-wrap items-center justify-end gap-3 rounded-2xl px-4 py-3">
      {children}
    </div>
  );
}
