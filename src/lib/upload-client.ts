import { adminForms } from "@/content/es/admin-forms";
import { createClient } from "@/lib/supabase/client";
import {
  IMAGE_MAX_BYTES,
  isImageType,
  MEDIA_BUCKET,
  projectImagePath,
  type ProjectImageKind,
} from "@/lib/storage";

export type UploadResult = { ok: true; path: string } | { ok: false; error: string };

const t = adminForms.upload;

/**
 * Sube una imagen de proyecto directo desde el navegador a Storage.
 * Las políticas de Storage exigen sesión de admin.
 */
export async function uploadProjectImage(
  projectId: string,
  kind: ProjectImageKind,
  file: File,
): Promise<UploadResult> {
  if (!isImageType(file.type)) return { ok: false, error: t.invalidType };
  if (file.size > IMAGE_MAX_BYTES) return { ok: false, error: t.tooLarge(IMAGE_MAX_BYTES / 1024 / 1024) };

  const path = projectImagePath(projectId, kind, file.type);
  const { error } = await createClient()
    .storage.from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });

  return error ? { ok: false, error: t.failed } : { ok: true, path };
}
