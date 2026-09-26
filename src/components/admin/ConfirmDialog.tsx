"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { adminForms } from "@/content/es/admin-forms";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel?: string;
  /** Recibe una función para abrir el diálogo. */
  trigger: (open: () => void) => ReactNode;
  onConfirm: () => Promise<void>;
};

export function ConfirmDialog({
  title,
  body,
  confirmLabel = adminForms.confirm.confirm,
  trigger,
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const titleId = useId();
  const bodyId = useId();

  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
      setOpen(false);
    }
  };

  return (
    <>
      {trigger(() => setOpen(true))}
      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId} describedBy={bodyId} locked={pending}>
        <h2 id={titleId} className="heading-4">
          {title}
        </h2>
        <p id={bodyId} className="mt-2 text-sm text-muted">
          {body}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending} autoFocus>
            {adminForms.cancel}
          </Button>
          <Button onClick={confirm} disabled={pending} className="bg-red-400 text-bg hover:bg-red-300">
            {pending ? adminForms.confirm.deleting : confirmLabel}
          </Button>
        </div>
      </Modal>
    </>
  );
}
