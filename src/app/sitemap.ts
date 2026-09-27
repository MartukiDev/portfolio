import type { MetadataRoute } from "next";
import { getProjectsForSitemap } from "@/lib/queries/projects";
import { absoluteUrl } from "@/lib/site-url";

// Se invalida desde el backoffice con el tag "projects" y revalidatePath("/sitemap.xml").
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectsForSitemap();

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/proyectos"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/servicios"), changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/cv"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/contacto"), changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    ...pages,
    ...projects.map((project) => ({
      url: absoluteUrl(`/proyectos/${project.slug}`),
      lastModified: new Date(project.updated_at),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
