import { supabaseUrl } from "@/lib/supabase/env";

export const MEDIA_BUCKET = "public-media";
export const CV_BUCKET = "cv";
/** Nombre estable: el link público del CV no cambia al reemplazarlo. */
export const CV_PATH = "cv.pdf";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const CV_MAX_BYTES = 10 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<(typeof IMAGE_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export function publicUrl(bucket: string, path: string): string {
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${encoded}`;
}

export function mediaUrl(path: string): string {
  return publicUrl(MEDIA_BUCKET, path);
}

export function isImageType(type: string): type is (typeof IMAGE_TYPES)[number] {
  return (IMAGE_TYPES as readonly string[]).includes(type);
}

/** Carpeta de un proyecto en el bucket: todo lo suyo vive aquí. */
export function projectFolder(projectId: string): string {
  return `projects/${projectId}`;
}

export type ProjectImageKind = "cover" | "gallery" | "content";

export function projectImagePath(
  projectId: string,
  kind: ProjectImageKind,
  type: (typeof IMAGE_TYPES)[number],
): string {
  const name = `${crypto.randomUUID()}.${IMAGE_EXTENSIONS[type]}`;
  const folder = projectFolder(projectId);
  return kind === "cover" ? `${folder}/cover-${name}` : `${folder}/${kind}/${name}`;
}
