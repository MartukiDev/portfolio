"use client";

import { CircleAlert, CircleCheck, X } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { adminForms } from "@/content/es/admin-forms";
import type { ActionResult } from "@/lib/actions/result";
import { cn } from "@/lib/cn";

type Toast = { id: number; ok: boolean; message: string };
type Notify = (result: ActionResult) => void;

const ToastContext = createContext<Notify | null>(null);
const DURATION_MS = 4500;

export function Toaster({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback<Notify>(
    (result) => {
      const id = nextId.current++;
      const message = result.ok ? result.message : result.error;
      setToasts((current) => [...current.slice(-2), { id, ok: result.ok, message }]);
      window.setTimeout(() => dismiss(id), DURATION_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
      >
        {toasts.map((toast) => {
          const Icon = toast.ok ? CircleCheck : CircleAlert;
          return (
            <div
              key={toast.id}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-surface px-4 py-3 text-sm shadow-glass",
                toast.ok ? "border-success/30" : "border-red-400/40",
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn("mt-0.5 size-4 shrink-0", toast.ok ? "text-success" : "text-red-300")}
              />
              <p className="flex-1">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label={adminForms.toastClose}
                className="-m-1 rounded p-1 text-muted hover:text-fg"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): Notify {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error("useToast debe usarse dentro de <Toaster>");
  return notify;
}
