"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { publicContent } from "@/content/es/public";
import { cn } from "@/lib/cn";
import type { ProjectCardData } from "@/lib/queries/projects";
import { EmptyState } from "./EmptyState";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

const categorias = ["cliente", "propio", "academico"] as const;
type Categoria = (typeof categorias)[number];

function parseCategoria(value: string | null): Categoria | null {
  return categorias.find((categoria) => categoria === value) ?? null;
}

const t = publicContent.projects;
const ABOVE_THE_FOLD = 2;

/**
 * Filtro por categoría en el cliente (?categoria=): la página sigue siendo
 * estática y los links filtrados se pueden compartir.
 */
export function ProjectExplorer({ projects }: { projects: ProjectCardData[] }) {
  const active = parseCategoria(useSearchParams().get("categoria"));
  return <ProjectGrid projects={projects} active={active} />;
}

/** Grilla sin leer la URL: fallback mientras se hidrata el filtro. */
export function ProjectGrid({ projects, active }: { projects: ProjectCardData[]; active: Categoria | null }) {
  const available = categorias.filter((categoria) => projects.some((project) => project.categoria === categoria));
  const visible = active ? projects.filter((project) => project.categoria === active) : projects;

  const chip = (isActive: boolean) =>
    cn(
      "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors",
      isActive ? "border-accent/50 bg-accent/10 text-accent" : "border-glass-border text-muted hover:text-fg",
    );

  return (
    <div className="flex flex-col gap-8">
      {available.length > 1 && (
        <nav aria-label={t.filterLabel}>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/proyectos" scroll={false} className={chip(!active)} aria-current={!active ? "page" : undefined}>
                {t.all}
              </Link>
            </li>
            {available.map((categoria) => (
              <li key={categoria}>
                <Link
                  href={`/proyectos?categoria=${categoria}`}
                  scroll={false}
                  className={chip(active === categoria)}
                  aria-current={active === categoria ? "page" : undefined}
                >
                  {publicContent.categorias[categoria]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {visible.length === 0 ? (
        <EmptyState
          command={t.emptyFilter.command(active ?? "")}
          output={t.emptyFilter.output}
          message={t.emptyFilter.message}
          action={
            <Link href="/proyectos" className="self-start text-sm text-accent hover:underline">
              {t.emptyFilter.reset}
            </Link>
          }
        />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {visible.map((project, index) => (
            <li key={project.id}>
              {/* Las dos primeras están sobre el pliegue (candidatas a LCP): sin animación de entrada. */}
              {index < ABOVE_THE_FOLD ? (
                <ProjectCard project={project} priority headingLevel={2} />
              ) : (
                <Reveal delay={(index % 2) * 0.08} className="h-full">
                  <ProjectCard project={project} headingLevel={2} />
                </Reveal>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
