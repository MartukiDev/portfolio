"use client";

import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { Textarea } from "@/components/ui/Textarea";
import { adminContent } from "@/content/es/admin-content";
import { deleteService, moveService, saveService, setServicePublished } from "@/lib/actions/services";
import type { Tables } from "@/lib/supabase/database.types";
import { EntityDialog } from "./EntityDialog";
import { fieldA11y, FormField } from "./FormField";
import { IconPicker } from "./IconPicker";
import { SortableList } from "./SortableList";
import { useEntityEditor } from "./useEntityEditor";

type Service = Tables<"services">;

const t = adminContent.services;
const c = adminContent.common;

export function ServicesManager({ services }: { services: Service[] }) {
  const editor = useEntityEditor<Service>();
  const current = editor.state.mode === "edit" ? editor.state.item : null;

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={() => editor.create({})}>
          <Plus aria-hidden="true" className="size-4" />
          {t.newItem}
        </Button>
      </div>

      <GlassCard>
        {services.length === 0 ? (
          <p className="text-sm text-muted">{t.empty}</p>
        ) : (
          <SortableList
            items={services}
            getLabel={(service) => service.titulo}
            onMove={moveService}
            onDelete={deleteService}
            edit={{ onEdit: editor.edit }}
            toggles={[{ key: "publicado", label: c.published, ariaLabel: c.togglePublished, action: setServicePublished }]}
            renderContent={(service) => {
              return (
                <div className="flex min-w-0 items-start gap-3">
                  <span className="glass-flat flex size-10 shrink-0 items-center justify-center rounded-xl text-accent">
                    <ServiceIcon name={service.icono} className="size-5" fallback={null} />
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{service.titulo}</span>
                      {!service.publicado && <Badge>{c.draft}</Badge>}
                    </div>
                    <p className="line-clamp-2 text-sm text-muted">{service.descripcion}</p>
                  </div>
                </div>
              );
            }}
          />
        )}
      </GlassCard>

      <EntityDialog
        open={editor.open}
        onClose={editor.close}
        title={current ? t.editTitle : t.newTitle}
        id={current?.id ?? null}
        action={saveService}
      >
        {(errors) => (
          <>
            <FormField id="titulo" label={t.fields.titulo} errors={errors?.titulo}>
              <Input {...fieldA11y("titulo", errors?.titulo)} name="titulo" defaultValue={current?.titulo ?? ""} maxLength={120} autoFocus />
            </FormField>
            <FormField id="descripcion" label={t.fields.descripcion} errors={errors?.descripcion}>
              <Textarea
                {...fieldA11y("descripcion", errors?.descripcion)}
                name="descripcion"
                defaultValue={current?.descripcion ?? ""}
                rows={4}
                maxLength={600}
              />
            </FormField>
            <IconPicker name="icono" label={t.fields.icono} defaultValue={current?.icono ?? null} errors={errors?.icono} />
            <label className="flex items-center justify-between gap-4">
              <span className="text-sm">{t.fields.publicado}</span>
              <Switch name="publicado" defaultChecked={current?.publicado ?? true} />
            </label>
          </>
        )}
      </EntityDialog>
    </>
  );
}
