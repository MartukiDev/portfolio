"use client";

import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { adminContent } from "@/content/es/admin-content";
import { deleteMessage, setMessageRead } from "@/lib/actions/messages";
import { cn } from "@/lib/cn";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toaster";

const t = adminContent.messages;

type MessageActionsProps = {
  id: string;
  leido: boolean;
  /** A dónde ir tras borrar (en el detalle, volver a la bandeja). */
  afterDeleteHref?: string;
  compact?: boolean;
};

export function MessageActions({ id, leido, afterDeleteHref, compact = false }: MessageActionsProps) {
  const notify = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const buttonClass = cn(
    "inline-flex h-9 items-center gap-1.5 rounded-full text-sm text-muted transition-colors hover:bg-glass-hover hover:text-fg disabled:opacity-50",
    compact ? "w-9 justify-center" : "px-3",
  );
  const ReadIcon = leido ? Mail : MailOpen;
  const readLabel = leido ? t.markUnread : t.markRead;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={pending}
        aria-label={compact ? readLabel : undefined}
        title={readLabel}
        className={buttonClass}
        onClick={() =>
          startTransition(async () => {
            notify(await setMessageRead(id, !leido));
            router.refresh();
          })
        }
      >
        <ReadIcon aria-hidden="true" className="size-4" />
        {!compact && readLabel}
      </button>
      <ConfirmDialog
        title={t.deleteTitle}
        body={t.deleteBody}
        onConfirm={async () => {
          const result = await deleteMessage(id);
          notify(result);
          if (result.ok && afterDeleteHref) router.replace(afterDeleteHref);
          else router.refresh();
        }}
        trigger={(open) => (
          <button
            type="button"
            onClick={open}
            disabled={pending}
            aria-label={compact ? adminContent.common.delete : undefined}
            title={adminContent.common.delete}
            className={cn(buttonClass, "hover:bg-red-400/10 hover:text-red-300")}
          >
            <Trash2 aria-hidden="true" className="size-4" />
            {!compact && adminContent.common.delete}
          </button>
        )}
      />
    </div>
  );
}

/**
 * Marca el mensaje como leído al abrir el detalle. Se hace en el cliente
 * (no en el render del servidor) para que el prefetch de links no lo marque.
 */
export function MarkAsReadOnOpen({ id, leido }: { id: string; leido: boolean }) {
  const router = useRouter();
  // Se decide una sola vez, con el estado al abrir: si después se marca como
  // no leído desde esta misma vista, no se vuelve a marcar solo.
  const [unreadOnOpen] = useState(!leido);

  useEffect(() => {
    if (!unreadOnOpen) return;
    void setMessageRead(id, true).then((result) => {
      if (result.ok) router.refresh();
    });
  }, [id, unreadOnOpen, router]);

  return null;
}
