import "server-only";
import { revalidatePath } from "next/cache";

/** Ajustes afectan header, footer, hero, CV y contacto: todo el sitio público. */
export function revalidateSettings(): void {
  revalidatePath("/", "layout");
}

/** Rutas públicas donde aparece un proyecto (incluye el slug anterior si cambió). */
export function revalidateProjects(...slugs: Array<string | null | undefined>): void {
  revalidatePath("/");
  revalidatePath("/proyectos");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs)) {
    if (slug) revalidatePath(`/proyectos/${slug}`);
  }
}
