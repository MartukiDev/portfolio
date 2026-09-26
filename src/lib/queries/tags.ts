/**
 * Tags de caché por entidad. Cada lectura pública de Supabase se etiqueta y
 * las server actions del backoffice los expiran con updateTag: así la caché
 * de datos de Next (que sobrevive entre builds) nunca queda desactualizada.
 */
export const CACHE_TAGS = {
  settings: "settings",
  projects: "projects",
  services: "services",
  testimonials: "testimonials",
  timeline: "timeline",
  skills: "skills",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
