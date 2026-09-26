import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/queries/tags";

/*
 * Solo se llaman desde server actions del backoffice. updateTag expira al
 * instante los datos etiquetados (y las páginas que los usan): la siguiente
 * visita ve el cambio. revalidatePath además refresca la caché de rutas.
 *
 * Ojo: revalidatePath(ruta, "layout") solo invalida si hay un layout.tsx en
 * ese segmento; las rutas dinámicas del grupo (public) se invalidan con el
 * patrón del archivo de página.
 */

/** Ajustes afectan header, footer, hero, CV y contacto: todo el sitio (layout raíz). */
export function revalidateSettings(): void {
  updateTag(CACHE_TAGS.settings);
  revalidatePath("/", "layout");
}

/** Portada, listado, todos los casos de estudio y sitemap. */
export function revalidateProjects(): void {
  updateTag(CACHE_TAGS.projects);
  revalidatePath("/");
  revalidatePath("/proyectos");
  revalidatePath("/(public)/proyectos/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export function revalidateServices(): void {
  updateTag(CACHE_TAGS.services);
  revalidatePath("/");
  revalidatePath("/servicios");
}

/** Los testimonios aparecen en la portada. */
export function revalidateTestimonials(): void {
  updateTag(CACHE_TAGS.testimonials);
  revalidatePath("/");
}

/** Trayectoria y habilidades viven en /cv. */
export function revalidateCv(): void {
  updateTag(CACHE_TAGS.timeline);
  updateTag(CACHE_TAGS.skills);
  revalidatePath("/cv");
}
