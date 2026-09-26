"use server";

import { adminContent } from "@/content/es/admin-content";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateTestimonials } from "@/lib/revalidate";
import { testimonialSchema, type TestimonialField } from "@/lib/validations/entities";
import { deleteById, formId, idSchema, invalid, notFound, setPublishedFlag, unexpected, writeResult } from "./helpers";
import { moveItem, nextOrder, type MoveDirection } from "./reorder";
import type { ActionResult, FormState } from "./result";

const t = adminContent.testimonials.toasts;

export async function saveTestimonial(
  _prev: FormState<TestimonialField>,
  formData: FormData,
): Promise<ActionResult<TestimonialField>> {
  const { supabase } = await requireAdmin();
  const id = formId(formData);
  if (id === undefined) return notFound;

  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return invalid<TestimonialField>(parsed.error);

  const result = id
    ? writeResult(await supabase.from("testimonials").update(parsed.data).eq("id", id).select("id"), t.saved)
    : writeResult(
        await supabase
          .from("testimonials")
          .insert({ ...parsed.data, orden: await nextOrder(supabase, "testimonials") }),
        t.created,
      );

  if (result.ok) revalidateTestimonials();
  return result;
}

export async function setTestimonialPublished(id: string, publicado: boolean): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await setPublishedFlag(supabase, "testimonials", id, publicado);
  if (failure) return failure;
  revalidateTestimonials();
  return { ok: true, message: publicado ? t.published : t.unpublished };
}

export async function moveTestimonial(id: string, direction: MoveDirection): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  if (!idSchema.safeParse(id).success) return notFound;
  const { error } = await moveItem(supabase, "testimonials", id, direction);
  if (error) return unexpected;
  revalidateTestimonials();
  return { ok: true, message: adminContent.common.moved };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const { supabase } = await requireAdmin();
  const failure = await deleteById(supabase, "testimonials", id);
  if (failure) return failure;
  revalidateTestimonials();
  return { ok: true, message: t.deleted };
}
