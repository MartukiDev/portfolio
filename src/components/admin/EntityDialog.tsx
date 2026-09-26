"use client";

import { useRouter } from "next/navigation";
import { useActionState, useId, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { adminForms } from "@/content/es/admin-forms";
import type { ActionResult, FormState } from "@/lib/actions/result";
import { Modal } from "./Modal";
import { submitWithoutReset } from "./submit";
import { useToast } from "./Toaster";

type EntityDialogProps<Field extends string> = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** id de la fila a editar; null para crear. */
  id: string | null;
  action: (prev: FormState<Field>, formData: FormData) => Promise<ActionResult<Field>>;
  /** Campos del formulario; reciben los errores de validación por campo. */
  children: (errors: Partial<Record<Field, string[]>> | undefined) => ReactNode;
};

/** Crear/editar una entidad simple en un diálogo. Se cierra al guardar bien. */
export function EntityDialog<Field extends string>(props: EntityDialogProps<Field>) {
  const titleId = useId();
  return (
    <Modal open={props.open} onClose={props.onClose} labelledBy={titleId} className="max-w-xl">
      {/* Montado solo con el diálogo abierto: cada apertura parte con estado limpio. */}
      <EntityForm {...props} titleId={titleId} />
    </Modal>
  );
}

function EntityForm<Field extends string>({
  onClose,
  title,
  titleId,
  id,
  action,
  children,
}: EntityDialogProps<Field> & { titleId: string }) {
  const notify = useToast();
  const router = useRouter();

  const [state, formAction, pending] = useActionState<FormState<Field>, FormData>(async (prev, formData) => {
    const result = await action(prev, formData);
    notify(result);
    if (result.ok) {
      onClose();
      router.refresh();
    }
    return result;
  }, null);

  const errors = state && !state.ok ? state.fieldErrors : undefined;

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="flex flex-col gap-5" noValidate>
      <h2 id={titleId} className="heading-4">
        {title}
      </h2>
      <input type="hidden" name="id" value={id ?? ""} />
      {children(errors)}
      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="ghost" onClick={onClose} disabled={pending}>
          {adminForms.cancel}
        </Button>
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? adminForms.saving : adminForms.save}
        </Button>
      </div>
    </form>
  );
}
