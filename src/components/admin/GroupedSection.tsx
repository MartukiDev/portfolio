import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Heading } from "@/components/ui/Heading";

type GroupedSectionProps = {
  title: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
  empty: string;
  children: ReactNode;
};

/** Tarjeta de un grupo (tipo de trayectoria, área de habilidad) con su botón de agregar. */
export function GroupedSection({ title, count, addLabel, onAdd, empty, children }: GroupedSectionProps) {
  return (
    <GlassCard blur={false} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Heading level={2} size={4}>
          {title}
          <span className="ml-2 font-mono text-sm font-normal text-muted">{count}</span>
        </Heading>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-accent transition-colors hover:bg-accent/10"
        >
          <Plus aria-hidden="true" className="size-4" />
          {addLabel}
        </button>
      </div>
      {count === 0 ? <p className="text-sm text-muted">{empty}</p> : children}
    </GlassCard>
  );
}
