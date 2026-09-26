"use client";

import { ArrowDown, ArrowUp, Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { adminProjects } from "@/content/es/admin-projects";
import {
  deleteProject,
  moveProject,
  setProjectFeatured,
  setProjectPublished,
} from "@/lib/actions/projects";
import type { ActionResult } from "@/lib/actions/result";
import { cn } from "@/lib/cn";
import type { Tables } from "@/lib/supabase/database.types";
import { mediaUrl } from "@/lib/storage";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toaster";

export type ProjectListItem = Pick<
  Tables<"projects">,
  "id" | "titulo" | "slug" | "categoria" | "publicado" | "destacado" | "portada_path"
>;

type Patch = { id: string } & Partial<Pick<ProjectListItem, "publicado" | "destacado">>;

export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  const t = adminProjects.list;
  const notify = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimistic, applyPatch] = useOptimistic(projects, (current, patch: Patch) =>
    current.map((project) => (project.id === patch.id ? { ...project, ...patch } : project)),
  );

  const run = (action: () => Promise<ActionResult>, patch?: Patch) => {
    startTransition(async () => {
      if (patch) applyPatch(patch);
      const result = await action();
      notify(result);
      router.refresh();
    });
  };

  return (
    <ul className="flex flex-col divide-y divide-glass-border" aria-busy={pending}>
      {optimistic.map((project, index) => (
        <li
          key={project.id}
          className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 py-4 first:pt-0 last:pb-0 md:grid-cols-[auto_1fr_auto_auto_auto]"
        >
          {/* Orden */}
          <div className="row-span-2 flex flex-col gap-1 md:row-span-1">
            <OrderButton
              label={t.moveUp(project.titulo)}
              disabled={pending || index === 0}
              onClick={() => run(() => moveProject(project.id, "up"))}
            >
              <ArrowUp aria-hidden="true" className="size-4" />
            </OrderButton>
            <OrderButton
              label={t.moveDown(project.titulo)}
              disabled={pending || index === optimistic.length - 1}
              onClick={() => run(() => moveProject(project.id, "down"))}
            >
              <ArrowDown aria-hidden="true" className="size-4" />
            </OrderButton>
          </div>

          {/* Proyecto */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="glass-flat relative hidden aspect-[1200/630] w-24 shrink-0 overflow-hidden rounded-lg sm:block">
              {project.portada_path && (
                <Image src={mediaUrl(project.portada_path)} alt="" fill unoptimized className="object-cover" />
              )}
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <Link
                href={`/admin/proyectos/${project.id}`}
                className="truncate font-medium hover:text-accent"
              >
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

          {/* Toggles */}
          <div className="col-start-2 flex items-center gap-5 md:col-start-auto">
            <label className="flex items-center gap-2 text-xs text-muted">
              <Switch
                checked={project.publicado}
                disabled={pending}
                aria-label={t.togglePublished(project.titulo)}
                onChange={(event) => {
                  const publicado = event.target.checked;
                  run(() => setProjectPublished(project.id, publicado), { id: project.id, publicado });
                }}
              />
              <span aria-hidden="true">{t.headers.published}</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-muted">
              <Switch
                checked={project.destacado}
                disabled={pending}
                aria-label={t.toggleFeatured(project.titulo)}
                onChange={(event) => {
                  const destacado = event.target.checked;
                  run(() => setProjectFeatured(project.id, destacado), { id: project.id, destacado });
                }}
              />
              <span aria-hidden="true">{t.headers.featured}</span>
            </label>
          </div>

          {/* Acciones */}
          <div className="col-start-2 flex items-center gap-1 md:col-start-auto md:col-span-2 md:justify-end">
            <Link
              href={`/admin/proyectos/${project.id}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted hover:bg-glass-hover hover:text-fg"
            >
              <Pencil aria-hidden="true" className="size-4" />
              {t.edit}
            </Link>
            <ConfirmDialog
              title={adminProjects.deleteConfirm.title(project.titulo)}
              body={adminProjects.deleteConfirm.body}
              onConfirm={async () => {
                const result = await deleteProject(project.id);
                notify(result);
                router.refresh();
              }}
              trigger={(open) => (
                <button
                  type="button"
                  onClick={open}
                  disabled={pending}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm text-muted hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                  {t.delete}
                </button>
              )}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function OrderButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors",
        "hover:bg-glass-hover hover:text-fg disabled:pointer-events-none disabled:opacity-25",
      )}
    >
      {children}
    </button>
  );
}
