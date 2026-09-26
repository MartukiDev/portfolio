"use client";

import { Ban, Search } from "lucide-react";
import { useId, useState } from "react";
import { adminContent } from "@/content/es/admin-content";
import { cn } from "@/lib/cn";
import { serviceIconNames, serviceIcons, type ServiceIconName } from "@/lib/icons";

type IconPickerProps = {
  name: string;
  label: string;
  defaultValue: string | null;
  errors?: readonly string[];
};

const t = adminContent.services.fields;

/** Grilla de íconos como grupo de radios (navegable con flechas). */
export function IconPicker({ name, label, defaultValue, errors }: IconPickerProps) {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<string>(defaultValue ?? "");
  const searchId = useId();
  const errorId = useId();

  const filtered = serviceIconNames.filter((icon) => icon.includes(query.trim().toLowerCase()));
  // El seleccionado siempre visible aunque no calce con la búsqueda.
  const visible: ServiceIconName[] =
    value && !filtered.includes(value as ServiceIconName) && value in serviceIcons
      ? [value as ServiceIconName, ...filtered]
      : filtered;

  const optionClass = (checked: boolean) =>
    cn(
      "flex size-11 cursor-pointer items-center justify-center rounded-xl border transition-colors",
      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
      checked
        ? "border-accent/60 bg-accent/15 text-accent"
        : "border-glass-border text-muted hover:bg-glass-hover hover:text-fg",
    );

  return (
    <fieldset className="flex flex-col gap-3" aria-describedby={errors?.length ? errorId : undefined}>
      <legend className="mb-2 text-sm font-medium">{label}</legend>

      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.iconoSearch}
          aria-label={t.iconoSearch}
          className="glass-flat h-10 w-full rounded-xl pr-3 pl-9 text-sm outline-none placeholder:text-muted focus:border-accent/60"
        />
      </div>

      <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto p-0.5">
        <label className={optionClass(value === "")} title={t.iconoNone}>
          <input
            type="radio"
            name={name}
            value=""
            checked={value === ""}
            onChange={() => setValue("")}
            className="sr-only"
            aria-label={t.iconoNone}
          />
          <Ban aria-hidden="true" className="size-5" />
        </label>
        {visible.map((icon) => {
          const Icon = serviceIcons[icon];
          return (
            <label key={icon} className={optionClass(value === icon)} title={icon}>
              <input
                type="radio"
                name={name}
                value={icon}
                checked={value === icon}
                onChange={() => setValue(icon)}
                className="sr-only"
                aria-label={icon}
              />
              <Icon aria-hidden="true" className="size-5" />
            </label>
          );
        })}
      </div>
      {visible.length === 0 && <p className="text-sm text-muted">{t.iconoEmpty}</p>}
      {errors?.[0] && (
        <p id={errorId} className="text-sm text-red-300">
          {errors[0]}
        </p>
      )}
    </fieldset>
  );
}
