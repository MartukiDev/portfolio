import "server-only";
import { z, type ZodError } from "zod";
import { adminForms } from "@/content/es/admin-forms";
import type { requireAdmin } from "@/lib/auth/require-admin";
import type { OrderedTable } from "./reorder";
import type { ActionResult } from "./result";

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];
type PublishableTable = "projects" | "services" | "testimonials";

export const idSchema = z.uuid();

export const notFound = { ok: false, error: adminForms.notFound } as const;
export const unexpected = { ok: false, error: adminForms.unexpectedError } as const;

/** Resultado de validación fallida con errores por campo. */
export function invalid<Field extends string>(error: ZodError): ActionResult<Field> {
  return {
    ok: false,
    error: adminForms.genericError,
    fieldErrors: z.flattenError(error).fieldErrors as Partial<Record<Field, string[]>>,
  };
}

/** Lee un id opcional del FormData ("" = crear). */
export function formId(formData: FormData): string | null | undefined {
  const value = formData.get("id");
  if (typeof value !== "string" || value === "") return null;
  return idSchema.safeParse(value).success ? value : undefined;
}

export async function setPublishedFlag(
  supabase: Supabase,
  table: PublishableTable,
  id: string,
  publicado: unknown,
): Promise<ActionResult | null> {
  if (!idSchema.safeParse(id).success || typeof publicado !== "boolean") return notFound;
  const { data, error } = await supabase.from(table).update({ publicado }).eq("id", id).select("id");
  if (error) return unexpected;
  if (!data.length) return notFound;
  return null;
}

export async function deleteById(
  supabase: Supabase,
  table: OrderedTable | "messages",
  id: string,
): Promise<ActionResult | null> {
  if (!idSchema.safeParse(id).success) return notFound;
  const { data, error } = await supabase.from(table).delete().eq("id", id).select("id");
  if (error) return unexpected;
  if (!data.length) return notFound;
  return null;
}

/** Resultado de una escritura update(...).select("id"): error, no encontrado u ok. */
export function writeResult(
  result: { error: unknown; data?: unknown[] | null },
  message: string,
): ActionResult {
  if (result.error) return unexpected;
  if (result.data && result.data.length === 0) return notFound;
  return { ok: true, message };
}
