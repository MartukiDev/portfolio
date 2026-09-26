export type ActionResult<Field extends string = string> =
  | { ok: true; message: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<Field, string[]>> };

/** Estado inicial para useActionState. */
export type FormState<Field extends string = string> = ActionResult<Field> | null;
