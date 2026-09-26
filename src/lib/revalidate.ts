import "server-only";
import { revalidatePath } from "next/cache";

/** Ajustes afectan header, footer, hero, CV y contacto: todo el sitio público. */
export function revalidateSettings(): void {
  revalidatePath("/", "layout");
}

/** Rutas públicas donde aparecen proyectos: portada, listado, todos los casos de estudio y sitemap. */
export function revalidateProjects(): void {
  revalidatePath("/");
  revalidatePath("/proyectos", "layout");
  revalidatePath("/sitemap.xml");
}

export function revalidateServices(): void {
  revalidatePath("/");
  revalidatePath("/servicios");
}

/** Los testimonios aparecen en la portada y pueden mostrarse en su caso de estudio. */
export function revalidateTestimonials(): void {
  revalidatePath("/");
  revalidatePath("/proyectos", "layout");
}

/** Trayectoria y habilidades viven en /cv. */
export function revalidateCv(): void {
  revalidatePath("/cv");
}
