"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { adminContent } from "@/content/es/admin-content";
import { deleteTimelineItem, moveTimelineItem, saveTimelineItem } from "@/lib/actions/timeline";
import { formatPeriod } from "@/lib/format";
import type { Tables } from "@/lib/supabase/database.types";
import { tiposTrayectoria, type TimelineField } from "@/lib/validations/entities";
import { EntityDialog } from "./EntityDialog";
import { fieldA11y, FormField } from "./FormField";
import { GroupedSection } from "./GroupedSection";
import { SortableList } from "./SortableList";
import { useEntityEditor } from "./useEntityEditor";

type TimelineItem = Tables<"timeline_items">;
type Tipo = TimelineItem["tipo"];

const t = adminContent.timeline;
const c = adminContent.common;

export function TimelineManager({ items }: { items: TimelineItem[] }) {
  const editor = useEntityEditor<TimelineItem, { tipo: Tipo }>();
  const current = editor.state.mode === "edit" ? editor.state.item : null;
  const defaultTipo = editor.state.mode === "create" ? editor.state.defaults.tipo : (current?.tipo ?? "formacion");

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-2">
        {tiposTrayectoria.map((tipo) => {
          const group = items.filter((item) => item.tipo === tipo);
          return (
            <GroupedSection
              key={tipo}
              title={t.tipos[tipo]}
              count={group.length}
              addLabel={c.add}
              onAdd={() => editor.create({ tipo })}
              empty={t.emptyGroup}
            >
              <SortableList
                items={group}
                getLabel={(item) => item.titulo}
                onMove={moveTimelineItem}
                onDelete={deleteTimelineItem}
                edit={{ onEdit: editor.edit }}
                compact
                renderContent={(item) => (
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="font-medium">{item.titulo}</span>
                    {item.organizacion && <span className="text-sm text-muted">{item.organizacion}</span>}
                    <span className="font-mono text-xs text-muted">{formatPeriod(item.inicio, item.fin, t.current)}</span>
                  </div>
                )}
              />
            </GroupedSection>
          );
        })}
      </div>

      <EntityDialog
        open={editor.open}
        onClose={editor.close}
        title={current ? t.editTitle : t.newTitle}
        id={current?.id ?? null}
        action={saveTimelineItem}
      >
        {(errors) => <TimelineFields item={current} defaultTipo={defaultTipo} errors={errors} />}
      </EntityDialog>
    </>
  );
}

function TimelineFields({
  item,
  defaultTipo,
  errors,
}: {
  item: TimelineItem | null;
  defaultTipo: Tipo;
  errors: Partial<Record<TimelineField, string[]>> | undefined;
}) {
  const f = t.fields;
  // Ítem existente sin fecha de fin = actual. En uno nuevo, también por defecto.
  const [actual, setActual] = useState(item ? item.fin === null : true);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="tipo" label={f.tipo} errors={errors?.tipo}>
          <Select {...fieldA11y("tipo", errors?.tipo)} name="tipo" defaultValue={defaultTipo}>
            {tiposTrayectoria.map((tipo) => (
              <option key={tipo} value={tipo}>
                {t.tipos[tipo]}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="organizacion" label={f.organizacion} errors={errors?.organizacion} optional>
          <Input {...fieldA11y("organizacion", errors?.organizacion)} name="organizacion" defaultValue={item?.organizacion ?? ""} maxLength={160} />
        </FormField>
      </div>
      <FormField id="titulo" label={f.titulo} errors={errors?.titulo}>
        <Input {...fieldA11y("titulo", errors?.titulo)} name="titulo" defaultValue={item?.titulo ?? ""} maxLength={160} autoFocus />
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="inicio" label={f.inicio} errors={errors?.inicio} optional>
          <Input {...fieldA11y("inicio", errors?.inicio)} name="inicio" type="date" defaultValue={item?.inicio ?? ""} />
        </FormField>
        <FormField id="fin" label={f.fin} errors={errors?.fin} optional={!actual}>
          <Input
            {...fieldA11y("fin", errors?.fin)}
            name="fin"
            type="date"
            defaultValue={item?.fin ?? ""}
            disabled={actual}
          />
        </FormField>
      </div>
      <label className="flex items-center justify-between gap-4">
        <span className="text-sm">{f.actual}</span>
        <Switch name="actual" checked={actual} onChange={(event) => setActual(event.target.checked)} />
      </label>
      <FormField id="descripcion" label={f.descripcion} errors={errors?.descripcion} optional>
        <Textarea {...fieldA11y("descripcion", errors?.descripcion)} name="descripcion" defaultValue={item?.descripcion ?? ""} rows={4} maxLength={1000} />
      </FormField>
    </>
  );
}
