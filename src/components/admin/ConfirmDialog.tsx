"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { adminForms } from "@/content/es/admin-forms";

type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel?: string;
  /** Recibe una función para abrir el diálogo. */
  trigger: (open: () => void) => ReactNode;
  onConfirm: () => Promise<void>;
};

/** Confirmación con <dialog> nativo (foco atrapado, Esc cierra). */
export function ConfirmDialog({
  title,
  body,
  confirmLabel = adminForms.confirm.confirm,
  trigger,
  onConfirm,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => setOpen(false);

  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
      close();
    }
  };

  return (
    <>
      {trigger(() => setOpen(true))}
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        onCancel={(event) => pending && event.preventDefault()}
        onClose={() => setOpen(false)}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-glass-border bg-surface p-6 text-fg shadow-glass backdrop:bg-bg/75"
      >
        <h2 id={titleId} className="heading-4">
          {title}
        </h2>
        <p id={bodyId} className="mt-2 text-sm text-muted">
          {body}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={close} disabled={pending} autoFocus>
            {adminForms.cancel}
          </Button>
          <Button
            onClick={confirm}
            disabled={pending}
            className="bg-red-400 text-bg hover:bg-red-300"
          >
            {pending ? adminForms.confirm.deleting : confirmLabel}
          </Button>
        </div>
      </dialog>
    </>
  );
}
