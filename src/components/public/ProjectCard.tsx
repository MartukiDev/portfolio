import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { publicContent } from "@/content/es/public";
import type { ProjectCardData } from "@/lib/queries/projects";
import { mediaUrl } from "@/lib/storage";

const MAX_STACK = 4;

type ProjectCardProps = {
  project: ProjectCardData;
  priority?: boolean;
  /** h3 bajo un h2 de sección (portada); h2 directo bajo el h1 de la página (/proyectos). */
  headingLevel?: 2 | 3;
};

export function ProjectCard({ project, priority = false, headingLevel = 3 }: ProjectCardProps) {
  const t = publicContent;
  const Title = `h${headingLevel}` as const;
  return (
    <article className="glass-flat group relative flex h-full flex-col overflow-hidden rounded-2xl transition-colors hover:border-white/15 hover:bg-glass-hover">
      <div className="relative aspect-[1200/630] overflow-hidden border-b border-glass-border bg-surface">
        {project.portada_path ? (
          <Image
            src={mediaUrl(project.portada_path)}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <div aria-hidden="true" className="flex size-full items-center justify-center font-mono text-sm text-muted">
            {`~/${project.slug}`}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <Badge>{t.categorias[project.categoria]}</Badge>
          <ArrowUpRight
            aria-hidden="true"
            className="size-5 text-muted transition-colors group-hover:text-accent"
          />
        </div>
        <Title className="heading-4">
          {/* El link cubre toda la tarjeta. */}
          <Link href={`/proyectos/${project.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {project.titulo}
          </Link>
        </Title>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{project.resumen}</p>
        {project.stack.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Stack">
            {project.stack.slice(0, MAX_STACK).map((tech) => (
              <li key={tech} className="rounded-md border border-glass-border px-2 py-0.5 font-mono text-xs text-muted">
                {tech}
              </li>
            ))}
            {project.stack.length > MAX_STACK && (
              <li className="px-1 py-0.5 font-mono text-xs text-muted">+{project.stack.length - MAX_STACK}</li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
}
