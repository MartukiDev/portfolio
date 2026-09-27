import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { cn } from "@/lib/cn";
import type { Service } from "@/lib/queries/content";

type ServiceCardProps = {
  service: Service;
  compact?: boolean;
  /** h3 bajo un h2 de sección (portada); h2 directo bajo el h1 de la página (/servicios). */
  headingLevel?: 2 | 3;
};

export function ServiceCard({ service, compact = false, headingLevel = 3 }: ServiceCardProps) {
  const Title = `h${headingLevel}` as const;
  return (
    <article className="glass-flat flex h-full flex-col gap-4 rounded-2xl p-6">
      <span className="flex size-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
        <ServiceIcon name={service.icono} className="size-5" />
      </span>
      <Title className="heading-4">{service.titulo}</Title>
      <p className={cn("text-sm leading-relaxed text-muted", compact && "line-clamp-3")}>{service.descripcion}</p>
    </article>
  );
}
