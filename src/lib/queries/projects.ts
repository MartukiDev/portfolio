import "server-only";
import { cache } from "react";
import type { Tables } from "@/lib/supabase/database.types";
import { createPublicClient } from "@/lib/supabase/public";
import { CACHE_TAGS } from "./tags";

export type Project = Tables<"projects">;
export type ProjectCardData = Pick<
  Project,
  "id" | "slug" | "titulo" | "resumen" | "categoria" | "portada_path" | "stack" | "destacado"
>;

const CARD_FIELDS = "id, slug, titulo, resumen, categoria, portada_path, stack, destacado";
const FEATURED_LIMIT = 4;

function fail(what: string, message: string): never {
  // Al lanzar durante una revalidación, Next sigue sirviendo la versión anterior.
  throw new Error(`No se pudieron leer ${what}: ${message}`);
}

export const getPublishedProjects = cache(async (): Promise<ProjectCardData[]> => {
  const { data, error } = await createPublicClient([CACHE_TAGS.projects])
    .from("projects")
    .select(CARD_FIELDS)
    .eq("publicado", true)
    .order("orden")
    .order("id");
  if (error) fail("los proyectos", error.message);
  return data;
});

export const getFeaturedProjects = cache(async (): Promise<ProjectCardData[]> => {
  const { data, error } = await createPublicClient([CACHE_TAGS.projects])
    .from("projects")
    .select(CARD_FIELDS)
    .eq("publicado", true)
    .eq("destacado", true)
    .order("orden")
    .order("id")
    .limit(FEATURED_LIMIT);
  if (error) fail("los proyectos destacados", error.message);
  return data;
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const { data, error } = await createPublicClient([CACHE_TAGS.projects])
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .maybeSingle();
  if (error) fail(`el proyecto ${slug}`, error.message);
  return data;
});

export async function getPublishedProjectSlugs(): Promise<string[]> {
  const { data, error } = await createPublicClient([CACHE_TAGS.projects]).from("projects").select("slug").eq("publicado", true);
  if (error) fail("los slugs de proyectos", error.message);
  return data.map((row) => row.slug);
}
