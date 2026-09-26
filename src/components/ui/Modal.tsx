"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  /** Impide cerrar con Esc (p. ej. mientras se guarda). */
  locked?: boolean;
  className?: string;
  children: ReactNode;
};

/** <dialog> nativo controlado: foco atrapado, Esc cierra, fondo inerte. */
export function Modal({ open, onClose, labelledBy, describedBy, locked, className, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(event) => {
        event.preventDefault();
        if (!locked) onClose();
      }}
      onClose={onClose}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-glass-border bg-surface p-6 text-fg shadow-glass backdrop:bg-bg/75",
        className ?? "max-w-md",
      )}
    >
      {open && children}
    </dialog>
  );
}
