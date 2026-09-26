"use server";

import { adminContent } from "@/content/es/admin-content";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateServices } from "@/lib/revalidate";
import { serviceSchema, type ServiceField } from "@/lib/validations/entities";
import { deleteById, formId, idSchema, invalid, notFound, setPublishedFlag, unexpected, writeResult } from "./helpers";
import { moveItem, nextOrder, type MoveDirection } from "./reorder";
import type { ActionResult, FormState } from "./result";

const t = adminContent.services.toasts;

export async function saveService(
  _prev: FormState<ServiceField>,
  formData: FormData,
): Promise<ActionResult<ServiceField>> {
  const { supabase } = await requireAdmin();
  const id = formId(formData);
  if (id === undefined) return notFound;

  const parsed = serviceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid<ServiceField>(parsed.error);

  const result = id
    ? writeResult(await supabase.from("services").update(parsed.data).eq("id", id).select("id"), t.saved)
    : writeResult(
        await supabase.from("services").insert({ ...parsed.data, orden: await nextOrder(supabase, "services") }),
        t.created,
      );

  if (result.ok) revalidateServices();
  return result;
}

export async function setServicePublished(id: string, publicado: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await setPublishedFlag(supabase, "services", id, publicado);
  if (failure) return failure;
  revalidateServices();
  return { ok: true, message: publicado ? t.published : t.unpublished };
}

export async function moveService(id: string, direction: MoveDirection): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success) return notFound;
  const { error } = await moveItem(supabase, "services", id, direction);
  if (error) return unexpected;
  revalidateServices();
  return { ok: true, message: adminContent.common.moved };
}

export async function deleteService(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await deleteById(supabase, "services", id);
  if (failure) return failure;
  revalidateServices();
  return { ok: true, message: t.deleted };
}
