import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import { adminForms } from "@/content/es/admin-forms";

type FormFieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  errors?: readonly string[];
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

/** Etiqueta + control + ayuda + error. El control debe usar `describedBy(id, …)`. */
export function FormField({ id, label, hint, errors, optional, className, children }: FormFieldProps) {
  const error = errors?.[0];
  return (
    <div className={className ? `flex flex-col gap-2 ${className}` : "flex flex-col gap-2"}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="ml-1.5 text-xs font-normal text-muted">({adminForms.optional})</span>}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

/** Props de accesibilidad para el control de un FormField. */
export function fieldA11y(id: string, errors?: readonly string[], hasHint = false) {
  const hasError = Boolean(errors?.length);
  const describedBy = hasError ? `${id}-error` : hasHint ? `${id}-hint` : undefined;
  return {
    id,
    "aria-invalid": hasError || undefined,
    "aria-describedby": describedBy,
  } as const;
}
