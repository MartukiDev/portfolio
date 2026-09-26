"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { adminProjects } from "@/content/es/admin-projects";
import {
  deleteProject,
  moveProject,
  setProjectFeatured,
  setProjectPublished,
} from "@/lib/actions/projects";
import type { Tables } from "@/lib/supabase/database.types";
import { mediaUrl } from "@/lib/storage";
import { SortableList } from "./SortableList";

export type ProjectListItem = Pick<
  Tables<"projects">,
  "id" | "titulo" | "slug" | "categoria" | "publicado" | "destacado" | "portada_path"
>;

const t = adminProjects.list;

export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  return (
    <SortableList
      items={projects}
      getLabel={(project) => project.titulo}
      onMove={moveProject}
      onDelete={deleteProject}
      deleteConfirm={{ title: adminProjects.deleteConfirm.title, body: adminProjects.deleteConfirm.body }}
      edit={{ href: (project) => `/admin/proyectos/${project.id}` }}
      toggles={[
        { key: "publicado", label: t.headers.published, ariaLabel: t.togglePublished, action: setProjectPublished },
        { key: "destacado", label: t.headers.featured, ariaLabel: t.toggleFeatured, action: setProjectFeatured },
      ]}
      renderContent={(project) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="glass-flat relative hidden aspect-[1200/630] w-24 shrink-0 overflow-hidden rounded-lg sm:block">
            {project.portada_path && (
              <Image src={mediaUrl(project.portada_path)} alt="" fill unoptimized className="object-cover" />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Link href={`/admin/proyectos/${project.id}`} className="truncate font-medium hover:text-accent">
              {project.titulo}
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{adminProjects.categorias[project.categoria]}</Badge>
              <Badge variant={project.publicado ? "available" : "default"}>
                {project.publicado ? t.published : t.draft}
              </Badge>
              {project.destacado && (
                <Badge variant="accent">
                  <Star aria-hidden="true" className="size-3" />
                  {t.featured}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}
