"use server";

import { adminContent } from "@/content/es/admin-content";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateCv } from "@/lib/revalidate";
import { skillSchema, type SkillField } from "@/lib/validations/entities";
import { deleteById, formId, idSchema, invalid, notFound, unexpected, writeResult } from "./helpers";
import { moveItem, nextOrder, type MoveDirection } from "./reorder";
import type { ActionResult, FormState } from "./result";

const t = adminContent.skills.toasts;

export async function saveSkill(
  _prev: FormState<SkillField>,
  formData: FormData,
): Promise<ActionResult<SkillField>> {
  const { supabase } = await requireAdmin();
  const id = formId(formData);
  if (id === undefined) return notFound;

  const parsed = skillSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid<SkillField>(parsed.error);
  const values = parsed.data;
  const scope = { column: "area", value: values.area };

  let result: ActionResult;
  if (id) {
    // Si cambia de área, pasa al final de la nueva.
    const { data: current } = await supabase.from("skills").select("area").eq("id", id).maybeSingle();
    const orden = current && current.area !== values.area ? await nextOrder(supabase, "skills", scope) : undefined;
    result = writeResult(
      await supabase.from("skills").update({ ...values, ...(orden ? { orden } : {}) }).eq("id", id).select("id"),
      t.saved,
    );
  } else {
    result = writeResult(
      await supabase.from("skills").insert({ ...values, orden: await nextOrder(supabase, "skills", scope) }),
      t.created,
    );
  }

  if (result.ok) revalidateCv();
  return result;
}

export async function moveSkill(id: string, direction: MoveDirection): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success) return notFound;

  const { data: skill } = await supabase.from("skills").select("area").eq("id", id).maybeSingle();
  if (!skill) return notFound;

  const { error } = await moveItem(supabase, "skills", id, direction, { column: "area", value: skill.area });
  if (error) return unexpected;
  revalidateCv();
  return { ok: true, message: adminContent.common.moved };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await deleteById(supabase, "skills", id);
  if (failure) return failure;
  revalidateCv();
  return { ok: true, message: t.deleted };
}
