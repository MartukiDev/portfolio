"use client";

import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition, type ReactNode } from "react";
import { Switch } from "@/components/ui/Switch";
import { adminContent } from "@/content/es/admin-content";
import type { MoveDirection } from "@/lib/actions/reorder";
import type { ActionResult } from "@/lib/actions/result";
import { cn } from "@/lib/cn";
import { ConfirmDialog } from "./ConfirmDialog";
import { useToast } from "./Toaster";

type BooleanKey<T> = { [K in keyof T]: T[K] extends boolean ? K : never }[keyof T] & string;

export type ListToggle<T> = {
  key: BooleanKey<T>;
  label: string;
  ariaLabel: (label: string) => string;
  action: (id: string, value: boolean) => Promise<ActionResult>;
};

type EditTarget<T> = { href: (item: T) => string } | { onEdit: (item: T) => void };

type SortableListProps<T extends { id: string }> = {
  items: readonly T[];
  getLabel: (item: T) => string;
  renderContent: (item: T) => ReactNode;
  onMove: (id: string, direction: MoveDirection) => Promise<ActionResult>;
  onDelete: (id: string) => Promise<ActionResult>;
  deleteConfirm?: { title: (label: string) => string; body: string };
  toggles?: readonly ListToggle<T>[];
  edit: EditTarget<T>;
  /** Botones de editar/borrar solo con ícono, para listas en columnas angostas. */
  compact?: boolean;
};

type Patch = { id: string; key: string; value: boolean };

const t = adminContent.common;

/**
 * Lista ordenable del backoffice: subir/bajar, interruptores (publicado,
 * destacado…) con UI optimista, editar y borrar con confirmación.
 */
export function SortableList<T extends { id: string }>({
  items,
  getLabel,
  renderContent,
  onMove,
  onDelete,
  deleteConfirm = { title: t.deleteTitle, body: t.deleteBody },
  toggles = [],
  edit,
  compact = false,
}: SortableListProps<T>) {
  const notify = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimistic, applyPatch] = useOptimistic(items, (current, patch: Patch) =>
    current.map((item) => (item.id === patch.id ? { ...item, [patch.key]: patch.value } : item)),
  );

  const run = (action: () => Promise<ActionResult>, patch?: Patch) => {
    startTransition(async () => {
      if (patch) applyPatch(patch);
      notify(await action());
      router.refresh();
    });
  };

  const actionClass = cn(
    "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full text-sm text-muted transition-colors hover:bg-glass-hover hover:text-fg disabled:opacity-50",
    compact ? "w-9 justify-center" : "px-3",
  );

  return (
    <ul className="flex flex-col divide-y divide-glass-border" aria-busy={pending}>
      {optimistic.map((item, index) => {
        const label = getLabel(item);
        return (
          <li
            key={item.id}
            className={cn(
              "grid items-center gap-x-4 gap-y-3 py-4 first:pt-0 last:pb-0",
              compact ? "grid-cols-[auto_1fr_auto] gap-x-3 py-3" : "grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto_auto]",
            )}
          >
            <div className={cn("flex flex-col gap-1", !compact && "row-span-2 md:row-span-1")}>
              <OrderButton
                label={t.moveUp(label)}
                disabled={pending || index === 0}
                onClick={() => run(() => onMove(item.id, "up"))}
              >
                <ArrowUp aria-hidden="true" className="size-4" />
              </OrderButton>
              <OrderButton
                label={t.moveDown(label)}
                disabled={pending || index === optimistic.length - 1}
                onClick={() => run(() => onMove(item.id, "down"))}
              >
                <ArrowDown aria-hidden="true" className="size-4" />
              </OrderButton>
            </div>

            <div className="min-w-0 break-words">{renderContent(item)}</div>

            {toggles.length > 0 && (
              <div className="col-start-2 flex flex-wrap items-center gap-5 md:col-start-auto">
                {toggles.map((toggle) => {
                  const checked = Boolean(item[toggle.key]);
                  return (
                    <label key={toggle.key} className="flex items-center gap-2 text-xs text-muted">
                      <Switch
                        checked={checked}
                        disabled={pending}
                        aria-label={toggle.ariaLabel(label)}
                        onChange={(event) => {
                          const value = event.target.checked;
                          run(() => toggle.action(item.id, value), { id: item.id, key: toggle.key, value });
                        }}
                      />
                      <span aria-hidden="true">{toggle.label}</span>
                    </label>
                  );
                })}
              </div>
            )}

            <div
              className={cn(
                "flex items-center gap-1",
                !compact && "col-start-2 md:col-start-auto md:justify-end",
                !compact && toggles.length === 0 && "md:col-span-2",
              )}
            >
              {"href" in edit ? (
                <Link href={edit.href(item)} className={actionClass} aria-label={compact ? `${t.edit} ${label}` : undefined} title={t.edit}>
                  <Pencil aria-hidden="true" className="size-4" />
                  {!compact && t.edit}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => edit.onEdit(item)}
                  disabled={pending}
                  className={actionClass}
                  aria-label={compact ? `${t.edit} ${label}` : undefined}
                  title={t.edit}
                >
                  <Pencil aria-hidden="true" className="size-4" />
                  {!compact && t.edit}
                </button>
              )}
              <ConfirmDialog
                title={deleteConfirm.title(label)}
                body={deleteConfirm.body}
                onConfirm={async () => {
                  notify(await onDelete(item.id));
                  router.refresh();
                }}
                trigger={(open) => (
                  <button
                    type="button"
                    onClick={open}
                    disabled={pending}
                    aria-label={compact ? `${t.delete} ${label}` : undefined}
                    title={t.delete}
                    className={cn(actionClass, "hover:bg-red-400/10 hover:text-red-300")}
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    {!compact && t.delete}
                  </button>
                )}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function OrderButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-glass-hover hover:text-fg disabled:pointer-events-none disabled:opacity-25"
    >
      {children}
    </button>
  );
}
