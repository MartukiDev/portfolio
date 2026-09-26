import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/cn";
import type { Service } from "@/lib/queries/content";

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  return (
    <article className="glass-flat flex h-full flex-col gap-4 rounded-2xl p-6">
      <span className="flex size-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
        <ServiceIcon name={service.icono} className="size-5" />
      </span>
      <h3 className="heading-4">{service.titulo}</h3>
      <p className={cn("text-sm leading-relaxed text-muted", compact && "line-clamp-3")}>{service.descripcion}</p>
    </article>
  );
}
