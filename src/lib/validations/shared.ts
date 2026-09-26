import { z } from "zod";

/** Recorta strings y convierte "" en null antes de validar. */
function blankToNull(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export function optionalText(max: number, message: string) {
  return z.preprocess(blankToNull, z.string().max(max, { error: message }).nullable());
}

export function requiredText(max: number, messages: { required: string; max: string }) {
  return z.preprocess(
    blankToNull,
    z
      .string({ error: messages.required })
      .min(1, { error: messages.required })
      .max(max, { error: messages.max }),
  );
}

export function optionalUrl(message: string) {
  return z.preprocess(
    blankToNull,
    z.url({ protocol: /^https?$/, error: message }).nullable(),
  );
}

/** Checkbox de formulario: presente ("on") = true. */
export const checkbox = z.preprocess((value) => value === "on" || value === "true", z.boolean());

/** Documento Tiptap enviado como JSON en un input oculto; vacío = null. */
export const tiptapDoc = z.preprocess(
  (value) => {
    if (typeof value !== "string" || value.trim() === "") return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  z
    .object({
      type: z.literal("doc"),
      content: z.array(z.json()).optional(),
    })
    .nullable(),
);

export type FieldErrors<K extends string> = Partial<Record<K, string[]>>;
