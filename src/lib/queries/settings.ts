import "server-only";
import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { CACHE_TAGS } from "./tags";
import type { Tables } from "@/lib/supabase/database.types";

export type SiteSettings = Tables<"site_settings">;

/**
 * Ajustes públicos del sitio. Se leen al prerenderizar y se invalidan con
 * revalidatePath desde el backoffice. `cache` evita consultas repetidas
 * dentro de un mismo render (layout + página).
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  const { data, error } = await createPublicClient([CACHE_TAGS.settings])
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw new Error(`No se pudieron leer los ajustes: ${error.message}`);
  return data;
});
