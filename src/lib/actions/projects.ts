"use server";

import { adminProjects } from "@/content/es/admin-projects";
import { adminForms } from "@/content/es/admin-forms";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateProjects } from "@/lib/revalidate";
import { MEDIA_BUCKET, projectFolder } from "@/lib/storage";
import {
  projectFormData,
  projectSchema,
  type ProjectField,
} from "@/lib/validations/project";
import { deleteById, idSchema, invalid, notFound, setPublishedFlag, unexpected } from "./helpers";
import { moveItem, nextOrder, type MoveDirection } from "./reorder";
import type { ActionResult, FormState } from "./result";

const t = adminProjects.toasts;

export type SaveProjectResult = ActionResult<ProjectField> & { created?: boolean };

export async function saveProject(
  _prev: FormState<ProjectField>,
  formData: FormData,
): Promise<SaveProjectResult> {
  const { supabase } = await requireAdmin();

  const parsed = projectSchema.safeParse(projectFormData(formData));
  if (!parsed.success) return invalid<ProjectField>(parsed.error);
  const input = parsed.data;

  const { data: existing, error: readError } = await supabase
    .from("projects")
    .select("portada_path, galeria_paths")
    .eq("id", input.id)
    .maybeSingle();
  if (readError) return unexpected;

  const { error } = existing
    ? await supabase.from("projects").update(input).eq("id", input.id)
    : await supabase
        .from("projects")
        .insert({ ...input, orden: await nextOrder(supabase, "projects") });

  if (error) {
    if (error.code === "23505") {
      return {
        ok: false,
        error: adminForms.genericError,
        fieldErrors: { slug: [adminForms.validation.slugTaken] },
      };
    }
    return unexpected;
  }

  // Imágenes que dejaron de usarse (portada reemplazada o quitada de la galería).
  if (existing) {
    const kept = new Set([input.portada_path, ...input.galeria_paths]);
    const orphans = [existing.portada_path, ...existing.galeria_paths].filter(
      (path): path is string => Boolean(path) && !kept.has(path),
    );
    if (orphans.length > 0) {
      await supabase.storage.from(MEDIA_BUCKET).remove(orphans);
    }
  }

  revalidateProjects();
  return existing
    ? { ok: true, message: t.saved }
    : { ok: true, message: t.created, created: true };
}

export async function setProjectPublished(id: string, publicado: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await setPublishedFlag(supabase, "projects", id, publicado);
  if (failure) return failure;
  revalidateProjects();
  return { ok: true, message: publicado ? t.published : t.unpublished };
}

export async function setProjectFeatured(id: string, destacado: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success || typeof destacado !== "boolean") return notFound;

  const { data, error } = await supabase.from("projects").update({ destacado }).eq("id", id).select("id");
  if (error) return unexpected;
  if (!data.length) return notFound;

  revalidateProjects();
  return { ok: true, message: destacado ? t.featured : t.unfeatured };
}

export async function moveProject(id: string, direction: MoveDirection): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success) return notFound;

  const { error } = await moveItem(supabase, "projects", id, direction);
  if (error) return unexpected;

  revalidateProjects();
  return { ok: true, message: t.moved };
}

/** Lista todos los archivos de la carpeta del proyecto (portada, galería, contenido). */
async function listProjectFiles(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  id: string,
): Promise<string[] | null> {
  const folder = projectFolder(id);
  const paths: string[] = [];
  for (const dir of [folder, `${folder}/gallery`, `${folder}/content`]) {
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(dir, { limit: 1000 });
    if (error) return null;
    // Las subcarpetas aparecen como entradas sin id.
    for (const entry of data) {
      if (entry.id) paths.push(`${dir}/${entry.name}`);
    }
  }
  return paths;
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await deleteById(supabase, "projects", id);
  if (failure) return failure;

  revalidateProjects();

  // El proyecto ya no existe: si falla la limpieza, se avisa pero no se revierte.
  const files = await listProjectFiles(supabase, id);
  if (files === null) return { ok: true, message: t.deletedFilesWarning };
  if (files.length > 0) {
    const { error: removeError } = await supabase.storage.from(MEDIA_BUCKET).remove(files);
    if (removeError) return { ok: true, message: t.deletedFilesWarning };
  }

  return { ok: true, message: t.deleted };
}
