"use server";

import { adminContent } from "@/content/es/admin-content";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateCv } from "@/lib/revalidate";
import { timelineSchema, type TimelineField } from "@/lib/validations/entities";
import { deleteById, formId, idSchema, invalid, notFound, unexpected, writeResult } from "./helpers";
import { moveItem, nextOrder, type MoveDirection } from "./reorder";
import type { ActionResult, FormState } from "./result";

const t = adminContent.timeline.toasts;

export async function saveTimelineItem(
  _prev: FormState<TimelineField>,
  formData: FormData,
): Promise<ActionResult<TimelineField>> {
  const { supabase } = await requireAdmin();
  const id = formId(formData);
  if (id === undefined) return notFound;

  const parsed = timelineSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid<TimelineField>(parsed.error);
  const values = parsed.data;
  const scope = { column: "tipo", value: values.tipo };

  let result: ActionResult;
  if (id) {
    // Si cambia de tipo, pasa al final del nuevo grupo.
    const { data: current } = await supabase.from("timeline_items").select("tipo").eq("id", id).maybeSingle();
    const orden = current && current.tipo !== values.tipo ? await nextOrder(supabase, "timeline_items", scope) : undefined;
    result = writeResult(
      await supabase.from("timeline_items").update({ ...values, ...(orden ? { orden } : {}) }).eq("id", id).select("id"),
      t.saved,
    );
  } else {
    result = writeResult(
      await supabase
        .from("timeline_items")
        .insert({ ...values, orden: await nextOrder(supabase, "timeline_items", scope) }),
      t.created,
    );
  }

  if (result.ok) revalidateCv();
  return result;
}

export async function moveTimelineItem(id: string, direction: MoveDirection): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success) return notFound;

  const { data: item } = await supabase.from("timeline_items").select("tipo").eq("id", id).maybeSingle();
  if (!item) return notFound;

  const { error } = await moveItem(supabase, "timeline_items", id, direction, { column: "tipo", value: item.tipo });
  if (error) return unexpected;
  revalidateCv();
  return { ok: true, message: adminContent.common.moved };
}

export async function deleteTimelineItem(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await deleteById(supabase, "timeline_items", id);
  if (failure) return failure;
  revalidateCv();
  return { ok: true, message: t.deleted };
}
