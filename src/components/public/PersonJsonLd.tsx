import type { Skill } from "@/lib/queries/content";
import type { SiteSettings } from "@/lib/queries/settings";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

/** Datos estructurados schema.org/Person para la portada. */
export function PersonJsonLd({ settings, skills }: { settings: SiteSettings; skills: Skill[] }) {
  const sameAs = [settings.github_url, settings.linkedin_url].filter((url): url is string => Boolean(url));

  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.nombre,
    url: siteUrl,
    image: absoluteUrl("/opengraph-image"),
    ...(settings.tagline ? { jobTitle: settings.tagline } : {}),
    ...(settings.hero_descripcion ? { description: settings.hero_descripcion } : {}),
    ...(settings.email ? { email: `mailto:${settings.email}` } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(skills.length > 0 ? { knowsAbout: skills.map((skill) => skill.nombre) } : {}),
  };

  // "<" escapado: el contenido editable no puede cerrar el <script>.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
