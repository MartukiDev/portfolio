"use server";

import { z } from "zod";
import { adminForms } from "@/content/es/admin-forms";
import { adminSettings } from "@/content/es/admin-settings";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateSettings } from "@/lib/revalidate";
import { CV_BUCKET, CV_PATH } from "@/lib/storage";
import { settingsSchema, type SettingsField } from "@/lib/validations/settings";
import type { ActionResult, FormState } from "./result";

export async function updateSettings(
  _prev: FormState<SettingsField>,
  formData: FormData,
): Promise<ActionResult<SettingsField>> {
  const { supabase } = await requireAdmin();

  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: adminForms.genericError,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...parsed.data }, { onConflict: "id" });
  if (error) return { ok: false, error: adminForms.unexpectedError };

  revalidateSettings();
  return { ok: true, message: adminSettings.saved };
}

/** Registra el CV después de que el navegador lo subió a Storage. */
export async function setCvPath(): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { data: files, error: listError } = await supabase.storage
    .from(CV_BUCKET)
    .list("", { search: CV_PATH });
  if (listError || !files?.some((file) => file.name === CV_PATH)) {
    return { ok: false, error: adminForms.upload.failed };
  }

  const { error } = await supabase
    .from("site_settings")
    .update({ cv_pdf_path: CV_PATH })
    .eq("id", 1);
  if (error) return { ok: false, error: adminForms.unexpectedError };

  revalidateSettings();
  return { ok: true, message: adminSettings.cv.uploaded };
}

export async function removeCv(): Promise<ActionResult> {
  const { supabase } = await requireAdmin();

  const { error: storageError } = await supabase.storage.from(CV_BUCKET).remove([CV_PATH]);
  if (storageError) return { ok: false, error: adminForms.unexpectedError };

  const { error } = await supabase.from("site_settings").update({ cv_pdf_path: null }).eq("id", 1);
  if (error) return { ok: false, error: adminForms.unexpectedError };

  revalidateSettings();
  return { ok: true, message: adminSettings.cv.removed };
}
