import type { Metadata } from "next";
import { site } from "@/content/es/site";

type OgImage = { url: string; width: number; height: number; alt: string };

/** Generada por app/opengraph-image.tsx. Se declara explícita: un openGraph propio la reemplazaría. */
const DEFAULT_OG_IMAGE: OgImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.title}: portafolio` };

type PageMetadataInput = {
  title?: string;
  /** Título completo sin la plantilla "· martojs" (p. ej. la portada). */
  absoluteTitle?: string;
  description?: string | null;
  path: string;
  /** Imagen propia (p. ej. portada del proyecto). Sin ella se usa la OG por defecto. */
  image?: OgImage;
  type?: "website" | "article" | "profile";
};

/**
 * Metadata de una página pública. Next reemplaza el objeto openGraph completo
 * en cada nivel, así que aquí siempre va entero (siteName, locale, url…).
 */
export function pageMetadata({ title, absoluteTitle, description, path, image, type = "website" }: PageMetadataInput): Metadata {
  const ogTitle = absoluteTitle ?? (title ? `${title} · ${site.title}` : site.title);
  const desc = description ?? site.description;
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  return {
    ...(absoluteTitle ? { title: { absolute: absoluteTitle } } : title ? { title } : {}),
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.title,
      locale: "es_CL",
      url: path,
      title: ogTitle,
      description: desc,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: desc,
      images: [ogImage.url],
    },
  };
}
